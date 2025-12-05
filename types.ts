export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface DayData {
  date: string; // Format YYYY-MM-DD
  todos: TodoItem[];
}

export type ViewState = 'CALENDAR' | 'TODO_LIST';

export interface CalendarDay {
  day: number | null; // null for padding days
  dateString: string;
  hasItems: boolean;
  completionRate: number; // 0 to 1
}