// C:\quran-similarity-app\frontend\src\features\flashcards\components\SequenceFlowchart.jsx
import React, { useState, useRef, useCallback, useEffect } from "react";
import { authFetch } from '../../../shared/services/http';

// ── Surah names lookup (index 0 empty so SURAH_NAMES[1] === "Al-Fatihah") ───────
const SURAH_NAMES = [
  "",
  "Al-Fatihah", "Al-Baqarah", "Aal-E-Imran", "An-Nisa", "Al-Ma'idah",
  "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus",
  "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr",
  "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Ta-Ha",
  "Al-Anbiya", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan",
  "Ash-Shu'ara", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum",
  "Luqman", "As-Sajdah", "Al-Ahzab", "Saba", "Fatir",
  "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir",
  "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah",
  "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf",
  "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman",
  "Al-Waqi'ah", "Al-Hadid", "Al-Mujadila", "Al-Hashr", "Al-Mumtahanah",
  "As-Saff", "Al-Jumu'ah", "Al-Munafiqun", "At-Taghabun", "At-Talaq",
  "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij",
  "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir", "Al-Qiyamah",
  "Al-Insan", "Al-Mursalat", "An-Naba", "An-Nazi'at", "Abasa",
  "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj",
  "At-Tariq", "Al-A'la", "Al-Ghashiyah", "Al-Fajr", "Al-Balad",
  "Ash-Shams", "Al-Layl", "Ad-Duhaa", "Ash-Sharh", "At-Tin",
  "Al-Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-Adiyat",
  "Al-Qari'ah", "At-Takathur", "Al-Asr", "Al-Humazah", "Al-Fil",
  "Quraysh", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr",
  "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas",
];

// ── Build surah name to number lookup map ───────────────────────────────────────
const SURAH_NAME_TO_NUMBER = new Map();
SURAH_NAMES.forEach((name, index) => {
  if (name) {
    SURAH_NAME_TO_NUMBER.set(name.toLowerCase(), index);
    // Also add without "Al-" prefix for easier matching
    if (name.startsWith("Al-")) {
      SURAH_NAME_TO_NUMBER.set(name.substring(3).toLowerCase(), index);
    }
  }
});

// ── Extract first Arabic word, skipping Quranic symbols ───────────────────────
function extractFirstWord(text) {
  if (!text) return "";
  const quranicSymbols = /[\u06DD\u06DE\u2766\u2767\u2764\u274C\u25A0\u25AB\u25B2\u25BC\u25CF\u25CB\s\u200B\u200C\u200D\uFEFF]/g;
  const words = text.split(/\s+/);
  for (const word of words) {
    const clean = word.replace(quranicSymbols, "").trim();
    if (clean && /[\u0600-\u06FF]/.test(clean)) return clean;
  }
  return "";
}

// ── Detect set type and number from set name ──────────────────────────────────
function detectSetInfo(setName) {
  const pageMatch = setName.match(/\b(?:page|pg\.?)\s*(\d{1,3})\b/i);
  if (pageMatch) return { type: "page", num: parseInt(pageMatch[1]) };

  const juzPagesMatch = setName.match(/\b(?:juz|juzz|para|sipara)\s*(\d{1,2})\s*pages\b/i);
  if (juzPagesMatch) return { type: "juz-pages", num: parseInt(juzPagesMatch[1]) };

  // Juz without "Pages" keyword → juz-surahs (surah sequence)
  // Must check this AFTER juz-pages to avoid matching "Juz X Pages" as juz-surahs
  const juzSurahsMatch = setName.match(/\b(?:juz|juzz|para|sipara)\s*(\d{1,2})\b/i);
  if (juzSurahsMatch && !juzPagesMatch) return { type: "juz-surahs", num: parseInt(juzSurahsMatch[1]) };

  const bracketMatch = setName.match(/\((\d{1,3})\)/);
  if (bracketMatch) return { type: "surah", num: parseInt(bracketMatch[1]) };

  const surahWordMatch = setName.match(/\bsurah\s+(\d{1,3})\b/i);
  if (surahWordMatch) return { type: "surah", num: parseInt(surahWordMatch[1]) };

  const plainNum = setName.match(/\b(\d{1,3})\b/);
  if (plainNum) return { type: "surah", num: parseInt(plainNum[1]) };

  // Check for surah name in the set name (e.g., "Al-Falaq", "Al-Nas", "Fatihah")
  const lowerName = setName.toLowerCase();
  for (const [name, num] of SURAH_NAME_TO_NUMBER) {
    if (lowerName.includes(name)) {
      return { type: "surah", num };
    }
  }

  return null;
}

