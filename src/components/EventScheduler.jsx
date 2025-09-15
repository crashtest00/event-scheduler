// components/EventScheduler.js - Unified Event Scheduling Interface
import React from 'react';
import { Download, Calendar, Repeat } from 'lucide-react';
import EventPreview from './EventPreview.jsx';
import { generateRecurringEvents, generateCSVContent, downloadCSV } from '../utils/eventUtils.js';
import { 
  StaffInputSection, 
  LocationSection, 
  EventTypeSelect, 
  TimezoneSelect, 
  ProgramInput, 
  CapacityInput, 
  TimeInput, 
  DateInput 
} from './FormComponents.jsx';

const EventScheduler = ({ 
  recurringPatterns, 
  setRecurringPatterns,
  singleEvents,
  setSingleEvents,
  timezone,
  program,
  setProgram,
  staff,
  setStaff
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

  // Generic update function
  const updateItem = (itemId, field, value, setItems) => {
    setItems(items => 
      items.map(item => 
        item.id === itemId 
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const updatePattern = (patternId, field, value) => {
    updateItem(patternId, field, value, setRecurringPatterns);
  };

  const updateSingleEvent = (id, field, value) => {
    updateItem(id, field, value, setSingleEvents);
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
        startTime: '09:00',
        endTime: '',
        weeks: 8,
        timezone: 'America/New_York',
        capacity: '',
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
      startTime: '09:00', 
      endTime: '',
      timezone: timezone,
      capacity: '',
      eventType: '',
      isVirtual: false,
      location: ''
    }]);
  };

  const removeSingleEvent = (id) => {
    setSingleEvents(events => events.filter(event => event.id !== id));
  };

  // Note: Generic staff management functions removed since staff is now global

  // Note: Staff management functions for individual patterns/events removed
  // since staff is now managed globally

  // Global staff management functions
  const addGlobalStaff = () => {
    setStaff(currentStaff => [...currentStaff, '']);
  };

  const removeGlobalStaff = (index) => {
    setStaff(currentStaff => currentStaff.filter((_, i) => i !== index));
  };

  const updateGlobalStaff = (index, value) => {
    setStaff(currentStaff => 
      currentStaff.map((staffMember, i) => 
        i === index ? value : staffMember
      )
    );
  };

  // Combined Functions
  const handleGenerateCSV = () => {
    // Add global program and staff to patterns before generating events
    const patternsWithGlobalData = recurringPatterns.map(pattern => ({
      ...pattern,
      program,
      staff
    }));
    
    const recurringEvents = patternsWithGlobalData.flatMap(pattern => 
      generateRecurringEvents(pattern)
    );
    
    const allSingleEvents = singleEvents
      .filter(event => event.date) // No longer need to check event.program since it's global
      .map(event => ({
        name: program,
        date: new Date(event.date).toLocaleDateString(),
        startTime: event.startTime,
        endTime: event.endTime,
        timezone: event.timezone,
        capacity: event.capacity,
        staff: staff,
        program: program,
        eventType: event.eventType,
        isVirtual: event.isVirtual,
        location: event.location
      }));
    
    const allEvents = [...recurringEvents, ...allSingleEvents];
    const csvContent = generateCSVContent(allEvents);
    downloadCSV(csvContent, 'events.csv');
  };

  // Generic validation function (staff validation moved to global)
  const validateItem = (item, requiredFields, customValidators = []) => {
    // Check all required fields are filled
    const hasAllFields = requiredFields.every(field => item[field] && item[field].toString().trim() !== '');
    
    // Run custom validators
    const passesCustomValidation = customValidators.every(validator => validator(item));
    
    return hasAllFields && passesCustomValidation;
  };

  // Global validation helper
  const validateGlobalData = () => {
    const hasProgram = program && program.trim() !== '';
    const hasValidStaff = Array.isArray(staff) && staff.some(staffMember => staffMember.trim() !== '');
    return hasProgram && hasValidStaff;
  };

  // Specific validation functions using the generic validator
  const validateRecurringPattern = (pattern) => {
    const requiredFields = ['startDate', 'startTime', 'endTime', 'capacity', 'eventType', 'location'];
    const customValidators = [
      // Check at least one day is selected
      (item) => Array.isArray(item.daysOfWeek) && item.daysOfWeek.length > 0
    ];
    
    return validateGlobalData() && validateItem(pattern, requiredFields, customValidators);
  };

  const validateSingleEvent = (event) => {
    const requiredFields = ['date', 'startTime', 'endTime', 'capacity', 'eventType', 'location'];
    
    return validateGlobalData() && validateItem(event, requiredFields);
  };

  // Card rendering functions
  const renderRecurringPatternCard = (pattern, globalIndex) => (
    <div key={pattern.id} className="border border-blue-200 bg-blue-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Repeat className="w-4 h-4 text-blue-600 mr-2" />
          <h3 className="font-medium text-gray-900">Recurring Pattern #{globalIndex + 1}</h3>
        </div>
        <button 
          onClick={() => removePattern(pattern.id)}
          className="text-red-600 hover:text-red-800 text-sm"
        >
          Remove
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <EventTypeSelect 
          value={pattern.eventType}
          onChange={(value) => updatePattern(pattern.id, 'eventType', value)}
          colorTheme="blue"
        />

        <CapacityInput 
          value={pattern.capacity}
          onChange={(value) => updatePattern(pattern.id, 'capacity', value)}
          colorTheme="blue"
        />

        <LocationSection 
          isVirtual={pattern.isVirtual}
          location={pattern.location}
          onVirtualChange={(value) => updatePattern(pattern.id, 'isVirtual', value)}
          onLocationChange={(value) => updatePattern(pattern.id, 'location', value)}
          itemId={pattern.id}
          colorTheme="blue"
        />

        <DateInput 
          label="Start Date"
          value={pattern.startDate}
          onChange={(value) => updatePattern(pattern.id, 'startDate', value)}
          colorTheme="blue"
        />

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

        <TimeInput 
          label="Start Time"
          value={pattern.startTime}
          onChange={(value) => updatePattern(pattern.id, 'startTime', value)}
          colorTheme="blue"
        />

        <TimeInput 
          label="End Time"
          value={pattern.endTime}
          onChange={(value) => updatePattern(pattern.id, 'endTime', value)}
          colorTheme="blue"
        />

        <TimezoneSelect 
          value={pattern.timezone}
          onChange={(value) => updatePattern(pattern.id, 'timezone', value)}
          colorTheme="blue"
        />

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
  );

  const renderSingleEventCard = (event, globalIndex) => (
    <div key={event.id} className="border border-green-200 bg-green-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 text-green-600 mr-2" />
          <span className="font-medium text-gray-900">Single Event #{globalIndex + 1}</span>
        </div>
        <button
          onClick={() => removeSingleEvent(event.id)}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          Remove
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <EventTypeSelect 
          value={event.eventType}
          onChange={(value) => updateSingleEvent(event.id, 'eventType', value)}
          colorTheme="green"
        />

        <CapacityInput 
          value={event.capacity}
          onChange={(value) => updateSingleEvent(event.id, 'capacity', value)}
          colorTheme="green"
        />

        <LocationSection 
          isVirtual={event.isVirtual}
          location={event.location}
          onVirtualChange={(value) => updateSingleEvent(event.id, 'isVirtual', value)}
          onLocationChange={(value) => updateSingleEvent(event.id, 'location', value)}
          itemId={`single-${event.id}`}
          colorTheme="green"
        />

        <DateInput 
          label="Date"
          value={event.date}
          onChange={(value) => updateSingleEvent(event.id, 'date', value)}
          colorTheme="green"
        />

        <TimeInput 
          label="Start Time"
          value={event.startTime}
          onChange={(value) => updateSingleEvent(event.id, 'startTime', value)}
          colorTheme="green"
        />
        
        <TimeInput 
          label="End Time"
          value={event.endTime}
          onChange={(value) => updateSingleEvent(event.id, 'endTime', value)}
          colorTheme="green"
        />

        <TimezoneSelect 
          value={event.timezone}
          onChange={(value) => updateSingleEvent(event.id, 'timezone', value)}
          colorTheme="green"
        />
      </div>
    </div>
  );

  // Generate combined preview
  const patternsWithGlobalData = recurringPatterns.map(pattern => ({
    ...pattern,
    program,
    staff
  }));
  
  const recurringEvents = patternsWithGlobalData.flatMap(pattern => 
    generateRecurringEvents(pattern)
  );
  
  const formattedSingleEvents = singleEvents
    .filter(event => event.date) // No longer need to check event.program since it's global
    .map(event => ({
      name: program,
      date: new Date(event.date).toLocaleDateString(),
      time: event.startTime && event.endTime ? `${event.startTime} - ${event.endTime}` : 'Time not set',
      timezone: event.timezone,
      capacity: event.capacity,
      staff: staff,
      program: program,
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

      {/* Global Program and Staff Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Program Information</h2>
          <p className="text-sm text-gray-600">This information will apply to all events you create.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <ProgramInput 
            value={program}
            onChange={setProgram}
            colorTheme="gray"
          />
          
          <StaffInputSection 
            staff={staff}
            onAddStaff={addGlobalStaff}
            onRemoveStaff={removeGlobalStaff}
            onUpdateStaff={updateGlobalStaff}
            colorTheme="gray"
          />
        </div>
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
            {/* Combined Events in Creation Order */}
            {(() => {
              // Create combined array with type information and sort by creation time (id)
              const allCards = [
                ...recurringPatterns.map(pattern => ({ ...pattern, cardType: 'pattern' })),
                ...singleEvents.map(event => ({ ...event, cardType: 'event' }))
              ].sort((a, b) => a.id - b.id);

              let patternCount = 0;
              let eventCount = 0;

              return allCards.map((item) => {
                if (item.cardType === 'pattern') {
                  const index = patternCount++;
                  return renderRecurringPatternCard(item, index);
                } else {
                  const index = eventCount++;
                  return renderSingleEventCard(item, index);
                }
              });
            })()}
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