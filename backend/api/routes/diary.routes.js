// modules/diary/diary.routes.js
"use strict";

const express    = require("express");
const router     = express.Router();
const auth       = require("../middleware/authMiddleware");
const diaryRepo  = require("../../repositories/diary.repository");
const { validate, rules } = require("../validators/validate");
const { formatSuccess }   = require("../../utils/responseFormatter");

// ─── Shared validation rules ──────────────────────────────────────────────────
const batchEntryRules = [rules.isArray("entries")];

const jadeedRules = [
    rules.required("range_from_surah"),
    rules.required("range_from_ayah"),
    rules.isInt("score", { min: 0, max: 10 }),
];

// ─── Diary write routes ───────────────────────────────────────────────────────
router.post("/murajah",  auth, validate(batchEntryRules), require("../controllers/diary/murajah.controller").addMurajahLog);
router.post("/tasmee",   auth, validate(batchEntryRules), require("../controllers/diary/tasmee.controller").addTasmeeLog);
router.post("/ikhtebar", auth, validate(batchEntryRules), require("../controllers/diary/ikhtebar.controller").addIkhtebarLog);
router.post("/jadeed",   auth, validate(jadeedRules),     require("../controllers/diary/jadeed.controller").addJadeedLog);
router.post("/juz-hali", auth, validate(batchEntryRules), require("../controllers/diary/juzzHali.controller").addJuzHaliLog);

// ─── Log read / update / delete routes ───────────────────────────────────────
router.get("/logs",       auth, require("../controllers/diary/log.controller").getLogs);
router.put("/log/:id",    auth, validate([rules.isInt("score", { min: 0, max: 10 })]), require("../controllers/diary/log.controller").updateLog);
router.delete("/log/:id", auth, require("../controllers/diary/log.controller").deleteLog);

// ─── GET /api/diary/heatmap ───────────────────────────────────────────────────
// Per-page average scores for the heatmap widget.
// Shape: [{ page, juz, score }]
router.get("/heatmap", auth, async (req, res, next) => {
    try {
        const rows = await diaryRepo.getHeatmapAggregates(req.user.id);
        res.json({ success: true, data: rows });
    } catch (err) { next(err); }
});

// ─── GET /api/diary/recent?limit=30 ──────────────────────────────────────────
// Most-recent N diary entries for the logged-in user (max 100).
// Shape: [{ id, type, range_from, range_to, score, created_at, … }]
router.get("/recent", auth, async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 30;
        const rows  = await diaryRepo.getRecentLogs(req.user.id, limit);
        res.json({ success: true, data: rows });
    } catch (err) { next(err); }
});

module.exports = router;