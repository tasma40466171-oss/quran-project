// modules/diary/log/log.controller.js
"use strict";

const diaryRepo = require("../../../repositories/diary.repository");
const { formatSuccess, formatError } = require("../../../utils/responseFormatter");
const AppError = require("../../../utils/AppError");
const asyncHandler = require("../../../utils/asyncHandler");

exports.getLogs = asyncHandler(async (req, res, next) => {
    const date = req.query.date || new Date().toISOString().split("T")[0];
    const type = req.query.type || null;
    const rows = await diaryRepo.getLogsByDate(req.user.id, date, type);
    res.status(200).json(formatSuccess(rows));
});

exports.updateLog = asyncHandler(async (req, res, next) => {
    const { score } = req.body;
    if (score === undefined || score < 0 || score > 10)
        throw new AppError("score must be between 0 and 10.", 400);
    const result = await diaryRepo.updateLog(req.params.id, req.user.id, score);
    if (result.changes === 0)
        throw new AppError("Log not found or not owned by user.", 404);
    res.status(200).json(formatSuccess(null, "Log updated."));
});

exports.deleteLog = asyncHandler(async (req, res, next) => {
    const result = await diaryRepo.deleteLog(req.params.id, req.user.id);
    if (result.changes === 0)
        throw new AppError("Log not found or not owned by user.", 404);
    res.status(200).json(formatSuccess(null, "Log deleted."));
});