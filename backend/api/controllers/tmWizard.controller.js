// backend/modules/coach/tmWizard.controller.js
"use strict";

const { formatSuccess, formatError } = require("../../utils/responseFormatter");
const AppError = require("../../utils/AppError");
const asyncHandler = require("../../utils/asyncHandler");
const timeManagementService = require("../../services/coach/timeManagement.service");

// ─── Time Management Wizard Controllers (Backend-Only Scheduling Logic) ─────

/**
 * STEP 2: Analyze Progress - Backend analyzes Jadeed progress
 * POST /api/coach/wizard/tm/analyze
 * Body: { useCurrentLogs: boolean }
 */
exports.analyzeProgress = asyncHandler(async (req, res, next) => {
    const { useCurrentLogs } = req.body;
    const userId = req.user.id;

    const analysis = await timeManagementService.analyzeProgress(userId);
    res.status(200).json(formatSuccess(analysis));
});

/**
 * STEP 3: Generate Weekly Cycle - Backend generates revision cycle using rules
 * POST /api/coach/wizard/tm/cycle
 * Body: { analysisData: object }
 */
exports.generateWeeklyCycle = asyncHandler(async (req, res, next) => {
    const { analysisData } = req.body;

    const cycle = timeManagementService.generateWeeklyCycle(analysisData);
    res.status(200).json(formatSuccess(cycle));
});

/**
 * STEP 9: Generate Schedule - Backend computes schedule deterministically
 * POST /api/coach/wizard/tm/generate
 * Body: { weeklyCycle, dailySchedule, frequency, exceptions, timeInputs, preferences }
 */
exports.generateSchedule = asyncHandler(async (req, res, next) => {
    const { weeklyCycle, dailySchedule, frequency, exceptions, timeInputs, preferences } = req.body;

    const data = await timeManagementService.generateCompleteSchedule(weeklyCycle);
    res.status(200).json(formatSuccess(data));
});

/**
 * STEP 10: Save Schedule - Backend persists schedule to database
 * POST /api/coach/wizard/tm/save
 * Body: { schedule: object }
 */
exports.saveSchedule = asyncHandler(async (req, res, next) => {
    const { schedule } = req.body;
    const userId = req.user.id;

    const data = timeManagementService.saveSchedule(schedule, userId);
    res.status(200).json(formatSuccess(data));
});
