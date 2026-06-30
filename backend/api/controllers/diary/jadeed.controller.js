//C:\quran-similarity-app\backend\modules\diary\jadeed\jadeed.controller.js
const service    = require("./jadeed.service");
const ThemeModel = require("../../../database/theme.model");
const { formatSuccess } = require("../../../utils/responseFormatter");
const AppError = require("../../../utils/AppError");
const asyncHandler = require("../../../utils/asyncHandler");

exports.addJadeedLog = asyncHandler(async (req, res, next) => {
    await service.createJadeedLog(req.user.id, req.body);
    await ThemeModel.incrementStreak(req.user.id);
    res.status(201).json(formatSuccess(null, "Jadeed log added."));
});