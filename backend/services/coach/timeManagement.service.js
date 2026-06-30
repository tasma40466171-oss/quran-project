// services/coach/timeManagement.service.js
"use strict";

const heatmapRepo = require("../../repositories/heatmap.repository");
const SCHEDULING_PROMPT = require("../../prompts/coach/scheduling.prompt.js");
const { callGroq } = require("./groqClient");
const { GROQ_MODEL } = require("../../constants/aiConstants");

/**
 * Analyze user's Jadeed progress from heatmap data
 */
async function analyzeProgress(userId) {
    // Fetch user's heatmap scores (actual completion data)
    const heatmapData = await heatmapRepo.getScoresByUser(userId);
    console.log('=== ANALYSIS DEBUG ===');
    console.log('User ID:', userId);
    console.log('Total heatmap entries:', heatmapData?.length);
    console.log('Sample entries:', heatmapData?.slice(0, 5));

    // Backend-only analysis logic (deterministic)
    const analysis = {
        completedMarhalas: [],
        currentMarhala: null,
        currentSipara: null,
        currentPage: null,
        totalPages: null,
        allActiveSiparas: [],
    };

    // Analyze heatmap data to determine progress
    const allActiveSiparas = [];
    if (heatmapData && heatmapData.length > 0) {
        // Group by Sipara (Juz) to determine progress
        const siparaProgress = {};
        
        heatmapData.forEach(entry => {
            const sipara = entry.juz; // sipara column maps to juz
            const page = entry.page; // quran_page
            const score = entry.score;
            
            if (!siparaProgress[sipara]) {
                siparaProgress[sipara] = { pages: new Set(), scores: [], entryCount: 0 };
            }
            siparaProgress[sipara].pages.add(page);
            siparaProgress[sipara].scores.push(score);
            siparaProgress[sipara].entryCount++;
        });

        console.log('Sipara Progress:', siparaProgress);

        // Determine completed Siparas (Juz) - has entries for all 20 pages
        // Also include partially completed Siparas for weekly review
        Object.keys(siparaProgress).forEach(sipara => {
            const uniquePages = siparaProgress[sipara].pages.size;
            // Consider Sipara complete if user has logged all 20 pages
            if (uniquePages >= 20) {
                analysis.completedMarhalas.push(`Juz ${sipara}`);
            }
            // Include all Siparas with any logged pages for weekly review
            if (uniquePages > 0) {
                const scores = siparaProgress[sipara].scores;
                const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
                
                // Map average score to quality rating
                let qualityRating;
                if (avgScore >= 9) {
                    qualityRating = 'Excellent';
                } else if (avgScore >= 7) {
                    qualityRating = 'Very Good';
                } else if (avgScore >= 5) {
                    qualityRating = 'Good';
                } else if (avgScore >= 3) {
                    qualityRating = 'Fair';
                } else {
                    qualityRating = 'Poor';
                }
                
                allActiveSiparas.push({
                    juz: parseInt(sipara),
                    avgScore: avgScore.toFixed(2),
                    qualityRating
                });
            }
        });

        console.log('Completed Marhalas:', analysis.completedMarhalas);
        console.log('All Active Siparas for review:', allActiveSiparas);

        // Find current Sipara (most recent with activity but not complete)
        const activeSiparas = Object.keys(siparaProgress)
            .map(s => parseInt(s))
            .sort((a, b) => b - a); // Sort descending (most recent first)
        
        let currentSipara = null;
        for (const sipara of activeSiparas) {
            if (!analysis.completedMarhalas.includes(`Juz ${sipara}`)) {
                currentSipara = sipara;
                break;
            }
        }
        
        // If all Siparas are complete or no data, use the highest Sipara with data
        if (!currentSipara && activeSiparas.length > 0) {
            currentSipara = activeSiparas[0];
        }
        
        if (currentSipara) {
            analysis.currentMarhala = `Juz ${currentSipara}`;
            const currentData = siparaProgress[currentSipara];
            const pagesArray = Array.from(currentData.pages);
            const maxPage = pagesArray.length > 0 ? Math.max(...pagesArray) : 1;
            analysis.currentSipara = currentSipara;
            analysis.currentPage = maxPage;
            analysis.totalPages = 20; // Each Juz has 20 pages (Siparas)
        } else if (Object.keys(siparaProgress).length > 0) {
            // All Siparas completed, find the last one
            const lastSipara = Object.keys(siparaProgress).sort((a, b) => parseInt(b) - parseInt(a))[0];
            analysis.currentMarhala = `Juz ${parseInt(lastSipara) + 1}`; // Next Juz
            analysis.currentSipara = 1;
            analysis.currentPage = (parseInt(lastSipara) * 20) + 1;
            analysis.totalPages = 20;
        } else {
            // No heatmap entries found
            analysis.currentMarhala = "Juz 1";
            analysis.currentSipara = 1;
            analysis.currentPage = 1;
            analysis.totalPages = 20;
        }
    } else {
        // No heatmap data - start from beginning
        analysis.currentMarhala = "Juz 1";
        analysis.currentSipara = 1;
        analysis.currentPage = 1;
        analysis.totalPages = 20;
    }

    console.log('Final Analysis:', analysis);
    
    // Assign the populated allActiveSiparas to the analysis object
    analysis.allActiveSiparas = allActiveSiparas;
    
    return analysis;
}

