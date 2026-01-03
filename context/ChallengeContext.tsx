import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { ChallengeState, ChallengeAction, DayProgress, WorkoutEntry, UserSettings } from '@/types';
import { saveChallengeState, loadChallengeState } from '@/utils/storage';
import { getTodayISO, getYesterdayISO, getChallengeDay } from '@/utils/dateUtils';
import {
  CHALLENGE_DAYS,
  WATER_GOAL_OZ,
  READING_GOAL_PAGES,
  WORKOUT_DURATION_MINUTES,
  WORKOUT_GAP_HOURS,
} from '@/constants/challenge';

// Create empty workout entry
function createEmptyWorkout(): WorkoutEntry {
  return {
    completed: false,
    isOutdoor: false,
    type: '',
    startTime: null,
    endTime: null,
    duration: 0,
  };
}

// Create empty day progress
function createEmptyDayProgress(date: string): DayProgress {
  return {
    date,
    workout1: createEmptyWorkout(),
    workout2: createEmptyWorkout(),
    waterOz: 0,
    pagesRead: 0,
    bookTitle: '',
    dietFollowed: false,
    photoUri: null,
    photoTimestamp: null,
    notes: '',
    completed: false,
  };
}

// Create completed day progress (for backfilling previous days)
function createCompletedDayProgress(date: string): DayProgress {
  return {
    date,
    workout1: {
      completed: true,
      isOutdoor: true,
      type: 'Completed',
      startTime: `${date}T08:00:00`,
      endTime: `${date}T08:45:00`,
      duration: WORKOUT_DURATION_MINUTES,
    },
    workout2: {
      completed: true,
      isOutdoor: false,
      type: 'Completed',
      startTime: `${date}T14:00:00`,
      endTime: `${date}T14:45:00`,
      duration: WORKOUT_DURATION_MINUTES,
    },
    waterOz: WATER_GOAL_OZ,
    pagesRead: READING_GOAL_PAGES,
    bookTitle: '',
    dietFollowed: true,
    photoUri: 'completed',
    photoTimestamp: `${date}T20:00:00`,
    notes: '',
    completed: true,
  };
}

// Generate date string for a specific day number from start date
function getDateForDay(startDate: string, dayNum: number): string {
  const start = new Date(startDate + 'T00:00:00');
  start.setDate(start.getDate() + dayNum - 1);
  return start.toISOString().split('T')[0];
}

// Check if workouts meet requirements
function areWorkoutsComplete(day: DayProgress): boolean {
  const w1 = day.workout1;
  const w2 = day.workout2;

  // Both workouts must be completed
  if (!w1.completed || !w2.completed) return false;

  // At least one must be outdoor
  if (!w1.isOutdoor && !w2.isOutdoor) return false;

  // Both must be at least 45 minutes
  if (w1.duration < WORKOUT_DURATION_MINUTES || w2.duration < WORKOUT_DURATION_MINUTES) return false;

  // Must be 3 hours apart (if both have timestamps)
  if (w1.endTime && w2.startTime) {
    const w1End = new Date(w1.endTime).getTime();
    const w2Start = new Date(w2.startTime).getTime();
    const hoursBetween = (w2Start - w1End) / (1000 * 60 * 60);
    if (hoursBetween < WORKOUT_GAP_HOURS) return false;
  }

  return true;
}

// Check if a day's progress is complete
function isDayComplete(day: DayProgress): boolean {
  return (
    day.dietFollowed &&
    areWorkoutsComplete(day) &&
    day.waterOz >= WATER_GOAL_OZ &&
    day.pagesRead >= READING_GOAL_PAGES &&
    day.photoUri !== null
  );
}

// Default user settings
const defaultUserSettings: UserSettings = {
  waterBottleSize: 16,
  notifications: true,
};

// Initial state
const initialState: ChallengeState = {
  currentDay: 0,
  startDate: null,
  streak: 0,
  todayProgress: null,
  history: [],
  attempts: [],
  hasCompletedOnboarding: false,
  userSettings: defaultUserSettings,
  totalPagesRead: 0,
  totalWaterOz: 0,
  totalWorkouts: 0,
};

