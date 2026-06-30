"use strict";
require("dotenv").config();

const REQUIRED_ENV = ["JWT_SECRET"];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missing.length > 0) {
    console.error(`FATAL: Missing required environment variables: ${missing.join(", ")}`);
    process.exit(1);
}

const express        = require("express");
const cors           = require("cors");
const helmet         = require("helmet");
const morgan         = require("morgan");
const errorHandler   = require("./api/middleware/errorHandler");

const authRoutes       = require("./api/routes/auth.routes");
const ayahRoutes       = require("./api/routes/ayah.routes");
const similarityRoutes = require("./api/routes/similarity.routes");
const wizardRoutes      = require("./api/routes/wizard.routes");
const diaryRoutes      = require("./api/routes/diary.routes");
const analyticsRoutes  = require("./api/routes/analytics.routes");
const taskRoutes       = require("./api/routes/task.routes");
const themeRoutes      = require("./api/routes/theme.routes");
const chatRoutes       = require("./api/routes/chat.routes");
const flashcardRoutes  = require("./api/routes/flashcard.routes");
const tmWizardRoutes   = require("./api/routes/tmWizard.routes");
const seqWizardRoutes  = require("./api/routes/sequenceWizard.routes");
const aqmosWizardRoutes = require("./api/routes/aqmosWizard.routes");
const schedulerRoutes   = require("./api/routes/schedule.routes");

const app = express();

// ─── Security & Logging ───────────────────────────────────────────────────────
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
    origin: (process.env.ALLOWED_ORIGINS || "http://localhost:3000")
        .split(",").map((o) => o.trim()),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.options("*", cors());

// ─── Body Parser ──────────────────────────────────────────────────────────────
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) =>
    res.json({ status: "OK", timestamp: new Date().toISOString() })
);

app.use("/api/auth",       authRoutes);
app.use("/api/ayah",       ayahRoutes);
app.use("/api/similarity", similarityRoutes);
app.use("/api/similarity/wizard", wizardRoutes);
app.use("/api/diary",      diaryRoutes);
app.use("/api/analytics",  analyticsRoutes);
app.use("/api/tasks",      taskRoutes);
app.use("/api/themes",     themeRoutes);
app.use("/api/coach",      chatRoutes);
app.use("/api/coach/wizard", tmWizardRoutes);
app.use("/api/coach/wizard", seqWizardRoutes);
app.use("/api/coach/wizard", aqmosWizardRoutes);
app.use("/api/flashcards", flashcardRoutes);
app.use("/api/scheduler", schedulerRoutes);

// ─── 404 handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.path} not found.`,
    });
});

// ─── JSON syntax error handler (must come AFTER routes) ───────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({ success: false, message: "Invalid JSON body." });
    }
    next(err);
});

// ─── Global error handler (must be last) ─────────────────────────────────────
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} [${process.env.NODE_ENV || "development"}]`);
});