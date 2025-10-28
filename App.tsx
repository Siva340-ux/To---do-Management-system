
import React, { useState, useCallback, useEffect } from 'react';
import { Task, TaskCategory, TaskPriority } from './types';
import { Header } from './components/Header';
import { TaskList } from './components/TaskList';
import { InputBar } from './components/InputBar';
import { SummaryModal } from './components/SummaryModal';
import { parseTaskFromString, getMotivationalMessage, getTaskSummary } from './services/geminiService';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, name: 'Submit quarterly report', category: TaskCategory.WORK, priority: TaskPriority.HIGH, dueDate: new Date(Date.now() + 86400000).toISOString(), completed: false },
    { id: 2, name: 'Grocery shopping for the week', category: TaskCategory.SHOPPING, priority: TaskPriority.MEDIUM, dueDate: new Date(Date.now() + 2 * 86400000).toISOString(), completed: false },
    { id: 3, name: 'Schedule dentist appointment', category: TaskCategory.PERSONAL, priority: TaskPriority.LOW, dueDate: null, completed: true },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [summary, setSummary] = useState('');
  
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAddTask = useCallback(async (prompt: string) => {
    if (!prompt) return;
    setIsLoading(true);
    setError(null);
    try {
      const parsedTask = await parseTaskFromString(prompt);
      if (parsedTask) {
        setTasks(prevTasks => [
          ...prevTasks,
          {
            ...parsedTask,
            id: Date.now(),
            completed: false,
          },
        ]);
        showNotification(`Task "${parsedTask.name}" added successfully!`);
      } else {
         throw new Error("I couldn't understand that. Please try rephrasing your request.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleToggleTask = useCallback(async (id: number) => {
    let completedTaskName: string | undefined;
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === id) {
          if (!task.completed) {
            completedTaskName = task.name;
          }
          return { ...task, completed: !task.completed };
        }
        return task;
      })
    );

    if (completedTaskName) {
      try {
        const message = await getMotivationalMessage(completedTaskName);
        showNotification(message);
      } catch (err) {
        console.error("Failed to get motivational message:", err);
      }
    }
  }, []);

  const handleDeleteTask = useCallback((id: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  }, []);

  const handleGetSummary = useCallback(async (period: 'today' | 'this week') => {
    setIsLoading(true);
    try {
      const summaryText = await getTaskSummary(tasks, period);
      setSummary(summaryText);
      setIsSummaryModalOpen(true);
    } catch (err) {
       const errorMessage = err instanceof Error ? err.message : 'Failed to get summary.';
       setError(errorMessage);
       setTimeout(() => setError(null), 5000);
    } finally {
      setIsLoading(false);
    }
  }, [tasks]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <Header onSummarize={handleGetSummary} />
        <main className="mt-8">
          <TaskList tasks={tasks} onToggle={handleToggleTask} onDelete={handleDeleteTask} />
        </main>
      </div>
      
      {notification && (
        <div className="fixed top-5 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in-out">
          {notification}
        </div>
      )}

      {error && (
        <div className="fixed bottom-24 right-5 bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in-out">
          {error}
        </div>
      )}

      <InputBar onAddTask={handleAddTask} isLoading={isLoading} />
      
      {isSummaryModalOpen && (
        <SummaryModal summary={summary} onClose={() => setIsSummaryModalOpen(false)} />
      )}
    </div>
  );
};

export default App;
