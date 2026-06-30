"use strict";

// ---------------------------------------------------------------------------
// modules/analytics/analytics.repository.js
//
// NOTE: This file is NOT imported by analytics.controller.js.
// The controller imports directly from:
//   - repositories/diary.repository.js   (getTrendRows, getDeepDiveRows)
//   - repositories/heatmap.repository.js (getScoresByUser, upsertScore)
//
// This file re-exports those two repositories so that if any future code
// does import analytics.repository, it gets real functions rather than
// a broken module.
// ---------------------------------------------------------------------------

const diaryRepo   = require("../../repositories/diary.repository");
const heatmapRepo = require("../../repositories/heatmap.repository");

module.exports = {
    // From diary.repository
    getTrendData:       diaryRepo.getTrendRows,
    getDeepDiveData:    diaryRepo.getDeepDiveRows,

    // From heatmap.repository
    getHeatmapScores:   heatmapRepo.getScoresByUser,
    upsertHeatmapScore: heatmapRepo.upsertScore,
};