// ── Detect whether a set was generated with "ending" (last words) mode ────────
// Looks for keywords in the set name like "Ending", "Last Words", "End"
function isEndingMode(setName) {
  return /\b(ending|end|last\s*word)/i.test(setName);
}

// ── Build the display word from a card.
//    For starting sets: card.back IS the first 3 words — take just the first.
//    For ending  sets:  card.back IS the last  3 words — take just the last.
//    Falls back to extractFirstWord(text) when no card back is available.
function cardDisplayWord(cardBack, ending) {
  if (!cardBack) return "";
  const words = cardBack.trim().split(/\s+/).filter(w => /[\u0600-\u06FF]/.test(w));
  if (words.length === 0) return "";
  // ending sets: last word of the back; starting sets: first word of the back
return ending ? words.slice(-3).join(' ') : words.slice(0, 3).join(' ');
}

// ── Convert raw cards array (from UserSetViewer) to the ayahs shape ───────────
// card.front looks like: "What is the 1st ayah of Surah Yaseen?" or
//                        "What is the last 3 words of the 1st ayah on Page 400?"
//                        or "Surah 51" (for Juz surah sequences)
// card.back  looks like: "يس والقرآن الحكيم"  or  "يفتح الله"
//                        or "الذاريات" (Arabic surah name for Juz sequences)
function cardsToAyahs(cards, ending) {
  return cards.map((card, i) => {
    // Check if this is a surah sequence (card front is "Surah X")
    const surahMatch = card.front.match(/^Surah\s+(\d+)/i);
    
    if (surahMatch) {
      // This is a surah sequence - use the Arabic name directly
      const surahNum = surahMatch[1];
      return {
        ayah:      surahNum,
        text:      card.back || "",
        firstWord: card.back || "", // For surah sequences, the back IS the Arabic name
      };
    }
    
    // This is an ayah sequence - try to extract ayah identifier
    const ordinalMatch = card.front.match(/\b(\d+)(?:st|nd|rd|th)\b/i);
    const ayahLabel    = ordinalMatch ? ordinalMatch[1] : String(i + 1);

    const displayWord  = cardDisplayWord(card.back, ending);

    return {
      ayah:      ayahLabel,
      // text: the full "answer" from the AI — shown in the reference table
      text:      card.back || "",
      // firstWord: what appears in the flowchart nodes and mnemonic chain
      firstWord: displayWord,
    };
  });
}

