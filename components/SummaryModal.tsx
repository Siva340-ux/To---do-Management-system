
import React from 'react';

interface SummaryModalProps {
  summary: string;
  onClose: () => void;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({ summary, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl p-6 relative" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-indigo-400 mb-4">Task Summary</h2>
        <div className="text-gray-300 whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
          {summary}
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div className="mt-6 text-right">
           <button
             onClick={onClose}
             className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200"
           >
             Close
           </button>
        </div>
      </div>
    </div>
  );
};
