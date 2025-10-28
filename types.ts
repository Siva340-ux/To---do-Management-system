
export enum TaskCategory {
  WORK = 'Work',
  PERSONAL = 'Personal',
  URGENT = 'Urgent',
  SHOPPING = 'Shopping',
  OTHER = 'Other',
}

export enum TaskPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

export interface Task {
  id: number;
  name: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate: string | null;
  completed: boolean;
}
