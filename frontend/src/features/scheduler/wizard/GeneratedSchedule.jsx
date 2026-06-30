import React, { useState, useEffect } from 'react';
import { getHeatmapData } from '../../../shared/services/analyticsApi';

const DAYS = [
  { value: 0, label: 'S' },
  { value: 1, label: 'M' },
  { value: 2, label: 'T' },
  { value: 3, label: 'W' },
  { value: 4, label: 'T' },
  { value: 5, label: 'F' },
  { value: 6, label: 'S' }
];

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Cumulative start page for each juz (1-indexed array, index 0 = juz 1)
const JUZZ_START_PAGES = [
  1, 22, 42, 62, 82, 102, 122, 142, 162, 182,
  202, 222, 242, 262, 282, 302, 322, 342, 362,
  382, 402, 422, 442, 462, 482, 502, 522, 542,
  562, 582
];

// Score-based color mapping
const getScoreColor = (score) => {
  if (score === null || score === undefined) return '#9CA3AF'; // Missing data - Gray
  if (score >= 9) return '#1B4332'; // Excellent - Dark Green
  if (score >= 7) return '#52B788'; // Very Good - Light Green
  if (score >= 5) return '#F1C40F'; // Good - Yellow
  if (score >= 3) return '#E67E22'; // Fair - Orange
  if (score >= 1) return '#C0392B'; // Poor - Red
  return '#9CA3AF'; // Default gray
};

const getScoreLabel = (score) => {
  if (score === null || score === undefined) return 'Unknown';
  if (score >= 9) return 'Excellent';
  if (score >= 7) return 'Very Good';
  if (score >= 5) return 'Good';
  if (score >= 3) return 'Fair';
  if (score >= 1) return 'Poor';
  return 'Unknown';
};

// Time per page based on score
const getTimePerPage = (score) => {
  if (score === null || score === undefined) return 0; // No data: 0 min
  if (score >= 9) return 1;  // Excellent: 1 min
  if (score >= 7) return 2;  // Very Good: 2 min
  if (score >= 5) return 3;  // Good: 3 min
  if (score >= 3) return 4;  // Fair: 4 min
  if (score >= 1) return 5;  // Poor: 5 min
  return 3; // Default: 3 min
};

// Calculate duration for a sipara based on page scores from heatmap data
const calculateSiparaDuration = (siparaNumber, heatmapData) => {
  const pageScores = {};
  
  // Get start page for this juz
  const startPage = JUZZ_START_PAGES[siparaNumber - 1] || 1;
  console.log(`calculateSiparaDuration: Sipara ${siparaNumber}, startPage: ${startPage}`);
  
  // Map heatmap data (juz/page/score) to sipara/page scores
  // Convert absolute page numbers to relative page numbers within the juz
  heatmapData.forEach(entry => {
    const entryJuz = entry.juz;
    const juzMatch = entryJuz === siparaNumber || entryJuz === siparaNumber.toString();
    if (juzMatch) {
      // Convert absolute page to relative page (1-20 within the juz)
      const relativePage = entry.page - startPage + 1;
      if (relativePage >= 1 && relativePage <= 20) {
        pageScores[relativePage] = entry.score;
      }
    }
  });
  
  console.log(`calculateSiparaDuration: Sipara ${siparaNumber}, pageScores:`, pageScores);
  
  const pages = Array.from({ length: 20 }, (_, i) => i + 1);
  return pages.reduce((sum, page) => {
    const score = pageScores[page];
    if (score === null || score === undefined) return sum; // Skip pages with no data
    return sum + getTimePerPage(score);
  }, 0);
};

// Get average score for a sipara from heatmap data
const getSiparaAvgScore = (siparaNumber, heatmapData) => {
  const pageScores = {};
  
  // Get start page for this juz
  const startPage = JUZZ_START_PAGES[siparaNumber - 1] || 1;
  
  // Map heatmap data (juz/page/score) to sipara/page scores
  // Convert absolute page numbers to relative page numbers within the juz
  heatmapData.forEach(entry => {
    const entryJuz = entry.juz;
    const juzMatch = entryJuz === siparaNumber || entryJuz === siparaNumber.toString();
    if (juzMatch) {
      // Convert absolute page to relative page (1-20 within the juz)
      const relativePage = entry.page - startPage + 1;
      if (relativePage >= 1 && relativePage <= 20) {
        pageScores[relativePage] = entry.score;
      }
    }
  });
  
  const pages = Array.from({ length: 20 }, (_, i) => i + 1);
  const pagesWithData = pages.filter(page => pageScores[page] !== null && pageScores[page] !== undefined);
  const sum = pagesWithData.reduce((sum, page) => sum + pageScores[page], 0);
  return pagesWithData.length > 0 ? sum / pagesWithData.length : 0;
};

