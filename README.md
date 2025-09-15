# Event Scheduler

A powerful desktop application for creating and managing recurring events with automated CSV export functionality. Perfect for organizing mentor swarms, investor events, and other recurring business activities.

## Features

### 🔄 Recurring Event Management
- Create weekly recurring patterns with flexible day selection
- Set custom duration (number of weeks) for event series
- Smart date handling with automatic DST (daylight saving time) transitions
- Global program and staff assignment across all events

### 📅 Single Event Creation
- Quick one-off event scheduling
- Independent configuration per event
- Mixed recurring and single events in the same schedule

### 🌍 Timezone Support
- Supports major timezones: Eastern, Central, Mountain, Pacific, Alaska, Central European Time
- Automatic DST handling using IANA timezone identifiers
- Consistent timezone display across UI and exports

### 📊 CSV Export
- Schema-compliant CSV generation for external systems
- Standardized time formats (10:00am, 2:30pm)
- Proper timezone mapping and GMT conversion
- Event type mapping (Mentor Swarm, Investor Swarm)
- Automatic CSV download with proper formatting

### 🎨 Modern Interface
- Clean, intuitive React-based UI
- Real-time event preview
- Form validation and error handling
- Responsive design for different screen sizes

### 💻 Cross-Platform Desktop App
- Native desktop application built with Electron
- Available for Windows (.exe), macOS (.dmg), and Linux (AppImage)
- Offline functionality - no internet connection required
- Native menu integration with keyboard shortcuts

## Development

### Prerequisites
- Node.js 18+ and npm
- For building: Platform-specific requirements for target OS

### Getting Started

```bash
# Install dependencies
npm install

# Start development server (web version)
npm run dev

# Start Electron development mode
npm run electron-dev
```

### Available Scripts

#### Web Development
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

#### Electron Development
- `npm run electron` - Run Electron app (production mode)
- `npm run electron-dev` - Run Electron with hot reload
- `npm run electron-build` - Build and package Electron app

#### Distribution
- `npm run dist:win` - Build Windows installer
- `npm run dist:mac` - Build macOS DMG
- `npm run dist:linux` - Build Linux AppImage  
- `npm run dist:all` - Build for all platforms

### Testing

```bash
# Run DST transition tests
node src/utils/__tests__/dst-test.js
```

## Architecture

### Core Components
- **EventScheduler** - Main scheduling interface
- **EventPreview** - Real-time event list display
- **FormComponents** - Reusable form elements with validation

### Utilities
- **eventUtils** - Event generation and CSV formatting
- **timezoneUtils** - Timezone handling and display
- **timezoneRegistry** - Centralized timezone configuration

### Key Features
- **Timezone Registry** - Single source of truth for timezone support
- **DST Handling** - Automatic daylight saving time transitions
- **CSV Schema Compliance** - Standardized export format
- **Form Validation** - Real-time input validation

## CSV Export Format

The app generates CSV files with the following schema:

| Column | Description | Example |
|--------|-------------|---------|
| Slot | Event identifier (blank) | |
| Program | Event program name | "Summer Mentor Program" |
| Staff | Comma-separated staff list | "John Doe, Jane Smith" |
| Virtual Location | Online meeting link | "https://zoom.us/..." |
| Physical Location | Physical address | "123 Main St, City" |
| Event Type | Standardized event type | "Mentor Swarm" |
| Day of Week | Full day name | "Thursday" |
| Event Date | M/D/YYYY format | "3/15/2025" |
| Start Time | 12-hour format | "10:00am" |
| End Time | 12-hour format | "11:30am" |
| Time Zone | Mapped timezone name | "Eastern" |
| GMT Start | GMT date/time | "3/15/2025 3:00pm" |
| GMT End | GMT date/time | "3/15/2025 4:30pm" |
| Slot Registrant Capacity | Maximum attendees | "25" |

## Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Desktop**: Electron 38
- **UI Components**: Material-UI, Lucide React icons
- **Build Tools**: Electron Builder, Vite
- **Date/Time**: Day.js, native Intl API for timezone handling

## License

This project is licensed under the MIT License.
