
import React from 'react';
import { Task } from '../types';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onToggle, onDelete }) => {
  const incompleteTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl text-gray-400">No tasks yet.</h2>
        <p className="text-gray-500 mt-2">Use the input bar below to add your first task!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-400 px-2 mb-3">To-Do</h2>
        <div className="space-y-2">
          {incompleteTasks.length > 0 ? (
            incompleteTasks.map(task => (
              <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
            ))
          ) : (
            <p className="text-gray-500 px-2">All tasks completed! Great job!</p>
          )}
        </div>
      </div>
      
      {completedTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-400 px-2 mb-3">Completed</h2>
          <div className="space-y-2">
            {completedTasks.map(task => (
              <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
