import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema } from "@shared/schema";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with API key
const getGenerativeAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }
  return new GoogleGenerativeAI(apiKey);
};

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Get messages with a limit (default to last 6)
  app.get("/api/messages", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
      const messages = await storage.getMessages(undefined, limit);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Create a new message from the user and get a response from LearnLM
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const { content, difficulty } = req.body;
      
      if (!content || typeof content !== "string") {
        return res.status(400).json({ error: "Message content is required" });
      }

      // Save user message
      const userMessage = await storage.createMessage({
        userId: 1, // Default user ID
        role: "user",
        content,
      });

      // Get previous messages for context (up to 5 previous messages)
      const previousMessages = await storage.getMessages(undefined, 5);
      
      try {
        // Initialize the generative AI
        const genAI = getGenerativeAI();
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Prepare chat history for the model
        const chatHistory = previousMessages.map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }));

        // Start a chat with the model
        const chat = model.startChat({
          history: chatHistory,
          generationConfig: {
            maxOutputTokens: 1000,
          },
        });

        // Determine the system prompt based on difficulty level
        let systemPrompt = "You are LearnLM, a friendly AI tutor helping a child learn English. Keep your responses simple, encouraging, and educational. Provide German translations for new words. Focus on basic vocabulary and simple sentence structures.";
        
        if (difficulty === "medium") {
          systemPrompt = "You are LearnLM, a friendly AI tutor helping a child learn English at an intermediate level. Use more complex vocabulary and sentence structures while still being supportive. Provide German translations for new terms.";
        } else if (difficulty === "hard") {
          systemPrompt = "You are LearnLM, a friendly AI tutor helping a child learn English at an advanced level. Challenge them with more complex vocabulary and grammar while being supportive. Provide German translations for difficult terms.";
        }

        // Send the system prompt first if this is the first interaction
        if (previousMessages.length === 0) {
          await chat.sendMessage(systemPrompt);
        }

        // Send the user's message and get a response
        const result = await chat.sendMessage(content);
        const response = result.response;
        const responseText = response.text();

        // Save the assistant's response
        const assistantMessage = await storage.createMessage({
          userId: 1, // Default user ID
          role: "assistant",
          content: responseText,
        });

        // Return both messages
        return res.json({
          userMessage,
          assistantMessage,
        });
      } catch (aiError) {
        console.error("AI Error:", aiError);
        
        // If AI fails, create a friendly error message
        const errorMessage = await storage.createMessage({
          userId: 1,
          role: "assistant",
          content: "Es tut mir leid, ich konnte deine Nachricht nicht verstehen. Kannst du es bitte noch einmal versuchen? / I'm sorry, I couldn't understand your message. Could you please try again?",
        });
        
        return res.json({
          userMessage,
          assistantMessage: errorMessage,
        });
      }
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  // Get user settings
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSettings(1);
      if (!settings) {
        // Return default settings if none exist
        return res.json({
          textToSpeechEnabled: true,
          speechRate: "1.0",
          difficultyLevel: "easy"
        });
      }
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  // Update user settings
  app.post("/api/settings", async (req, res) => {
    try {
      const { textToSpeechEnabled, speechRate, difficultyLevel } = req.body;
      
      const settings = await storage.createOrUpdateSettings({
        userId: 1, // Default user ID
        textToSpeechEnabled: textToSpeechEnabled !== undefined ? textToSpeechEnabled : true,
        speechRate: speechRate || "1.0",
        difficultyLevel: difficultyLevel || "easy",
      });
      
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
