// services/similarity/wizard.service.js
"use strict";

const similarityRepo = require("../../repositories/similarity.repository");
const ayahRepo = require("../../repositories/ayah.repository");
const MUTASHABIHAT_TIPS_PROMPT = require("../../prompts/coach/mutashabihatTips.prompt.js");
const { callGroq } = require("../coach/groqClient");
const { GROQ_MODEL } = require("../../constants/aiConstants");

/**
 * Find similar ayahs for a given ayah
 */
async function findMutashabihat(surah, ayah) {
    const sourceAyah = await ayahRepo.getAyah(surah, ayah);
    if (!sourceAyah) {
        throw new Error("Source ayah not found.");
    }

    const raw = await similarityRepo.getSimilarities(surah, ayah);
    const results = raw.map((s) => ({
        id: s.id,
        target_surah: s.target_surah,
        target_ayah: s.target_ayah,
        similarity_score: s.similarity_score,
    }));

    return {
        source: { surah, ayah, text: sourceAyah.text },
        results,
    };
}

/**
 * Save bidirectional pair relationship
 */
async function savePair(source_surah, source_ayah, target_surah, target_ayah) {
    // Check if pair already exists (bidirectional)
    const existing = await similarityRepo.getPairByCoordinates(
        source_surah, source_ayah, target_surah, target_ayah
    );

    if (existing) {
        return {
            id: existing.id,
            message: "Pair already exists",
        };
    }

    // Create bidirectional pair
    await similarityRepo.createPair(source_surah, source_ayah, target_surah, target_ayah);

    return {
        message: "Pair saved successfully",
    };
}

/**
 * Generate AI tip for a single pair
 */
async function generatePairTip(source_surah, source_ayah, target_surah, target_ayah) {
    // Get ayah texts for context
    const sourceAyah = await ayahRepo.getAyah(source_surah, source_ayah);
    const targetAyah = await ayahRepo.getAyah(target_surah, target_ayah);

    if (!sourceAyah || !targetAyah) {
        throw new Error("One or both ayahs not found.");
    }

    console.log('Generating tip for pair:', { source_surah, source_ayah, target_surah, target_ayah });
    console.log('Source text:', sourceAyah.text);
    console.log('Target text:', targetAyah.text);

    // Build prompt with context
    const context = `
Source: Surah ${source_surah}:${source_ayah}
Text: ${sourceAyah.text}

Target: Surah ${target_surah}:${target_ayah}
Text: ${targetAyah.text}

Generate a memory tip for this pair in JSON format.`;

    const messages = [
        { role: "system", content: MUTASHABIHAT_TIPS_PROMPT },
        { role: "user", content: context },
    ];

    // Call Groq API using groqClient
    const { text } = await callGroq({
        model: GROQ_MODEL,
        messages,
        max_tokens: 500,
        temperature: 0.3,
    });
    
    const content = text;
    console.log('LLM content:', content);
    
    let tipData;
    try {
        tipData = JSON.parse(content);
    } catch (parseErr) {
        console.error('JSON parse error:', parseErr);
        // Fallback: use raw content as tip if JSON parsing fails
        tipData = { tip: content };
    }

    // Save tip to database
    const cleanTip = tipData.tip || content || "";
    console.log('Clean tip:', cleanTip);
    
    await similarityRepo.updateTipsByPair(
        source_surah, source_ayah, target_surah, target_ayah, [cleanTip]
    );

    return {
        tip: cleanTip,
        pair: `${source_surah}:${source_ayah} ↔ ${target_surah}:${target_ayah}`,
    };
}

/**
 * Generate AI tips for all pairs of an ayah
 */
async function generateBulkTips(surah, ayah) {
    console.log('Generating bulk tips for:', { surah, ayah });

    // Get all similar pairs
    const raw = await similarityRepo.getSimilarities(surah, ayah);
    console.log('Found raw pairs:', raw.length);
    
    if (raw.length === 0) {
        return {
            message: "No similar pairs found",
            results: [],
        };
    }

    // Get ayah texts for context
    const sourceAyah = await ayahRepo.getAyah(surah, ayah);
    console.log('Source ayah:', sourceAyah?.text?.substring(0, 50));
    
    const pairsWithContext = await Promise.all(
        raw.map(async (pair) => {
            const targetAyah = await ayahRepo.getAyah(pair.target_surah, pair.target_ayah);
            return {
                pair,
                targetText: targetAyah?.text || "",
            };
        })
    );

    // Build prompt with all pairs
    const context = `
Source: Surah ${surah}:${ayah}
Text: ${sourceAyah.text}

Similar pairs:
${pairsWithContext.map((p, i) => `
${i + 1}. Source: Surah ${surah}:${ayah}
   Target: Surah ${p.pair.target_surah}:${p.pair.target_ayah}
   Target Text: ${p.targetText}
`).join("\n")}

Generate memory tips for each pair in JSON bulk format with structured coordinates.`;

    const messages = [
        { role: "system", content: MUTASHABIHAT_TIPS_PROMPT },
        { role: "user", content: context },
    ];

    console.log('Calling Groq API for bulk tips...');

    // Call Groq API using groqClient
    const { text } = await callGroq({
        model: GROQ_MODEL,
        messages,
        max_tokens: 2000,
        temperature: 0.3,
    });
    
    const content = text;
    console.log('LLM bulk content:', content);
    
    let tipData;
    try {
        tipData = JSON.parse(content);
    } catch (parseErr) {
        console.error('JSON parse error for bulk:', parseErr);
        // Fallback: try to extract tips from raw content
        tipData = { results: [] };
    }

    // Save all tips to database using structured coordinates from LLM output
    const results = [];
    if (tipData.results && Array.isArray(tipData.results)) {
        for (const result of tipData.results) {
            // Use structured coordinates from LLM output (validated against backend dataset)
            const { source_surah, source_ayah, target_surah, target_ayah, tip } = result;
            
            // Validate coordinates exist
            if (source_surah && source_ayah && target_surah && target_ayah) {
                await similarityRepo.updateTipsByPair(source_surah, source_ayah, target_surah, target_ayah, [tip]);
                results.push({
                    pair: `${source_surah}:${source_ayah} ↔ ${target_surah}:${target_ayah}`,
                    tip: tip,
                });
            }
        }
    } else {
        console.error('No results array in tipData');
    }

    console.log('Generated and saved', results.length, 'tips');

    return {
        results,
        message: `Generated ${results.length} tips`,
    };
}

module.exports = {
    findMutashabihat,
    savePair,
    generatePairTip,
    generateBulkTips,
};
