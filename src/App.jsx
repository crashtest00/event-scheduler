// App.js - Main Application Component
import React, { useState } from 'react';
import EventScheduler from './components/EventScheduler.jsx';

const App = () => {
  const [recurringPatterns, setRecurringPatterns] = useState([]);
  const [singleEvents, setSingleEvents] = useState([]);
  const [timezone, setTimezone] = useState('America/New_York');
  
  // Global program and staff state
  const [program, setProgram] = useState('');
  const [staff, setStaff] = useState(['']);

  return (
    <div className="min-h-screen bg-gray-50">
      <EventScheduler 
        recurringPatterns={recurringPatterns}
        setRecurringPatterns={setRecurringPatterns}
        singleEvents={singleEvents}
        setSingleEvents={setSingleEvents}
        timezone={timezone}
        program={program}
        setProgram={setProgram}
        staff={staff}
        setStaff={setStaff}
      />
    </div>
  );
};

export default App;