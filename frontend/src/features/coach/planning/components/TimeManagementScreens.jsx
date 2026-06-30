// features/coach/components/TimeManagementScreens.jsx
//
// Time Management module screens for Ustadh AI coach workflow

import React, { useState } from 'react';

export function TimeManagementStart({ onSelect }) {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "24px 16px", textAlign: "center",
    }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "#111827", margin: "0 0 16px" }}>
        Quran Scheduler
      </h2>
      <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 24px" }}>
        Page-level Quran scheduling with AQMOS quality analysis
      </p>
      <button
        onClick={() => onSelect('new')}
        style={{
          background: "#004D40", color: "white", border: "none",
          borderRadius: 12, padding: "16px 24px",
          cursor: "pointer", fontSize: 14, fontWeight: 600,
        }}
      >
        Open Scheduler
      </button>
      
      <button
        onClick={() => onSelect('back')}
        style={{
          marginTop: 20,
          background: "transparent", border: "none",
          color: "#6B7280", fontSize: 12, cursor: "pointer",
          textDecoration: "underline",
        }}
      >
        Back to Home
      </button>
    </div>
  );
}

export function TimeManagementAnalysis({ analysis, onContinue, onBack }) {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "24px 16px", textAlign: "center",
    }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "#111827", margin: "0 0 16px" }}>
        Progress Analysis
      </h2>
      
      <div style={{
        background: "#F9FAFB", border: "1px solid #E5E7EB",
        borderRadius: 12, padding: 20, width: "100%", maxWidth: 400,
        textAlign: "left",
      }}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Completed</div>
          {analysis?.completedMarhalas?.map((m, i) => (
            <div key={i} style={{ fontSize: 13, color: "#10B981", marginBottom: 2 }}>
              ✓ {m}
            </div>
          ))}
        </div>
        
        <div>
          <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Current</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#004D40" }}>
            {analysis?.currentMarhala}
          </div>
          <div style={{ fontSize: 13, color: "#374151", marginTop: 4 }}>
            Sipara {analysis?.currentSipara}
          </div>
          <div style={{ fontSize: 13, color: "#374151" }}>
            Page {analysis?.currentPage} / {analysis?.totalPages}
          </div>
        </div>
      </div>
      
      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <button
          onClick={onContinue}
          style={{
            padding: "10px 20px",
            background: "#004D40", color: "white",
            border: "none", borderRadius: 8,
            fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}
        >
          Continue
        </button>
        
        <button
          onClick={onBack}
          style={{
            padding: "10px 20px",
            background: "transparent", border: "1.5px solid #E5E7EB",
            color: "#6B7280", borderRadius: 8,
            fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
}

export function TimeManagementWeeklyCycle({ weeklyCycle, onContinue, onBack }) {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "24px 16px", textAlign: "center",
    }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "#111827", margin: "0 0 16px" }}>
        Weekly Cycle
      </h2>
      
      <div style={{
        background: "#F9FAFB", border: "1px solid #E5E7EB",
        borderRadius: 12, padding: 16, width: "100%", maxWidth: 500,
        textAlign: "left", maxHeight: 300, overflowY: "auto",
      }}>
        {weeklyCycle?.map((day, i) => (
          <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #E5E7EB" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 4 }}>
              {day.day}
            </div>
            {day.siparas?.map((s, j) => (
              <div key={j} style={{ fontSize: 13, color: "#374151", marginBottom: 2 }}>
                {s}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <button
          onClick={onContinue}
          style={{
            padding: "10px 20px",
            background: "#004D40", color: "white",
            border: "none", borderRadius: 8,
            fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}
        >
          Continue
        </button>
        
        <button
          onClick={onBack}
          style={{
            padding: "10px 20px",
            background: "transparent", border: "1.5px solid #E5E7EB",
            color: "#6B7280", borderRadius: 8,
            fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
}

export function TimeManagementDailyRoutine({ data, onChange, onContinue, onBack }) {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "24px 16px", textAlign: "center",
    }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "#111827", margin: "0 0 16px" }}>
        Enter Daily Routine
      </h2>
      
      <div style={{
        background: "#F9FAFB", border: "1px solid #E5E7EB",
        borderRadius: 12, padding: 20, width: "100%", maxWidth: 400,
        textAlign: "left",
      }}>
        {[
          { key: 'wake', label: 'Wake:' },
          { key: 'schoolWork', label: 'School/Work:' },
          { key: 'sleep', label: 'Sleep:' },
        ].map((field) => (
          <div key={field.key} style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 4 }}>
              {field.label}
            </label>
            <input
              type="text"
              value={data?.[field.key] || ''}
              onChange={(e) => onChange(field.key, e.target.value)}
              placeholder="e.g., 6:00 AM"
              style={{
                width: "100%", padding: "8px 12px",
                border: "1px solid #E5E7EB", borderRadius: 6,
                fontSize: 14, outline: "none",
              }}
            />
          </div>
        ))}
      </div>
      
      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <button
          onClick={onContinue}
          style={{
            padding: "10px 20px",
            background: "#004D40", color: "white",
            border: "none", borderRadius: 8,
            fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}
        >
          Continue
        </button>
        
        <button
          onClick={onBack}
          style={{
            padding: "10px 20px",
            background: "transparent", border: "1.5px solid #E5E7EB",
            color: "#6B7280", borderRadius: 8,
            fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
}

export function TimeManagementDays({ onSelect, onBack }) {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "24px 16px", textAlign: "center",
    }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "#111827", margin: "0 0 16px" }}>
        Is this schedule followed on:
      </h2>
      
      <div style={{
        display: "flex", flexDirection: "column", gap: 12,
        width: "100%", maxWidth: 400,
      }}>
        <button
          onClick={() => onSelect('mon-sat')}
          style={{
            background: "white", border: "1.5px solid #E5E7EB",
            borderRadius: 12, padding: "16px",
            cursor: "pointer", textAlign: "left",
            transition: "border-color .15s, background .15s",
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
            1. Monday-Saturday
          </div>
        </button>
        
        <button
          onClick={() => onSelect('mon-sun')}
          style={{
            background: "white", border: "1.5px solid #E5E7EB",
            borderRadius: 12, padding: "16px",
            cursor: "pointer", textAlign: "left",
            transition: "border-color .15s, background .15s",
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
            2. Monday-Sunday
          </div>
        </button>
      </div>
      
      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <button
          onClick={onBack}
          style={{
            padding: "10px 20px",
            background: "transparent", border: "1.5px solid #E5E7EB",
            color: "#6B7280", borderRadius: 8,
            fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
}

export function TimeManagementExceptions({ data, onChange, onContinue, onBack }) {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "24px 16px", textAlign: "center",
    }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "#111827", margin: "0 0 16px" }}>
        Weekly Exceptions
      </h2>
      
      <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 16 }}>
        Example: Sports Monday 5:00 PM - 6:00 PM
      </p>
      
      <textarea
        value={data?.exceptions || ''}
        onChange={(e) => onChange('exceptions', e.target.value)}
        placeholder="Enter exceptions..."
        style={{
          width: "100%", maxWidth: 400,
          padding: "12px 16px",
          border: "1.5px solid #E5E7EB",
          borderRadius: 8,
          fontSize: 14,
          outline: "none",
          minHeight: 80,
          resize: "vertical",
        }}
      />
      
      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <button
          onClick={onContinue}
          style={{
            padding: "10px 20px",
            background: "#004D40", color: "white",
            border: "none", borderRadius: 8,
            fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}
        >
          Continue
        </button>
        
        <button
          onClick={onBack}
          style={{
            padding: "10px 20px",
            background: "transparent", border: "1.5px solid #E5E7EB",
            color: "#6B7280", borderRadius: 8,
            fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
}

export function TimeManagementStudySettings({ data, onChange, onContinue, onBack }) {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "24px 16px", textAlign: "center",
    }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "#111827", margin: "0 0 16px" }}>
        Time Settings
      </h2>
      
      <div style={{
        background: "#F9FAFB", border: "1px solid #E5E7EB",
        borderRadius: 12, padding: 20, width: "100%", maxWidth: 400,
        textAlign: "left",
      }}>
        {[
          { key: 'jadeedMinutes', label: 'Minutes needed for Jadeed:' },
          { key: 'juzHaliPages', label: 'Pages of Juz Hali this week:' },
        ].map((field) => (
          <div key={field.key} style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 4 }}>
              {field.label}
            </label>
            <input
              type="text"
              value={data?.[field.key] || ''}
              onChange={(e) => onChange(field.key, e.target.value)}
              placeholder="____"
              style={{
                width: "100%", padding: "8px 12px",
                border: "1px solid #E5E7EB", borderRadius: 6,
                fontSize: 14, outline: "none",
              }}
            />
          </div>
        ))}
      </div>
      
      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <button
          onClick={onContinue}
          style={{
            padding: "10px 20px",
            background: "#004D40", color: "white",
            border: "none", borderRadius: 8,
            fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}
        >
          Continue
        </button>
        
        <button
          onClick={onBack}
          style={{
            padding: "10px 20px",
            background: "transparent", border: "1.5px solid #E5E7EB",
            color: "#6B7280", borderRadius: 8,
            fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
}

export function TimeManagementPreferredTimes({ data, onChange, onContinue, onBack }) {
  const [currentActivity, setCurrentActivity] = useState('murajaah');
  
  const activities = [
    { key: 'murajaah', label: 'Muraja\'ah' },
    { key: 'jadeed', label: 'Jadeed' },
    { key: 'juzHali', label: 'Juz Hali' },
  ];
  
  const times = [
    { key: 'morning', label: '1. Morning' },
    { key: 'afternoon', label: '2. Afternoon' },
    { key: 'evening', label: '3. Evening' },
    { key: 'night', label: '4. Night' },
  ];
  
  const toggleTime = (timeKey) => {
    const current = data?.[currentActivity] || [];
    const updated = current.includes(timeKey)
      ? current.filter(t => t !== timeKey)
      : [...current, timeKey];
    onChange(currentActivity, updated);
  };
  
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "24px 16px", textAlign: "center",
    }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "#111827", margin: "0 0 16px" }}>
        Preferred Times
      </h2>
      
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {activities.map((act) => (
          <button
            key={act.key}
            onClick={() => setCurrentActivity(act.key)}
            style={{
              padding: "8px 16px",
              background: currentActivity === act.key ? "#004D40" : "#F3F4F6",
              color: currentActivity === act.key ? "white" : "#374151",
              border: currentActivity === act.key ? "none" : "1px solid #E5E7EB",
              borderRadius: 6,
              fontSize: 13, fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {act.label}
          </button>
        ))}
      </div>
      
      <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 16 }}>
        Select preferred times for {activities.find(a => a.key === currentActivity)?.label}
      </p>
      
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(2, 1fr)",
        gap: 8, width: "100%", maxWidth: 400,
      }}>
        {times.map((time) => {
          const isSelected = (data?.[currentActivity] || []).includes(time.key);
          return (
            <button
              key={time.key}
              onClick={() => toggleTime(time.key)}
              style={{
                padding: "12px",
                background: isSelected ? "#E6F4F1" : "white",
                border: isSelected ? "2px solid #004D40" : "1.5px solid #E5E7EB",
                borderRadius: 8,
                fontSize: 13, fontWeight: 600,
                color: isSelected ? "#004D40" : "#374151",
                cursor: "pointer",
              }}
            >
              {time.label}
            </button>
          );
        })}
      </div>
      
      <p style={{ fontSize: 11, color: "#6B7280", marginTop: 16, maxWidth: 380 }}>
        Multiple selections allowed. Same time period may be selected for all activities. Preferences do not reserve time.
      </p>
      
      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <button
          onClick={onContinue}
          style={{
            padding: "10px 20px",
            background: "#004D40", color: "white",
            border: "none", borderRadius: 8,
            fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}
        >
          Generate Schedule
        </button>
        
        <button
          onClick={onBack}
          style={{
            padding: "10px 20px",
            background: "transparent", border: "1.5px solid #E5E7EB",
            color: "#6B7280", borderRadius: 8,
            fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
}

export function TimeManagementSchedule({ schedule, onSatisfied, onBack }) {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "24px 16px", textAlign: "center",
    }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "#111827", margin: "0 0 16px" }}>
        Weekly Timetable
      </h2>
      
      <div style={{
        background: "#F9FAFB", border: "1px solid #E5E7EB",
        borderRadius: 12, padding: 16, width: "100%", maxWidth: 600,
        textAlign: "left", maxHeight: 400, overflowY: "auto",
      }}>
        {schedule?.map((block, i) => (
          <div key={i} style={{ 
            marginBottom: 8, paddingBottom: 8, 
            borderBottom: i < schedule.length - 1 ? "1px solid #E5E7EB" : "none" 
          }}>
            <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 2 }}>
              {block.time}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
              {block.activity}
            </div>
            {block.details && (
              <div style={{ fontSize: 13, color: "#374151", marginTop: 2 }}>
                {block.details}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827", margin: "16px 0 8px" }}>
        Are you satisfied with this schedule?
      </h3>
      
      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={() => onSatisfied(true)}
          style={{
            padding: "10px 20px",
            background: "#10B981", color: "white",
            border: "none", borderRadius: 8,
            fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}
        >
          1. Yes
        </button>
        
        <button
          onClick={() => onSatisfied(false)}
          style={{
            padding: "10px 20px",
            background: "#F59E0B", color: "white",
            border: "none", borderRadius: 8,
            fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}
        >
          2. Request Changes
        </button>
      </div>
      
      <button
        onClick={onBack}
        style={{
          marginTop: 16,
          background: "transparent", border: "none",
          color: "#6B7280", fontSize: 12, cursor: "pointer",
          textDecoration: "underline",
        }}
      >
        Back
      </button>
    </div>
  );
}

export function TimeManagementFinal({ onBack }) {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "24px 16px", textAlign: "center",
    }}>
      <div style={{
        width: 60, height: 60, borderRadius: "50%", background: "#10B981",
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
      }}>
        <i className="ti ti-check" style={{ fontSize: 30, color: "white" }} />
      </div>
      
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "#111827", margin: "0 0 8px" }}>
        Schedule Saved
      </h2>
      
      <p style={{ fontSize: 13, color: "#6B7280", maxWidth: 380 }}>
        Your schedule has been saved and is now active.
      </p>
    </div>
  );
}
