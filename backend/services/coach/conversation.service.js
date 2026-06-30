// services/coach/conversation.service.js
"use strict";

const { buildSystemPrompt } = require("./promptBuilder");
const { analyzeAIError } = require("../../utils/aiErrorHandler");
const { recordRequest } = require("../../utils/tokenUsageTracker");
const { callGroq } = require("./groqClient");
const { GROQ_MODEL } = require("../../constants/aiConstants");
const AppError = require("../../utils/AppError");

const UNLIMITED_USER_ID = parseInt(process.env.UNLIMITED_USER_ID || "0");
const DAILY_LIMIT = 10;

/**
 * Check if user has reached daily message limit
 */
async function checkDailyLimit(userId, isUnlimited) {
    if (isUnlimited) return { canProceed: true, remaining: null };
    
    const used = await require("../../repositories/coach.repository").getDailyCount(userId);
    if (used >= DAILY_LIMIT) {
        return { 
            canProceed: false, 
            remaining: 0,
            error: `Daily limit of ${DAILY_LIMIT} coach messages reached. Come back tomorrow!` 
        };
    }
    
    return { canProceed: true, remaining: Math.max(0, DAILY_LIMIT - used) };
}

/**
 * Format messages for Groq API
 */
function formatMessages(messages, system, state) {
    const studentDataSection =
        system && system.includes("=== STUDENT")
            ? "\n\n" + system.substring(system.indexOf("=== STUDENT"))
            : system && system.includes("=== JUZ")
            ? "\n\n" + system.substring(system.indexOf("=== JUZ"))
            : system
            ? "\n\n" + system
            : "";

    const stateSection = `\n\nCURRENT CONVERSATION STATE: ${state}`;
    const baseSystemPrompt = buildSystemPrompt(state);
    const fullSystem = baseSystemPrompt + stateSection + studentDataSection;

    return [
        { role: "system", content: fullSystem },
        ...messages.map((m) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.content,
        })),
    ];
}

/**
 * Calculate prompt diagnostics for logging
 */
function calculateDiagnostics(messages, system, fullSystem) {
    const systemPromptLength = fullSystem.length;
    const userMessages = messages.filter(m => m.role === "user").map(m => m.content).join("");
    const userTextLength = userMessages.length;
    const conversationText = messages.map(m => m.content).join("");
    const conversationLength = conversationText.length;
    const contextSection = system || "";
    const quranContextLength = contextSection.length;
    const totalChars = systemPromptLength + userTextLength + conversationLength + quranContextLength;

    return {
        systemPromptLength,
        userTextLength,
        conversationLength,
        quranContextLength,
        totalChars,
    };
}

/**
 * Call Groq API with timeout using groqClient
 */
async function callGroqAPI(messages, controller) {
    const { text } = await callGroq({
        model: GROQ_MODEL,
        messages,
        signal: controller.signal,
    });
    
    return { choices: [{ message: { content: text } }] };
}

/**
 * Process chat request
 */
async function processChat(userId, messages, system, state) {
    const isUnlimited = Number(userId) === UNLIMITED_USER_ID;
    
    // Check daily limit
    const limitCheck = await checkDailyLimit(userId, isUnlimited);
    if (!limitCheck.canProceed) {
        throw Object.assign(new Error(limitCheck.error), { status: 429 });
    }

    // Validate messages
    if (!Array.isArray(messages) || messages.length === 0) {
        throw new AppError("messages array is required and must not be empty.", 400);
    }

    // Format messages
    const formattedMessages = formatMessages(messages, system, state);
    const fullSystem = formattedMessages[0].content;

    // Calculate diagnostics
    const diagnostics = calculateDiagnostics(messages, system, fullSystem);

    // Log diagnostics
    console.log("=== PROMPT SECTION LENGTHS ===");
    console.log("System Prompt:", diagnostics.systemPromptLength);
    console.log("Conversation History:", diagnostics.conversationLength);
    console.log("Quran Context:", diagnostics.quranContextLength);
    console.log("User Message:", diagnostics.userTextLength);
    console.log("Total Request:", diagnostics.totalChars);
    console.log("==============================");

    // Duplicate detection
    console.log("=== DUPLICATE DETECTION ===");
    const option1Count = (fullSystem.match(/OPTION 1 - Sequence/g) || []).length;
    const option2Count = (fullSystem.match(/OPTION 2 - Mutashabihat/g) || []).length;
    const option3Count = (fullSystem.match(/OPTION 3 - Best Method/g) || []).length;
    const option4Count = (fullSystem.match(/OPTION 4 - Time Management/g) || []).length;
    
    console.log("OPTION 1 - Sequence occurrences:", option1Count);
    console.log("OPTION 2 - Mutashabihat occurrences:", option2Count);
    console.log("OPTION 3 - Best Method occurrences:", option3Count);
    console.log("OPTION 4 - Time Management occurrences:", option4Count);
    console.log("==========================");

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);

    try {
        // Call Groq API
        const groqData = await callGroqAPI(formattedMessages, controller);
        
        clearTimeout(timeout);

        const text = groqData.choices?.[0]?.message?.content || "Sorry, I could not generate a response.";

        // Log API usage
        console.log("Prompt tokens:", groqData.usage?.prompt_tokens);
        console.log("Completion tokens:", groqData.usage?.completion_tokens);
        console.log("Total tokens:", groqData.usage?.total_tokens);

        // Record token usage
        recordRequest({
            promptTokens: groqData.usage?.prompt_tokens,
            completionTokens: groqData.usage?.completion_tokens,
            totalTokens: groqData.usage?.total_tokens,
            charsSent: diagnostics.totalChars,
            endpoint: "/api/coach/chat",
        });

        // Record usage (limited users only)
        if (!isUnlimited) {
            const coachRepo = require("../../repositories/coach.repository");
            await coachRepo.recordUsage(userId)
                .catch((e) => console.error("Failed to record coach_message:", e.message));
        }

        return { text };
    } catch (error) {
        clearTimeout(timeout);
        throw error;
    }
}

/**
 * Get remaining messages for user
 */
async function getRemaining(userId) {
    const isUnlimited = Number(userId) === UNLIMITED_USER_ID;
    if (isUnlimited) {
        return { remaining: null, unlimited: true };
    }

    const coachRepo = require("../../repositories/coach.repository");
    const used = await coachRepo.getDailyCount(userId);
    return { remaining: Math.max(0, DAILY_LIMIT - used), unlimited: false };
}

module.exports = {
    processChat,
    getRemaining,
    checkDailyLimit,
};
