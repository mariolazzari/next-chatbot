# Hands-On AI: Build an AI Chatbot with GPT-4o and Next.js

## Project setup

### Next.js project

```sh
pnpx create-next-app@latest
pnpm add @ai-sdk/openai @ai-sdk/react ai dexie dexie-react-hooks lucide-react react-markdown
```

### Styling

```sh
src/styles
```

## Vercel AI SDK

### Setting up AI and Github models

[Vercel AI](https://ai-sdk.dev/docs/introduction)
[Github models](https://docs.github.com/en/github-models)

### Test API route

```ts
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export const runtime = "edge";

const openai = createOpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.GITHUB_TOKEN,
});

export async function GET() {
  try {
    const { text } = await generateText({
      model: openai("gpt-4.1-nano"),
      system: "You are a helpful AI assistant named Ella",
      prompt: "Give a brief 2-sentence introduction of yourself",
    });

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error("Test route error:", error);
    return NextResponse.json(
      { message: "Error in test route" },
      { status: 500 }
    );
  }
} 
```

### AI chat route

```ts
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
```

## Client-side database

### IndexedDB
