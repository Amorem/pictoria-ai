import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("Working");
    return NextResponse.json({ success: true }), { status: 201 };
  } catch (error) {
    console.error("Webhook processing | Error |", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
