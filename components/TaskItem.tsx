
import React from 'react';
import { Task } from '../types';
import { CATEGORY_COLORS, PRIORITY_COLORS } from '../constants';
import { TrashIcon, CalendarIcon } from './Icons';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  const { id, name, category, priority, dueDate, completed } = task;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      className={`
        flex items-center p-4 rounded-lg transition-all duration-300
        ${completed ? 'bg-gray-800 opacity-60' : 'bg-gray-800/50 hover:bg-gray-700/80'}
      `}
    >
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onToggle(id)}
        className="form-checkbox h-6 w-6 rounded-full bg-gray-700 border-gray-600 text-indigo-500 focus:ring-indigo-600 cursor-pointer"
      />
      <div className="ml-4 flex-grow">
        <p className={`text-lg text-gray-100 ${completed ? 'line-through text-gray-500' : ''}`}>
          {name}
        </p>
        <div className="flex items-center space-x-3 mt-1 text-sm">
          {dueDate && (
            <div className="flex items-center space-x-1 text-gray-400">
              <CalendarIcon className="w-4 h-4" />
              <span>{formatDate(dueDate)}</span>
            </div>
          )}
          <span
            className={`px-2 py-0.5 text-xs font-semibold rounded-full ${CATEGORY_COLORS[category]}`}
          >
            {category}
          </span>
          <span
            className={`border px-2 py-0.5 text-xs font-semibold rounded-full ${PRIORITY_COLORS[priority]}`}
          >
            {priority} Priority
          </span>
        </div>
      </div>
      <button
        onClick={() => onDelete(id)}
        className="ml-4 p-2 text-gray-500 hover:text-red-400 rounded-full hover:bg-gray-700 transition-colors"
        aria-label="Delete task"
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  );
};
