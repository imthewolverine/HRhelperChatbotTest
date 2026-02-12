import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { ChatPayload, Message } from "./mockData";

const MODEL_NAME = "gemini-2.5-flash";
const SYSTEM_PROMPT = `
You are an HR concierge for employees and hiring managers. Be concise, policy-aware, and action oriented. Provide bullet points, surface risks, and suggest next steps. Keep replies short unless explicitly asked for detail.

Company Policies (Mongolian):

1. Ээлжийн амралт болон ээлжийн амралтын цалингаа хэрхэн авах вэ?
Та 6 сар ажиллаад ээлжийн амралт авах эрх үүсэх бөгөөд биеэр эдэлж болно. Харин байгууллагын дотоод журамдаа ээлжийн амралтын цалингаа та 11 сар ажиллаад авна.
Үүнд Хүний нөөц, сургалт хөгжлийн албанаас ээлжийн амралтын хуудас бөглөн, шууд удирдлагаараа цохуулан, хүний нөөцийн албанд хүргэнэ.

2. Цалингийн тасалдаг өдөр болон цалингийн задаргааг хэрхэн авах вэ?
Цалин сард 2 удаа буух бөгөөд 15 31-нд бууна. 15-ны цалин 10-наар тасалбар болж 31-ний цалин 25-наар тасалбар болгодог.
Та хүний нөөцийн албанд цалингийн задаргаа авах мэйл хаягаа өгснөөр тухайн бүр мэйлээр цалингийн задаргаагаа авах боломжтой.

3. Цалинтай болон цалингүй чөлөө хэрхэн авах вэ?
Цалингүй 1-ээс 3 хоногийн чөлөөг шууд удирдлага өгөх боломжтой бөгөөд 3-аас дээш хоногийн чөлөөг хүний нөөцийн албанд өргөдөл гарган Ерөнхий захирал шийдвэрлэнэ.

4. Жинхлэх процесс хэрхэн явагддаг вэ?
Байгууллагын Жинхлэх процесс албан тушаал бүрээс хамаараад өөр өөр байдаг. 1-ээс 3 сарын хугацаанд туршилтын гэрээгээр ажиллана. Харилцан тохиролцож шаардлагатай гэж үзвэл 1-3 сараар нэг удаа сунгаж болно.

5. Ажилтан нарт бүтээгдэхүүний урамшуулал байдаг уу?
Та жинхлэгдсэнийхээ дараа Санхүү бүртгэлийн алба руу 4 оронтой код явуулан өөрийнхөө хөнгөлөлтийн кодыг авах боломжтой.
Сар бүр 300 мянган төгрөгийн худалдан авах 30%-ийн хөнгөлөлт үүснэ.
`;

function initClient(): GenerativeModel | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const client = new GoogleGenerativeAI(apiKey);
  return client.getGenerativeModel({ model: MODEL_NAME, systemInstruction: SYSTEM_PROMPT });
}

export async function runAgent(payload: ChatPayload): Promise<Message> {
  const model = initClient();
  const now = new Date().toISOString();

  if (!model) {
    return {
      id: `mock-${now}`,
      role: "assistant",
      content:
        "(Mock) No Gemini key detected. To enable live HR answers, add GEMINI_API_KEY (free tier) and retry. Draft next steps: confirm policy, share a short reply, and log the request.",
      timestamp: now
    };
  }

  try {
    const history = payload.messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const result = await model.generateContent({ contents: history });
    const text = result.response.text();

    return {
      id: `ai-${now}`,
      role: "assistant",
      content: text,
      timestamp: now
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Gemini API Error:", errorMsg);
    return {
      id: `fallback-${now}`,
      role: "assistant",
      content: `(Fallback) Gemini call failed: ${errorMsg}. Check your API key and quota.`,
      timestamp: now
    };
  }
}
