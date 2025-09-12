// components/BatchEventsFlow.js
import React from 'react';
import { ArrowLeft, Plus, Download } from 'lucide-react';
import { getCommonTimezones } from '../utils/timezoneUtils.js';

const BatchEventsFlow = ({ 
  setCurrentFlow, 
  resetData, 
  batchEvents, 
  setBatchEvents,
  batchTimezone,
  setBatchTimezone
}) => {
  const addBatchEvent = () => {
    setBatchEvents([...batchEvents, { 
      id: Date.now(), 
      name: '', 
      date: '', 
      startTime: '', 
      endTime: '' 
    }]);
  };

  const updateBatchEvent = (id, field, value) => {
    setBatchEvents(batchEvents.map(event => 
      event.id === id ? { ...event, [field]: value } : event
    ));
  };

  const removeBatchEvent = (id) => {
    if (batchEvents.length > 1) {
      setBatchEvents(batchEvents.filter(event => event.id !== id));
    }
  };

  const handleGenerateCSV = () => {
    const validEvents = batchEvents.filter(event => 
      event.name && event.date && event.startTime && event.endTime
    );
    alert(`CSV would be generated with ${validEvents.length} events! (This is just a prototype)`);
  };

  const hasValidEvents = batchEvents.some(event => 
    event.name && event.date && event.startTime && event.endTime
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <button 
          onClick={() => { setCurrentFlow('home'); resetData(); }}
          className="mb-4 inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900 text-center">Create Batch Events</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone for All Events
          </label>
          <select
            value={batchTimezone}
            onChange={(e) => setBatchTimezone(e.target.value)}
            className="w-full max-w-md p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {getCommonTimezones().map(timezone => (
              <option key={timezone.value} value={timezone.value}>
                {timezone.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Events</h3>
          <button
            onClick={addBatchEvent}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </button>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {batchEvents.map((event, index) => (
            <div key={event.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-700">Event #{index + 1}</span>
                {batchEvents.length > 1 && (
                  <button
                    onClick={() => removeBatchEvent(event.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Name
                  </label>
                  <input
                    type="text"
                    placeholder="Event name"
                    value={event.name}
                    onChange={(e) => updateBatchEvent(event.id, 'name', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={event.date}
                    onChange={(e) => updateBatchEvent(event.id, 'date', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={event.startTime}
                    onChange={(e) => updateBatchEvent(event.id, 'startTime', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={event.endTime}
                    onChange={(e) => updateBatchEvent(event.id, 'endTime', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <button 
          onClick={handleGenerateCSV}
          disabled={!hasValidEvents}
          className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Generate CSV
        </button>
      </div>
    </div>
  );
};

export default BatchEventsFlow;