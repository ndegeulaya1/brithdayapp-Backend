import { z } from "zod";

export const sendMessageSchema = z.object({
  receiverId: z.number().min(1, "Receiver ID is required"),
  content: z.string().min(1, "Message content cannot be empty").max(1000, "Message too long"),
});

// Response schemas
export const sendMessageResponseSchema = z.object({
  message: z.string(),
});

export const messageSchema = z.object({
  id: z.number(),
  senderId: z.number(),
  receiverId: z.number(),
  content: z.string(),
  createdAt: z.string(),
});

export const messagesResponseSchema = z.array(messageSchema);
