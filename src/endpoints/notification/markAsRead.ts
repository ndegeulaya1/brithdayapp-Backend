import { drizzle } from "drizzle-orm/d1";
import { notifications } from "../../db/schema";
import { eq, and } from "drizzle-orm";

export const markNotificationAsRead = async (c: any) => {
  const db = drizzle(c.env.DB);

  try {
    // Temporarily removed auth requirement for testing
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const token = authHeader.substring(7);
    let decodedToken;
    try {
      decodedToken = JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      return c.json({ error: "Invalid token" }, 401);
    }

    const currentUserId = decodedToken.userId;
    const notificationId = parseInt(c.req.param("id"));

    if (!notificationId) {
      return c.json({ error: "Notification ID is required" }, 400);
    }

    // Mark the specific notification as read
    await db
      .update(notifications)
      .set({ isRead: 1 })
      .where(and(eq(notifications.id, notificationId), eq(notifications.userId, currentUserId)));

    return c.json({ message: "Notification marked as read" });
  } catch (err) {
    console.error("Error marking notification as read:", err);
    return c.json({ error: "Failed to mark notification as read" }, 500);
  }
};