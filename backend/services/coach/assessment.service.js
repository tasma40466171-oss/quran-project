// services/coach/assessment.service.js
"use strict";

const BEST_METHOD_PROMPT = require("../../prompts/coach/bestMethod.prompt.js");
const { callGroq } = require("./groqClient");
const { GROQ_MODEL } = require("../../constants/aiConstants");
const userRepo = require("../../database/user.model");

// Accepted profiles (deterministic validation)
const ACCEPTED_PROFILES = [
  'Exploratory Learner',
  'Repetitive Learner',
  'Sensitive Structured Learner',
  'Balanced Learner',
];

/**
 * Validate profile against accepted profiles
 */
function validateProfile(profile) {
    if (!profile) {
        throw new Error("profile is required.");
    }

    // Backend-only validation (deterministic)
    const normalizedProfile = profile.trim();
    const isValid = ACCEPTED_PROFILES.some(
        accepted => accepted.toLowerCase() === normalizedProfile.toLowerCase()
    );

    if (!isValid) {
        throw new Error(
            `Invalid profile. Accepted profiles: ${ACCEPTED_PROFILES.join(', ')}`
        );
    }

    // Find the exact profile name (case-insensitive match)
    const exactProfile = ACCEPTED_PROFILES.find(
        accepted => accepted.toLowerCase() === normalizedProfile.toLowerCase()
    );

    return exactProfile;
}

/**
 * Format recommendation using LLM (formatting only, no classification)
 */
async function formatRecommendationWithLLM(profile) {
    const messages = [
        { role: "system", content: BEST_METHOD_PROMPT },
        { role: "user", content: `Provide coaching recommendation for: ${profile}` },
    ];

    const { text } = await callGroq({
        model: GROQ_MODEL,
        messages,
        max_tokens: 500,
        temperature: 0.3,
    });

    return text;
}

/**
 * Save profile with validation and recommendation
 */
async function saveProfile(userId, profile) {
    const exactProfile = validateProfile(profile);

    // Persist profile to database
    // In production, this would save to a user profiles table
    // await userRepo.saveProfile(userId, exactProfile);

    // Use LLM ONLY to format recommendation message (no classification)
    const recommendation = await formatRecommendationWithLLM(exactProfile);

    return {
        profile: exactProfile,
        message: recommendation,
    };
}

/**
 * Clear AQMOS profile from user
 */
async function clearProfile(userId) {
    // Clear profile from database
    await userRepo.clearAqmosProfile(userId);

    return { cleared: true };
}

module.exports = {
    validateProfile,
    formatRecommendationWithLLM,
    saveProfile,
    clearProfile,
};