export default function GeneratedSchedule({ schedule, weeklyCycle, onSelectUnit, onBack }) {
  const [activeTab, setActiveTab] = useState('timeline');
  const [selectedDay, setSelectedDay] = useState(1); // Default to Monday
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getHeatmapData();
        if (res.success) {
          setHeatmapData(res.data || []);
          console.log('GeneratedSchedule: Loaded heatmap data:', res.data?.length || 0, 'entries');
          console.log('GeneratedSchedule: Sample heatmap entry:', res.data?.[0]);
        }
      } catch (err) {
        console.error('GeneratedSchedule: Failed to fetch heatmap data:', err);
      }
    };
    fetchData();
  }, []);

  console.log('GeneratedSchedule schedule:', schedule);
  console.log('GeneratedSchedule weeklyCycle:', weeklyCycle);

  // Get schedule for selected day from weekly cycle data
  const getDaySchedule = () => {
    console.log('getDaySchedule called with weeklyCycle:', weeklyCycle);
    console.log('getDaySchedule selectedDay:', selectedDay);
    
    if (!weeklyCycle) {
      console.log('No weeklyCycle data available');
      return [];
    }
    
    // Handle array format
    if (Array.isArray(weeklyCycle)) {
      console.log('weeklyCycle is array, finding day:', selectedDay);
      const dayData = weeklyCycle.find(d => d.day === selectedDay);
      console.log('Found dayData:', dayData);
      if (dayData && dayData.siparas) {
        return dayData.siparas.map((sipara, index) => {
          // Parse sipara number from string (e.g., "Sipara Sipara 2 (Very Good)" -> 2)
          const siparaNumber = typeof sipara === 'number' 
            ? sipara 
            : typeof sipara === 'object' 
              ? sipara.number 
              : parseInt(sipara?.toString().replace(/\D/g, '') || '0');
          console.log(`GeneratedSchedule: Raw sipara value:`, sipara, `type:`, typeof sipara);
          console.log(`GeneratedSchedule: Parsed siparaNumber:`, siparaNumber, `type:`, typeof siparaNumber);
          const avgScore = getSiparaAvgScore(siparaNumber, heatmapData);
          const duration = calculateSiparaDuration(siparaNumber, heatmapData);
          const quality = getScoreLabel(avgScore);
          
          console.log(`GeneratedSchedule: Sipara ${siparaNumber} - avgScore: ${avgScore.toFixed(1)}, duration: ${duration}min, quality: ${quality}`);
          
          // Calculate start time based on cumulative duration
          const startHour = 5 + Math.floor(duration * index / 60);
          const startMin = (duration * index) % 60;
          const endHour = 5 + Math.floor(duration * (index + 1) / 60);
          const endMin = (duration * (index + 1)) % 60;
          
          return {
            time: `${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}–${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`,
            sipara: `Sipara ${siparaNumber}`,
            pages: '1-20',
            duration: `${duration} min`,
            method: index % 3 === 0 ? 'Quick Revision' : index % 3 === 1 ? 'AQMOS Recovery' : 'Normal Revision',
            quality: quality,
            color: avgScore >= 7 ? 'green' : avgScore >= 5 ? 'yellow' : avgScore >= 3 ? 'orange' : 'red',
            avgScore
          };
        });
      }
    }
    
    // Handle object format with numeric string keys ('0', '1', etc.)
    if (typeof weeklyCycle === 'object') {
      console.log('weeklyCycle is object, keys:', Object.keys(weeklyCycle));
      console.log('Looking for key:', String(selectedDay));
      
      // Try direct lookup with string key first
      const dayKey = String(selectedDay);
      console.log('Trying direct lookup with key:', dayKey);
      
      if (weeklyCycle[dayKey]?.siparas) {
        console.log('Found data with key:', dayKey);
        return weeklyCycle[dayKey].siparas.map((sipara, index) => {
          // Parse sipara number from string (e.g., "Sipara Sipara 2 (Very Good)" -> 2)
          const siparaNumber = typeof sipara === 'number' 
            ? sipara 
            : typeof sipara === 'object' 
              ? sipara.number 
              : parseInt(sipara?.toString().replace(/\D/g, '') || '0');
          const avgScore = getSiparaAvgScore(siparaNumber, heatmapData);
          const duration = calculateSiparaDuration(siparaNumber, heatmapData);
          const quality = getScoreLabel(avgScore);
          
          console.log(`GeneratedSchedule: Sipara ${siparaNumber} - avgScore: ${avgScore.toFixed(1)}, duration: ${duration}min, quality: ${quality}`);
          
          // Calculate start time based on cumulative duration
          const startHour = 5 + Math.floor(duration * index / 60);
          const startMin = (duration * index) % 60;
          const endHour = 5 + Math.floor(duration * (index + 1) / 60);
          const endMin = (duration * (index + 1)) % 60;
          
          return {
            time: `${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}–${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`,
            sipara: `Sipara ${siparaNumber}`,
            pages: '1-20',
            duration: `${duration} min`,
            method: index % 3 === 0 ? 'Quick Revision' : index % 3 === 1 ? 'AQMOS Recovery' : 'Normal Revision',
            quality: quality,
            color: avgScore >= 7 ? 'green' : avgScore >= 5 ? 'yellow' : avgScore >= 3 ? 'orange' : 'red',
            avgScore
          };
        });
      }
      
      // Fallback: try to find by day name
      const dayNameKey = Object.keys(weeklyCycle).find(key => 
        key.toLowerCase().includes(DAY_NAMES[selectedDay].toLowerCase())
      );
      console.log('Fallback: Found dayNameKey:', dayNameKey);
      if (dayNameKey && weeklyCycle[dayNameKey]?.siparas) {
        return weeklyCycle[dayNameKey].siparas.map((sipara, index) => {
          // Parse sipara number from string (e.g., "Sipara Sipara 2 (Very Good)" -> 2)
          const siparaNumber = typeof sipara === 'number' 
            ? sipara 
            : typeof sipara === 'object' 
              ? sipara.number 
              : parseInt(sipara?.toString().replace(/\D/g, '') || '0');
          const avgScore = getSiparaAvgScore(siparaNumber, heatmapData);
          const duration = calculateSiparaDuration(siparaNumber, heatmapData);
          const quality = getScoreLabel(avgScore);
          
          console.log(`GeneratedSchedule: Sipara ${siparaNumber} - avgScore: ${avgScore.toFixed(1)}, duration: ${duration}min, quality: ${quality}`);
          
          // Calculate start time based on cumulative duration
          const startHour = 5 + Math.floor(duration * index / 60);
          const startMin = (duration * index) % 60;
          const endHour = 5 + Math.floor(duration * (index + 1) / 60);
          const endMin = (duration * (index + 1)) % 60;
          
          return {
            time: `${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}–${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`,
            sipara: `Sipara ${siparaNumber}`,
            pages: '1-20',
            duration: `${duration} min`,
            method: index % 3 === 0 ? 'Quick Revision' : index % 3 === 1 ? 'AQMOS Recovery' : 'Normal Revision',
            quality: quality,
            color: avgScore >= 7 ? 'green' : avgScore >= 5 ? 'yellow' : avgScore >= 3 ? 'orange' : 'red',
            avgScore
          };
        });
      }
    }
    
    console.log('No matching schedule found, returning empty array');
    return [];
  };

  const [daySchedule, setDaySchedule] = useState([]);
  const [hasScheduleData, setHasScheduleData] = useState(false);
  
  // Recalculate schedule when heatmap data loads or weeklyCycle changes
  useEffect(() => {
    console.log('GeneratedSchedule: Triggering schedule recalculation');
    console.log('GeneratedSchedule: heatmapData length:', heatmapData.length);
    console.log('GeneratedSchedule: weeklyCycle available:', !!weeklyCycle);
    console.log('GeneratedSchedule: schedule prop available:', !!schedule);
    
    // Generate schedule from weeklyCycle even if schedule prop is undefined
    if (weeklyCycle) {
      const generatedSchedule = getDaySchedule();
      console.log('GeneratedSchedule: Generated schedule for day:', selectedDay, 'with', generatedSchedule.length, 'items');
      setDaySchedule(generatedSchedule);
      setHasScheduleData(true);
    } else if (schedule && Array.isArray(schedule)) {
      // Fallback to schedule prop if weeklyCycle is not available
      console.log('GeneratedSchedule: Using schedule prop as fallback');
      setDaySchedule(schedule);
      setHasScheduleData(true);
    } else {
      console.log('GeneratedSchedule: No schedule data available from either source');
      setDaySchedule([]);
      setHasScheduleData(false);
    }
  }, [heatmapData, weeklyCycle, selectedDay, schedule]);

  return (
    <div className="generated-schedule">
      {!hasScheduleData && (
        <div className="banner info">
          <div className="banner-icon">⚠️</div>
          <div className="banner-text">No schedule data available. Please generate a schedule first.</div>
        </div>
      )}

      <div className="banner success">
        <div className="banner-icon">✨</div>
        <div className="banner-text">Your personalized schedule is ready!</div>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          Timeline
        </button>
        <button 
          className={`tab ${activeTab === 'units' ? 'active' : ''}`}
          onClick={() => setActiveTab('units')}
        >
          Units
        </button>
        <button 
          className={`tab ${activeTab === 'focus' ? 'active' : ''}`}
          onClick={() => setActiveTab('focus')}
        >
          Focus Pages
        </button>
      </div>

      {activeTab === 'timeline' && (
        <div>
          <div className="day-tabs" style={{ marginBottom: 16 }}>
            {DAYS.map((day) => (
              <button
                key={day.value}
                className={`day-tab ${selectedDay === day.value ? 'active' : ''}`}
                onClick={() => setSelectedDay(day.value)}
              >
                {day.label}
              </button>
            ))}
          </div>

          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 16 }}>
            {DAY_NAMES[selectedDay]}'s Schedule
          </h3>
          
          {daySchedule.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: 40, 
              color: '#9CA3AF',
              fontSize: 14 
            }}>
              No schedule for this day.
            </div>
          ) : (
            daySchedule.map((slot, index) => (
              <div 
                key={index} 
                className={`timeline-slot ${slot.color}`}
                onClick={() => onSelectUnit(slot)}
                style={{ cursor: 'pointer' }}
              >
                <div className="timeline-time">{slot.time}</div>
                <div className="timeline-content">
                  <div className="timeline-title">{slot.sipara} ({slot.quality})</div>
                  <div className="timeline-details">
                    Pages {slot.pages} • {slot.duration}
                  </div>
                  <span className={`badge ${slot.color === 'green' ? 'green' : slot.color === 'yellow' ? 'yellow' : slot.color === 'orange' ? 'orange' : 'red'}`}>
                    {slot.method}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'units' && (
        <div className="card">
          <h3 className="card-title">Revision Units</h3>
          <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 16 }}>
            {daySchedule.length} revision units scheduled for {DAY_NAMES[selectedDay]}
          </p>
          
          {daySchedule.map((slot, index) => (
            <div 
              key={index}
              className="time-block"
              onClick={() => onSelectUnit(slot)}
              style={{ cursor: 'pointer' }}
            >
              <div className="time-block-icon">
                {slot.color === 'green' ? '✓' : slot.color === 'yellow' ? '⚡' : slot.color === 'orange' ? '🔄' : '⚠️'}
              </div>
              <div className="time-block-content">
                <div className="time-block-title">{slot.sipara} ({slot.quality})</div>
                <div className="time-block-subtitle">Pages {slot.pages}</div>
              </div>
              <div className="time-block-time">{slot.duration}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'focus' && (
        <div className="card">
          <h3 className="card-title">Focus Pages</h3>
          <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 16 }}>
            Pages requiring extra attention
          </p>
          
          <div className="page-chips">
            {[3, 5, 7, 12].map((page) => (
              <div key={page} className="page-chip very-weak">
                {page}
              </div>
            ))}
          </div>
          
          <div className="page-chips" style={{ marginTop: 8 }}>
            {[1, 2, 4, 6, 8, 9, 10, 11, 13, 14].map((page) => (
              <div key={page} className="page-chip weak">
                {page}
              </div>
            ))}
          </div>
        </div>
      )}

      <button className="pill-button secondary" onClick={onBack}>
        Back
      </button>
    </div>
  );
}
