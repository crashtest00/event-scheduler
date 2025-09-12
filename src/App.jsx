// App.js - Main Application Component
import React, { useState } from 'react';
import EventScheduler from './components/EventScheduler.jsx';

const App = () => {
  const [recurringPatterns, setRecurringPatterns] = useState([]);

  const [singleEvents, setSingleEvents] = useState([]);

  const [timezone, setTimezone] = useState('America/New_York');

  return (
    <div className="min-h-screen bg-gray-50">
      <EventScheduler 
        recurringPatterns={recurringPatterns}
        setRecurringPatterns={setRecurringPatterns}
        singleEvents={singleEvents}
        setSingleEvents={setSingleEvents}
        timezone={timezone}
      />
    </div>
  );
};

export default App;