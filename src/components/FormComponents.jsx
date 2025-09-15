import React from 'react';
import { getCommonTimezones } from '../utils/timezoneUtils.js';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// Simple form components without TW Elements complexity

export const StaffInputSection = ({ 
  staff, 
  onAddStaff, 
  onRemoveStaff, 
  onUpdateStaff, 
  colorTheme = 'blue' 
}) => {
  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Staff
      </label>
      <div className="space-y-2">
        {staff.map((staffMember, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="First Last"
              value={staffMember}
              onChange={(e) => onUpdateStaff(index, e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {staff.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveStaff(index)}
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
          onClick={onAddStaff}
          className="flex items-center gap-1 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Staff Member
        </button>
      </div>
    </div>
  );
};

export const LocationSection = ({ 
  isVirtual, 
  location, 
  onVirtualChange, 
  onLocationChange, 
  itemId,
  colorTheme = 'blue' 
}) => {
  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Location Type
      </label>
      <div className="flex items-center space-x-6 mb-3">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name={`location-type-${itemId}`}
            checked={!isVirtual}
            onChange={() => onVirtualChange(false)}
            className="w-4 h-4 text-blue-600 border-gray-300"
          />
          <span className="ml-2 text-sm text-gray-700">Physical Location</span>
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name={`location-type-${itemId}`}
            checked={isVirtual}
            onChange={() => onVirtualChange(true)}
            className="w-4 h-4 text-blue-600 border-gray-300"
          />
          <span className="ml-2 text-sm text-gray-700">Virtual</span>
        </label>
      </div>
      <input
        type="text"
        placeholder="Physical Address or Zoom link"
        value={location}
        onChange={(e) => onLocationChange(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
};

export const EventTypeSelect = ({ 
  value, 
  onChange, 
  colorTheme = 'blue' 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Event Type
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Select event type</option>
        <option value="mentor-swarm">Mentor Swarm</option>
        <option value="investor-swarm">Investor Swarm</option>
      </select>
    </div>
  );
};

export const TimezoneSelect = ({ 
  value, 
  onChange, 
  colorTheme = 'blue' 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Timezone
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {getCommonTimezones().map(timezone => (
          <option key={timezone.value} value={timezone.value}>
            {timezone.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export const ProgramInput = ({ 
  value, 
  onChange, 
  colorTheme = 'blue' 
}) => {
  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Program
      </label>
      <input
        type="text"
        placeholder="gener8tor Madison Fall 2012"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
};

export const CapacityInput = ({ 
  value, 
  onChange, 
  colorTheme = 'blue' 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Capacity
      </label>
      <input
        type="number"
        min="1"
        placeholder="Max attendees"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
};

export const TimeInput = ({
  label,
  value,
  onChange,
  colorTheme = "blue",
}) => {
  // Convert string time (HH:mm) to dayjs object
  const timeValue = value ? dayjs(`2000-01-01 ${value}`) : null;

  const handleTimeChange = (newValue) => {
    if (newValue) {
      // Convert dayjs object back to HH:mm string
      const timeString = newValue.format('HH:mm');
      onChange(timeString);
    } else {
      onChange('');
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          value={timeValue}
          onChange={handleTimeChange}
          format="h:mm A"
          ampm={true}
          slotProps={{
            textField: {
              className: "w-full",
              style: {
                width: '100%'
              },
              sx: {
                '& .MuiOutlinedInput-root': {
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#3B82F6',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#3B82F6',
                    borderWidth: '2px',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  padding: '0px',
                },
              }
            }
          }}
        />
      </LocalizationProvider>
    </div>
  );
};

export const DateInput = ({ 
  label, 
  value, 
  onChange, 
  colorTheme = 'blue' 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
};