// modules/ayah/ayah.controller.js
"use strict";

const ayahRepo = require("../../repositories/ayah.repository");
const { formatSuccess, formatError } = require("../../utils/responseFormatter");
const AppError = require("../../utils/AppError");
const asyncHandler = require("../../utils/asyncHandler");

// ─── Helper ───────────────────────────────────────────────────────────────────

/** Extract the first 3 Arabic content words, skipping Quranic symbol characters. */
function extractFirstThreeWords(text) {
    if (!text) return "";
    const symbolPrefix = /^[\u06D6-\u06ED\u06DD\u06DE\u2766\u2767\u2764\u274C\u25A0\u25AB\u25B2\u25BC\u25CF\u25CB\s\u200B\u200C\u200D\uFEFF]+/;
    const cleanWords = [];
    for (const word of text.trim().split(/\s+/)) {
        const clean = word.replace(symbolPrefix, "").trim();
        if (clean && /[\u0600-\u06FF]/.test(clean)) {
            cleanWords.push(clean);
            if (cleanWords.length === 3) break;
        }
    }
    return cleanWords.join(" ");
}

// ─── Controllers ──────────────────────────────────────────────────────────────

exports.getSurahs = asyncHandler(async (req, res, next) => {
    const surahs = await ayahRepo.getAllSurahs();
    res.status(200).json(formatSuccess(surahs));
});

exports.getAyahsBySurah = asyncHandler(async (req, res, next) => {
    const ayahs = await ayahRepo.getAyahsBySurah(req.params.surah);
    res.status(200).json(formatSuccess(ayahs));
});

exports.getSingleAyah = asyncHandler(async (req, res, next) => {
    const { surah, ayah } = req.params;
    if (!surah || !ayah)
        throw new AppError("surah and ayah params are required.", 400);
    const ayahData = await ayahRepo.getAyah(surah, ayah);
    if (!ayahData)
        throw new AppError(`Ayah ${surah}:${ayah} not found.`, 404);
    res.status(200).json(formatSuccess(ayahData));
});

exports.getAyahContext = asyncHandler(async (req, res, next) => {
    const { surah, ayah } = req.query;
    if (!surah || !ayah)
        throw new AppError("surah and ayah query params are required.", 400);
    const context = await ayahRepo.getAyahContext(surah, ayah);
    res.status(200).json(formatSuccess(context));
});

exports.getPageDetails = asyncHandler(async (req, res, next) => {
    const { page } = req.query;
    if (!page) throw new AppError("page query param is required.", 400);
    const details = await ayahRepo.getPageDetails(page);
    if (!details) throw new AppError("Page not found.", 404);
    res.status(200).json(formatSuccess(details));
});

exports.getJuzPages = asyncHandler(async (req, res, next) => {
    const { juz } = req.query;
    if (!juz) throw new AppError("juz query param is required.", 400);
    const pages = await ayahRepo.getPagesByJuz(juz);
    res.status(200).json(formatSuccess(pages.map((p) => p.page)));
});

exports.getPagesInRange = asyncHandler(async (req, res, next) => {
    const { start, end } = req.query;
    if (!start || !end)
        throw new AppError("start and end query params are required.", 400);
    const pages = await ayahRepo.getPagesInRange(start, end);
    res.status(200).json(formatSuccess(pages));
});

exports.getFirstWords = asyncHandler(async (req, res, next) => {
    const { surah } = req.params;
    const surahNum  = parseInt(surah, 10);
    const ayahs     = await ayahRepo.getFullAyahsBySurah(surah);
    const filtered  = ayahs.filter((a) => surahNum === 1 ? true : a.ayah !== 0);
    const withFirstWords = filtered.map((a) => ({
        ayah:      a.ayah,
        text:      a.text,
        firstWord: extractFirstThreeWords(a.text),
    }));
    res.status(200).json(formatSuccess(withFirstWords));
});

// GET /api/ayah/page/:page/full
exports.getPageFull = asyncHandler(async (req, res, next) => {
    const { page } = req.params;
    if (!page) throw new AppError("page param required.", 400);
    const ayahs = await ayahRepo.getAyahsByPage(page);
    if (!ayahs || ayahs.length === 0)
        throw new AppError("No ayahs found for this page.", 404);
    
    console.log(`[PAGE FULL] Page ${page} has ${ayahs.length} ayahs`);
    console.log('[PAGE FULL] Ayahs:', ayahs.map(a => `${a.surah}:${a.ayah}`));
    
    res.status(200).json(formatSuccess({
        page:       Number(page),
        totalAyahs: ayahs.length,
        ayahs:      ayahs.map((a) => ({
            ayah:      `${a.surah}:${a.ayah}`,
            text:      a.text,
            firstWord: extractFirstThreeWords(a.text),
        })),
    }));
});

// GET /api/ayah/:surah/full
exports.getSurahFull = asyncHandler(async (req, res, next) => {
    const { surah } = req.params;
    const ayahs = await ayahRepo.getFullAyahsBySurah(surah);
    if (!ayahs || ayahs.length === 0)
        throw new AppError("Surah not found.", 404);
    res.status(200).json(formatSuccess({
        surah:      Number(surah),
        totalAyahs: ayahs.length,
        ayahs:      ayahs.map((a) => ({
            ayah:      a.ayah,
            text:      a.text,
            firstWord: extractFirstThreeWords(a.text),
        })),
    }));
});

// GET /api/ayah/juz/:juz/full
exports.getJuzFull = asyncHandler(async (req, res, next) => {
    const { juz } = req.params;
    const pageFirstAyahs = await ayahRepo.getFirstAyahOfEachPageInJuz(juz);
    if (!pageFirstAyahs || pageFirstAyahs.length === 0)
        throw new AppError("Juz not found.", 404);
    res.status(200).json(formatSuccess({
        juz:        Number(juz),
        totalPages: pageFirstAyahs.length,
        ayahs:      pageFirstAyahs.map((a) => ({
            ayah:      `${a.surah}:${a.ayah}`,
            text:      a.text,
            firstWord: extractFirstThreeWords(a.text),
            page:      a.page,
        })),
    }));
});

// GET /api/ayah/:surah/ayahs  (alias kept for backward compat)
exports.getAyahsByPage = exports.getSurahFull;