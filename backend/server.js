const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
dotenv.config();
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes//messageRoutes");

const app = express();
app.use(
  cors({
    origin: "*",

    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

const PORT = process.env.PORT || 5000;
connectDB();

// test route
app.get("/", (req, res) => {
  res.send("Hello from Express backend 🚀");
});

app.use("/api/user", userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);
// Handle unmatched routes
app.use((req, res) => {
  res.status(404).json({
    status: "ERROR",
    data: null,
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.message);
  res.status(err.status || 500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
