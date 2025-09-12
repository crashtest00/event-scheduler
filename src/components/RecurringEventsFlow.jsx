// components/RecurringEventsFlow.js
import React from 'react';
import { ArrowLeft, Download, Plus } from 'lucide-react';
import EventPreview from './EventPreview.jsx';
import { generateRecurringEvents } from '../utils/eventUtils.js';
import { getCommonTimezones } from '../utils/timezoneUtils.js';

const RecurringEventsFlow = ({ 
  setCurrentFlow, 
  resetData, 
  recurringPatterns, 
  setRecurringPatterns
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
        eventName: '',
        startDate: '',
        endDate: '',
        daysOfWeek: [],
        startTime: '',
        endTime: '',
        weeks: 8,
        timezone: 'America/New_York'
      }
    ]);
  };

  const removePattern = (patternId) => {
    if (recurringPatterns.length > 1) {
      setRecurringPatterns(patterns => patterns.filter(p => p.id !== patternId));
    }
  };
  const handleGenerateCSV = () => {
    const allEvents = recurringPatterns.flatMap(pattern => 
      generateRecurringEvents(pattern)
    );
    alert(`CSV would be generated with ${allEvents.length} events! (This is just a prototype)`);
  };

  const previewEvents = recurringPatterns.flatMap(pattern => 
    generateRecurringEvents(pattern)
  ).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <button 
          onClick={() => { setCurrentFlow('home'); resetData(); }}
          className="mb-4 inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900 text-center">Create Recurring Events</h1>
      </div>


      {/* Event Patterns */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Event Patterns</h2>
          <button 
            onClick={addPattern}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Pattern
          </button>
        </div>

        <div className="space-y-6">
          {recurringPatterns.map((pattern, index) => (
            <div key={pattern.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Pattern #{index + 1}</h3>
                {recurringPatterns.length > 1 && (
                  <button 
                    onClick={() => removePattern(pattern.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Weekly Team Meeting"
                    value={pattern.eventName}
                    onChange={(e) => updatePattern(pattern.id, 'eventName', e.target.value)}
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
        </div>
      </div>

      <EventPreview events={previewEvents} title="Preview Events" />

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <button 
          onClick={handleGenerateCSV}
          disabled={previewEvents.length === 0}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Generate CSV
        </button>
      </div>
    </div>
  );
};

export default RecurringEventsFlow;