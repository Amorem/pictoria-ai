import { NextResponse } from "next/server";
import Replicate from "replicate";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/email-templates/Email-Template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  try {
    const body = await req.json();
    console.log("Working", body);

    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") ?? "";
    const modelName = url.searchParams.get("modelName") ?? "";
    const fileName = url.searchParams.get("fileName") ?? "";

    const webhook_id = req.headers.get("webhook-id") ?? "";
    const webhook_timestamp = req.headers.get("webhook-timestamp") ?? "";
    const webhook_signature = req.headers.get("webhook-signature") ?? "";

    const signedContent = `${webhook_id}.${webhook_timestamp}.${JSON.stringify(
      body
    )}`;
    const secret = await replicate.webhooks.default.secret.get();

    // Base64 decode the secret
    const secretBytes = Buffer.from(secret.key.split("_")[1], "base64");
    const computedSignature = crypto
      .createHmac("sha256", secretBytes)
      .update(signedContent)
      .digest("base64");

    const expectedSignatures = webhook_signature
      .split(" ")
      .map((sig) => sig.split(",")[1]);
    const isValid = expectedSignatures.some(
      (expectedSignature) => expectedSignature === computedSignature
    );
    console.log(isValid);

    if (!isValid) {
      return new NextResponse("Invalid signature", { status: 401 });
    }

    const { data: user, error: userError } =
      await supabaseAdmin.auth.admin.getUserById(userId);

    if (userError || !user) {
      return new NextResponse("User not found", { status: 401 });
    }

    const userEmail = user.user.email ?? "";
    const userName = user.user.user_metadata.full_name ?? "";

    if (body.status === "succeeded") {
      // send a successfull status email
      await resend.emails.send({
        from: "Pictoria AI<onboarding@o365.report>",
        to: [userEmail],
        subject: "Model Training completed",
        react: EmailTemplate({
          userName,
          message: "You model training has been completed",
        }),
      });

      // update the supabase models table
      supabaseAdmin
        .from("models")
        .update({
          training_status: body.status,
          training_time: body.metrics?.total_time ?? null,
          version: body.output?.version.split(":")[1] ?? null,
        })
        .eq("user_id", userId)
        .eq("model_name", modelName);

      // delete the storage data from supabase storage
      supabaseAdmin.storage
        .from("training_data")
        .remove([`${userId}/${fileName}`]);
    } else {
      // handle the failed or canceled status
      await resend.emails.send({
        from: "Pictoria AI<onboarding@o365.report>",
        to: [userEmail],
        subject: `Model Training completed ${body.status}`,
        react: EmailTemplate({
          userName,
          message: `You model training has been ${body.status}`,
        }),
      });

      // update the supabase models table
      supabaseAdmin
        .from("models")
        .update({
          training_status: body.status,
        })
        .eq("user_id", userId)
        .eq("model_name", modelName);

      // delete the storage data from supabase storage
      supabaseAdmin.storage
        .from("training_data")
        .remove([`${userId}/${fileName}`]);
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Webhook processing | Error |", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
