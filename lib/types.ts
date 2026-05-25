export type Category = {
  id: string;
  name: string;
  icon: string;          // lucide icon name
  color: string;         // hex
  unit?: string;         // 'words', 'minutes', 'pages', 'reps'
  trackValue: boolean;   // does this category track a numeric value
};

export type LogEntry = {
  id: string;
  categoryId: string;
  date: string;          // ISO yyyy-mm-dd
  value?: number;
  note?: string;
  createdAt: string;     // full ISO
};

export type Goal = {
  id: string;
  title: string;
  categoryId?: string;
  target: number;
  unit: string;
  period: 'day' | 'week' | 'month';
  createdAt: string;
  archived?: boolean;
};

export type Note = {
  id: string;
  title: string;
  body: string;
  pinned?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AppData = {
  categories: Category[];
  entries: LogEntry[];
  goals: Goal[];
  notes: Note[];
};
