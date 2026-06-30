import React, { useState, useEffect } from 'react';

const DAYS = [
  { value: 1, label: 'MON' },
  { value: 2, label: 'TUE' },
  { value: 3, label: 'WED' },
  { value: 4, label: 'THU' },
  { value: 5, label: 'FRI' },
  { value: 6, label: 'SAT' },
  { value: 0, label: 'SUN' }
];

export default function WeeklyCycle({ weeklyCycle, analysis, onNext, onBack }) {
  const [selectedDays, setSelectedDays] = useState([1, 2, 3, 4, 5]); // Default: Mon-Fri

  // Pre-fill from saved data if exists
  useEffect(() => {
    if (weeklyCycle && weeklyCycle.studyDays) {
      setSelectedDays(weeklyCycle.studyDays);
    }
  }, [weeklyCycle]);

  const toggleDay = (dayValue) => {
    setSelectedDays(prev =>
      prev.includes(dayValue)
        ? prev.filter(d => d !== dayValue)
        : [...prev, dayValue]
    );
  };

  const handleContinue = () => {
    // Save selection to parent state before advancing
    // The parent SchedulerWizard will handle dispatchTourEvent
    onNext();
  };

  // Calculate sipara distribution for preview
  const getSiparaDistribution = () => {
    if (!analysis) return null;

    // Get completed siparas and current sipara
    const completedSiparas = analysis.completedMarhalas || analysis.completedSiparas;
    const currentSipara = analysis.currentMarhala || analysis.currentSipara;

    // Convert to array if needed
    const completedArray = Array.isArray(completedSiparas) ? completedSiparas : [];
    
    // Build list of all siparas to cover (completed + current)
    const allSiparas = [...completedArray];
    if (currentSipara && !allSiparas.includes(currentSipara)) {
      allSiparas.push(currentSipara);
    }

    if (allSiparas.length === 0) return null;

    // Sort selected days in order (MON=1, TUE=2, ..., SUN=0)
    const sortedDays = [...selectedDays].sort((a, b) => {
      // Treat Sunday (0) as 7 for sorting purposes
      const aVal = a === 0 ? 7 : a;
      const bVal = b === 0 ? 7 : b;
      return aVal - bVal;
    });

    if (sortedDays.length === 0) return { error: 'Select at least one study day' };

    // Distribute siparas round-robin across selected days
    const distribution = {};
    sortedDays.forEach(dayValue => {
      const dayInfo = DAYS.find(d => d.value === dayValue);
      distribution[dayValue] = {
        label: dayInfo ? dayInfo.label : 'Unknown',
        siparas: []
      };
    });

    allSiparas.forEach((sipara, index) => {
      const dayIndex = index % sortedDays.length;
      const dayValue = sortedDays[dayIndex];
      distribution[dayValue].siparas.push(sipara);
    });

    return distribution;
  };

  const distribution = getSiparaDistribution();

  return (
    <div className="weekly-cycle">
      <div className="banner info">
        <div className="banner-icon">📅</div>
        <div className="banner-text">
          Select the days you study Quran each week
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Weekly Cycle</h2>
        <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 16 }}>
          Choose which days of the week you dedicate to Quran study.
        </p>

        <div 
          className="day-selector" 
          data-tour="day-selector"
          style={{ 
            display: 'flex', 
            gap: 12, 
            flexWrap: 'wrap',
            marginBottom: 16
          }}
        >
          {DAYS.map((day) => (
            <button
              key={day.value}
              className={`day-toggle ${selectedDays.includes(day.value) ? 'active' : ''}`}
              onClick={() => toggleDay(day.value)}
              style={{
                padding: '12px 24px',
                borderRadius: 8,
                border: '2px solid',
                borderColor: selectedDays.includes(day.value) ? '#004D40' : '#D1D5DB',
                backgroundColor: selectedDays.includes(day.value) ? '#004D40' : '#FFFFFF',
                color: selectedDays.includes(day.value) ? '#FFFFFF' : '#374151',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                minWidth: 60
              }}
              onMouseEnter={(e) => {
                if (!selectedDays.includes(day.value)) {
                  e.target.style.backgroundColor = '#F3F4F6';
                }
              }}
              onMouseLeave={(e) => {
                if (!selectedDays.includes(day.value)) {
                  e.target.style.backgroundColor = '#FFFFFF';
                }
              }}
            >
              {day.label}
            </button>
          ))}
        </div>

        <div style={{ fontSize: 13, color: '#6B7280' }}>
          Selected: {selectedDays.length} day{selectedDays.length !== 1 ? 's' : ''} per week
        </div>

        {/* Sipara distribution preview */}
        {distribution && distribution.error ? (
          <div style={{ 
            marginTop: 16, 
            padding: 12, 
            background: '#FEF2F2', 
            borderRadius: 6, 
            color: '#991B1B', 
            fontSize: 13 
          }}>
            {distribution.error}
          </div>
        ) : distribution && Object.keys(distribution).length > 0 ? (
          <div style={{ marginTop: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 12 }}>
              Sipara Distribution Preview
            </h3>
            {DAYS.map((day) => {
              const dayData = distribution[day.value];
              if (!dayData || dayData.siparas.length === 0) return null;
              
              return (
                <div 
                  key={day.value} 
                  style={{ 
                    padding: '10px 12px', 
                    background: '#F9FAFB', 
                    borderRadius: 6, 
                    marginBottom: 8,
                    fontSize: 13
                  }}
                >
                  <div style={{ fontWeight: 600, color: '#374151', marginBottom: 4 }}>
                    {dayData.label}DAY: {dayData.siparas.length} sipara{dayData.siparas.length !== 1 ? 's' : ''}
                  </div>
                  <div style={{ color: '#6B7280' }}>
                    {dayData.siparas.map((s, i) => (
                      <span key={i}>
                        Juz {s}{i < dayData.siparas.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>

      <button className="pill-button" onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
}
