import { z } from "zod";

export const sendMessageSchema = z.object({
  receiverId: z.number().min(1, "Receiver ID is required"),
  content: z.string().min(1, "Message content cannot be empty").max(1000, "Message too long"),
});