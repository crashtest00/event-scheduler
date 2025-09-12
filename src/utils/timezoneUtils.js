// Timezone utilities using the native Intl API

/**
 * Get a curated list of common timezones with user-friendly labels
 */
export const getCommonTimezones = () => {
  const commonTimezones = [
    // US Timezones
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
    { value: 'Pacific/Honolulu', label: 'Hawaii Time (HST)' },
    
    // International
    { value: 'UTC', label: 'Coordinated Universal Time (UTC)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Paris', label: 'Central European Time - Paris (CET)' },
    { value: 'Europe/Berlin', label: 'Central European Time - Berlin (CET)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
    { value: 'Asia/Shanghai', label: 'China Standard Time (CST)' },
    { value: 'Asia/Kolkata', label: 'India Standard Time (IST)' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time - Sydney (AET)' },
    { value: 'Australia/Melbourne', label: 'Australian Eastern Time - Melbourne (AET)' },
  ];

  return commonTimezones;
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