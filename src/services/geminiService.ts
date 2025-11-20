import { GoogleGenAI, Chat } from "@google/genai";
import { AI_SYSTEM_PROMPT } from '../constants';

// 修改点 1：获取 Key 的方式变了
// 浏览器里要用 import.meta.env.VITE_xxx
const apiKey = import.meta.env.VITE_API_KEY;

if (!apiKey) {
  // 这里的报错信息最好不要把 Key 打印出来，为了安全
  throw new Error("VITE_API_KEY is not set in environment variables");
}

// 修改点 2：传入获取到的 apiKey
const ai = new GoogleGenAI({ apiKey: apiKey });

export const createChatSession = (): Chat => {
  const chat = ai.chats.create({
    model: 'gemini-2.5-pro',
    config: {
      systemInstruction: AI_SYSTEM_PROMPT,
    }
  });
  return chat;
};