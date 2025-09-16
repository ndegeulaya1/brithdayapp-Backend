import { drizzle } from "drizzle-orm/d1";
import { users, birthdays } from "../../db/schema";
import { eq } from "drizzle-orm"; 
import { updateUserSchema } from "../validator/users";

export const updateProfile = async (c: any) => {
  const db = drizzle(c.env.DB);
  const body = await c.req.json();

  // Parse request body with Zod
  const parsed = updateUserSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);

  const { username, birthday } = parsed.data;

  try {
  
    const userIdParam = c.req.param("id"); 

     

    if (!userIdParam) return c.json({ error: "User ID is required" }, 400);

    const userId = Number(userIdParam);

   
    if (username) {
      await db.update(users)
        .set({ username })
        .where(eq(users.id, userId));
    }

    // Update birthday in birthdays table
    if (birthday) {
      const existingBirthday = await db
        .select()
        .from(birthdays)
        .where(eq(birthdays.userId, userId))
        .get();

      if (existingBirthday) {
        await db.update(birthdays)
          .set({ date: birthday })
          .where(eq(birthdays.userId, userId));
      } else {
        await db.insert(birthdays).values({ userId, date: birthday });
      }
    }

    return c.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Error updating profile:", err);
    return c.json({ error: "Failed to update profile" }, 500);
  }
};
