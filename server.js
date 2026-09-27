
require("dotenv").config();

// Check required security configuration
if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET is missing in .env");
    process.exit(1);
}

const express = require("express");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const bmiRoutes = require("./routes/bmiRoutes");
const healthRoutes = require("./routes/healthRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/bmi", bmiRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/chat", chatRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Home Route
app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(
        `🚀 Server is running on http://localhost:${PORT}`
    );
});