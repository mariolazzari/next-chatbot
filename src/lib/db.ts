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