// Reducer function
function challengeReducer(state: ChallengeState, action: ChallengeAction): ChallengeState {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload;

    case 'COMPLETE_ONBOARDING':
      return { ...state, hasCompletedOnboarding: true };

    case 'START_CHALLENGE': {
      const today = getTodayISO();
      const todayProgress = createEmptyDayProgress(today);
      return {
        ...state,
        currentDay: 1,
        startDate: today,
        streak: 0,
        history: [todayProgress],
        todayProgress,
      };
    }

    case 'RESET_CHALLENGE': {
      const today = getTodayISO();
      const todayProgress = createEmptyDayProgress(today);

      // Save current attempt to history
      const newAttempt = {
        id: Date.now().toString(),
        startDate: state.startDate || today,
        endDate: today,
        daysCompleted: state.currentDay - 1,
        reason: action.payload || 'Task incomplete',
        history: state.history,
      };

      return {
        ...state,
        currentDay: 1,
        startDate: today,
        streak: 0,
        history: [todayProgress],
        todayProgress,
        attempts: [...state.attempts, newAttempt],
      };
    }

    case 'UPDATE_TODAY': {
      if (!state.todayProgress) return state;

      const updatedProgress = {
        ...state.todayProgress,
        ...action.payload,
      };
      updatedProgress.completed = isDayComplete(updatedProgress);

      const historyIndex = state.history.findIndex(
        (d) => d.date === state.todayProgress!.date
      );
      const newHistory = [...state.history];
      if (historyIndex >= 0) {
        newHistory[historyIndex] = updatedProgress;
      }

      return {
        ...state,
        todayProgress: updatedProgress,
        history: newHistory,
      };
    }

    case 'UPDATE_WORKOUT': {
      if (!state.todayProgress) return state;

      const workoutKey = action.payload.workoutNum === 1 ? 'workout1' : 'workout2';
      const currentWorkout = state.todayProgress[workoutKey];
      const updatedWorkout = { ...currentWorkout, ...action.payload.data };

      return challengeReducer(state, {
        type: 'UPDATE_TODAY',
        payload: { [workoutKey]: updatedWorkout },
      });
    }

    case 'ADD_WATER': {
      if (!state.todayProgress) return state;
      const newWater = Math.max(0, state.todayProgress.waterOz + action.payload);
      return challengeReducer(state, {
        type: 'UPDATE_TODAY',
        payload: { waterOz: newWater },
      });
    }

    case 'ADD_PAGES': {
      if (!state.todayProgress) return state;
      const newPages = Math.max(0, state.todayProgress.pagesRead + action.payload);
      return challengeReducer(state, {
        type: 'UPDATE_TODAY',
        payload: { pagesRead: newPages },
      });
    }

    case 'SET_PHOTO': {
      if (!state.todayProgress) return state;
      return challengeReducer(state, {
        type: 'UPDATE_TODAY',
        payload: {
          photoUri: action.payload,
          photoTimestamp: new Date().toISOString(),
        },
      });
    }

    case 'COMPLETE_DAY': {
      if (!state.todayProgress?.completed) return state;

      // Update cumulative stats
      const day = state.todayProgress;
      return {
        ...state,
        streak: state.streak + 1,
        totalPagesRead: state.totalPagesRead + day.pagesRead,
        totalWaterOz: state.totalWaterOz + day.waterOz,
        totalWorkouts: state.totalWorkouts + 2,
      };
    }

    case 'CHECK_DAY_TRANSITION': {
      if (!state.startDate) return state;

      const today = getTodayISO();
      const yesterday = getYesterdayISO();

      // Check if today already exists in history
      const todayExists = state.history.some((d) => d.date === today);
      if (todayExists) {
        const todayProgress = state.history.find((d) => d.date === today) || null;
        return { ...state, todayProgress };
      }

      // Check if yesterday was completed
      const yesterdayProgress = state.history.find((d) => d.date === yesterday);

      if (!yesterdayProgress || !yesterdayProgress.completed) {
        // Missed a day - this triggers a reset
        // But we don't auto-reset, user must confirm
        return state;
      }

      // Yesterday was complete - advance to next day
      const newDay = getChallengeDay(state.startDate);
      if (newDay > CHALLENGE_DAYS) {
        // Challenge complete!
        return state;
      }

      const newTodayProgress = createEmptyDayProgress(today);
      return {
        ...state,
        currentDay: newDay,
        todayProgress: newTodayProgress,
        history: [...state.history, newTodayProgress],
      };
    }

    case 'SET_DAY': {
      const newDay = Math.max(1, Math.min(action.payload, CHALLENGE_DAYS));
      const today = getTodayISO();

      // Calculate startDate so that today = Day N
      // startDate = today - (N - 1) days
      const todayDateObj = new Date(today + 'T00:00:00');
      todayDateObj.setDate(todayDateObj.getDate() - (newDay - 1));
      const startDate = todayDateObj.toISOString().split('T')[0];

      // Build history with completed days for all previous days
      const newHistory: DayProgress[] = [];
      const completedDaysCount = newDay - 1;

      // Generate completed entries for days 1 through (newDay - 1)
      for (let d = 1; d <= completedDaysCount; d++) {
        const dayDate = getDateForDay(startDate, d);
        // Check if we already have data for this day
        const existingDay = state.history.find(h => h.date === dayDate);
        if (existingDay) {
          // If it exists but isn't complete, mark it complete
          newHistory.push(existingDay.completed ? existingDay : { ...existingDay, completed: true });
        } else {
          newHistory.push(createCompletedDayProgress(dayDate));
        }
      }

      // Add today's progress (current day = today)
      const existingToday = state.history.find(h => h.date === today);
      const todayProgress = existingToday || createEmptyDayProgress(today);
      newHistory.push(todayProgress);

      // Calculate stats from completed days
      const completedDays = newHistory.filter(h => h.completed);
      const totalPages = completedDays.reduce((sum, h) => sum + h.pagesRead, 0);
      const totalWater = completedDays.reduce((sum, h) => sum + h.waterOz, 0);
      const totalWorkouts = completedDays.length * 2;

      return {
        ...state,
        currentDay: newDay,
        startDate,
        history: newHistory,
        todayProgress,
        streak: completedDaysCount,
        totalPagesRead: totalPages,
        totalWaterOz: totalWater,
        totalWorkouts,
      };
    }

    case 'UPDATE_SETTINGS': {
      return {
        ...state,
        userSettings: {
          ...state.userSettings,
          ...action.payload,
        },
      };
    }

    case 'IMPORT_DATA': {
      return {
        ...action.payload,
        userSettings: action.payload.userSettings || defaultUserSettings,
      };
    }

    default:
      return state;
  }
}

