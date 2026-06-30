// backend/modules/coach/sequenceWizard.controller.js
"use strict";

const { formatSuccess, formatError } = require("../../utils/responseFormatter");
const AppError = require("../../utils/AppError");
const asyncHandler = require("../../utils/asyncHandler");
const sequenceService = require("../../services/coach/sequence.service");

// ─── Sequence Wizard Controllers (Backend-Only Traversal Logic) ─────────────

/**
 * Sequence of Ayah in Surah - Backend deterministic fetch
 * POST /api/coach/wizard/sequence/surah
 * Body: { surah: number|string, mode: 'starting'|'ending' }
 */
exports.getSurahSequence = asyncHandler(async (req, res, next) => {
    const { surah, mode } = req.body;

    if (!surah || !mode) {
        throw new AppError("surah and mode are required.", 400);
    }

    const result = await sequenceService.getSurahSequence(surah, mode);
    res.status(200).json(formatSuccess(result));
});

/**
 * Sequence of Ayah in Page - Backend deterministic fetch
 * POST /api/coach/wizard/sequence/page
 * Body: { page: number, mode: 'starting'|'ending' }
 */
exports.getPageSequence = asyncHandler(async (req, res, next) => {
    const { page, mode } = req.body;

    if (!page || !mode) {
        throw new AppError("page and mode are required.", 400);
    }

    const result = await sequenceService.getPageSequence(page, mode);
    res.status(200).json(formatSuccess(result));
});

/**
 * Sequence of Pages in Juz - Backend deterministic fetch
 * POST /api/coach/wizard/sequence/juz-pages
 * Body: { juz: number, mode: 'starting'|'ending' }
 */
exports.getJuzPagesSequence = asyncHandler(async (req, res, next) => {
    const { juz, mode } = req.body;

    if (!juz || !mode) {
        throw new AppError("juz and mode are required.", 400);
    }

    const result = await sequenceService.getJuzPagesSequence(juz, mode);
    res.status(200).json(formatSuccess(result));
});

/**
 * Sequence of Surahs in Juz - Backend deterministic fetch
 * POST /api/coach/wizard/sequence/juz-surahs
 * Body: { juz: number }
 */
exports.getJuzSurahSequence = asyncHandler(async (req, res, next) => {
    const { juz } = req.body;

    if (!juz) {
        throw new AppError("juz is required.", 400);
    }

    const result = await sequenceService.getJuzSurahSequence(juz);
    res.status(200).json(formatSuccess(result));
});
