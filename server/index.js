import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import postRoute from "./routes/post.js";
import authRoute from "./routes/auth.js";
import testRoute from "./routes/test.js";
import userRoute from "./routes/user.js";
import chatRoute from "./routes/chat.js";
import http from "http";
import messageRoute from "./routes/message.js";
import stripeRoute from "./routes/stripe.js";
import { Server } from "socket.io";
import "dotenv/config";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(cookieParser());

app.use("/api/posts", postRoute);
app.use("/api/auth", authRoute);
app.use("/api/test", testRoute);
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);
app.use("/api/stripe", stripeRoute);

const PORT = process.env.PORT || 8800

app.get('/favicon.ico', (req, res) => res.status(204));

let onlineUser = [];

const addUser = (userId, socketId) => {
  const userExits = onlineUser.find((user) => user.userId === userId);
  if (!userExits) {
    onlineUser.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    io.to(receiver?.socketId).emit("getMessage", data);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

io.listen("4000");

app.listen(PORT, () => [console.log("Server is running!")]);
