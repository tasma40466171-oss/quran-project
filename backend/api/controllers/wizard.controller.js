// backend/modules/similarity/wizard.controller.js
"use strict";

const { formatSuccess, formatError } = require("../../utils/responseFormatter");
const wizardService = require("../../services/similarity/wizard.service");

// ─── Wizard Flow Controllers ─────────────────────────────────────────────────────

/**
 * Find Mutashabihat - similarity search only, no LLM
 * POST /api/similarity/wizard/find
 * Body: { surah: number, ayah: number }
 */
exports.findMutashabihat = async (req, res, next) => {
    try {
        const { surah, ayah } = req.body;

        if (!surah || !ayah) {
            return res.status(400).json(formatError("surah and ayah are required."));
        }

        const data = await wizardService.findMutashabihat(surah, ayah);
        res.status(200).json(formatSuccess(data));
    } catch (err) {
        next(err);
    }
};

/**
 * Save Pair - store bidirectional pair relationship
 * POST /api/similarity/wizard/pair/save
 * Body: { source_surah: number, source_ayah: number, target_surah: number, target_ayah: number }
 */
exports.savePair = async (req, res, next) => {
    try {
        const { source_surah, source_ayah, target_surah, target_ayah } = req.body;

        if (!source_surah || !source_ayah || !target_surah || !target_ayah) {
            return res.status(400).json(formatError("All pair coordinates are required."));
        }

        const data = await wizardService.savePair(source_surah, source_ayah, target_surah, target_ayah);
        res.status(201).json(formatSuccess(data));
    } catch (err) {
        next(err);
    }
};

/**
 * Generate Pair Tip - LLM generates tip for a single pair
 * POST /api/similarity/wizard/pair/tip
 * Body: { source_surah: number, source_ayah: number, target_surah: number, target_ayah: number }
 */
exports.generatePairTip = async (req, res, next) => {
    try {
        const { source_surah, source_ayah, target_surah, target_ayah } = req.body;

        if (!source_surah || !source_ayah || !target_surah || !target_ayah) {
            return res.status(400).json(formatError("All pair coordinates are required."));
        }

        const data = await wizardService.generatePairTip(source_surah, source_ayah, target_surah, target_ayah);
        res.status(200).json(formatSuccess(data));
    } catch (err) {
        console.error('generatePairTip error:', err);
        next(err);
    }
};

/**
 * Generate Bulk Tips - LLM generates tips for all pairs of an ayah
 * POST /api/similarity/wizard/bulk/tips
 * Body: { surah: number, ayah: number }
 */
exports.generateBulkTips = async (req, res, next) => {
    try {
        const { surah, ayah } = req.body;

        if (!surah || !ayah) {
            return res.status(400).json(formatError("surah and ayah are required."));
        }

        const data = await wizardService.generateBulkTips(surah, ayah);
        res.status(200).json(formatSuccess(data));
    } catch (err) {
        console.error('generateBulkTips error:', err);
        next(err);
    }
};
