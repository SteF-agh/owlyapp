import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema - retained from template
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Message schema for the chat app
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Insert schema for messages
export const insertMessageSchema = createInsertSchema(messages).pick({
  userId: true,
  role: true,
  content: true,
});

// Settings schema for user preferences
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  textToSpeechEnabled: boolean("text_to_speech_enabled").default(true),
  speechRate: text("speech_rate").default("1.0"),
  difficultyLevel: text("difficulty_level").default("easy"), // 'easy', 'medium', 'hard'
});

// Insert schema for settings
export const insertSettingsSchema = createInsertSchema(settings).pick({
  userId: true,
  textToSpeechEnabled: true,
  speechRate: true,
  difficultyLevel: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;
