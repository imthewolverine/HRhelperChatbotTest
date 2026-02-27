import { NextResponse } from "next/server";
import { BotFrameworkAdapter, type Activity, type WebRequest, type WebResponse } from "botbuilder";
import { runAgent } from "@/lib/gemini";
import type { Message } from "@/lib/mockData";

export const runtime = "nodejs";

const adapter = new BotFrameworkAdapter({
  appId: process.env.MICROSOFT_APP_ID ?? "",
  appPassword: process.env.MICROSOFT_APP_PASSWORD ?? ""
});

function buildPayload(text: string): Message[] {
  return [
    {
      id: `teams-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toISOString()
    }
  ];
}

export async function POST(request: Request) {
  if (!process.env.MICROSOFT_APP_ID || !process.env.MICROSOFT_APP_PASSWORD) {
    return NextResponse.json(
      { error: "Missing MICROSOFT_APP_ID or MICROSOFT_APP_PASSWORD" },
      { status: 500 }
    );
  }

  try {
    const activity = (await request.json()) as Activity;
    const requestHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      requestHeaders[key] = value;
    });

    const webReq: WebRequest = {
      body: activity,
      headers: requestHeaders,
      method: request.method
    };

    let statusCode = 200;
    let responseBody: unknown = undefined;
    const responseHeaders: Record<string, string> = {};

    const webRes = {
      status: (code: number) => {
        statusCode = code;
        return webRes;
      },
      send: (body: unknown) => {
        responseBody = body;
      },
      header: (name: string, value: string) => {
        responseHeaders[name] = value;
      },
      end: () => {}
    } as unknown as WebResponse;

    await adapter.processActivity(webReq, webRes, async (context) => {
      if (context.activity.type !== "message") {
        return;
      }

      const text = context.activity.text ?? "";
      const aiMessage = await runAgent({ messages: buildPayload(text) });
      await context.sendActivity(aiMessage.content);
    });

    return NextResponse.json(responseBody ?? { ok: true }, { status: statusCode, headers: responseHeaders });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Teams bot error:", message);
    return NextResponse.json({ error: "Teams adapter error" }, { status: 500 });
  }
}
