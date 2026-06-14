import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "./config/passport.js";
import projectRoutes from "./routes/project.routes.js";
import metricsRoutes from "./routes/metrics.routes.js";
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import { getFrontendUrls, isAllowedOrigin } from "./utils/runtimeConfig.js";

const app = express();
const frontendUrls = getFrontendUrls();

app.set("trust proxy", 1);

app.use(cors({
  origin(origin, callback) {
    callback(null, isAllowedOrigin(origin));
  },
  credentials: true
}));
app.use(express.json());

// Session configuration for Passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'development-session-secret',
  resave: false,
  saveUninitialized: false,
  proxy: process.env.NODE_ENV === "production",
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    frontendUrls,
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/projects", projectRoutes);
app.use("/api/metrics", metricsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

export default app;
