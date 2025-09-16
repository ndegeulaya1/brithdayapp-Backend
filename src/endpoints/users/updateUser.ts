import { drizzle } from "drizzle-orm/d1";
import { users, birthdays } from "../../db/schema";
import { eq } from "drizzle-orm";

export const updateUser = async (c: any) => {
  const db = drizzle(c.env.DB);
  const body = await c.req.json();

  const { userId, username, email, birthday } = body;

  try {
   
    await db.update(users)
      .set({
        username: username,
        email: email,
      })
      .where(eq(users.id, userId));

    // Update birthdays table
    if (birthday) {
      // Check if birthday exists
      const existingBirthday = await db.select().from(birthdays).where(eq(birthdays.userId, userId)).get();

      if (existingBirthday) {
        await db.update(birthdays)
          .set({ date: birthday })
          .where(eq(birthdays.userId, userId));
      } else {
        await db.insert(birthdays).values({ userId, date: birthday });
      }
    }

    return c.json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Error updating user:", err);
    return c.json({ error: "Failed to update user" }, 500);
  }
};
