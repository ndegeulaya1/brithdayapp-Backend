
import { drizzle } from "drizzle-orm/d1";
import { users, birthdays } from "../../db/schema";
import { eq } from "drizzle-orm";




const formatMonthDay = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}-${day}`;
};

export const getUpcomingBirthdays = (days: number) => async (c: any) => {
  const db = drizzle(c.env.DB);
  const today = new Date();

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

    const upcomingBirthdays = allUsers.filter(user => {
      if (!user.birthday) return false;

      const birthdayDate = new Date(user.birthday);
      birthdayDate.setFullYear(today.getFullYear()); // Set this year for comparison

      const diffDays = Math.ceil((birthdayDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= days;
    });

    return c.json({ birthdays: upcomingBirthdays });
  } catch (err) {
    console.error(`Error fetching upcoming birthdays for next ${days} days:`, err);
    return c.json({ error: "Failed to fetch upcoming birthdays" }, 500);
  }
};