import { drizzle } from "drizzle-orm/d1";
import { users, birthdays } from "../../db/schema";
import { eq } from "drizzle-orm";

// Helper: format a date to MM-DD
const formatMonthDay = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}-${day}`;
};

// Get today's birthdays
export const getTodaysBirthdays = async (c: any) => {
  const db = drizzle(c.env.DB);
  const todayMMDD = formatMonthDay(new Date());

  try {
    const allUsers = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        birthday: birthdays.date,
      })
      .from(users)
      .leftJoin(birthdays, eq(birthdays.userId, users.id));

    const birthdaysToday = allUsers.filter(user => {
      if (!user.birthday) return false;
      return user.birthday.slice(5) === todayMMDD;
    });

    return c.json({ birthdays: birthdaysToday });
  } catch (err) {
    console.error("Error fetching today's birthdays:", err);
    return c.json({ error: "Failed to fetch birthdays" }, 500);
  }
};