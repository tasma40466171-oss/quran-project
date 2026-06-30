// constants/aiConstants.js
"use strict";

/**
 * AI-related constants
 */

const GROQ_MODEL = "llama-3.3-70b-versatile";
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

const DEFAULT_MAX_TOKENS = 1200;
const DEFAULT_TEMPERATURE = 0.7;

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1500;

module.exports = {
    GROQ_MODEL,
    GROQ_ENDPOINT,
    DEFAULT_MAX_TOKENS,
    DEFAULT_TEMPERATURE,
    MAX_RETRIES,
    BASE_DELAY_MS,
};
