import { apiRequest } from "./queryClient";

export interface Message {
  id?: number;
  userId?: number;
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

interface ChatResponse {
  userMessage: Message;
  assistantMessage: Message;
}

// Function to send a message to the API and get a response
export async function sendMessage(content: string, difficulty: string): Promise<ChatResponse> {
  const response = await apiRequest("POST", "/api/chat", {
    content,
    difficulty
  });
  
  return await response.json();
}

// Function to get message history
export async function getMessageHistory(limit: number = 6): Promise<Message[]> {
  const response = await apiRequest("GET", `/api/messages?limit=${limit}`, undefined);
  return await response.json();
}
