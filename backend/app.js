const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const authRoutes     = require("./routes/authRoutes");
const userRoutes     = require("./routes/userRoutes");
const resumeRoutes   = require("./routes/resumeRoutes");
const interviewRoutes= require("./routes/interviewRoutes");
const jobRoutes      = require("./routes/jobRoutes");
const roadmapRoutes  = require("./routes/roadmapRoutes");

const app = express();

// ─── Security ──────────────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  })
);

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173").split(",");

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true,
  })
);

// ─── Body / Cookie parsing ─────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── Logging ───────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ─── Global rate limit ─────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", globalLimiter);

// ─── Health check ──────────────────────────────────────────────────────────
app.get("/api/health", (req, res) =>
  res.status(200).json({ success: true, message: "PrepAI API is running", timestamp: new Date() })
);

// ─── Routes ────────────────────────────────────────────────────────────────
app.use("/api/auth",       authRoutes);
app.use("/api/users",      userRoutes);
app.use("/api/resumes",    resumeRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/jobs",       jobRoutes);
app.use("/api/roadmaps",   roadmapRoutes);

// ─── Error handling ────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
