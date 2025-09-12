// components/EventScheduler.js - Unified Event Scheduling Interface
import React from 'react';
import { Download, Calendar, Repeat } from 'lucide-react';
import EventPreview from './EventPreview.jsx';
import { generateRecurringEvents } from '../utils/eventUtils.js';
import { getCommonTimezones } from '../utils/timezoneUtils.js';

const EventScheduler = ({ 
  recurringPatterns, 
  setRecurringPatterns,
  singleEvents,
  setSingleEvents,
  timezone
}) => {
  const daysOfWeek = [
    { value: '0', label: 'Sunday' },
    { value: '1', label: 'Monday' },
    { value: '2', label: 'Tuesday' },
    { value: '3', label: 'Wednesday' },
    { value: '4', label: 'Thursday' },
    { value: '5', label: 'Friday' },
    { value: '6', label: 'Saturday' }
  ];

  // Recurring Pattern Functions
  const handleDayToggle = (patternId, dayValue) => {
    setRecurringPatterns(patterns => 
      patterns.map(pattern => {
        if (pattern.id === patternId) {
          const currentDays = pattern.daysOfWeek || [];
          const newDays = currentDays.includes(dayValue)
            ? currentDays.filter(day => day !== dayValue)
            : [...currentDays, dayValue].sort();
          return { ...pattern, daysOfWeek: newDays };
        }
        return pattern;
      })
    );
  };

  const updatePattern = (patternId, field, value) => {
    setRecurringPatterns(patterns => 
      patterns.map(pattern => 
        pattern.id === patternId 
          ? { ...pattern, [field]: value }
          : pattern
      )
    );
  };

  const addPattern = () => {
    const newId = Date.now();
    setRecurringPatterns(patterns => [
      ...patterns, 
      {
        id: newId,
        startDate: '',
        endDate: '',
        daysOfWeek: [],
        startTime: '',
        endTime: '',
        weeks: 8,
        timezone: 'America/New_York',
        capacity: '',
        staff: [''],
        program: '',
        eventType: '',
        isVirtual: false,
        location: ''
      }
    ]);
  };

  const removePattern = (patternId) => {
    setRecurringPatterns(patterns => patterns.filter(p => p.id !== patternId));
  };

  // Single Event Functions
  const addSingleEvent = () => {
    setSingleEvents(events => [...events, { 
      id: Date.now(), 
      date: '', 
      startTime: '', 
      endTime: '',
      timezone: timezone,
      capacity: '',
      staff: [''],
      program: '',
      eventType: '',
      isVirtual: false,
      location: ''
    }]);
  };

  const updateSingleEvent = (id, field, value) => {
    setSingleEvents(events => events.map(event => 
      event.id === id ? { ...event, [field]: value } : event
    ));
  };

  const removeSingleEvent = (id) => {
    setSingleEvents(events => events.filter(event => event.id !== id));
  };

  // Staff Management Functions
  const addStaffToPattern = (patternId) => {
    setRecurringPatterns(patterns => patterns.map(pattern =>
      pattern.id === patternId 
        ? { ...pattern, staff: [...pattern.staff, ''] }
        : pattern
    ));
  };

  const removeStaffFromPattern = (patternId, staffIndex) => {
    setRecurringPatterns(patterns => patterns.map(pattern =>
      pattern.id === patternId 
        ? { ...pattern, staff: pattern.staff.filter((_, index) => index !== staffIndex) }
        : pattern
    ));
  };

  const updatePatternStaff = (patternId, staffIndex, value) => {
    setRecurringPatterns(patterns => patterns.map(pattern =>
      pattern.id === patternId 
        ? { 
            ...pattern, 
            staff: pattern.staff.map((staff, index) => 
              index === staffIndex ? value : staff
            ) 
          }
        : pattern
    ));
  };

  const addStaffToEvent = (eventId) => {
    setSingleEvents(events => events.map(event =>
      event.id === eventId 
        ? { ...event, staff: [...event.staff, ''] }
        : event
    ));
  };

  const removeStaffFromEvent = (eventId, staffIndex) => {
    setSingleEvents(events => events.map(event =>
      event.id === eventId 
        ? { ...event, staff: event.staff.filter((_, index) => index !== staffIndex) }
        : event
    ));
  };

  const updateEventStaff = (eventId, staffIndex, value) => {
    setSingleEvents(events => events.map(event =>
      event.id === eventId 
        ? { 
            ...event, 
            staff: event.staff.map((staff, index) => 
              index === staffIndex ? value : staff
            ) 
          }
        : event
    ));
  };

  // Combined Functions
  const handleGenerateCSV = () => {
    const recurringEvents = recurringPatterns.flatMap(pattern => 
      generateRecurringEvents(pattern)
    );
    const allSingleEvents = singleEvents
      .filter(event => event.program && event.date)
      .map(event => ({
        name: event.program,
        date: new Date(event.date).toLocaleDateString(),
        startTime: event.startTime,
        endTime: event.endTime,
        timezone: event.timezone,
        capacity: event.capacity,
        staff: event.staff,
        program: event.program,
        eventType: event.eventType,
        isVirtual: event.isVirtual,
        location: event.location
      }));
    
    const totalEvents = recurringEvents.length + allSingleEvents.length;
    alert(`CSV would be generated with ${totalEvents} events! (This is just a prototype)`);
  };

  // Validation functions
  const validateRecurringPattern = (pattern) => {
    // Check all required fields are filled
    const requiredFields = ['program', 'startDate', 'startTime', 'endTime', 'capacity', 'eventType', 'location'];
    const hasAllFields = requiredFields.every(field => pattern[field] && pattern[field].toString().trim() !== '');
    
    // Check staff array has at least one non-empty staff member
    const hasValidStaff = Array.isArray(pattern.staff) && pattern.staff.some(staff => staff.trim() !== '');
    
    // Check at least one day is selected
    const hasValidDays = Array.isArray(pattern.daysOfWeek) && pattern.daysOfWeek.length > 0;
    
    return hasAllFields && hasValidStaff && hasValidDays;
  };

  const validateSingleEvent = (event) => {
    // Check all required fields are filled
    const requiredFields = ['program', 'date', 'startTime', 'endTime', 'capacity', 'eventType', 'location'];
    const hasAllFields = requiredFields.every(field => event[field] && event[field].toString().trim() !== '');
    
    // Check staff array has at least one non-empty staff member
    const hasValidStaff = Array.isArray(event.staff) && event.staff.some(staff => staff.trim() !== '');
    
    return hasAllFields && hasValidStaff;
  };

  // Generate combined preview
  const recurringEvents = recurringPatterns.flatMap(pattern => 
    generateRecurringEvents(pattern)
  );
  
  const formattedSingleEvents = singleEvents
    .filter(event => event.program && event.date)
    .map(event => ({
      name: event.program,
      date: new Date(event.date).toLocaleDateString(),
      time: event.startTime && event.endTime ? `${event.startTime} - ${event.endTime}` : 'Time not set',
      timezone: event.timezone,
      capacity: event.capacity,
      staff: event.staff,
      program: event.program,
      eventType: event.eventType,
      isVirtual: event.isVirtual,
      location: event.location
    }));

  const allPreviewEvents = [...recurringEvents, ...formattedSingleEvents]
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const hasEvents = recurringPatterns.length > 0 || singleEvents.length > 0;
  
  // Check if ALL cards are completely filled out
  const allRecurringPatternsValid = recurringPatterns.length === 0 || recurringPatterns.every(validateRecurringPattern);
  const allSingleEventsValid = singleEvents.length === 0 || singleEvents.every(validateSingleEvent);
  const hasValidEvents = hasEvents && allRecurringPatternsValid && allSingleEventsValid;


  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 text-center">Event Scheduler</h1>
      </div>

      {/* Add Event Buttons */}
      {!hasEvents && (
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6 text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Get Started</h2>
          <p className="text-gray-600 mb-6">Add recurring patterns or single events to build your schedule</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={addPattern}
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Repeat className="w-5 h-5 mr-2" />
              Add Recurring Pattern
            </button>
            <button
              onClick={addSingleEvent}
              className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Add Single Event
            </button>
          </div>
        </div>
      )}

      {/* Events Section */}
      {hasEvents && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Events</h2>
          </div>

          <div className="space-y-6">
            {/* Recurring Patterns */}
            {recurringPatterns.map((pattern, index) => (
              <div key={pattern.id} className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Repeat className="w-4 h-4 text-blue-600 mr-2" />
                    <h3 className="font-medium text-gray-900">Recurring Pattern #{index + 1}</h3>
                  </div>
                  <button 
                    onClick={() => removePattern(pattern.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Program
                    </label>
                    <input
                      type="text"
                      placeholder="gener8tor Madison Fall 2012"
                      value={pattern.program}
                      onChange={(e) => updatePattern(pattern.id, 'program', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Staff
                    </label>
                    <div className="space-y-2">
                      {pattern.staff.map((staffMember, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="First Last"
                            value={staffMember}
                            onChange={(e) => updatePatternStaff(pattern.id, index, e.target.value)}
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          {pattern.staff.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeStaffFromPattern(pattern.id, index)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addStaffToPattern(pattern.id)}
                        className="flex items-center gap-1 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Staff Member
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Type
                    </label>
                    <select
                      value={pattern.eventType}
                      onChange={(e) => updatePattern(pattern.id, 'eventType', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select event type</option>
                      <option value="mentor-swarm">Mentor Swarm</option>
                      <option value="investor-swarm">Investor Swarm</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacity
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Max attendees"
                      value={pattern.capacity}
                      onChange={(e) => updatePattern(pattern.id, 'capacity', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Location Type
                    </label>
                    <div className="flex items-center space-x-6 mb-3">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`location-type-${pattern.id}`}
                          checked={!pattern.isVirtual}
                          onChange={() => updatePattern(pattern.id, 'isVirtual', false)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Physical Location</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`location-type-${pattern.id}`}
                          checked={pattern.isVirtual}
                          onChange={() => updatePattern(pattern.id, 'isVirtual', true)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Virtual</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      placeholder="Physical Address or Zoom link"
                      value={pattern.location}
                      onChange={(e) => updatePattern(pattern.id, 'location', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={pattern.startDate}
                      onChange={(e) => updatePattern(pattern.id, 'startDate', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Weeks
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="52"
                      value={pattern.weeks}
                      onChange={(e) => updatePattern(pattern.id, 'weeks', parseInt(e.target.value) || 8)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={pattern.startTime}
                      onChange={(e) => updatePattern(pattern.id, 'startTime', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={pattern.endTime}
                      onChange={(e) => updatePattern(pattern.id, 'endTime', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={pattern.timezone}
                      onChange={(e) => updatePattern(pattern.id, 'timezone', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {getCommonTimezones().map(timezone => (
                        <option key={timezone.value} value={timezone.value}>
                          {timezone.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Days of Week
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {daysOfWeek.map(day => (
                        <label key={day.value} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={pattern.daysOfWeek?.includes(day.value) || false}
                            onChange={() => handleDayToggle(pattern.id, day.value)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-sm text-gray-700">{day.label}</span>
                        </label>
                      ))}
                    </div>
                    {pattern.daysOfWeek?.length > 0 && (
                      <div className="mt-2 text-sm text-blue-600">
                        Selected: {pattern.daysOfWeek.length} day{pattern.daysOfWeek.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Single Events */}
            {singleEvents.map((event, index) => (
              <div key={event.id} className="border border-green-200 bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-green-600 mr-2" />
                    <span className="font-medium text-gray-900">Single Event #{index + 1}</span>
                  </div>
                  <button
                    onClick={() => removeSingleEvent(event.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Program
                    </label>
                    <input
                      type="text"
                      placeholder="gener8tor Madison Fall 2012"
                      value={event.program}
                      onChange={(e) => updateSingleEvent(event.id, 'program', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Staff
                    </label>
                    <div className="space-y-2">
                      {event.staff.map((staffMember, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="First Last"
                            value={staffMember}
                            onChange={(e) => updateEventStaff(event.id, index, e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                          {event.staff.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeStaffFromEvent(event.id, index)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addStaffToEvent(event.id)}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Staff Member
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Type
                    </label>
                    <select
                      value={event.eventType}
                      onChange={(e) => updateSingleEvent(event.id, 'eventType', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select event type</option>
                      <option value="mentor-swarm">Mentor Swarm</option>
                      <option value="investor-swarm">Investor Swarm</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacity
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Max attendees"
                      value={event.capacity}
                      onChange={(e) => updateSingleEvent(event.id, 'capacity', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location Type
                    </label>
                    <div className="flex items-center space-x-6 mb-2">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`location-type-single-${event.id}`}
                          checked={!event.isVirtual}
                          onChange={() => updateSingleEvent(event.id, 'isVirtual', false)}
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Physical Location</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`location-type-single-${event.id}`}
                          checked={event.isVirtual}
                          onChange={() => updateSingleEvent(event.id, 'isVirtual', true)}
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Virtual</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      placeholder="Physical Address or Zoom link"
                      value={event.location}
                      onChange={(e) => updateSingleEvent(event.id, 'location', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={event.date}
                      onChange={(e) => updateSingleEvent(event.id, 'date', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={event.startTime}
                      onChange={(e) => updateSingleEvent(event.id, 'startTime', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={event.endTime}
                      onChange={(e) => updateSingleEvent(event.id, 'endTime', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Timezone
                    </label>
                    <select
                      value={event.timezone}
                      onChange={(e) => updateSingleEvent(event.id, 'timezone', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {getCommonTimezones().map(timezone => (
                        <option key={timezone.value} value={timezone.value}>
                          {timezone.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Buttons at Bottom */}
          <div className="flex flex-col sm:flex-row gap-2 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={addPattern}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Repeat className="w-4 h-4 mr-2" />
              Add Pattern
            </button>
            <button
              onClick={addSingleEvent}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Add Single Event
            </button>
          </div>
        </div>
      )}

      {/* Preview */}
      {hasValidEvents && <EventPreview events={allPreviewEvents} title="Preview All Events" />}

      {/* Actions */}
      {hasEvents && (
        <div className="flex justify-end space-x-4">
          <button 
            onClick={handleGenerateCSV}
disabled={!hasValidEvents}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Generate CSV
          </button>
        </div>
      )}
    </div>
  );
};

export default EventScheduler;