import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages } from "ai";

export async function POST(reqest: Request) {
  const { messages } = await reqest.json();
  
  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages: await convertToModelMessages(messages),
  });

  // ストリーミングオプション
  return result.toUIMessageStreamResponse();
}