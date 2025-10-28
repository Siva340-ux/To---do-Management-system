
import { TaskCategory, TaskPriority } from './types';

export const CATEGORY_COLORS: Record<TaskCategory, string> = {
  [TaskCategory.WORK]: 'bg-blue-500 text-blue-50',
  [TaskCategory.PERSONAL]: 'bg-green-500 text-green-50',
  [TaskCategory.URGENT]: 'bg-red-500 text-red-50',
  [TaskCategory.SHOPPING]: 'bg-yellow-500 text-yellow-50',
  [TaskCategory.OTHER]: 'bg-gray-500 text-gray-50',
};

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: 'border-green-400 text-green-300',
  [TaskPriority.MEDIUM]: 'border-yellow-400 text-yellow-300',
  [TaskPriority.HIGH]: 'border-red-400 text-red-300',
};
