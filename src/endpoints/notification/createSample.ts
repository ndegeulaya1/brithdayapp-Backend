import { drizzle } from "drizzle-orm/d1";
import { notifications } from "../../db/schema";

export const createSampleNotifications = async (c: any) => {
  const db = drizzle(c.env.DB);

  try {
    // Temporarily removed auth requirement for testing
    const sampleNotifications = [
      {
        userId: 1, // Assuming user ID 1 exists
        type: "birthday",
        refId: null,
        content: "Today is John's birthday! 🎉",
        isRead: 0,
        createdAt: new Date().toISOString(),
      },
      {
        userId: 1,
        type: "message",
        refId: 1,
        content: "You have a new message from Jane",
        isRead: 0,
        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      },
      {
        userId: 1,
        type: "friend_request",
        refId: 2,
        content: "Mike sent you a friend request",
        isRead: 1,
        createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      },
      {
        userId: 1,
        type: "post",
        refId: 1,
        content: "Sarah tagged you in a post",
        isRead: 0,
        createdAt: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
      },
    ];

    // Insert sample notifications
    await db.insert(notifications).values(sampleNotifications);

    return c.json({
      message: "Sample notifications created",
      count: sampleNotifications.length,
    });
  } catch (err) {
    console.error("Error creating sample notifications:", err);
    return c.json({ error: "Failed to create sample notifications" }, 500);
  }
};