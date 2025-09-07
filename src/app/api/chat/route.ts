import { createOpenAI } from "@ai-sdk/openai";
import { smoothStream, streamText } from "ai";
import { NextRequest } from "next/server";

export const maxDuration = 30;

const openai = createOpenAI({
  apiKey: process.env.GITHUB_TOKEN,
});

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4.1-nano"),
    system: "You are a helpful assistant named Lexi.",
    messages,
    experimental_transform: smoothStream(),
  });

  return result.toTextStreamResponse();
}
