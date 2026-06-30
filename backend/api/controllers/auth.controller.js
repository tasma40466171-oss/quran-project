// modules/auth/auth.controller.js
"use strict";

const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");
const authRepo = require("../../repositories/auth.repository");
const { formatSuccess, formatError } = require("../../utils/responseFormatter");
const AppError = require("../../utils/AppError");
const asyncHandler = require("../../utils/asyncHandler");

const JWT_SECRET  = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || "7d";

// ─── POST /api/auth/signup ────────────────────────────────────────────────────
exports.signup = asyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 12);
    await authRepo.createUser(username.trim(), email.toLowerCase().trim(), hashed);
    res.status(201).json(formatSuccess(null, "Account created successfully."));
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
exports.login = asyncHandler(async (req, res, next) => {
    const { username, password } = req.body;
    const user = await authRepo.findByUsername(username.trim());

    // Always run bcrypt — prevents timing-based user enumeration.
    const DUMMY_HASH = "$2a$12$dummyhashfortimingsafety000000000000000000000000000";
    const match = await bcrypt.compare(password, user?.password ?? DUMMY_HASH);

    if (!user || !match)
        throw new AppError("Invalid username or password.", 401);

    const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES }
    );
    res.status(200).json(formatSuccess({ token, username: user.username }, "Login successful."));
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await authRepo.findById(req.user.id);
    if (!user) throw new AppError("User not found.", 404);
    res.status(200).json(formatSuccess({
        id:         user.id,
        username:   user.username,
        email:      user.email,
        created_at: user.created_at,
        aqmosProfile: user.aqmosProfile,
    }));
});

// ─── PATCH /api/auth/password ─────────────────────────────────────────────────
exports.changePassword = asyncHandler(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
        throw new AppError("currentPassword and newPassword are required.", 400);
    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/\d/.test(newPassword))
        throw new AppError(
            "newPassword must be at least 8 characters with 1 uppercase letter and 1 number.",
            400
        );

    // findById gives us the email; findByEmail gives us the hash.
    const profile = await authRepo.findById(req.user.id);
    if (!profile) throw new AppError("User not found.", 404);

    const userWithHash = await authRepo.findByEmail(profile.email);
    const match = await bcrypt.compare(currentPassword, userWithHash.password);
    if (!match) throw new AppError("Current password is incorrect.", 401);

    const hashed = await bcrypt.hash(newPassword, 12);
    await authRepo.updatePassword(req.user.id, hashed);
    res.status(200).json(formatSuccess(null, "Password updated successfully."));
});

// ─── PATCH /api/auth/aqmos-profile ──────────────────────────────────────────────
exports.updateAqmosProfile = asyncHandler(async (req, res, next) => {
    const { aqmosProfile } = req.body;
    console.log("AQMOS profile received:", aqmosProfile);

    await authRepo.updateAqmosProfile(req.user.id, aqmosProfile);
    console.log("AQMOS profile saved:", aqmosProfile);

    res.status(200).json(formatSuccess({ aqmosProfile }, "Profile saved successfully."));
});

// ─── PATCH /api/auth/walkthrough ───────────────────────────────────────────────
exports.markWalkthroughSeen = asyncHandler(async (req, res, next) => {
    await authRepo.updateWalkthroughSeen(req.user.id);
    res.status(200).json(formatSuccess(null, "Walkthrough marked as seen."));
});