// ── Build the printable HTML string ──────────────────────────────────────────
function buildPrintHTML(ayahs, setName, story, ending) {
  const chainLabel    = ending ? "Last-Word Sequence (read right → left)" : "First-Word Sequence (read right → left)";
  const colLabel      = ending ? "Key Word" : "First Word";
  const mnemonicChain = ayahs.map(a => a.firstWord).join(" ← ");

  const flowchartNodes = ayahs.map((a, i) => `
    <div class="node">
      <div class="node-badge">${a.ayah}</div>
      <div class="node-word">${a.firstWord}</div>
      <div class="node-label">Ayah ${a.ayah}</div>
    </div>
    ${i < ayahs.length - 1 ? '<div class="arrow-line"></div><div class="arrow-head"></div>' : ""}
  `).join("");

  const tableRows = ayahs.map((a, i) => `
    <tr class="${i % 2 === 0 ? "row-even" : "row-odd"}">
      <td class="cell-num">${a.ayah}</td>
      <td class="cell-word">${a.firstWord}</td>
      <td class="cell-text">${a.text}</td>
    </tr>
  `).join("");

  const storyBlock = story ? `
    <div class="story-box">
      <div class="story-title">📖 Mnemonic Story</div>
      <div class="story-text">${story.replace(/\n/g, "<br/>")}</div>
    </div>
  ` : "";

  return `<!DOCTYPE html>
<html lang="ar" dir="ltr">
<head>
  <meta charset="utf-8"/>
  <title>Sequence Memory Aid — ${setName}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Tahoma, sans-serif; background: white; padding: 32px 40px; color: #111827; }
    .header { text-align: center; margin-bottom: 28px; padding-bottom: 18px; border-bottom: 2px solid #004D40; }
    .header-title { font-size: 22px; font-weight: 700; color: #004D40; margin-bottom: 6px; }
    .header-sub   { font-size: 13px; color: #6B7280; }
    .mnemonic-label { font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #6B7280; text-align: center; margin-bottom: 8px; }
    .mnemonic-box { background: #E6F4F1; border: 1.5px solid #004D40; border-radius: 10px; padding: 14px 20px; margin-bottom: 28px; text-align: center; direction: rtl; font-family: 'Traditional Arabic', 'Amiri', serif; font-size: 22px; font-weight: 700; color: #004D40; line-height: 1.8; letter-spacing: 2px; }
    .flowchart { display: flex; flex-direction: column; align-items: center; margin-bottom: 28px; }
    .node { background: linear-gradient(135deg, #004D40 0%, #00695C 100%); color: white; border-radius: 12px; padding: 14px 24px; min-width: 200px; max-width: 280px; text-align: center; position: relative; margin-top: 14px; box-shadow: 0 3px 10px rgba(0,77,64,0.28); }
    .node-badge { position: absolute; top: -11px; left: 50%; transform: translateX(-50%); background: #F2C94C; color: #1a1a1a; border-radius: 50%; width: 24px; height: 24px; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
    .node-word { font-family: 'Traditional Arabic', 'Amiri', serif; font-size: 24px; font-weight: 700; direction: rtl; margin-bottom: 5px; line-height: 1.4; }
    .node-label { font-size: 11px; opacity: 0.72; direction: ltr; }
    .arrow-line { width: 2px; height: 28px; background: #004D40; margin: 0 auto; }
    .arrow-head { width: 0; height: 0; border-left: 7px solid transparent; border-right: 7px solid transparent; border-top: 10px solid #004D40; margin: 0 auto; }
    .table-section { margin-bottom: 28px; }
    .table-title { font-size: 13px; font-weight: 700; color: #004D40; margin-bottom: 10px; text-transform: uppercase; letter-spacing: .1em; }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: #004D40; color: white; }
    thead th { padding: 10px 14px; text-align: left; font-size: 13px; }
    .row-even { background: #F8FAFC; }
    .row-odd  { background: white; }
    .cell-num  { padding: 9px 14px; text-align: center; font-weight: 700; color: #004D40; font-size: 14px; width: 60px; }
    .cell-word { padding: 9px 14px; text-align: right; direction: rtl; font-family: 'Traditional Arabic','Amiri',serif; font-size: 18px; font-weight: 700; color: #004D40; width: 160px; }
    .cell-text { padding: 9px 14px; text-align: right; direction: rtl; font-family: 'Traditional Arabic','Amiri',serif; font-size: 15px; color: #374151; line-height: 1.7; }
    .story-box { background: #FFFBEB; border: 1.5px solid #FDE68A; border-radius: 10px; padding: 16px 20px; margin-bottom: 24px; }
    .story-title { font-size: 13px; font-weight: 700; color: #92400E; margin-bottom: 10px; }
    .story-text  { font-size: 14px; line-height: 1.85; color: #1a1a1a; }
    .footer { text-align: center; font-size: 11px; color: #9CA3AF; border-top: 1px solid #E5E7EB; padding-top: 14px; margin-top: 8px; }
    @media print {
      body { padding: 20px 24px; }
      .node { break-inside: avoid; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .node-badge, .mnemonic-box, thead tr { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-title">📊 Sequence Memory Aid</div>
    <div class="header-sub">${setName} · ${ayahs.length} ayahs · Generated ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</div>
  </div>
  <div class="mnemonic-label">${chainLabel}</div>
  <div class="mnemonic-box">${mnemonicChain}</div>
  ${storyBlock}
  <div class="mnemonic-label" style="margin-bottom:0">Flowchart</div>
  <div class="flowchart">${flowchartNodes}</div>
  <div class="table-section">
    <div class="table-title">Complete Ayah Reference</div>
    <table>
      <thead><tr><th style="text-align:center">Ayah</th><th>${colLabel}</th><th>Full Text</th></tr></thead>
      <tbody>${tableRows}</tbody>
    </table>
  </div>
  <div class="footer">حفظ القرآن · Hifz al-Quran Platform</div>
</body>
</html>`;
}