// Context
interface ChallengeContextType {
  state: ChallengeState;
  dispatch: React.Dispatch<ChallengeAction>;
  isLoading: boolean;

  // Actions
  completeOnboarding: () => void;
  startChallenge: () => void;
  resetChallenge: (reason?: string) => void;

  // Task updates
  updateWorkout: (workoutNum: 1 | 2, data: Partial<WorkoutEntry>) => void;
  addWater: (oz: number) => void;
  addPages: (pages: number) => void;
  setBookTitle: (title: string) => void;
  toggleDiet: () => void;
  setPhoto: (uri: string) => void;
  updateNotes: (notes: string) => void;

  // Settings
  setDay: (day: number) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  importData: (data: ChallengeState) => void;
  exportData: () => string;

  // Computed
  getTaskCompletion: () => {
    diet: boolean;
    workouts: boolean;
    water: boolean;
    reading: boolean;
    photo: boolean;
  };
  getWorkoutGapInfo: () => { canStartSecond: boolean; timeRemaining: number | null };
}

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

// Provider component
export function ChallengeProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(challengeReducer, initialState);
  const [isLoading, setIsLoading] = React.useState(true);

  // Load saved state on mount
  useEffect(() => {
    async function loadState() {
      const savedState = await loadChallengeState();
      if (savedState) {
        dispatch({ type: 'LOAD_STATE', payload: savedState });
        dispatch({ type: 'CHECK_DAY_TRANSITION' });
      }
      setIsLoading(false);
    }
    loadState();
  }, []);

  // Save state whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveChallengeState(state);
    }
  }, [state, isLoading]);

  // Actions
  const completeOnboarding = useCallback(() => {
    dispatch({ type: 'COMPLETE_ONBOARDING' });
  }, []);

  const startChallenge = useCallback(() => {
    dispatch({ type: 'START_CHALLENGE' });
  }, []);

  const resetChallenge = useCallback((reason?: string) => {
    dispatch({ type: 'RESET_CHALLENGE', payload: reason });
  }, []);

  const updateWorkout = useCallback((workoutNum: 1 | 2, data: Partial<WorkoutEntry>) => {
    dispatch({ type: 'UPDATE_WORKOUT', payload: { workoutNum, data } });
  }, []);

  const addWater = useCallback((oz: number) => {
    dispatch({ type: 'ADD_WATER', payload: oz });
  }, []);

  const addPages = useCallback((pages: number) => {
    dispatch({ type: 'ADD_PAGES', payload: pages });
  }, []);

  const setBookTitle = useCallback((title: string) => {
    dispatch({ type: 'UPDATE_TODAY', payload: { bookTitle: title } });
  }, []);

  const toggleDiet = useCallback(() => {
    const current = state.todayProgress?.dietFollowed || false;
    dispatch({ type: 'UPDATE_TODAY', payload: { dietFollowed: !current } });
  }, [state.todayProgress?.dietFollowed]);

  const setPhoto = useCallback((uri: string) => {
    dispatch({ type: 'SET_PHOTO', payload: uri });
  }, []);

  const updateNotes = useCallback((notes: string) => {
    dispatch({ type: 'UPDATE_TODAY', payload: { notes } });
  }, []);

  // Settings
  const setDay = useCallback((day: number) => {
    dispatch({ type: 'SET_DAY', payload: day });
  }, []);

  const updateSettings = useCallback((settings: Partial<UserSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }, []);

  const importData = useCallback((data: ChallengeState) => {
    dispatch({ type: 'IMPORT_DATA', payload: data });
  }, []);

  const exportData = useCallback(() => {
    return JSON.stringify(state, null, 2);
  }, [state]);

  // Computed values
  const getTaskCompletion = useCallback(() => {
    const day = state.todayProgress;
    if (!day) {
      return { diet: false, workouts: false, water: false, reading: false, photo: false };
    }
    return {
      diet: day.dietFollowed,
      workouts: areWorkoutsComplete(day),
      water: day.waterOz >= WATER_GOAL_OZ,
      reading: day.pagesRead >= READING_GOAL_PAGES,
      photo: day.photoUri !== null,
    };
  }, [state.todayProgress]);

  const getWorkoutGapInfo = useCallback(() => {
    const day = state.todayProgress;
    if (!day?.workout1.endTime) {
      return { canStartSecond: true, timeRemaining: null };
    }

    const w1End = new Date(day.workout1.endTime).getTime();
    const now = Date.now();
    const hoursSinceFirst = (now - w1End) / (1000 * 60 * 60);

    if (hoursSinceFirst >= WORKOUT_GAP_HOURS) {
      return { canStartSecond: true, timeRemaining: null };
    }

    const msRemaining = (WORKOUT_GAP_HOURS * 60 * 60 * 1000) - (now - w1End);
    return { canStartSecond: false, timeRemaining: Math.ceil(msRemaining / 60000) };
  }, [state.todayProgress]);

  return (
    <ChallengeContext.Provider
      value={{
        state,
        dispatch,
        isLoading,
        completeOnboarding,
        startChallenge,
        resetChallenge,
        updateWorkout,
        addWater,
        addPages,
        setBookTitle,
        toggleDiet,
        setPhoto,
        updateNotes,
        setDay,
        updateSettings,
        importData,
        exportData,
        getTaskCompletion,
        getWorkoutGapInfo,
      }}
    >
      {children}
    </ChallengeContext.Provider>
  );
}

// Custom hook
export function useChallenge() {
  const context = useContext(ChallengeContext);
  if (context === undefined) {
    throw new Error('useChallenge must be used within a ChallengeProvider');
  }
  return context;
}
