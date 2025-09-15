#!/usr/bin/env node

// DST Test for Recurring Events
// Tests timezone handling across daylight saving time transitions

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the functions we need to test
import { generateRecurringEvents } from '../eventUtils.js';

// We need to extract the internal calculateGMTDateTime function
// Since it's not exported, we'll recreate it here for testing
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
    
    // Map common timezone names to IANA timezone identifiers
    const timezoneMap = {
      'Eastern': 'America/New_York',
      'Central': 'America/Chicago', 
      'Mountain': 'America/Denver',
      'Pacific': 'America/Los_Angeles',
      'EST': 'America/New_York',
      'CST': 'America/Chicago',
      'MST': 'America/Denver', 
      'PST': 'America/Los_Angeles',
      'EDT': 'America/New_York',
      'CDT': 'America/Chicago',
      'MDT': 'America/Denver',
      'PDT': 'America/Los_Angeles'
    };
    
    const ianaTimezone = timezoneMap[timezone] || timezone;
    
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
    console.error('Error calculating GMT:', error);
    return '';
  }
};

console.log('🕐 DST Transition Test for Recurring Events\n');
console.log('Testing timezone handling across 2025 Spring DST transition (March 9)');
console.log('DST begins: Sunday, March 9, 2025 at 2:00 AM EST (clocks spring forward to 3:00 AM EDT)\n');

// Test data: Weekly recurring event spanning DST transition
const testRecurringPattern = {
  id: 'dst-test',
  startDate: '2025-02-20', // Thursday, Feb 20 (before DST)
  daysOfWeek: [4], // Thursday (0=Sunday, 4=Thursday)
  startTime: '10:00am',
  endTime: '11:00am',
  weeks: 5, // Will generate 5 events
  timezone: 'America/New_York',
  program: 'DST Test Event',
  staff: ['Test Staff'],
  eventType: 'mentor-swarm',
  isVirtual: true,
  location: 'Virtual',
  capacity: '10'
};

// Expected results for verification
const expectedResults = [
  { date: '2/20/2025', localTime: '10:00am', expectedGMT: '3:00pm', note: 'EST (before DST)' },
  { date: '2/27/2025', localTime: '10:00am', expectedGMT: '3:00pm', note: 'EST (before DST)' },
  { date: '3/6/2025',  localTime: '10:00am', expectedGMT: '3:00pm', note: 'EST (before DST)' },
  { date: '3/13/2025', localTime: '10:00am', expectedGMT: '2:00pm', note: 'EDT (after DST)' },
  { date: '3/20/2025', localTime: '10:00am', expectedGMT: '2:00pm', note: 'EDT (after DST)' }
];

// Generate the recurring events
console.log('Generating recurring events...\n');
const events = generateRecurringEvents(testRecurringPattern);

console.log('📅 Generated Events:');
console.log('=====================================');

events.forEach((event, index) => {
  const expectedResult = expectedResults[index];
  
  // Calculate GMT times using the function
  const gmtStart = calculateGMTDateTime(event.date, event.startTime || '10:00am', event.timezone);
  const gmtEnd = calculateGMTDateTime(event.date, event.endTime || '11:00am', event.timezone);
  
  // Extract just the time portion for comparison
  const gmtStartTime = gmtStart.split(' ')[1] || gmtStart;
  const gmtEndTime = gmtEnd.split(' ')[1] || gmtEnd;
  
  // Check if result matches expectation
  const isCorrect = gmtStartTime === expectedResult.expectedGMT;
  const status = isCorrect ? '✅' : '❌';
  
  console.log(`${status} Event ${index + 1}:`);
  console.log(`   Date: ${event.date} (${expectedResult.note})`);
  console.log(`   Local Time: ${event.startTime || '10:00am'} - ${event.endTime || '11:00am'} Eastern`);
  console.log(`   GMT Start: ${gmtStart}`);
  console.log(`   GMT End: ${gmtEnd}`);
  console.log(`   Expected GMT Start: ${expectedResult.expectedGMT}`);
  if (!isCorrect) {
    console.log(`   ⚠️  MISMATCH! Got ${gmtStartTime}, expected ${expectedResult.expectedGMT}`);
  }
  console.log('');
});

// Summary
const totalEvents = events.length;
const correctEvents = events.filter((event, index) => {
  const gmtStart = calculateGMTDateTime(event.date, event.startTime || '10:00am', event.timezone);
  const gmtStartTime = gmtStart.split(' ')[1] || gmtStart;
  return gmtStartTime === expectedResults[index].expectedGMT;
}).length;

console.log('📊 Test Summary:');
console.log('=====================================');
console.log(`Total events generated: ${totalEvents}`);
console.log(`Events with correct GMT conversion: ${correctEvents}`);
console.log(`Events with incorrect GMT conversion: ${totalEvents - correctEvents}`);

if (correctEvents === totalEvents) {
  console.log('🎉 All DST transitions handled correctly!');
} else {
  console.log('❌ DST transition handling needs fixes.');
  console.log('\nThe calculateGMTDateTime function may have issues with:');
  console.log('- Timezone conversion logic');
  console.log('- DST transition detection');
  console.log('- Date/time object creation');
}

console.log('\n---');
console.log('Run this test with: node src/utils/__tests__/dst-test.js');