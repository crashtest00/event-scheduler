// components/EventPreview.js
import React from 'react';

const EventPreview = ({ events, title = "Preview Events" }) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="max-h-64 overflow-y-auto">
        {events.length > 0 ? (
          <div className="space-y-2">
            {events.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                <div>
                  <span className="font-medium">{event.name}</span>
                  <span className="text-gray-600 ml-3">{event.date}</span>
                </div>
                <span className="text-sm text-gray-500">{event.time}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Fill in the form above to see your events preview</p>
        )}
        {events.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Total events: <span className="font-medium">{events.length}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventPreview;