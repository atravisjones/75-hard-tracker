import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { useChallenge } from '@/context/ChallengeContext';
import { WorkoutEntry, WORKOUT_TYPES } from '@/types';
import { WORKOUT_DURATION_MINUTES, WORKOUT_GAP_HOURS } from '@/constants/challenge';

interface WorkoutCardProps {
  workoutNum: 1 | 2;
}

export function WorkoutCard({ workoutNum }: WorkoutCardProps) {
  const { state, updateWorkout, getWorkoutGapInfo } = useChallenge();
  const workout = workoutNum === 1 ? state.todayProgress?.workout1 : state.todayProgress?.workout2;
  const otherWorkout = workoutNum === 1 ? state.todayProgress?.workout2 : state.todayProgress?.workout1;

  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const gapInfo = getWorkoutGapInfo();

  // Timer logic
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = () => {
    if (!workout) return;
    updateWorkout(workoutNum, { startTime: new Date().toISOString() });
    setIsTimerRunning(true);
  };

  const handleStopTimer = () => {
    if (!workout) return;
    const duration = Math.floor(elapsedSeconds / 60);
    updateWorkout(workoutNum, {
      endTime: new Date().toISOString(),
      duration,
      completed: duration >= WORKOUT_DURATION_MINUTES,
    });
    setIsTimerRunning(false);
  };

  const handleMarkComplete = () => {
    if (!workout) return;
    updateWorkout(workoutNum, {
      completed: true,
      duration: WORKOUT_DURATION_MINUTES,
      endTime: new Date().toISOString(),
    });
  };

  const handleToggleOutdoor = () => {
    if (!workout) return;
    updateWorkout(workoutNum, { isOutdoor: !workout.isOutdoor });
  };

  const handleSelectType = (type: string) => {
    updateWorkout(workoutNum, { type });
    setShowTypeModal(false);
  };

  const isComplete = workout?.completed && workout?.duration >= WORKOUT_DURATION_MINUTES;
  const progress = Math.min(((workout?.duration || 0) / WORKOUT_DURATION_MINUTES) * 100, 100);

  // Check if this workout can start (for workout 2, need 3hr gap)
  const canStart = workoutNum === 1 || gapInfo.canStartSecond;

  return (
    <View className="bg-dark-300 rounded-2xl p-5 mb-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Text className="text-2xl mr-2">💪</Text>
          <View>
            <Text className="text-white text-lg font-semibold">
              Workout {workoutNum}
            </Text>
            <Text className="text-gray-500 text-sm">{WORKOUT_DURATION_MINUTES} min required</Text>
          </View>
        </View>
        {isComplete && (
          <View className="bg-accent rounded-full px-3 py-1">
            <Text className="text-white text-xs font-bold">DONE</Text>
          </View>
        )}
      </View>

      {/* Timer Display */}
      {!isComplete && (
        <View className="items-center mb-4">
          <Text className={`text-5xl font-mono font-bold ${isTimerRunning ? 'text-accent' : 'text-white'}`}>
            {isTimerRunning ? formatTime(elapsedSeconds) : formatTime((workout?.duration || 0) * 60)}
          </Text>
        </View>
      )}

      {/* Progress Bar */}
      {!isComplete && (
        <View className="h-2 bg-dark-400 rounded-full overflow-hidden mb-4">
          <View
            className="h-full bg-accent rounded-full"
            style={{ width: `${progress}%` }}
          />
        </View>
      )}

      {/* Timer Controls */}
      {!isComplete && (
        <View className="flex-row justify-center gap-3 mb-4">
          {!isTimerRunning ? (
            <>
              <Pressable
                onPress={handleStartTimer}
                disabled={!canStart}
                className={`px-6 py-3 rounded-xl ${canStart ? 'bg-accent active:bg-accent-dark' : 'bg-gray-700'}`}
              >
                <Text className="text-white font-bold">Start Timer</Text>
              </Pressable>
              <Pressable
                onPress={handleMarkComplete}
                disabled={!canStart}
                className={`px-6 py-3 rounded-xl ${canStart ? 'bg-green-600 active:bg-green-700' : 'bg-gray-700'}`}
              >
                <Text className="text-white font-bold">✓ Completed</Text>
              </Pressable>
            </>
          ) : (
            <Pressable
              onPress={handleStopTimer}
              className="bg-accent px-8 py-3 rounded-xl active:bg-accent-dark"
            >
              <Text className="text-white font-bold text-lg">Stop ({formatTime(elapsedSeconds)})</Text>
            </Pressable>
          )}
        </View>
      )}

      {/* Completed workout info */}
      {isComplete && (
        <View className="items-center mb-4">
          <Text className="text-accent text-3xl font-bold">{workout?.duration} min</Text>
          <Text className="text-gray-500">completed</Text>
        </View>
      )}

      {/* Options Row */}
      <View className="flex-row justify-between">
        {/* Outdoor Toggle */}
        <Pressable
          onPress={handleToggleOutdoor}
          className={`flex-1 mr-2 py-3 rounded-xl items-center ${
            workout?.isOutdoor ? 'bg-green-600' : 'bg-dark-400'
          }`}
        >
          <Text className="text-white">
            {workout?.isOutdoor ? '🌳 Outdoor' : '🏠 Indoor'}
          </Text>
        </Pressable>

        {/* Workout Type */}
        <Pressable
          onPress={() => setShowTypeModal(true)}
          className="flex-1 ml-2 py-3 rounded-xl items-center bg-dark-400"
        >
          <Text className="text-white">{workout?.type || 'Select Type'}</Text>
        </Pressable>
      </View>

      {/* Type Selection Modal */}
      <Modal visible={showTypeModal} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-dark-200 rounded-t-3xl p-6">
            <Text className="text-white text-xl font-bold mb-4 text-center">
              Workout Type
            </Text>
            {WORKOUT_TYPES.map((type) => (
              <Pressable
                key={type}
                onPress={() => handleSelectType(type)}
                className="py-4 border-b border-dark-400"
              >
                <Text className={`text-lg text-center ${workout?.type === type ? 'text-accent' : 'text-white'}`}>
                  {type}
                </Text>
              </Pressable>
            ))}
            <Pressable
              onPress={() => setShowTypeModal(false)}
              className="mt-4 py-4 bg-dark-400 rounded-xl"
            >
              <Text className="text-white text-center font-bold">Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
