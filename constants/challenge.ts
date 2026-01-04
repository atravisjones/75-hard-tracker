import { TaskConfig } from '@/types';

// Challenge configuration
export const CHALLENGE_DAYS = 75;

// Water tracking
export const WATER_GOAL_OZ = 128;
export const WATER_INCREMENT_SMALL = 8;
export const WATER_INCREMENT_LARGE = 16;

// Workout requirements
export const WORKOUT_DURATION_MINUTES = 45;
export const WORKOUT_GAP_HOURS = 3;

// Reading requirements
export const READING_GOAL_PAGES = 10;

// The 5 daily tasks
export const DAILY_TASKS: TaskConfig[] = [
  {
    id: 'photo',
    title: 'Progress Photo',
    subtitle: 'Take a daily photo',
    icon: '📸',
  },
  {
    id: 'water',
    title: 'Drink 1 Gallon of Water',
    subtitle: '128 oz total',
    icon: '💧',
  },
  {
    id: 'workouts',
    title: 'Two 45-Min Workouts',
    subtitle: 'One must be outdoors, 3+ hours apart',
    icon: '💪',
  },
  {
    id: 'reading',
    title: 'Read 10 Pages',
    subtitle: 'Non-fiction / self-development',
    icon: '📖',
  },
  {
    id: 'diet',
    title: 'Follow Diet',
    subtitle: 'No cheat meals, no alcohol',
    icon: '🥗',
  },
];

// Milestones
export const MILESTONES = [25, 50, 75];

// Storage keys
export const STORAGE_KEYS = {
  CHALLENGE_STATE: '@75hard/challenge_state',
  PHOTOS_DIR: '75hard_photos',
  SETTINGS: '@75hard/settings',
};
