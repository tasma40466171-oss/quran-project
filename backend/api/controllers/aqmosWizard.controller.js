// backend/modules/coach/aqmosWizard.controller.js
"use strict";

const { formatSuccess, formatError } = require("../../utils/responseFormatter");
const AppError = require("../../utils/AppError");
const asyncHandler = require("../../utils/asyncHandler");
const assessmentService = require("../../services/coach/assessment.service");

// ─── AQMOS Wizard Controllers (Backend-Only Classification Logic) ─────────────

/**
 * Save Profile - Backend validates and saves profile
 * POST /api/coach/wizard/aqmos/save
 * Body: { profile: string }
 */
exports.saveProfile = asyncHandler(async (req, res, next) => {
    const { profile } = req.body;
    const userId = req.user.id;

    const data = await assessmentService.saveProfile(userId, profile);
    res.status(200).json(formatSuccess(data));
});

/**
 * Clear Profile - Remove AQMOS profile from user
 * DELETE /api/coach/wizard/aqmos/clear
 */
exports.clearProfile = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    const data = await assessmentService.clearProfile(userId);
    res.status(200).json(formatSuccess(data, "Profile cleared successfully."));
});
