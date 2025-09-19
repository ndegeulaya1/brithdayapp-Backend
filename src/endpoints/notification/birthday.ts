import { drizzle } from "drizzle-orm/d1";
import { users, birthdays, notifications } from "../../db/schema";
import { eq } from "drizzle-orm";

export const generateBirthdayNotifications = async (c: any) => {
  const db = drizzle(c.env.DB);
  const today = new Date();

  try {
    const allUsers = await db
      .select({
        id: users.id,
        username: users.username,
        birthday: birthdays.date,
      })
      .from(users)
      .leftJoin(birthdays, eq(birthdays.userId, users.id));

    const notificationsToCreate = [];

    for (const user of allUsers) {
      if (!user.birthday) continue;

      const birthdayDate = new Date(user.birthday);
      birthdayDate.setFullYear(today.getFullYear());

      const diffDays = Math.ceil((birthdayDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if ([7, 1, 0].includes(diffDays)) {
        const content =
          diffDays === 0
            ? `Today is ${user.username}'s birthday 🎉`
            : diffDays === 1
            ? `Tomorrow is ${user.username}'s birthday 🎂`
            : `In 7 days, ${user.username} will have a birthday 🎁`;

        notificationsToCreate.push({
          user_id: users.id,
          type: "birthday",
          ref_id: null,
          content,
          is_read: 0,
        });
      }
    }

    if (notificationsToCreate.length > 0) {
      await db.insert(notifications).values(notificationsToCreate);
    }

    return c.json({
      message: "Birthday notifications generated",
      count: notificationsToCreate.length,
    });
  } catch (err) {
    console.error("Error generating birthday notifications:", err);
    return c.json({ error: "Failed to generate notifications" }, 500);
  }
};
