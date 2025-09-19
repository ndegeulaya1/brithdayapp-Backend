import { drizzle } from "drizzle-orm/d1";
import { notifications, users } from "../../db/schema";
import { eq } from "drizzle-orm";

export const getNotifications = async (c: any) => {
  const db = drizzle(c.env.DB);
  const currentUser = c.get("user");

  try {
    // Get all notifications for the current user
    const userNotifications = await db
      .select({
        id: notifications.id,
        type: notifications.type,
        content: notifications.content,
        is_read: notifications.isRead,
        created_at: notifications.createdAt,
        ref_id: notifications.refId,
      })
      .from(notifications)
      .where(eq(notifications.userId, currentUser.userId));

    // Fetch actor details for notifications that have a ref_id
    const notificationsWithActor = [];
    for (const notif of userNotifications) {
      let actor = null;
      if (notif.ref_id) {
        actor = await db
          .select({ id: users.id, username: users.username, email: users.email })
          .from(users)
          .where(eq(users.id, notif.ref_id))
          .get();
      }

      notificationsWithActor.push({
        id: notif.id,
        type: notif.type,
        message: notif.content,
        is_read: !!notif.is_read,
        created_at: notif.created_at,
        actor,
      });
    }

    return c.json({ notifications: notificationsWithActor });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return c.json({ error: "error" }, 500);
  }
};
