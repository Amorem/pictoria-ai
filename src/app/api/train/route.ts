import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const WEBHOOK_URL = process.env.SITE_URL;

export async function POST(request: NextRequest) {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error("Replicate API not set");
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "unauthorized",
        },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const input = {
      fileKey: formData.get("fileKey") as string,
      modelName: formData.get("modelName") as string,
      gender: formData.get("gender") as string,
    };

    console.log("@@INPUT", input);

    if (!input.fileKey || !input.modelName || !input.gender) {
      return NextResponse.json(
        { error: "Missing required field" },
        { status: 400 }
      );
    }

    const fileName = input.fileKey.replace("training_data/", "");
    const { data: fileUrl } = await supabaseAdmin.storage
      .from("training_data")
      .createSignedUrl(fileName, 3600);

    if (!fileUrl?.signedUrl) {
      throw new Error("failed to get the file URL");
    }

    console.log("SignedFileURL", fileUrl);

    // Create the model
    //const hardware = await replicate.hardware.list();
    const modelId = `${user.id}_${Date.now()}_${input.modelName
      .toLowerCase()
      .replace(" ", "_")}`;

    await replicate.models.create(`amorem`, modelId, {
      visibility: "private",
      hardware: "gpu-a100-large",
    });

    // Start the training

    const training = await replicate.trainings.create(
      "ostris",
      "flux-dev-lora-trainer",
      "e440909d3512c31646ee2e0c7d6f6f4923224863a6a10c494606e79fb5844497",
      {
        // You need to create a model on Replicate that will be the destination for the trained version.
        destination: `amorem/${modelId}`,
        input: {
          steps: 1200,
          resolution: "1024",
          input_images: fileUrl.signedUrl,
          trigger_word: "ohwx",
        },
        webhook: `${WEBHOOK_URL}/api/webhooks/training`,
        webhook_events_filter: ["completed"],
      }
    );

    console.log("Training", training);

    // add modell values in the supabase
    await supabaseAdmin.from("models").insert({
      model_id: modelId,
      userId: user.id,
      model_name: input.modelName,
      gender: input.gender,
      training_status: training.status,
      trigger_word: "ohwx",
      training_steps: 1200,
      training_id: training.id,
    });

    return NextResponse.json(
      {
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Training Error", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to start the model training";
    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
