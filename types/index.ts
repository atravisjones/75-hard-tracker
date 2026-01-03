// Workout tracking details
export interface WorkoutEntry {
  completed: boolean;
  isOutdoor: boolean;
  type: string;           // e.g., "Walk", "Run", "Lift", "Yoga", etc.
  startTime: string | null;  // ISO timestamp when started
  endTime: string | null;    // ISO timestamp when ended
  duration: number;       // minutes
}

// Daily progress tracking for 75 Hard challenge
export interface DayProgress {
  date: string;              // ISO date string (YYYY-MM-DD)

  // Workouts (2 required, one must be outdoor, 3hrs apart)
  workout1: WorkoutEntry;
  workout2: WorkoutEntry;

  // Water (128oz goal)
  waterOz: number;           // Current water intake in oz

  // Reading (10 pages minimum)
  pagesRead: number;         // Pages read today
  bookTitle: string;         // Current book being read

  // Diet
  dietFollowed: boolean;     // No cheat meals, no alcohol

  // Progress photo
  photoUri: string | null;   // Local URI to progress photo
  photoTimestamp: string | null;

  // Notes/Journal
  notes: string;

  // Completion status
  completed: boolean;        // All 5 tasks done
}

// Challenge attempt history
export interface ChallengeAttempt {
  id: string;
  startDate: string;
  endDate: string | null;    // null if current attempt
  daysCompleted: number;
  reason: string | null;     // Why failed (if applicable)
  history: DayProgress[];
}

// User settings
export interface UserSettings {
  waterBottleSize: number;      // Custom bottle size in oz (default 16)
  notifications: boolean;       // Daily reminders enabled
}

// Overall challenge state
export interface ChallengeState {
  // Current attempt
  currentDay: number;        // 1-75 (or 0 if not started)
  startDate: string | null;
  streak: number;
  todayProgress: DayProgress | null;
  history: DayProgress[];

  // All attempts
  attempts: ChallengeAttempt[];

  // Settings
  hasCompletedOnboarding: boolean;
  userSettings: UserSettings;

  // Stats
  totalPagesRead: number;
  totalWaterOz: number;
  totalWorkouts: number;
}

// Actions for the reducer
export type ChallengeAction =
  | { type: 'LOAD_STATE'; payload: ChallengeState }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'START_CHALLENGE' }
  | { type: 'RESET_CHALLENGE'; payload?: string }  // reason for reset
  | { type: 'UPDATE_TODAY'; payload: Partial<DayProgress> }
  | { type: 'UPDATE_WORKOUT'; payload: { workoutNum: 1 | 2; data: Partial<WorkoutEntry> } }
  | { type: 'ADD_WATER'; payload: number }
  | { type: 'ADD_PAGES'; payload: number }
  | { type: 'SET_PHOTO'; payload: string }
  | { type: 'COMPLETE_DAY' }
  | { type: 'CHECK_DAY_TRANSITION' }
  | { type: 'SET_DAY'; payload: number }  // Override current day
  | { type: 'UPDATE_SETTINGS'; payload: Partial<UserSettings> }
  | { type: 'IMPORT_DATA'; payload: ChallengeState };

// Task display configuration
export interface TaskConfig {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
}

// Workout types
export const WORKOUT_TYPES = [
  'Walk',
  'Run',
  'HIIT',
  'Strength Training',
  'Yoga',
  'Cycling',
  'Swimming',
  'Sports',
  'Other',
] as const;

export type WorkoutType = typeof WORKOUT_TYPES[number];
