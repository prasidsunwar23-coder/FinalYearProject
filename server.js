const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST"],
  },
});

// Track online users
const onlineUsers = new Map(); // userId -> socketId

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // User joins with their userId
  socket.on("join", ({ userId }) => {
    onlineUsers.set(userId, socket.id);
    socket.userId = userId;
    console.log(`User ${userId} joined`);
    // Broadcast online status
    io.emit("presence", { userId, online: true });
  });

  // Real-time message relay
  socket.on("message", ({ conversationId, senderId, senderName, content }) => {
    // Broadcast to all clients in the conversation
    socket.broadcast.emit("new_message", {
      conversationId, senderId, senderName, content,
      timestamp: new Date().toISOString(),
    });
  });

  // Typing indicator
  socket.on("typing", ({ conversationId, userId, isTyping }) => {
    socket.broadcast.emit("typing", { conversationId, userId, isTyping });
  });

  // Online presence
  socket.on("online", ({ userId }) => {
    onlineUsers.set(userId, socket.id);
    io.emit("presence", { userId, online: true });
  });

  // Disconnect
  socket.on("disconnect", () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      io.emit("presence", { userId: socket.userId, online: false });
      console.log(`User ${socket.userId} disconnected`);
    }
  });
});

app.get("/health", (req, res) => res.json({ status: "ok", online: onlineUsers.size }));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Socket.io server running on port ${PORT}`));
