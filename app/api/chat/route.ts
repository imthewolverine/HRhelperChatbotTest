import { NextResponse } from "next/server";
import { runAgent } from "@/lib/gemini";
import { ChatPayload, Message } from "@/lib/mockData";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ChatPayload>;
    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const aiMessage: Message = await runAgent({ messages: body.messages });
    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
