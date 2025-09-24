import { drizzle } from "drizzle-orm/d1";
import { notifications, users, birthdays, messages } from "../../db/schema";
import { eq } from "drizzle-orm";

type NotificationType = "birthday" | "message" | "tag" | "post"|"comment";

interface NotificationPayload {
  userId: number;
  type: NotificationType;
  refId?: number;       // ID of the message, post, etc.
  content: string;
}

export const createNotification = async (c: any, payload: NotificationPayload) => {
  const db = drizzle(c.env.DB);

  try {
    const result = await db.insert(notifications).values({
      userId: payload.userId,
      type: payload.type,
      refId: payload.refId ?? null,
      content: payload.content,
      isRead: 0,
      createdAt: new Date().toISOString(),
    }).returning({ id: notifications.id });

    return { success: true, id: result[0]?.id };
  } catch (err) {
    console.error("Failed to create notification:", err);
    return { success: false, error: err };
  }
};