// ── Flowchart node (in-page view) ─────────────────────────────────────────────
function FlowNode({ ayah, firstWord, isLast, surahName, surahNumber, surahNum, ayahNum }) {
  // For Juz Surah sets, show surah number in badge; for others, show ayah/sequential number
  const badgeNumber = surahNumber || ayah;
  const isJuzSurah = !!surahNumber; // Juz Surah sets have surahNumber prop
  
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{
        background:   "linear-gradient(135deg, #004D40 0%, #00695C 100%)",
        color:        "#fff",
        borderRadius: 12,
        padding:      "14px 20px",
        minWidth:     180,
        maxWidth:     260,
        textAlign:    "center",
        boxShadow:    "0 3px 10px rgba(0,77,64,0.25)",
        position:     "relative",
      }}>
        <div style={{
          position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
          background: "#F2C94C", color: "#1a1a1a", borderRadius: "50%",
          width: 22, height: 22, fontSize: 11, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        }}>
          {badgeNumber}
        </div>
        {/* Top: Surah name for Juz Surah sets */}
        {isJuzSurah && surahName && (
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, color: "#E0F2F1" }}>
            {surahName}
          </div>
        )}
        <div style={{ fontSize: 22, fontWeight: 700, direction: "rtl", fontFamily: "serif", marginBottom: 5, lineHeight: 1.4 }}>
          {firstWord || "—"}
        </div>
        <div style={{ fontSize: 11, opacity: 0.75 }}>
          {isJuzSurah ? `Surah ${surahNumber}` : (surahNum && ayahNum ? `Ayah ${surahNum}:${ayahNum}` : `Ayah ${ayah}`)}
        </div>
      </div>
      {!isLast && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "4px 0" }}>
          <div style={{ width: 2, height: 24, background: "#004D40" }} />
          <div style={{ width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "8px solid #004D40" }} />
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
// Props:
//   setName  {string}  — display name of the set (used for title + detection)
//   cards    {Array}   — optional: [{front, back}, …] from UserSetViewer.
//                        ONLY used for study questions section, NOT for flowchart.
//                        Flowchart always fetches fresh data from API.
export default function SequenceFlowchart({ setName, cards }) {
  const ending = isEndingMode(setName);

  const [open,      setOpen]      = useState(true);
  const [ayahs,     setAyahs]     = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [view,      setView]      = useState("flowchart");
  const [story,     setStory]     = useState("");
  const [storyLoad, setStoryLoad] = useState(false);
  const chartRef = useRef(null);

  // ── Fetch ayah data from API (only used when no cards prop is provided) ───
  const fetchFromApi = useCallback(async () => {
    const info = detectSetInfo(setName);
    if (!info) {
      setError("Could not detect a Surah, Page, or Juz number from the set name. Try naming it e.g. 'Surah 112', 'Page 582', or 'Juz 30'.");
      return;
    }

    const { type, num } = info;
    if (type === "surah" && (num < 1 || num > 114)) { setError("Surah number must be between 1 and 114.");  return; }
    if (type === "page"  && (num < 1 || num > 604)) { setError("Page number must be between 1 and 604.");   return; }
    if (type === "juz"   && (num < 1 || num > 30))  { setError("Juz number must be between 1 and 30.");     return; }
    if (type === "juz-pages" && (num < 1 || num > 30)) { setError("Juz number must be between 1 and 30."); return; }
    if (type === "juz-surahs" && (num < 1 || num > 30)) { setError("Juz number must be between 1 and 30."); return; }

    const controller = new AbortController();
    setLoading(true);
    setError("");

    try {
      let path;
      let body;
      if (type === "juz-pages") {
        // Use the sequence wizard endpoint for juz-pages to get correct mode handling
        path = '/coach/wizard/sequence/juz-pages';
        body = { juz: num, mode: ending ? 'ending' : 'starting' };
        console.log('[FLOWCHART API] Calling juz-pages endpoint:', path, 'with body:', body);
      } else if (type === "juz-surahs") {
        // Use the sequence wizard endpoint for juz-surahs to get all surahs in the juz
        path = '/coach/wizard/sequence/juz-surahs';
        body = { juz: num };
        console.log('[FLOWCHART API] Calling juz-surahs endpoint:', path, 'with body:', body);
      } else {
        path =
          type === "page"  ? `/ayah/page/${num}/full` :
          type === "juz"   ? `/ayah/juz/${num}/full`  :
                             `/ayah/${num}/full`;
        console.log('[FLOWCHART API] calling standard endpoint:', path);
      }

      const res = await authFetch(path, { 
        signal: controller.signal,
        method: body ? 'POST' : undefined,
        body: body ? JSON.stringify(body) : undefined,
      }, 'fetchAyahData');

      if (res?.success && res.data) {
        let ayahsList = [];

        if (res.data.ayahs && Array.isArray(res.data.ayahs)) {
          console.log('[FLOWCHART API] Received ayahs from API:', res.data.ayahs.length, 'ayahs');
          console.log('[FLOWCHART API] Ayahs:', res.data.ayahs.map(a => ({ ayah: a.ayah, text: a.text?.substring(0, 30) })));
          console.log('[FLOWCHART API] Mode:', ending ? 'ENDING (last 3 words)' : 'STARTING (first 3 words)');
          
          ayahsList = res.data.ayahs.map(a => {
            let displayWord;
            if (ending) {
              // Ending mode: extract last 3 words from full text
              const words = (a.text || '').trim().split(/\s+/).filter(w => /[\u0600-\u06FF]/.test(w));
              displayWord = words.slice(-3).join(' ');
            } else {
              // Starting mode: use backend's firstWord or extract from full text
              displayWord = a.firstWord || cardDisplayWord(a.text, false);
            }
            
            // Parse ayah reference (format: "surah:ayah" or just ayah number)
            // For surah sets, a.ayah is just the ayah number; for page sets, it's "surah:ayah"
            let surahNum, ayahNum;
            const ayahStr = String(a.ayah || '');
            if (ayahStr.includes(':')) {
              [surahNum, ayahNum] = ayahStr.split(':').map(Number);
            } else {
              // For surah sets, ayah is just the number; surah comes from res.data.surah
              surahNum = res.data.surah || null;
              ayahNum = parseInt(ayahStr) || null;
            }
            
            return {
              ayah:      a.ayah,
              text:      a.text,
              firstWord: displayWord,
              surahNum:  surahNum || null,
              ayahNum:   ayahNum || null,
            };
          });
          
          console.log('[FLOWCHART API] Processed ayahsList:', ayahsList.length, 'items');
        } else if (res.data.pages && Array.isArray(res.data.pages)) {
          // Juz Pages sequence - each page is a node with display text
          console.log('[FLOWCHART API] Received pages from API:', res.data.pages.length, 'pages');
          console.log('[FLOWCHART API] Mode:', ending ? 'ENDING (last 3 words of last ayah per page)' : 'STARTING (first 3 words of first ayah per page)');
          
          ayahsList = res.data.pages.map((p, i) => ({
            ayah: i + 1, // Sequential numbering
            text: p.text,
            firstWord: p.text,
            surahName: p.surahName,
            surahNum: p.surahNum || null,
            ayahNum: p.ayahNum || null,
          }));
          
          console.log('[FLOWCHART API] Processed ayahsList from pages:', ayahsList.length, 'items');
        } else if (res.data.surahs && Array.isArray(res.data.surahs)) {
          // Juz Surah sequence - each surah is a node with name and first ayah
          console.log('[FLOWCHART API] Received surahs from API:', res.data.surahs.length, 'surahs');
          ayahsList = res.data.surahs.map((s, i) => ({
            ayah: i + 1, // Sequential numbering
            text: s.firstAyahText || s.name, // Use first ayah text as the full text
            firstWord: s.firstWord || s.name, // Use first word or surah name
            surahName: s.name, // Store surah name for display
            surahNumber: s.number, // Store surah number for display
          }));
          console.log('[FLOWCHART API] Processed ayahsList from surahs:', ayahsList.length, 'items');
        }

        if (ayahsList.length > 0) {
          setAyahs(ayahsList);
        } else {
          setError("No ayahs found in response. Please check your request.");
        }
      } else {
        const messages = {
          page:  "Backend error: Unable to load Page data. Please verify the page number (1-604) is correct.",
          juz:   "Backend error: Unable to load Juz/Sipara data. Please verify the Juz number (1-30) is correct.",
          surah: "Backend error: Unable to load Surah data. Please verify the Surah number (1-114) is correct.",
        };
        setError(messages[type] || "Unexpected error loading data.");
      }
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error("[FETCH ERROR]", err);
      setError("Network error loading ayah data. Please check your connection and try again.");
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }

    return () => controller.abort();
  }, [setName, ending]);

  // ── Reset and auto-load when setName changes ───────────────────────────────
  useEffect(() => {
    setOpen(true);
    setAyahs([]);
    setLoading(false);
    setError("");
    setView("flowchart");
    setStory("");
    setStoryLoad(false);

    // ALWAYS fetch from API for flowchart - ignore cards prop
    // The cards prop is only used for study questions, not the flowchart nodes
    fetchFromApi();
  }, [setName, ending, fetchFromApi]);

  // ── Generate AI mnemonic story ─────────────────────────────────────────────
  const generateStory = async () => {
    if (story) { setView("story"); return; }
    setStoryLoad(true);
    setView("story");
    try {
      const keyWords = ayahs.map(a => a.firstWord).join("، ");
      const res = await authFetch(
        '/coach/chat',
        {
          method: 'POST',
          body: JSON.stringify({
            system: "You are a Quran memorization coach. When given key words of ayahs, create a short mnemonic story in English (under 80 words) that uses those Arabic words as anchors to help remember the sequence.",
            messages: [{ role: "user", content: `Sequence of key words in order: ${keyWords}` }],
          }),
        },
        'generateStory'
      );
      setStory(res?.content?.[0]?.text || "Could not generate story.");
    } catch {
      setStory("Could not generate story. Please try again.");
    } finally {
      setStoryLoad(false);
    }
  };

  // ── Print/download ─────────────────────────────────────────────────────────
  const openPrintWindow = useCallback((forPrint = false) => {
    const html = buildPrintHTML(ayahs, setName, story, ending);
    const win  = window.open("", "_blank", "width=900,height=700");
    if (!win) { alert("Please allow popups for this site to use print/download."); return; }
    win.document.open();
    win.document.write(html);
    win.document.close();
    if (forPrint) {
      win.onload = () => { win.focus(); win.print(); };
      // Fallback: best-effort print trigger (may fail due to popup blockers)
      setTimeout(() => { try { win.focus(); win.print(); } catch {} }, 800);
    }
  }, [ayahs, setName, story, ending]);

  const handlePrint    = () => openPrintWindow(true);
  const handleDownload = () => openPrintWindow(false);

  // Column/chain label changes based on starting vs ending mode
  const chainLabel = ending ? "Last-Word Sequence" : "First-Word Sequence";
  const colLabel   = ending ? "Key Word"           : "First Word";


  // ── Expanded panel ─────────────────────────────────────────────────────────
  return (
    <div style={{ marginBottom: 20, border: "1px solid #E5E7EB", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>

      {/* Header bar */}
      <div style={{ background: "#004D40", color: "#fff", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontWeight: 600, fontSize: 14 }}>📊 Sequence Memory Aid — {setName}</span>
        <button
          onClick={() => setOpen(false)}
          style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 20, lineHeight: 1 }}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", background: "#FAFAFA", borderBottom: "1px solid #E5E7EB" }}>
        {[
          { id: "flowchart", label: "🔽 Flowchart"  },
          { id: "mnemonic",  label: `🔤 ${colLabel}s` },
          { id: "story",     label: "📖 AI Story"    },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => tab.id === "story" ? generateStory() : setView(tab.id)}
            style={{
              flex: 1, padding: "10px 6px", border: "none",
              borderBottom: view === tab.id ? "2px solid #004D40" : "2px solid transparent",
              background: "none", cursor: "pointer", fontSize: 12,
              fontWeight: view === tab.id ? 700 : 400,
              color: view === tab.id ? "#004D40" : "#6B7280",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: 20, background: "white", maxHeight: 480, overflowY: "auto" }}>
        {loading && (
          <div style={{ textAlign: "center", color: "#6B7280", padding: 24 }}>
            Loading ayah data…
          </div>
        )}

        {error && (
          <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#991B1B" }}>
            {error}
          </div>
        )}

        {!loading && !error && ayahs.length > 0 && (
          <>
            {/* FLOWCHART */}
            {view === "flowchart" && (
              <div ref={chartRef} style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 12 }}>
                <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 14, background: "#F0FDF4", borderRadius: 8, padding: "6px 14px", border: "1px solid #BBF7D0" }}>
                  {ayahs.length} ayahs · {chainLabel} · Top → Bottom
                </div>
                {ayahs.map((a, i) => (
                  <FlowNode
                    key={`${a.ayah}-${i}`}
                    ayah={a.ayah}
                    firstWord={a.firstWord}
                    isLast={i === ayahs.length - 1}
                    surahName={a.surahName}
                    surahNumber={a.surahNumber}
                    surahNum={a.surahNum}
                    ayahNum={a.ayahNum}
                  />
                ))}
              </div>
            )}

            {/* MNEMONIC / KEY WORDS */}
            {view === "mnemonic" && (
              <div ref={chartRef}>
                {/* Arrow chain */}
                <div style={{
                  direction: "rtl", fontSize: 18, fontFamily: "serif",
                  textAlign: "center", padding: "14px 8px",
                  background: "#F8FAFC", borderRadius: 10,
                  border: "1px solid #E5E7EB", marginBottom: 16, lineHeight: 2.4,
                }}>
                  {ayahs.map((a, i) => (
                    <span key={`${a.ayah}-${i}`}>
                      <span style={{ background: "#004D40", color: "#fff", borderRadius: 6, padding: "3px 10px", fontSize: 17, fontWeight: 700, display: "inline-block" }}>
                        {a.firstWord}
                      </span>
                      {i < ayahs.length - 1 && (
                        <span style={{ color: "#9CA3AF", fontSize: 16, margin: "0 6px", direction: "ltr", display: "inline-block" }}>←</span>
                      )}
                    </span>
                  ))}
                </div>
                {/* Reference table */}
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#004D40", color: "#fff" }}>
                      <th style={{ padding: "8px 10px", textAlign: "center", width: 55 }}>Ayah</th>
                      <th style={{ padding: "8px 10px", textAlign: "right", direction: "rtl", width: 160 }}>{colLabel}</th>
                      <th style={{ padding: "8px 10px", textAlign: "right", direction: "rtl" }}>Full Answer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ayahs.map((a, i) => (
                      <tr key={`${a.ayah}-${i}`} style={{ background: i % 2 === 0 ? "#F8FAFC" : "white" }}>
                        <td style={{ padding: "8px 10px", textAlign: "center", fontWeight: 700, color: "#004D40" }}>{a.ayah}</td>
                        <td style={{ padding: "8px 10px", textAlign: "right", direction: "rtl", fontFamily: "serif", fontSize: 16, fontWeight: 700, color: "#004D40" }}>{a.firstWord}</td>
                        <td style={{ padding: "8px 10px", textAlign: "right", direction: "rtl", fontFamily: "serif", fontSize: 14, color: "#374151", lineHeight: 1.7 }}>{a.text}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* AI STORY */}
            {view === "story" && (
              <div ref={chartRef}>
                {storyLoad ? (
                  <div style={{ textAlign: "center", padding: 24, color: "#6B7280" }}>
                    ✨ Generating mnemonic story…
                  </div>
                ) : (
                  <>
                    <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: 16, fontSize: 14, lineHeight: 1.8, marginBottom: 14 }}>
                      {story || "Click the AI Story tab to generate a mnemonic story."}
                    </div>
                    <div style={{ direction: "rtl", textAlign: "center", fontSize: 18, fontFamily: "serif", background: "#E6F4F1", borderRadius: 8, padding: "10px 14px", border: "1px solid #004D40" }}>
                      {ayahs.map((a, i) => (
                        <span key={`${a.ayah}-${i}`}>
                          <strong>{a.firstWord}</strong>
                          {i < ayahs.length - 1 && <span style={{ margin: "0 6px", opacity: 0.5 }}>←</span>}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer actions */}
      {!loading && ayahs.length > 0 && (
        <div style={{ padding: "12px 16px", borderTop: "1px solid #E5E7EB", background: "#FAFAFA", display: "flex", gap: 8, justifyContent: "flex-end", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#9CA3AF", marginRight: "auto" }}>
            Opens in a new tab — use your browser's Save/Print
          </span>
          <button
            onClick={handleDownload}
            style={{ background: "none", border: "1px solid #004D40", color: "#004D40", borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}
          >
            🔗 Open / Save
          </button>
          <button
            onClick={handlePrint}
            style={{ background: "#004D40", border: "none", color: "#fff", borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}
          >
            🖨️ Print
          </button>
        </div>
      )}
    </div>
  );
}