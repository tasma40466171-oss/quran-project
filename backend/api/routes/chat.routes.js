// modules/coach/chat.routes.js
"use strict";

const express     = require("express");
const router      = express.Router();
const auth        = require("../middleware/authMiddleware");
const coachRepo   = require("../../repositories/coach.repository");
const conversationService = require("../../services/coach/conversation.service");
const AppError    = require("../../utils/AppError");
const asyncHandler = require("../../utils/asyncHandler");

// ─── GET /api/coach/remaining ─────────────────────────────────────────────────
router.get("/remaining", auth, asyncHandler(async (req, res, next) => {
    const data = await conversationService.getRemaining(req.user.id);
    res.json({ success: true, data });
}));

// ─── POST /api/coach/chat ─────────────────────────────────────────────────────
router.post("/chat", auth, asyncHandler(async (req, res, next) => {
    const { messages = [], system: clientSystem, state: currentState = "home" } = req.body;
    
    try {
        const { text } = await conversationService.processChat(
            req.user.id,
            messages,
            clientSystem,
            currentState
        );
        res.json({ content: [{ type: "text", text }] });
    } catch (error) {
        if (error.status === 429) {
            return res.status(429).json({
                success: false,
                error: error.message,
            });
        }
        if (error.diagnosis) {
            return res.status(error.status).json({
                success: false,
                error: error.message,
                diagnosis: error.diagnosis,
            });
        }
        next(error);
    }
}));

// ─── GET /api/coach/sessions ──────────────────────────────────────────────────
router.get("/sessions", auth, asyncHandler(async (req, res, next) => {
    const sessions = await coachRepo.getSessions(req.user.id);
    res.json({ success: true, data: sessions });
}));

// ─── POST /api/coach/sessions ─────────────────────────────────────────────────
router.post("/sessions", auth, asyncHandler(async (req, res, next) => {
    const session = await coachRepo.createSession(req.user.id, req.body.title);
    res.status(201).json({ success: true, data: session });
}));

// ─── GET /api/coach/sessions/:id/messages ────────────────────────────────────
router.get("/sessions/:id/messages", auth, asyncHandler(async (req, res, next) => {
    const session = await coachRepo.getSessionByIdAndUser(req.params.id, req.user.id);
    if (!session)
        throw new AppError("Session not found.", 404);

    const messages = await coachRepo.getMessages(req.params.id);
    res.json({ success: true, data: messages });
}));

// ─── POST /api/coach/sessions/:id/messages ───────────────────────────────────
router.post("/sessions/:id/messages", auth, asyncHandler(async (req, res, next) => {
    const { role, content } = req.body;

    if (!role || !content)
        throw new AppError("role and content are required.", 400);
    if (!["user", "assistant"].includes(role))
        throw new AppError("role must be user or assistant.", 400);

    const session = await coachRepo.getSessionByIdAndUser(req.params.id, req.user.id);
    if (!session)
        throw new AppError("Session not found.", 404);

    const newId = await coachRepo.addMessage(req.params.id, role, content);
    await coachRepo.touchSession(req.params.id);

    if (role === "user") {
        await coachRepo.autoTitleSession(req.params.id, content);
    }

    res.status(201).json({ success: true, data: { id: newId } });
}));

// ─── DELETE /api/coach/sessions/:id ──────────────────────────────────────────
router.delete("/sessions/:id", auth, asyncHandler(async (req, res, next) => {
    const changes = await coachRepo.deleteSession(req.params.id, req.user.id);
    if (changes === 0)
        throw new AppError("Session not found.", 404);
    res.json({ success: true, message: "Session deleted." });
}));

// ─── PATCH /api/coach/sessions/:id ───────────────────────────────────────────
router.patch("/sessions/:id", auth, asyncHandler(async (req, res, next) => {
    const { title } = req.body;
    if (!title)
        throw new AppError("title is required.", 400);

    const changes = await coachRepo.renameSession(req.params.id, req.user.id, title);
    if (changes === 0)
        throw new AppError("Session not found.", 404);
    res.json({ success: true, message: "Session renamed." });
}));

module.exports = router;