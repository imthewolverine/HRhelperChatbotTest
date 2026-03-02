import { NextRequest } from "next/server";
import { BotFrameworkAdapter } from "botbuilder";
import { runAgent } from "@/lib/gemini";

export const runtime = "nodejs";

const adapter = new BotFrameworkAdapter({
  appId: process.env.MICROSOFT_APP_ID!,
  appPassword: process.env.MICROSOFT_APP_PASSWORD!,
  channelAuthTenant: process.env.MICROSOFT_APP_TENANT_ID!
});

export async function POST(req: NextRequest) {
  const body = await req.json();

  let responseBody: any;
  let status = 200;

  await adapter.processActivity(
    {
      body,
      headers: Object.fromEntries(req.headers.entries()),
      method: "POST"
    } as any,
    {
      status(code: number) {
        status = code;
        return this;
      },
      send(body: any) {
        responseBody = body;
      },
      header() {},
      end() {}
    } as any,
    async (context) => {
      if (context.activity.type === "message") {
        const userText = context.activity.text ?? "";

        const aiMessage = await runAgent({
          messages: [
            {
              id: `teams-${Date.now()}`,
              role: "user",
              content: userText,
              timestamp: new Date().toISOString()
            }
          ]
        });

        await context.sendActivity(aiMessage.content);
      }
    }
  );

  return new Response(responseBody ? JSON.stringify(responseBody) : null, {
    status
  });
}