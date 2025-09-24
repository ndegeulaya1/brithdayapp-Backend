import { drizzle } from "drizzle-orm/d1";
import { messages, users } from "../../db/schema";
import { eq, desc, or } from "drizzle-orm";
import { z } from "zod";

const getMyMessagesSchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

export const getMyMessages = async (c: any) => {
  const db = drizzle(c.env.DB);
  const currentUser = c.get("user");
  const body = await c.req.json();

  const parsed = getMyMessagesSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);

  const { limit, offset } = parsed.data;

  try {
    // Get all messages where current user is sender or receiver
    const myMessages = await db
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
        receiver: {
          id: users.id,
          username: users.username,
        },
      })
      .from(messages)
      .leftJoin(users, eq(messages.senderId, users.id))
      .where(
        or(
          eq(messages.senderId, currentUser.userId),
          eq(messages.receiverId, currentUser.userId)
        )
      )
      .orderBy(desc(messages.createdAt))
      .limit(limit)
      .offset(offset);

    // Group messages by conversation partner
    const conversations = new Map();

    for (const msg of myMessages) {
      const partnerId = msg.senderId === currentUser.userId ? msg.receiverId : msg.senderId;
      const partner = msg.senderId === currentUser.userId ? msg.receiver : msg.sender;

      if (!conversations.has(partnerId)) {
        conversations.set(partnerId, {
          partner: partner,
          lastMessage: msg,
          messageCount: 0,
        });
      }

      conversations.get(partnerId).messageCount++;
    }

    return c.json({
      conversations: Array.from(conversations.values()),
      total: conversations.size,
    });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to get messages" }, 500);
  }
};