import { Category } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'writing',    name: 'Writing',    icon: 'PenLine',    color: '#6366f1', unit: 'words',    trackValue: true },
  { id: 'workout',    name: 'Workout',    icon: 'Dumbbell',   color: '#f97316', unit: 'minutes',  trackValue: true },
  { id: 'reading',    name: 'Reading',    icon: 'BookOpen',   color: '#10b981', unit: 'pages',    trackValue: true },
  { id: 'meditation', name: 'Meditation', icon: 'Sparkles',   color: '#8b5cf6', unit: 'minutes',  trackValue: true },
];

// Curated palette for creating new categories
export const CATEGORY_COLORS = [
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#64748b', // slate
];

// Curated icon set – kept short so they fit in the picker grid
export const CATEGORY_ICONS = [
  'PenLine', 'Dumbbell', 'BookOpen', 'Sparkles',
  'Brain', 'Coffee', 'Music', 'Code',
  'Heart', 'Footprints', 'Bike', 'Apple',
  'Briefcase', 'Palette', 'Camera', 'Sun',
  'Moon', 'Droplet', 'Flame', 'Mountain',
  'Target', 'Trophy', 'Flag', 'Smile',
];
