import { 
  users, type User, type InsertUser,
  messages, type Message, type InsertMessage,
  settings, type Settings, type InsertSettings
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Message operations
  getMessages(userId?: number, limit?: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Settings operations
  getSettings(userId?: number): Promise<Settings | undefined>;
  createOrUpdateSettings(settings: InsertSettings): Promise<Settings>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private messages: Map<number, Message>;
  private settings: Map<number, Settings>;
  private currentUserId: number;
  private currentMessageId: number;
  private currentSettingsId: number;

  constructor() {
    this.users = new Map();
    this.messages = new Map();
    this.settings = new Map();
    this.currentUserId = 1;
    this.currentMessageId = 1;
    this.currentSettingsId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Message methods
  async getMessages(userId?: number, limit?: number): Promise<Message[]> {
    let result = Array.from(this.messages.values());
    
    if (userId !== undefined) {
      result = result.filter(message => message.userId === userId);
    }
    
    // Sort by timestamp (newest first)
    result.sort((a, b) => {
      const dateA = new Date(a.timestamp || 0);
      const dateB = new Date(b.timestamp || 0);
      return dateB.getTime() - dateA.getTime();
    });
    
    // Apply limit if specified
    if (limit !== undefined) {
      result = result.slice(0, limit);
      // Reverse to get chronological order (oldest first)
      result.reverse();
    }
    
    return result;
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const timestamp = new Date();
    const message: Message = { ...insertMessage, id, timestamp };
    this.messages.set(id, message);
    return message;
  }

  // Settings methods
  async getSettings(userId?: number): Promise<Settings | undefined> {
    if (userId === undefined) {
      return undefined;
    }
    
    return Array.from(this.settings.values()).find(
      (setting) => setting.userId === userId
    );
  }

  async createOrUpdateSettings(insertSettings: InsertSettings): Promise<Settings> {
    // Check if settings already exist for this user
    const existingSettings = await this.getSettings(insertSettings.userId);
    
    if (existingSettings) {
      // Update existing settings
      const updatedSettings: Settings = { 
        ...existingSettings,
        ...insertSettings 
      };
      this.settings.set(existingSettings.id, updatedSettings);
      return updatedSettings;
    } else {
      // Create new settings
      const id = this.currentSettingsId++;
      const newSettings: Settings = { ...insertSettings, id };
      this.settings.set(id, newSettings);
      return newSettings;
    }
  }
}

export const storage = new MemStorage();
