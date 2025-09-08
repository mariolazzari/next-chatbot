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

- Built into modern browser
- Store structured data locally
- Handle large dataset efficiently

#### IndexedDB vs LocalStorage

##### LocalStorage limits

- Strings only
- No built-in search
- 5-10 Mb limit

##### IndexedDB features

- Stores JavaScript objects
- Indexes fast searching
- Higher store limits
- Complex data operations

#### Dexie.js

- Standard IndexedDB limitations
- Not working in private mode

### Dexie.js setup

```ts
import Dexie from "dexie";

export const db = new Dexie("chatApp");

db.version(1).stores({
  chats: "++id, title, createdAt",
  messages: "++id, chatId, role, content, createdAt",
});
```

### Saving and retrieving data

```ts
import Dexie, { Table } from "dexie";

export type Chat = {
  id?: number;
  title: string;
  createdAt: string;
};

export type Message = {
  id?: number;
  chatId: number;
  role: string;
  content: string;
  createdAt: string;
};

// create database instance
export const db = new Dexie("chatApp") as Dexie & {
  chats: Table<Chat>;
  messages: Table<Message>;
};

// define schema
db.version(1).stores({
  chats: "++id, title, createdAt",
  messages: "++id, chatId, role, content, createdAt",
});

// functions
export const createChat = async (title: string = "New Chat"): Promise<number> =>
  db.chats.add({
    title,
    createdAt: new Date().toISOString(),
  });

export const getChat = async (id: number): Promise<Chat | undefined> =>
  db.chats.get(+id);

export const getChatMessages = async (chatId?: number): Promise<Message[]> => {
  if (!chatId) return [];

  return db.messages.where("chatId").equals(+chatId).sortBy("createdAt");
};

export const saveMessage = async (
  chatId: number,
  role: string,
  content: string
): Promise<Message> => {
  const data: Message = {
    chatId: +chatId,
    role,
    content,
    createdAt: new Date().toISOString(),
  };
  await db.messages.add(data);

  return data;
};

export const updateChatTitle = async (
  chatId: number,
  title: string
): Promise<number> => {
  return db.chats.update(chatId, { title });
};

export const deleteChat = async (chatId: number): Promise<void> => {
  await db.messages.where("chatId").equals(+chatId).delete();
  await db.chats.delete(+chatId);
};
```

## Chat interface

### ChatThread component

```tsx

```
