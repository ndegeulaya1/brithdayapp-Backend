// src/schema.ts
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

// ----------------- Users -----------------
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), // hashed
  role: text("role").default("user"), // "user" | "admin"
});

// ----------------- Birthdays -----------------
export const birthdays = sqliteTable("birthdays", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  date: text("date").notNull(), // YYYY-MM-DD
});

// ----------------- Posts -----------------
export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  content: text("content").notNull(),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

// ----------------- Post Tags -----------------
export const postTags = sqliteTable("post_tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  postId: integer("post_id").references(() => posts.id),
  userId: integer("user_id").references(() => users.id), // tagged user
});

// ----------------- Comments -----------------
export const comments = sqliteTable("comments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  postId: integer("post_id").references(() => posts.id),
  userId: integer("user_id").references(() => users.id),
  content: text("content").notNull(),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

// ----------------- Messages -----------------
export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  senderId: integer("sender_id").references(() => users.id),
  receiverId: integer("receiver_id").references(() => users.id),
  content: text("content").notNull(),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

// ----------------- Notifications -----------------
export const notifications = sqliteTable("notifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id), // receiver
  type: text("type").notNull(), // "post", "comment", "message", "birthday", "tag"
  refId: integer("ref_id"), // related post/comment/message/birthday
  content: text("content").notNull(),
  isRead: integer("is_read").default(0), // 0 = unread, 1 = read
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});


//frendship

export const friendships = sqliteTable("friendships", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  requesterId: integer("requester_id").references(() => users.id),
  receiverId: integer("receiver_id").references(() => users.id),
  status: text("status").default("pending"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});
