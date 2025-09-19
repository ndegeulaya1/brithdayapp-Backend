import { z } from "zod";


export const upcomingBirthdayParamsSchema = z.object({
  days: z.enum(["1", "7"]), // Only allow "1" or "7"
});

export const birthdayUserSchema = z.object({
  id: z.number(),
  username: z.string(),
  birthday: z.string(), // YYYY-MM-DD
});


export const todayBirthdaysResponseSchema = z.object({
  birthdays: z.array(birthdayUserSchema),
});


export const upcomingBirthdaysResponseSchema = z.object({
  birthdays: z.array(birthdayUserSchema),
});
