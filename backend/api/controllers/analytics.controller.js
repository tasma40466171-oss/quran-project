// modules/analytics/analytics.controller.js
"use strict";

const diaryRepo   = require("../../repositories/diary.repository");
const heatmapRepo = require("../../repositories/heatmap.repository");
const AppError = require("../../utils/AppError");
const asyncHandler = require("../../utils/asyncHandler");

// ─── Helpers ──────────────────────────────────────────────────────────────────

const RANGE_INTERVALS = {
    "7d": 7, "1m": 30, "3m": 90, "6m": 180, "1y": 365, "all": 365 * 10,
};

const DEEP_DIVE_INTERVALS = {
    "7d": "-7 days", "1m": "-1 month", "3m": "-3 months",
    "6m": "-6 months", "1y": "-1 year", "all": "-100 years",
};

const TYPE_MAP = {
    murajah:  "murajah",
    tasmee:   "tasmee",
    ikhtebar: "ikhtebar",
    jadeed:   "jadeed",
    juzz_hali: "Juz_Hali",
    Juz_Hali:  "Juz_Hali",
};

const toDateStr = (date) => date.toISOString().split("T")[0];

const addDays = (dateStr, n) => {
    const d = new Date(dateStr + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() + n);
    return toDateStr(d);
};

// ─── Controllers ──────────────────────────────────────────────────────────────

exports.getTrend = asyncHandler(async (req, res, next) => {
    const { range, start, end } = req.query;
    const today = toDateStr(new Date());

    let startDate, endDate;
    if (start && end) {
        startDate = start < end ? start : end;
        endDate   = start < end ? end   : start;
    } else {
        const days = RANGE_INTERVALS[range] ?? 7;
        startDate  = toDateStr(new Date(Date.now() - days * 86_400_000));
        endDate    = today;
    }

    const rows = await diaryRepo.getTrendRows(req.user.id, startDate, endDate);

    const dataMap = new Map(rows.map((d) => [
        d.raw_date,
        d.total_entries > 0
            ? Math.round((d.total_score / (d.total_entries * 10)) * 100)
            : 0,
    ]));

    // Fill every date in range so gaps are visible (null = no data)
    const continuousData = [];
    let cursor = startDate;
    while (cursor <= endDate) {
        continuousData.push({ date: cursor, percentage: dataMap.get(cursor) ?? null });
        cursor = addDays(cursor, 1);
    }

    res.status(200).json({ success: true, data: continuousData });
});

exports.getDeepDive = asyncHandler(async (req, res, next) => {
    const { type, juz, range } = req.query;

    if (!type)
        throw new AppError("type query param is required.", 400);

    const dbType = TYPE_MAP[type];
    if (!dbType)
        throw new AppError(`Unknown type: ${type}`, 400);

    const interval = DEEP_DIVE_INTERVALS[range] ?? "-7 days";
    const data     = await diaryRepo.getDeepDiveRows(req.user.id, dbType, interval, juz ?? null);
    res.status(200).json({ success: true, data: data ?? [] });
});

exports.getHeatmapData = asyncHandler(async (req, res, next) => {
    const rows = await heatmapRepo.getScoresByUser(req.user.id);
    res.status(200).json({ success: true, data: rows || [] });
});

exports.saveHeatmapData = asyncHandler(async (req, res, next) => {
    // DEPRECATED: Heatmap data is now computed from diary_logs
    // This endpoint is kept for backward compatibility but should not be used
    throw new AppError("This endpoint is deprecated. Heatmap data is now automatically computed from diary_logs (murajah/tasmee entries).", 410);
});