const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ─── Security Middleware ───────────────────────────────────────────────────────
// app.use(
//   helmet({
//     contentSecurityPolicy: false,
//     crossOriginEmbedderPolicy: false,
//     crossOriginResourcePolicy: false,
//   })
// ); // Sets secure HTTP headers (allows CDNs and external video streaming)

// ─── Rate Limiting ────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,                  // Limit each IP to 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
});
app.use("/api/", limiter);

// ─── CORS Configuration ───────────────────────────────────────────────────────
const corsOptions = {
  origin: function (origin, callback) {
    // Allow all origins in development mode
    if (process.env.NODE_ENV === "development") {
      return callback(null, true);
    }
    
    const allowedOrigins = [
      process.env.CLIENT_URL || "http://127.0.0.1:5500",
      "http://localhost:5000",
      "http://127.0.0.1:5000",
      "http://localhost:5500",
      "http://127.0.0.1:5500",
      "http://localhost:5501",
      "http://127.0.0.1:5501",
      "http://localhost:5502",
      "http://127.0.0.1:5502",
      "http://localhost:5503",
      "http://127.0.0.1:5503",
      "http://127.0.0.1:3000",
      "http://localhost:3000",
      // Allow Postman / server-side calls (no origin)
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: Origin ${origin} not allowed`));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve static images
app.use("/images", express.static(path.join(__dirname, "../images")));

// ─── HTTP Logger ──────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ─── Serve Frontend Statically ────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, "../frontend")));

// ─── Health Check / Status ────────────────────────────────────────────────────
app.get("/api/status", (req, res) => {
  res.json({
    success: true,
    message: "🎬 Netflix Clone API is running",
    version: "1.0.0",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/movies", require("./routes/movieRoutes"));
app.use("/api/tvshows", require("./routes/tvshowRoutes"));
app.use("/api/watchlist", require("./routes/watchlistRoutes"));
app.use("/api/recently-watched", require("./routes/recentlyWatchedRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// ─── Error Handling Middleware ─────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`❤️  Health: http://localhost:${PORT}/api/health\n`);
});

// ─── Unhandled Promise Rejections ─────────────────────────────────────────────
process.on("unhandledRejection", (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// ─── Uncaught Exceptions ──────────────────────────────────────────────────────
process.on("uncaughtException", (err) => {
  console.error(`❌ Uncaught Exception: ${err.message}`);
  process.exit(1);
});
