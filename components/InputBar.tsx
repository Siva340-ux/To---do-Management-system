
import React, { useState, useEffect } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { MicIcon, SendIcon, StopCircleIcon } from './Icons';

interface InputBarProps {
  onAddTask: (prompt: string) => void;
  isLoading: boolean;
}

export const InputBar: React.FC<InputBarProps> = ({ onAddTask, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const { text, startListening, stopListening, isListening, hasRecognitionSupport } = useSpeechRecognition();

  useEffect(() => {
    if (text) {
      setPrompt(text);
    }
  }, [text]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onAddTask(prompt.trim());
      setPrompt('');
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <footer className="sticky bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm z-10">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={isListening ? 'Listening...' : 'e.g., Remind me to submit my assignment tomorrow'}
            className="w-full bg-gray-800 border border-gray-700 rounded-full py-3 pl-6 pr-28 text-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
             {hasRecognitionSupport && (
                <button
                type="button"
                onClick={handleMicClick}
                className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                disabled={isLoading}
                >
                {isListening ? <StopCircleIcon className="w-6 h-6" /> : <MicIcon className="w-6 h-6" />}
                </button>
            )}
            <button
              type="submit"
              className="bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors"
              disabled={isLoading || !prompt.trim()}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <SendIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </form>
      </div>
    </footer>
  );
};
