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
import { getAllUsersAdmin } from "./endpoints/users/getAllUsersAdmin";
import { getUserStats } from "./endpoints/users/getUserStats";
import { updateUserRole } from "./endpoints/users/updateUserRole";

// --- Birthday Endpoints ---
import { getTodaysBirthdays } from "./endpoints/Birthday/todaybirthday";
import { getUpcomingBirthdays } from "./endpoints/Birthday/1birthday";

// --- Notification Endpoints ---
import { generateBirthdayNotifications } from "./endpoints/notification/birthday";
import { getNotifications } from "./endpoints/notification/getnotification";
import { markNotificationAsRead } from "./endpoints/notification/markAsRead";
import { createSampleNotifications } from "./endpoints/notification/createSample";

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


//-=- frend request
 import { sendFriendRequest } from "./endpoints/friends/friendRequest"
 import { acceptFriendRequest } from "./endpoints/friends/friendAccepts"
 import { getFriendsList } from "./endpoints/friends/listfrend"

 //------frend 

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
openapi.get("/users/all", getAllUsersAdmin);
openapi.get("/users/stats", getUserStats);
openapi.post("/deleteUser/:id", deleteUser);
openapi.get("/user/:id", getUserById);
openapi.post("/updateuser", updateUser);
openapi.post("/updateProfile/:id", updateProfile);
openapi.patch("/users/:id/role", updateUserRole);

// --- Birthday Routes ---
openapi.get("/birthdays/today", getTodaysBirthdays);
openapi.get("/birthdays/upcoming/1", getUpcomingBirthdays(1));
openapi.get("/birthdays/upcoming/7", getUpcomingBirthdays(7));

// --- Notification Routes ---
openapi.post("/notifications/birthdays", generateBirthdayNotifications);
openapi.get("/notifications", getNotifications);
openapi.patch("/notifications/:id/read", markNotificationAsRead);
openapi.post("/notifications/sample", createSampleNotifications);

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

// Friendship requests
openapi.post("/friend-request/:userId", sendFriendRequest);
openapi.put("/friend-request/:id/accept", authMiddleware, acceptFriendRequest);
openapi.get("/friends", authMiddleware, getFriendsList);











// --- Root (no docs) ---
app.get("/app", (c) => c.text("Birthday App API running"));

//trigler notification automatically 
export default {
  fetch: app.fetch,
};