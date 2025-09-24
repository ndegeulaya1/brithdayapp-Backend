import { drizzle } from "drizzle-orm/d1";
import { messages, users } from "../../db/schema";
import { eq, or, and, desc } from "drizzle-orm";
import { z } from "zod";

const getMessagesSchema = z.object({
  userId: z.number().min(1, "User ID is required"),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
});

export const getMessages = async (c: any) => {
  const db = drizzle(c.env.DB);
  const currentUser = c.get("user");
  const body = await c.req.json();

  const parsed = getMessagesSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);

  const { userId, limit, offset } = parsed.data;

  try {
    // Check if target user exists
    const targetUser = await db.select().from(users).where(eq(users.id, userId)).get();
    if (!targetUser) {
      return c.json({ error: "User not found" }, 404);
    }

    // Prevent getting messages with self
    if (userId === currentUser.userId) {
      return c.json({ error: "Cannot get messages with yourself" }, 400);
    }

    // Get messages between current user and target user
    const conversation = await db
      .select({
        id: messages.id,
        content: messages.content,
        senderId: messages.senderId,
        receiverId: messages.receiverId,
        createdAt: messages.createdAt,
        sender: {
          id: users.id,
          username: users.username,
        },
      })
      .from(messages)
      .leftJoin(users, eq(messages.senderId, users.id))
      .where(
        and(
          or(
            and(eq(messages.senderId, currentUser.userId), eq(messages.receiverId, userId)),
            and(eq(messages.senderId, userId), eq(messages.receiverId, currentUser.userId))
          )
        )
      )
      .orderBy(desc(messages.createdAt))
      .limit(limit)
      .offset(offset);

    return c.json({
      conversation: conversation.reverse(), // Reverse to show oldest first
      total: conversation.length,
    });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to get messages" }, 500);
  }
};