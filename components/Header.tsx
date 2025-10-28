
import React from 'react';
import { CalendarIcon, SparklesIcon } from './Icons';

interface HeaderProps {
  onSummarize: (period: 'today' | 'this week') => void;
}

export const Header: React.FC<HeaderProps> = ({ onSummarize }) => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
      <div className="flex items-center space-x-3">
        <SparklesIcon className="w-8 h-8 text-indigo-400" />
        <h1 className="text-3xl font-bold text-gray-50">
          AI To-Do Assistant
        </h1>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onSummarize('today')}
          className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium py-2 px-4 rounded-md flex items-center space-x-2 transition-colors duration-200"
        >
          <CalendarIcon className="w-5 h-5" />
          <span>Summarize Today</span>
        </button>
        <button
          onClick={() => onSummarize('this week')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-md flex items-center space-x-2 transition-colors duration-200"
        >
          <CalendarIcon className="w-5 h-5" />
          <span>Summarize Week</span>
        </button>
      </div>
    </header>
  );
};
