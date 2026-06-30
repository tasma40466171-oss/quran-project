// features/coach/components/GlobalSidePanel.jsx
//
// Global Side Panel for Ustadh AI coach workflow
// Shows: Current Progress, AQMOS Profile, Weekly Cycle, Current Schedule
// Visible everywhere except Mutashabihat-specific content

import React, { useState } from 'react';

export function GlobalSidePanel({ 
  progress, 
  aqmosProfile, 
  weeklyCycle, 
  schedule,
  isOpen,
  onToggle,
  onRetakeTest,
  onViewProfile
}) {
  if (!isOpen) return null;

  return (
    <div style={{
      width: 280,
      background: "white",
      borderLeft: "1px solid #E5E7EB",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "12px 16px",
        borderBottom: "1px solid #E5E7EB",
        background: "#F9FAFB",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
          Your Progress
        </span>
        <button
          onClick={onToggle}
          style={{
            background: "none",
            border: "none",
            color: "#6B7280",
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        
        {/* Current Progress */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#004D40", marginBottom: 8 }}>
            Current Progress
          </div>
          {progress ? (
            <div style={{
              background: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: 8,
              padding: 12,
            }}>
              <div style={{ fontSize: 13, color: "#374151", marginBottom: 4 }}>
                <strong>Marhala:</strong> {progress.marhala || 'Not set'}
              </div>
              <div style={{ fontSize: 13, color: "#374151", marginBottom: 4 }}>
                <strong>Sipara:</strong> {progress.sipara || 'No data yet'}
              </div>
              <div style={{ fontSize: 13, color: "#374151" }}>
                <strong>Page:</strong> {progress.page || 'No data yet'}
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 12, color: "#9CA3AF", fontStyle: "italic" }}>
              No progress data available
            </div>
          )}
        </div>

        {/* AQMOS Profile */}
        <div style={{ marginBottom: 20 }} data-tour="aqmos-profile">
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            marginBottom: 8 
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#004D40" }}>
              AQMOS Profile
            </div>
            {aqmosProfile && (
              <button
                onClick={onRetakeTest}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2D6A4F",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                  textDecoration: "none",
                }}
              >
                ↺ Retake Test
              </button>
            )}
          </div>
          {aqmosProfile ? (
            <div style={{
              background: "#E6F4F1",
              border: "1px solid #004D40",
              borderRadius: 8,
              padding: 12,
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#004D40", marginBottom: 6 }}>
                {aqmosProfile}
              </div>
              <div style={{ fontSize: 11, color: "#065F46", lineHeight: 1.5, marginBottom: 8 }}>
                Your personalized memorization strategy based on your learning style.
              </div>
              <button
                onClick={onViewProfile}
                style={{
                  fontSize: 11,
                  color: "#004D40",
                  fontWeight: 600,
                  textDecoration: "none",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  textAlign: "left",
                }}
              >
                View Full Profile →
              </button>
            </div>
          ) : (
            <div style={{ fontSize: 12, color: "#9CA3AF", fontStyle: "italic", marginBottom: 8 }}>
              No profile yet
            </div>
          )}
          {!aqmosProfile && (
            <button
              onClick={onRetakeTest}
              style={{
                fontSize: 11,
                color: "#004D40",
                fontWeight: 600,
                textDecoration: "none",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                textAlign: "left",
              }}
            >
              Take the Test →
            </button>
          )}
        </div>

        {/* Weekly Cycle */}
        <div style={{ marginBottom: 20 }} data-tour="weekly-cycle">
          <div style={{ fontSize: 12, fontWeight: 600, color: "#004D40", marginBottom: 8 }}>
            Weekly Cycle
          </div>
          {weeklyCycle && weeklyCycle.length > 0 ? (
            <div style={{
              background: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: 8,
              padding: 12,
            }}>
              {weeklyCycle.slice(0, 3).map((day, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>
                    {day.day}
                  </div>
                  {day.siparas?.map((s, j) => (
                    <div key={j} style={{ fontSize: 11, color: "#6B7280" }}>
                      • {s}
                    </div>
                  ))}
                </div>
              ))}
              {weeklyCycle.length > 3 && (
                <div style={{ fontSize: 11, color: "#6B7280", fontStyle: "italic" }}>
                  +{weeklyCycle.length - 3} more days
                </div>
              )}
            </div>
          ) : (
            <div style={{ fontSize: 12, color: "#9CA3AF", fontStyle: "italic" }}>
              No weekly cycle set
            </div>
          )}
        </div>

        {/* Current Schedule */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#004D40", marginBottom: 8 }}>
            Current Schedule
          </div>
          {schedule && schedule.length > 0 ? (
            <div style={{
              background: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: 8,
              padding: 12,
            }}>
              {schedule.slice(0, 4).map((block, i) => (
                <div key={i} style={{ marginBottom: 8, paddingBottom: 8, borderBottom: i < 3 ? "1px solid #E5E7EB" : "none" }}>
                  <div style={{ fontSize: 11, color: "#6B7280" }}>
                    {block.time}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>
                    {block.activity}
                  </div>
                  {block.details && (
                    <div style={{ fontSize: 11, color: "#6B7280" }}>
                      {block.details}
                    </div>
                  )}
                </div>
              ))}
              {schedule.length > 4 && (
                <div style={{ fontSize: 11, color: "#6B7280", fontStyle: "italic" }}>
                  +{schedule.length - 4} more blocks
                </div>
              )}
            </div>
          ) : (
            <div style={{ fontSize: 12, color: "#9CA3AF", fontStyle: "italic" }}>
              No active schedule
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
