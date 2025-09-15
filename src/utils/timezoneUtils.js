// Timezone utilities using the native Intl API
import { getTimezoneOptionsForUI } from './timezoneRegistry.js';

/**
 * Get a curated list of supported timezones with consistent labels
 * Uses the centralized timezone registry for consistency between UI and CSV
 */
export const getCommonTimezones = () => {
  return getTimezoneOptionsForUI();
};

/**
 * Get the user's local timezone
 */
export const getUserTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Get a formatted display name for a timezone
 */
export const formatTimezone = (timezone) => {
  try {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short'
    });
    
    const parts = formatter.formatToParts(date);
    const timeZoneName = parts.find(part => part.type === 'timeZoneName')?.value;
    
    return `${timezone.replace(/_/g, ' ')} (${timeZoneName})`;
  } catch {
    return timezone;
  }
};

/**
 * Convert a date/time to a specific timezone
 */
export const convertToTimezone = (date, timezone) => {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(new Date(date));
  } catch {
    return date;
  }
};

/**
 * Get timezone offset in minutes
 */
export const getTimezoneOffset = (timezone, date = new Date()) => {
  try {
    const utc = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
    const targetTime = new Date(utc.toLocaleString('en-US', { timeZone: timezone }));
    return (targetTime.getTime() - utc.getTime()) / 60000;
  } catch {
    return 0;
  }
};