/**
 * Generate weekly revision cycle using deterministic rules
 */
function generateWeeklyCycle(analysisData) {
    console.log('=== WEEKLY CYCLE DEBUG ===');
    console.log('Analysis Data:', JSON.stringify(analysisData, null, 2));
    console.log('All Active Siparas:', analysisData.allActiveSiparas);
    console.log('Current Sipara:', analysisData.currentSipara);

    // Backend-only cycle generation (deterministic rule engine)
    // Ensure all active Siparas (with any logged pages) are reviewed at least once per week
    // No artificial limit on Siparas per day - distribute evenly based on progress
    
    const cycle = [];
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    
    // Use allActiveSiparas (all Siparas with any logged pages) for weekly review
    // This includes both fully completed and partially completed Siparas
    const allActiveSiparas = analysisData.allActiveSiparas || [];
    
    const currentSipara = analysisData.currentSipara || 1;
    const revisionDays = 6; // Monday-Saturday
    
    // Distribute all active Siparas evenly across revision days
    // Use modulo to cycle through all active Siparas
    // This allows 5-6 Siparas per day when there's significant progress
    days.forEach((day, index) => {
        if (day === 'SUNDAY') {
            cycle.push({ day, siparas: ['Rest'] });
        } else {
            const siparas = [];
            
            // Always add current Sipara (weak - needs frequent review)
            siparas.push(`Sipara ${currentSipara} (Current)`);
            
            // Add active Siparas for this day using modulo to cycle through all
            // This ensures every active Sipara appears at least once
            // and allows multiple Siparas per day when there are many
            if (allActiveSiparas.length > 0) {
                // Only exclude current Sipara if there are other Siparas to review
                // If user only has one active Sipara, still show it for review
                const reviewSiparas = allActiveSiparas.length > 1 
                    ? allActiveSiparas.filter(s => s.juz !== currentSipara)
                    : allActiveSiparas;
                
                console.log(`Day ${day}: Review Siparas:`, reviewSiparas);
                
                // Add Siparas based on day index to distribute evenly
                // Each day gets a different subset, cycling through all
                reviewSiparas.forEach((siparaData, juzIndex) => {
                    if (juzIndex % revisionDays === index % revisionDays) {
                        siparas.push(`Sipara ${siparaData.juz} (${siparaData.qualityRating})`);
                    }
                });
            }
            
            cycle.push({ day, siparas });
        }
    });

    console.log('Generated Cycle:', JSON.stringify(cycle, null, 2));
    return cycle;
}

/**
 * Generate schedule deterministically
 */
function generateSchedule(weeklyCycle) {
    // Backend-only schedule generation (deterministic)
    // Compute free blocks, allocate revision slots, apply preferences
    
    const schedule = {
        days: [],
    };

    weeklyCycle.forEach(dayCycle => {
        const daySchedule = {
            day: dayCycle.day,
            blocks: [],
        };

        // Add Muraja'ah blocks
        if (dayCycle.siparas[0] !== 'Rest') {
            daySchedule.blocks.push({
                time: '06:00-06:15',
                activity: 'Muraja\'ah',
                details: `${dayCycle.siparas[0]} - Pages 1-2`,
            });
            
            if (dayCycle.siparas.length > 1) {
                daySchedule.blocks.push({
                    time: '06:15-06:30',
                    activity: 'Muraja\'ah',
                    details: `${dayCycle.siparas[1]} - Pages 10-11 (Visual method)`,
                });
            }

            // Add Juz Hali
            daySchedule.blocks.push({
                time: '04:00-04:20',
                activity: 'Juz Hali',
                details: 'Pages 1-2',
            });

            // Add Jadeed
            daySchedule.blocks.push({
                time: '07:00-07:45',
                activity: 'Jadeed',
                details: 'Surah Al-Fatihah (6446 Method)',
            });
        }

        schedule.days.push(daySchedule);
    });

    return schedule;
}

/**
 * Format schedule using LLM (formatting only, no scheduling logic)
 */
async function formatScheduleWithLLM(schedule) {
    const scheduleText = JSON.stringify(schedule, null, 2);
    
    const messages = [
        { role: "system", content: SCHEDULING_PROMPT },
        { role: "user", content: `Format this schedule for readability:\n\n${scheduleText}` },
    ];

    const { text } = await callGroq({
        model: GROQ_MODEL,
        messages,
        max_tokens: 1000,
        temperature: 0.3,
    });

    return text;
}

/**
 * Generate complete schedule with formatting
 */
async function generateCompleteSchedule(weeklyCycle) {
    const schedule = generateSchedule(weeklyCycle);
    const formattedText = await formatScheduleWithLLM(schedule);
    
    return {
        schedule,
        formattedText,
    };
}

/**
 * Save schedule (placeholder for database persistence)
 */
function saveSchedule(schedule, userId) {
    // Persist schedule to database
    // In production, this would save to a schedules table
    
    return {
        message: "Schedule saved to your profile! Review it every evening.",
    };
}

module.exports = {
    analyzeProgress,
    generateWeeklyCycle,
    generateSchedule,
    formatScheduleWithLLM,
    generateCompleteSchedule,
    saveSchedule,
};
