import { Hono } from "hono";
import { fromHono } from "chanfana";
import { cors } from "hono/cors";

// --- Auth Endpoints ---
import { Signup } from "./endpoints/auth/signup";
import { Signin } from "./endpoints/auth/signin";
import { Logout } from "./endpoints/auth/logout";
import { ResetPasswordRequest } from "./endpoints/auth/reset";
import { ResetPasswordConfirm } from "./endpoints/auth/forgot";

// --- User Endpoints ---
import { deleteUser } from "./endpoints/users/deleteuser";
import { getUsersWithBirthdays } from "./endpoints/users/getAllUser";
import { getUserById } from "./endpoints/users/getuserById";
import { updateUser } from "./endpoints/users/updateUser";
import { updateProfile } from "./endpoints/users/updateprofile";

// --- Birthday Endpoints ---
import { getTodaysBirthdays } from "./endpoints/Birthday/todaybirthday";
import { getUpcomingBirthdays } from "./endpoints/Birthday/1birthday";

// --- Notification Endpoints ---
import { generateBirthdayNotifications } from "./endpoints/notification/birthday";
import { getNotifications } from "./endpoints/notification/getnotification";

// --- Middleware ---
import { authMiddleware } from "./endpoints/middleware/auth";

//post
import { createComment } from "./endpoints/comment/createComment";
import { getCommentsByPost } from "./endpoints/comment/getComment";

//comments
import { createPost } from "./endpoints/post/createPost";
import { getPosts } from "./endpoints/post/getPost";

// --- Message Endpoints ---
import { sendMessage } from "./endpoints/messages/sendMessage";
import { getMessages } from "./endpoints/messages/getMessages";
import { getMyMessages } from "./endpoints/messages/getMyMessages";

// --- Types ---
type Env = {
  JWT_SECRET: string;
  DB: D1Database;
  RESEND_API_KEY: string;
};

// --- App Init ---
const app = new Hono<{ Bindings: Env }>();

// --- CORS ---
app.use(
  "/*",
  cors({
    origin: ["*"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// --- API Docs ---
const openapi = fromHono(app, {
  docs_url: "/",
});

// --- Auth Routes ---
openapi.post("/signup", Signup);
openapi.post("/signin", Signin);
openapi.post("/logout", Logout);
openapi.post("/reset", ResetPasswordRequest);
openapi.post("/reset-password", ResetPasswordConfirm);

// --- User Routes ---
openapi.get("/user", getUsersWithBirthdays);
openapi.post("/deleteUser/:id", deleteUser);
openapi.get("/user/:id", getUserById);
openapi.post("/updateuser", updateUser);
openapi.post("/updateProfile/:id", updateProfile);

// --- Birthday Routes ---
openapi.get("/birthdays/today", getTodaysBirthdays);
openapi.get("/birthdays/upcoming/1", getUpcomingBirthdays(1));
openapi.get("/birthdays/upcoming/7", getUpcomingBirthdays(7));

// --- Notification Routes ---
openapi.post("/notifications/birthdays", generateBirthdayNotifications);
openapi.get("/notifications", authMiddleware, getNotifications);


//coments
// Posts
openapi.post("/posts", authMiddleware, createPost);
openapi.get("/posts", getPosts);

// Comments
openapi.post("/comments", authMiddleware, createComment);
openapi.get("/comments/:postId", getCommentsByPost);

// Messages
openapi.post("/messages/send", authMiddleware, sendMessage);
openapi.post("/messages/conversation", authMiddleware, getMessages);
openapi.get("/messages", authMiddleware, getMyMessages);


// --- Root (no docs) ---
app.get("/app", (c) => c.text("Birthday App API running"));

//trigler notification automatically 
export default {
  fetch: app.fetch,
};