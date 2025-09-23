import { drizzle } from "drizzle-orm/d1";
import { messages, users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createNotification } from "../notification/notification";
import { sendMessageSchema } from "../validator/message";

export const sendMessage = async (c: any) => {
  const db = drizzle(c.env.DB);
  const currentUser = c.get("user");
  const body = await c.req.json();

  const parsed = sendMessageSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);

  const { receiverId, content } = parsed.data;

  try {
    // Check if receiver exists
    const receiver = await db.select().from(users).where(eq(users.id, receiverId)).get();
    if (!receiver) {
      return c.json({ error: "Receiver not found" }, 404);
    }

    // Prevent sending message to self
    if (receiverId === currentUser.userId) {
      return c.json({ error: "Cannot send message to yourself" }, 400);
    }

    // Create the message
    const insertedMessage = await db.insert(messages)
      .values({
        senderId: currentUser.userId,
        receiverId: receiverId,
        content: content,
      })
      .returning({ id: messages.id });

    const messageId = insertedMessage[0].id;

    // Send notification to receiver
    const notificationResult = await createNotification(c, {
      userId: receiverId,
      type: "message",
      refId: messageId,
      content: `New message from ${currentUser.username || currentUser.userId}`,
    });

    if (!notificationResult.success) {
      console.error(`Failed to create notification for user ${receiverId}:`, notificationResult.error);
    }

    return c.json({
      message: "Message sent successfully",
      messageId: messageId
    });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to send message" }, 500);
  }
};