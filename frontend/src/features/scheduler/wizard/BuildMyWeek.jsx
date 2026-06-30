import React, { useState, useEffect } from 'react';
import { schedulerApi } from '../services/schedulerApi';

const DAYS = [
  { value: 0, label: 'S' },
  { value: 1, label: 'M' },
  { value: 2, label: 'T' },
  { value: 3, label: 'W' },
  { value: 4, label: 'T' },
  { value: 5, label: 'F' },
  { value: 6, label: 'S' }
];

const ROUTINE_ICONS = {
  sleep: '😴',
  school: '📚',
  commute: '🚗',
  gym: '💪',
  dinner: '🍽️',
  family: '👨‍👩‍👧‍👦',
  work: '💼',
  prayer: '🕌',
  quran: '📖',
  custom: '📌'
};

// Deduplicate events by title + startTime + endTime
const deduplicateEvents = (events) => {
  const seen = new Set();
  return events.filter(event => {
    const key = `${event.title}_${event.startTime}_${event.endTime}`;
    if (seen.has(key)) {
      console.log('BuildMyWeek: Skipping duplicate event:', event.title);
      return false;
    }
    seen.add(key);
    return true;
  });
};

export default function BuildMyWeek({ events, onEventsChange, onNext, onBack }) {
  const [selectedDay, setSelectedDay] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [localEvents, setLocalEvents] = useState(events || []);
  const [formData, setFormData] = useState({
    title: '',
    startTime: '',
    endTime: '',
    daysOfWeek: [1, 2, 3, 4, 5],
    isFixed: true,
    priority: 'medium'
  });
  const [formError, setFormError] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);

  // Auto-fetch saved events on mount
  useEffect(() => {
    const fetchSavedEvents = async () => {
      try {
        const savedEvents = await schedulerApi.getEvents();
        console.log(`BuildMyWeek: Loaded ${savedEvents?.length || 0} events from DB:`, savedEvents);
        
        // Deduplicate events by title + startTime + endTime
        const deduplicatedEvents = savedEvents ? deduplicateEvents(savedEvents) : [];
        console.log(`BuildMyWeek: Deduplicated to ${deduplicatedEvents.length} unique events`);
        
        if (deduplicatedEvents.length > 0) {
          setLocalEvents(deduplicatedEvents);
        } else if (events && events.length > 0) {
          setLocalEvents(deduplicateEvents(events));
        }
      } catch (err) {
        console.error('BuildMyWeek: Failed to fetch saved events:', err);
        if (events && events.length > 0) {
          setLocalEvents(deduplicateEvents(events));
        }
      }
    };
    fetchSavedEvents();
  }, []);

  // Only sync local events with prop on initial mount if no saved events
  useEffect(() => {
    if (events && events.length > 0 && localEvents.length === 0) {
      setLocalEvents(events);
    }
  }, []);

  const dayEvents = localEvents.filter(e => 
    e && e.daysOfWeek && e.daysOfWeek.includes(selectedDay)
  );
  
  console.log('All local events:', localEvents);
  console.log('Filtered dayEvents for selectedDay', selectedDay, ':', dayEvents);
  
  // Debug: log daysOfWeek for each event
  localEvents.forEach(e => {
    console.log(`Event "${e.title}": daysOfWeek =`, e.daysOfWeek, 'type:', typeof e.daysOfWeek[0]);
  });

  const getIconForEvent = (title) => {
    const lower = title.toLowerCase();
    if (lower.includes('sleep')) return ROUTINE_ICONS.sleep;
    if (lower.includes('school') || lower.includes('class')) return ROUTINE_ICONS.school;
    if (lower.includes('commute') || lower.includes('travel')) return ROUTINE_ICONS.commute;
    if (lower.includes('gym') || lower.includes('exercise')) return ROUTINE_ICONS.gym;
    if (lower.includes('dinner') || lower.includes('meal')) return ROUTINE_ICONS.dinner;
    if (lower.includes('family')) return ROUTINE_ICONS.family;
    if (lower.includes('work')) return ROUTINE_ICONS.work;
    if (lower.includes('prayer')) return ROUTINE_ICONS.prayer;
    if (lower.includes('quran')) return ROUTINE_ICONS.quran;
    return ROUTINE_ICONS.custom;
  };

  const handleCreate = async () => {
    // Validate inputs
    if (!formData.title.trim()) {
      setFormError('Please enter a title');
      return;
    }
    if (!formData.startTime) {
      setFormError('Please enter a start time');
      return;
    }
    if (!formData.endTime) {
      setFormError('Please enter an end time');
      return;
    }
    if (formData.daysOfWeek.length === 0) {
      setFormError('Please select at least one day');
      return;
    }

    setFormError('');

    try {
      console.log('BuildMyWeek: Creating event with payload:', JSON.stringify(formData, null, 2));
      
      let savedEvent;
      if (editingEvent) {
        // Update existing event
        savedEvent = await schedulerApi.updateEvent(editingEvent.id, formData);
        console.log('BuildMyWeek: Updated event from API:', savedEvent);
      } else {
        // Create new event
        savedEvent = await schedulerApi.createEvent(formData);
        console.log('BuildMyWeek: Saved event from API:', savedEvent);
      }
      
      if (!savedEvent) {
        setFormError('Failed to save event: no response from server');
        return;
      }
      
      // Update local state
      setLocalEvents(prev => {
        if (editingEvent) {
          return prev.map(e => e.id === editingEvent.id ? savedEvent : e);
        } else {
          return [...prev, savedEvent];
        }
      });
      
      // Also update parent state to persist across wizard steps
      if (onEventsChange) {
        onEventsChange();
      }
      
      // Clear form and hide
      setShowAddForm(false);
      setEditingEvent(null);
      setFormData({
        title: '',
        startTime: '',
        endTime: '',
        daysOfWeek: [1, 2, 3, 4, 5],
        isFixed: true,
        priority: 'medium'
      });
    } catch (err) {
      console.error('Failed to save event:', err);
      setFormError('Failed to save event. Please try again.');
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      startTime: event.startTime,
      endTime: event.endTime,
      daysOfWeek: event.daysOfWeek || [1, 2, 3, 4, 5],
      isFixed: event.isFixed !== undefined ? event.isFixed : true,
      priority: event.priority || 'medium'
    });
    setShowAddForm(true);
  };

  const handleDelete = async (event) => {
    if (!window.confirm(`Delete "${event.title}"?`)) {
      return;
    }

    try {
      await schedulerApi.deleteEvent(event.id);
      setLocalEvents(prev => prev.filter(e => e.id !== event.id));
      if (onEventsChange) {
        onEventsChange();
      }
    } catch (err) {
      console.error('Failed to delete event:', err);
      alert('Failed to delete event. Please try again.');
    }
  };

  const handlePreset = (preset) => {
    const presets = {
      school: { title: 'School', startTime: '08:00', endTime: '15:00', daysOfWeek: [1, 2, 3, 4, 5] },
      work: { title: 'Work', startTime: '09:00', endTime: '17:00', daysOfWeek: [1, 2, 3, 4, 5] },
      sleep: { title: 'Sleep', startTime: '22:00', endTime: '06:00', daysOfWeek: [0, 1, 2, 3, 4, 5, 6] },
      gym: { title: 'Gym', startTime: '18:00', endTime: '19:00', daysOfWeek: [1, 3, 5] },
      commute: { title: 'Commute', startTime: '07:30', endTime: '08:30', daysOfWeek: [1, 2, 3, 4, 5] }
    };
    
    const presetData = presets[preset];
    if (presetData) {
      setFormData({
        ...formData,
        ...presetData,
        isFixed: true,
        priority: 'medium'
      });
    }
  };

  const toggleDay = (day) => {
    setFormData({
      ...formData,
      daysOfWeek: formData.daysOfWeek.includes(day)
        ? formData.daysOfWeek.filter(d => d !== day)
        : [...formData.daysOfWeek, day]
    });
  };

  return (
    <div className="build-my-week">
      <div className="day-tabs" data-tour="day-selector">
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

      <div className="card">
        <div className="card-header" data-tour="daily-routine">
          <h2 className="card-title">Daily Routine</h2>
          <button 
            className="pill-button" 
            style={{ width: 'auto', padding: '8px 16px', margin: 0, fontSize: 13 }}
            onClick={() => setShowAddForm(!showAddForm)}
            data-tour="add-event-btn"
          >
            + Add Event
          </button>
        </div>

        {showAddForm && (
          <div style={{ 
            background: '#F9FAFB', 
            padding: 16, 
            borderRadius: 12, 
            marginBottom: 16,
            border: '1px solid #E5E7EB'
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
              {editingEvent ? 'Edit Event' : 'New Event'}
            </h3>
            
            {!editingEvent && (
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: '#6B7280', marginBottom: 4, display: 'block' }}>
                  Quick Add
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {['School', 'Work', 'Sleep', 'Gym', 'Commute'].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handlePreset(preset.toLowerCase())}
                      style={{
                        padding: '6px 12px',
                        background: '#FFFFFF',
                        border: '1px solid #D1D5DB',
                        borderRadius: 6,
                        fontSize: 12,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.background = '#F3F4F6'}
                      onMouseOut={(e) => e.target.style.background = '#FFFFFF'}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {formError && (
              <div style={{ 
                color: '#DC2626', 
                fontSize: 12, 
                marginBottom: 12,
                padding: '8px 12px',
                background: '#FEE2E2',
                borderRadius: 6
              }}>
                {formError}
              </div>
            )}
            
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: '#6B7280', marginBottom: 4, display: 'block' }}>
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., School, Gym, Dinner"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: 6,
                  fontSize: 14
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 12, color: '#6B7280', marginBottom: 4, display: 'block' }}>
                  Start Time
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: 6,
                    fontSize: 14
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 12, color: '#6B7280', marginBottom: 4, display: 'block' }}>
                  End Time
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: 6,
                    fontSize: 14
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: '#6B7280', marginBottom: 4, display: 'block' }}>
                Days
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {DAYS.map((day) => (
                  <label key={day.value} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 4,
                    fontSize: 12,
                    color: '#374151'
                  }}>
                    <input
                      type="checkbox"
                      checked={formData.daysOfWeek.includes(day.value)}
                      onChange={() => toggleDay(day.value)}
                    />
                    {day.label}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                onClick={handleCreate}
                className="pill-button" 
                style={{ padding: '10px 20px', fontSize: 13, flex: 1 }}
              >
                Create
              </button>
              <button 
                onClick={() => {
                  setShowAddForm(false);
                  setFormError('');
                }}
                className="pill-button secondary" 
                style={{ padding: '10px 20px', fontSize: 13, flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {dayEvents.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: 40, 
            color: '#9CA3AF',
            fontSize: 14 
          }}>
            No events for this day. Click "+ Add Event" to create one.
          </div>
        ) : (
          dayEvents.map((event) => (
            <div key={event.id} className="time-block" style={{ position: 'relative' }}>
              <div className="time-block-icon">
                {getIconForEvent(event.title)}
              </div>
              <div className="time-block-content">
                <div className="time-block-title">{event.title}</div>
                <div className="time-block-subtitle">
                  {event.daysOfWeek.length === 7 ? 'Every day' : `${event.daysOfWeek.length} days/week`}
                </div>
              </div>
              <div className="time-block-time">
                {event.startTime} - {event.endTime}
              </div>
              {event.isFixed && <div className="time-block-lock">🔒</div>}
              <div style={{ 
                position: 'absolute', 
                right: 8, 
                top: 8, 
                display: 'flex', 
                gap: 4 
              }}>
                <button
                  onClick={() => handleEdit(event)}
                  style={{
                    padding: 4,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 14,
                    opacity: 0.6,
                    transition: 'opacity 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.opacity = 1}
                  onMouseOut={(e) => e.target.style.opacity = 0.6}
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(event)}
                  style={{
                    padding: 4,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 14,
                    opacity: 0.6,
                    transition: 'opacity 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.opacity = 1}
                  onMouseOut={(e) => e.target.style.opacity = 0.6}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <button className="pill-button" onClick={onNext}>
        Next: Exceptions
      </button>
      
      <button className="pill-button secondary" onClick={onBack}>
        Back
      </button>
    </div>
  );
}
