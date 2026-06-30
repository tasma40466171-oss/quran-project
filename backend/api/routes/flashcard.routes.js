// modules/coach/flashcard.routes.js
"use strict";

const express        = require("express");
const router         = express.Router();
const auth           = require("../middleware/authMiddleware");
const flashcardRepo  = require("../../repositories/flashcard.repository");
const folderRepo     = require("../../repositories/folder.repository");
const flashcardService = require("../../services/flashcard.service");
const AppError       = require("../../utils/AppError");
const asyncHandler   = require("../../utils/asyncHandler");

// ─── GET /api/flashcards/user-sets ───────────────────────────────────────────
router.get("/user-sets", auth, asyncHandler(async (req, res, next) => {
    const sets = await flashcardRepo.getSetsByUser(req.user.id);
    res.json({ success: true, data: sets });
}));

// ─── GET /api/flashcards/user-sets/uncategorised ─────────────────────────────────
// Must be BEFORE /user-sets/:id to avoid being caught by the wildcard
router.get("/user-sets/uncategorised", auth, asyncHandler(async (req, res, next) => {
    console.log('[uncategorised] Fetching for user:', req.user.id);
    const sets = await folderRepo.getUncategorisedSets(req.user.id);
    console.log('[uncategorised] Found sets:', sets.length);
    res.json({ success: true, data: sets });
}));

// ─── POST /api/flashcards/user-sets ──────────────────────────────────────────
// Body: { name: string, cards: [{ front, back }, …] }
router.post("/user-sets", auth, asyncHandler(async (req, res, next) => {
    const { name, cards } = req.body;
    const data = await flashcardService.createFlashcardSet(req.user.id, name, cards);
    res.status(201).json({ success: true, data });
}));

// ─── GET /api/flashcards/user-sets/:id ───────────────────────────────────────
router.get("/user-sets/:id", auth, asyncHandler(async (req, res, next) => {
    const data = await flashcardService.getFlashcardSet(req.user.id, req.params.id);
    res.json({ success: true, data });
}));

// ─── PATCH /api/flashcards/user-sets/:id ─────────────────────────────────────
// Body: { name: string }
router.patch("/user-sets/:id", auth, asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    const data = await flashcardService.renameFlashcardSet(req.user.id, req.params.id, name);
    res.json({ success: true, data });
}));

// ─── DELETE /api/flashcards/user-sets/:id ────────────────────────────────────
router.delete("/user-sets/:id", auth, asyncHandler(async (req, res, next) => {
    await flashcardService.deleteFlashcardSet(req.user.id, req.params.id);
    res.json({ success: true, message: "Set deleted." });
}));

// ─── FOLDER ROUTES ───────────────────────────────────────────────────────────────

// ─── GET /api/flashcards/folders ───────────────────────────────────────────────
router.get("/folders", auth, asyncHandler(async (req, res, next) => {
    const folders = await folderRepo.getFoldersByUser(req.user.id);
    res.json({ success: true, data: folders });
}));

// ─── POST /api/flashcards/folders ──────────────────────────────────────────────
// Body: { name: string, color: string }
router.post("/folders", auth, asyncHandler(async (req, res, next) => {
    const { name, color } = req.body;
    const data = await flashcardService.createFolder(req.user.id, name, color);
    res.status(201).json({ success: true, data });
}));

// ─── DELETE /api/flashcards/folders/:id ───────────────────────────────────────────
router.delete("/folders/:id", auth, asyncHandler(async (req, res, next) => {
    await flashcardService.deleteFolder(req.user.id, req.params.id);
    res.json({ success: true, message: "Folder deleted." });
}));

// ─── GET /api/flashcards/folders/:id/sets ─────────────────────────────────────
router.get("/folders/:id/sets", auth, asyncHandler(async (req, res, next) => {
    const sets = await folderRepo.getSetsInFolder(req.params.id, req.user.id);
    res.json({ success: true, data: sets });
}));

// ─── PATCH /api/flashcards/folders/:id ───────────────────────────────────────────
// Body: { name: string }
router.patch("/folders/:id", auth, asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    const data = await flashcardService.renameFolder(req.user.id, req.params.id, name);
    res.json({ success: true, data });
}));

// ─── POST /api/flashcards/folders/:id/items/batch ─────────────────────────────────
// Body: { items: [{ set_id: string, set_type: string }, …] }
router.post("/folders/:id/items/batch", auth, asyncHandler(async (req, res, next) => {
    const { items } = req.body;
    const message = await flashcardService.addItemsToFolder(req.user.id, req.params.id, items);
    res.json({ success: true, message });
}));

// ─── POST /api/flashcards/folders/:id/items ─────────────────────────────────────
// Body: { set_id: string, set_type: string }
router.post("/folders/:id/items", auth, asyncHandler(async (req, res, next) => {
    const { set_id, set_type } = req.body;
    const message = await flashcardService.addItemToFolder(req.user.id, req.params.id, set_id, set_type);
    res.json({ success: true, message });
}));

// ─── DELETE /api/flashcards/folders/:id/items/:setId ────────────────────────────
router.delete("/folders/:id/items/:setId", auth, asyncHandler(async (req, res, next) => {
    const message = await flashcardService.removeItemFromFolder(req.user.id, req.params.id, req.params.setId);
    res.json({ success: true, message });
}));

module.exports = router;