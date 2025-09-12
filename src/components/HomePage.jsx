// components/HomePage.js
import React from 'react';
import { Calendar, Plus, Check, Repeat } from 'lucide-react';

const HomePage = ({ setCurrentFlow }) => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Event Scheduler</h1>
        <p className="text-lg text-gray-600">Create and manage all your events in one place</p>
      </div>
      
      <div className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:border-gray-300 transition-colors">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <Plus className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-4">
          Unified Event Scheduler
        </h2>
        
        <p className="text-gray-700 text-center mb-6">
          Create both recurring patterns and one-off events in a single workflow. 
          Mix and match different event types to build your perfect schedule.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <Repeat className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Recurring Patterns</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Weekly team meetings</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Multiple day patterns</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Automatic generation</span>
              </li>
            </ul>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6 text-green-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Single Events</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                <span>One-time events</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Irregular schedules</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Flexible timing</span>
              </li>
            </ul>
          </div>
        </div>
        
        <button 
          onClick={() => setCurrentFlow('scheduler')}
          className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-medium text-lg"
        >
          Start Creating Events
        </button>
      </div>
    </div>
  );
};

export default HomePage;