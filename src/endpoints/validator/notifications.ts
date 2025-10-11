import { z } from "zod";

export const generateBirthdayNotificationsSchema = z.object({
  // No body
});

export const getNotificationsSchema = z.object({
  // No body
});

// Response schemas
export const generateBirthdayNotificationsResponseSchema = z.object({
  message: z.string(),
});

export const notificationSchema = z.object({
  id: z.number(),
  userId: z.number(),
  type: z.string(),
  message: z.string(),
  createdAt: z.string(),
});

export const notificationsResponseSchema = z.array(notificationSchema);
