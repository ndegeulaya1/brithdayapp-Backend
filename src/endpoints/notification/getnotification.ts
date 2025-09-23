import { drizzle } from "drizzle-orm/d1";
import { notifications, users, messages } from "../../db/schema";
import { eq } from "drizzle-orm";

export const getNotifications = async (c: any) => {
  const db = drizzle(c.env.DB);
  const currentUser = c.get("user");

  try {
    // Check if user is authenticated
    if (!currentUser) {
      return c.json({ error: "Authentication required" }, 401);
    }

    // Get all notifications for the current user
    const userNotifications = await db
      .select({
        id: notifications.id,
        type: notifications.type,
        content: notifications.content,
        isRead: notifications.isRead,
        createdAt: notifications.createdAt,
        refId: notifications.refId,
      })
      .from(notifications)
      .where(eq(notifications.userId, currentUser.userId));

    // Fetch actor details for notifications that have a refId
    const notificationsWithActor = [];
    for (const notif of userNotifications) {
      let actor = null;
      if (notif.refId) {
        if (notif.type === "message") {
          // For message notifications, get sender info from messages table
          const message = await db
            .select({
              senderId: messages.senderId,
              sender: {
                id: users.id,
                username: users.username,
                email: users.email,
              },
            })
            .from(messages)
            .leftJoin(users, eq(messages.senderId, users.id))
            .where(eq(messages.id, notif.refId))
            .get();

          if (message) {
            actor = message.sender;
          }
        } else {
          // For other notification types, get actor directly
          actor = await db
            .select({ id: users.id, username: users.username, email: users.email })
            .from(users)
            .where(eq(users.id, notif.refId))
            .get();
        }
      }

      notificationsWithActor.push({
        id: notif.id,
        type: notif.type,
        message: notif.content,
        isRead: !!notif.isRead,
        createdAt: notif.createdAt,
        actor,
      });
    }

    return c.json({ notifications: notificationsWithActor });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return c.json({ error: "error" }, 500);
  }
};
