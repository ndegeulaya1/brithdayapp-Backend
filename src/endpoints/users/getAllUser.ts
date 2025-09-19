import { drizzle } from "drizzle-orm/d1";
import { users, birthdays } from "../../db/schema"; 
import { eq } from "drizzle-orm";


export const getUsersWithBirthdays = async (c: any) => {
  const db = drizzle(c.env.DB);

  try {
   
    const usersWithBirthdays = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        birthday: birthdays.date,
      })
      .from(users)
      .leftJoin(birthdays, eq(birthdays.userId, users.id));

 
    return c.json({ users: usersWithBirthdays });
  } catch (err) {
    console.error("Error fetching users with birthdays:", err);

    return c.json(
      { error: "Failed to fetch users" },
      500
    );
  }
};
