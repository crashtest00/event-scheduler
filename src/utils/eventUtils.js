// utils/eventUtils.js
// Utility functions for event generation and manipulation

export const generateRecurringEvents = (recurringData) => {
  if (!recurringData.program || !recurringData.startDate || !recurringData.daysOfWeek || recurringData.daysOfWeek.length === 0) {
    return [];
  }
  
  const events = [];
  const startDate = new Date(recurringData.startDate);
  const targetDays = recurringData.daysOfWeek.map(day => parseInt(day));
  
  // Generate events for each selected day for the specified number of weeks
  for (let week = 0; week < recurringData.weeks; week++) {
    targetDays.forEach(targetDay => {
      // Find the occurrence of the target day in this week
      const eventDate = new Date(startDate);
      // Calculate days to add to get to the target day in the current week
      const dayDiff = (targetDay - startDate.getDay() + 7) % 7;
      eventDate.setDate(startDate.getDate() + dayDiff + (week * 7));
      
      events.push({
        name: recurringData.program,
        date: eventDate.toLocaleDateString(),
        time: `${recurringData.startTime} - ${recurringData.endTime}`,
        dayOfWeek: targetDay,
        timezone: recurringData.timezone,
        capacity: recurringData.capacity,
        staff: recurringData.staff,
        program: recurringData.program,
        eventType: recurringData.eventType,
        isVirtual: recurringData.isVirtual,
        location: recurringData.location
      });
    });
  }
  
  // Sort events by date
  events.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  return events;
};

const getDayOfWeekName = (dayNumber) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayNumber];
};

const formatTimeWithCase = (timeString) => {
  if (!timeString) return '';
  // Format time to match pattern exactly: "10:00am" (lowercase am/pm, no spaces)
  const cleaned = timeString.trim().toLowerCase().replace(/\s+/g, '');
  // Handle various input formats and normalize to HH:MMam/pm
  const timeMatch = cleaned.match(/(\d{1,2}):?(\d{0,2})\s*(am|pm|a|p)/i);
  if (timeMatch) {
    const hours = timeMatch[1];
    const minutes = timeMatch[2] || '00';
    const period = timeMatch[3].toLowerCase();
    const normalizedPeriod = period === 'a' ? 'am' : period === 'p' ? 'pm' : period;
    return `${hours}:${minutes.padStart(2, '0')}${normalizedPeriod}`;
  }
  // Fallback: just clean up existing format
  return cleaned.replace(/(\d+:\d+)\s*(am|pm)/, '$1$2');
};

const formatDateForSchema = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  // Format as M/D/YYYY (e.g., 9/10/2025)
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

const calculateGMTDateTime = (dateString, timeString, timezone) => {
  if (!dateString || !timeString || !timezone) return '';
  
  try {
    // Parse the date and time
    const date = new Date(dateString);
    const [time, period] = timeString.toLowerCase().split(/([ap]m)/);
    let [hours, minutes] = time.split(':').map(Number);
    
    // Convert to 24-hour format
    if (period === 'pm' && hours !== 12) hours += 12;
    if (period === 'am' && hours === 12) hours = 0;
    
    // Use centralized timezone registry to get IANA identifier
    const ianaTimezone = getIanaTimezone(timezone);
    
    // Create a date in the specified timezone using JavaScript's built-in timezone support
    const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes || 0);
    
    // Convert to GMT using Intl.DateTimeFormat to handle DST automatically
    const gmtDate = new Date(localDate.toLocaleString('en-US', { timeZone: ianaTimezone }));
    const actualGmtDate = new Date(localDate.getTime() - (gmtDate.getTime() - localDate.getTime()));
    
    // Format as M/D/YYYY h:mmam/pm
    const gmtHours = actualGmtDate.getUTCHours();
    const gmtMinutes = actualGmtDate.getUTCMinutes().toString().padStart(2, '0');
    const gmtPeriod = gmtHours >= 12 ? 'pm' : 'am';
    const displayHours = gmtHours === 0 ? 12 : gmtHours > 12 ? gmtHours - 12 : gmtHours;
    
    return `${actualGmtDate.getUTCMonth() + 1}/${actualGmtDate.getUTCDate()}/${actualGmtDate.getUTCFullYear()} ${displayHours}:${gmtMinutes}${gmtPeriod}`;
  } catch (error) {
    console.error('Error calculating GMT time:', error);
    return '';
  }
};

// Map event type values to display names for CSV
const mapEventTypeForCSV = (eventType) => {
  const eventTypeMap = {
    'mentor-swarm': 'Mentor Swarm',
    'investor-swarm': 'Investor Swarm'
  };
  return eventTypeMap[eventType] || eventType;
};

// Use centralized timezone mapping for CSV
import { mapToLabel, getIanaTimezone } from './timezoneRegistry.js';
const mapTimezoneForCSV = mapToLabel;

export const generateCSVContent = (events) => {
  // Schema-compliant headers as defined in SchemaDefinition.csv
  const headers = [
    'Slot',
    'Program', 
    'Staff',
    'Virtual Location',
    'Physical Location',
    'Event Type',
    'Day of Week',
    'Event Date',
    'Start Time',
    'End Time', 
    'Time Zone',
    'GMT Start',
    'GMT End',
    'Slot Registrant Capacity'
  ];
  
  let csvContent = headers.join(',') + '\n';
  
  events.forEach(event => {
    // Parse start and end times from the time field or individual fields
    let startTime = '';
    let endTime = '';
    
    if (event.startTime && event.endTime) {
      startTime = formatTimeWithCase(event.startTime);
      endTime = formatTimeWithCase(event.endTime);
    } else if (event.time) {
      const timeParts = event.time.split(' - ');
      startTime = formatTimeWithCase(timeParts[0]);
      endTime = formatTimeWithCase(timeParts[1]);
    }
    
    const eventDate = formatDateForSchema(event.date);
    const dayOfWeek = getDayOfWeekName(typeof event.dayOfWeek === 'number' ? event.dayOfWeek : new Date(event.date).getDay());
    
    const row = [
      '', // Slot - Leave blank as per schema instructions. No space between comma & names.
      `"${event.program || ''}"`,
      `"${Array.isArray(event.staff) ? event.staff.filter(s => s.trim()).join(',') : (event.staff || '')}"`, // Convert staff array to comma-separated string
      event.isVirtual ? `"${event.location || ''}"` : '', // Virtual Location
      !event.isVirtual ? `"${event.location || ''}"` : '', // Physical Location  
      mapEventTypeForCSV(event.eventType) || '',
      dayOfWeek,
      eventDate,
      startTime,
      endTime,
      mapTimezoneForCSV(event.timezone) || '',
      calculateGMTDateTime(event.date, startTime, event.timezone), // GMT Start
      calculateGMTDateTime(event.date, endTime, event.timezone), // GMT End
      event.capacity || ''
    ];
    csvContent += row.join(',') + '\n';
  });
  
  return csvContent;
};

export const downloadCSV = (content, filename = 'events.csv') => {
  const blob = new Blob([content], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const validateEvent = (event) => {
  const required = ['name', 'date'];
  return required.every(field => event[field] && event[field].trim() !== '');
};

export const formatEventForDisplay = (event) => {
  return {
    ...event,
    displayDate: new Date(event.date).toLocaleDateString(),
    displayTime: event.startTime && event.endTime 
      ? `${event.startTime} - ${event.endTime}`
      : event.time || 'Time not set'
  };
};