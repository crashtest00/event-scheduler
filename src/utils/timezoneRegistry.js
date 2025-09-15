// Centralized timezone registry - Single source of truth for all timezone handling
// UI and CSV both use the same mappedLabel for consistency

export const SUPPORTED_TIMEZONES = [
  {
    iana: 'America/New_York',
    mappedLabel: 'Eastern',
    abbreviations: ['EST', 'EDT', 'Eastern']
  },
  {
    iana: 'America/Chicago',
    mappedLabel: 'Central',
    abbreviations: ['CST', 'CDT', 'Central']
  },
  {
    iana: 'America/Denver',
    mappedLabel: 'Mountain',
    abbreviations: ['MST', 'MDT', 'Mountain']
  },
  {
    iana: 'America/Los_Angeles',
    mappedLabel: 'Pacific',
    abbreviations: ['PST', 'PDT', 'Pacific']
  },
  {
    iana: 'America/Anchorage',
    mappedLabel: 'Alaska',
    abbreviations: ['AKST', 'AKDT']
  },
  {
    iana: 'Europe/Amsterdam',
    mappedLabel: 'Central European Time',
    abbreviations: ['CET', 'CEST']
  }
];

// Helper functions for timezone lookups
export const getTimezoneByIana = (iana) => 
  SUPPORTED_TIMEZONES.find(tz => tz.iana === iana);

export const getTimezoneByAbbreviation = (abbrev) =>
  SUPPORTED_TIMEZONES.find(tz => tz.abbreviations.includes(abbrev));

// Main mapping function - converts any timezone input to standardized label
export const mapToLabel = (input) => {
  if (!input) return '';
  const tz = getTimezoneByIana(input) || getTimezoneByAbbreviation(input);
  return tz?.mappedLabel || input;
};

// Generate UI options for timezone dropdowns
export const getTimezoneOptionsForUI = () =>
  SUPPORTED_TIMEZONES.map(tz => ({
    value: tz.iana,
    label: tz.mappedLabel
  }));

// Validation helper
export const isTimezoneSupported = (input) => {
  return Boolean(getTimezoneByIana(input) || getTimezoneByAbbreviation(input));
};

// Get the IANA identifier for a given input
export const getIanaTimezone = (input) => {
  const tz = getTimezoneByIana(input) || getTimezoneByAbbreviation(input);
  return tz?.iana || input;
};