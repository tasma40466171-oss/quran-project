// modules/diary/ikhtebar/ikhtebar.controller.js
const service    = require("./ikhtebar.service");   // ← was wrongly pointing to tasmee.service
const ThemeModel = require("../../../database/theme.model");
const { formatSuccess, formatError } = require("../../../utils/responseFormatter");
const AppError = require("../../../utils/AppError");
const asyncHandler = require("../../../utils/asyncHandler");

exports.addIkhtebarLog = asyncHandler(async (req, res, next) => {
    const { entries, date } = req.body;
    if (!Array.isArray(entries) || entries.length === 0) {
        throw new AppError("entries must be a non-empty array.", 400);
    }
    const today = new Date().toISOString().split("T")[0];
    const count = await service.createIkhtebarLogs(req.user.id, entries, date || today);
    await ThemeModel.incrementStreak(req.user.id);
    res.status(201).json(formatSuccess({ logged: count }, `Logged ${count} ikhtebar entries.`));
});