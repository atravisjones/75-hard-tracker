import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useChallenge } from '@/context/ChallengeContext';
import { TaskItem } from '@/components/TaskItem';
import { ReminderModal } from '@/components/ReminderModal';
import { CHALLENGE_DAYS, WATER_GOAL_OZ, READING_GOAL_PAGES, WORKOUT_DURATION_MINUTES, MILESTONES } from '@/constants/challenge';

function OnboardingScreen() {
  const { startChallenge, completeOnboarding } = useChallenge();

  const handleStart = () => {
    completeOnboarding();
    startChallenge();
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24, justifyContent: 'center', flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View className="items-center mb-12">
          <View className="flex-row items-center mb-2">
            <View className="bg-white rounded-lg p-3 mr-2">
              <Text className="text-black text-3xl">♠️</Text>
            </View>
            <Text className="text-white text-5xl font-bold">75</Text>
          </View>
          <Text className="text-accent text-2xl font-bold tracking-widest">HARD</Text>
        </View>

        {/* Tagline */}
        <Text className="text-white text-2xl font-bold text-center mb-2">
          Track your daily
        </Text>
        <Text className="text-white text-2xl font-bold text-center mb-8">
          75 Hard tasks.
        </Text>

        {/* Task Preview */}
        <View className="bg-dark-200 border border-dark-400 rounded-xl p-4 mb-8">
          {['Follow a Diet', '2 Workouts (45 min)', 'Drink 1 Gallon', 'Read 10 Pages', 'Progress Photo'].map((task, i) => (
            <View key={i} className="flex-row items-center py-2">
              <View className="w-6 h-6 rounded border-2 border-accent mr-3" />
              <Text className="text-gray-400">{task}</Text>
            </View>
          ))}
        </View>

        {/* Start Button */}
        <Pressable
          onPress={handleStart}
          className="bg-accent py-4 rounded-xl active:bg-accent-dark"
        >
          <Text className="text-white text-center text-lg font-bold">
            Start Challenge
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function DashboardScreen() {
  const { state, toggleDiet, updateWorkout, addWater, addPages, updateNotes, getTaskCompletion } = useChallenge();
  const router = useRouter();
  const [reminderModal, setReminderModal] = useState<{ visible: boolean; taskName: string }>({ visible: false, taskName: '' });

  const completion = getTaskCompletion();
  const workout1 = state.todayProgress?.workout1;
  const workout2 = state.todayProgress?.workout2;
  const waterOz = state.todayProgress?.waterOz || 0;
  const pagesRead = state.todayProgress?.pagesRead || 0;
  const notes = state.todayProgress?.notes || '';
  const bottleSize = state.userSettings?.waterBottleSize || 16;

  const workout1Complete = workout1?.completed && (workout1?.duration || 0) >= WORKOUT_DURATION_MINUTES;
  const workout2Complete = workout2?.completed && (workout2?.duration || 0) >= WORKOUT_DURATION_MINUTES;

  const isMilestone = MILESTONES.includes(state.currentDay);
  const isComplete = state.currentDay >= CHALLENGE_DAYS && state.todayProgress?.completed;

  const handleWorkout1Toggle = () => {
    if (!workout1Complete) {
      updateWorkout(1, { completed: true, duration: WORKOUT_DURATION_MINUTES, endTime: new Date().toISOString() });
    }
  };

  const handleWorkout2Toggle = () => {
    if (!workout2Complete) {
      updateWorkout(2, { completed: true, duration: WORKOUT_DURATION_MINUTES, endTime: new Date().toISOString() });
    }
  };

  const openReminder = (taskName: string) => {
    setReminderModal({ visible: true, taskName });
  };

  const completedCount = [completion.diet, completion.workouts, completion.water, completion.reading, completion.photo].filter(Boolean).length;

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4">
          <View className="flex-row items-center">
            <View className="bg-white rounded-lg p-1.5 mr-2">
              <Text className="text-black text-lg">♠️</Text>
            </View>
            <Text className="text-white text-2xl font-bold">75</Text>
          </View>

          <Text className="text-accent text-3xl font-black tracking-wider">
            DAY {state.currentDay || 1}
          </Text>

          <Pressable onPress={() => router.push('/calendar')} className="p-2">
            <View className="border-2 border-white rounded p-1">
              <View className="flex-row">
                <View className="w-1.5 h-1.5 border border-white m-0.5" />
                <View className="w-1.5 h-1.5 border border-white m-0.5" />
              </View>
              <View className="flex-row">
                <View className="w-1.5 h-1.5 border border-white m-0.5" />
                <View className="w-1.5 h-1.5 border border-white m-0.5" />
              </View>
            </View>
          </Pressable>
        </View>

        {/* Milestone Banner */}
        {isMilestone && (
          <View className="mx-4 mb-4 bg-accent/20 border border-accent rounded-xl p-3">
            <Text className="text-accent text-center font-bold">
              🎉 Day {state.currentDay} Milestone!
            </Text>
          </View>
        )}

        {/* Challenge Complete Banner */}
        {isComplete && (
          <View className="mx-4 mb-4 bg-accent rounded-xl p-4">
            <Text className="text-white text-center font-bold text-xl">
              🏆 CHALLENGE COMPLETE! 🏆
            </Text>
          </View>
        )}

        {/* Progress Bar */}
        <View className="px-4 mb-4">
          <View className="h-1.5 bg-dark-400 rounded-full overflow-hidden">
            <View
              className="h-full bg-accent rounded-full"
              style={{ width: `${(completedCount / 5) * 100}%` }}
            />
          </View>
          <Text className="text-gray-500 text-xs mt-2 text-right">{completedCount}/5 completed</Text>
        </View>

        {/* Task List */}
        <View className="px-4">
          {/* First Workout */}
          <TaskItem
            icon="💪"
            title="First Workout"
            subtitle={`${WORKOUT_DURATION_MINUTES} min • ${workout1?.isOutdoor ? '🌳 Outdoor' : '🏠 Indoor'}`}
            time={workout1?.endTime ? new Date(workout1.endTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : undefined}
            completed={workout1Complete}
            onToggle={handleWorkout1Toggle}
            onReminderPress={() => openReminder('First Workout')}
          />

          {/* Second Workout */}
          <TaskItem
            icon="🏃"
            title="Second Workout"
            subtitle={`${WORKOUT_DURATION_MINUTES} min • ${workout2?.isOutdoor ? '🌳 Outdoor' : '🏠 Indoor'}`}
            time={workout2?.endTime ? new Date(workout2.endTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : undefined}
            completed={workout2Complete}
            onToggle={handleWorkout2Toggle}
            onReminderPress={() => openReminder('Second Workout')}
          />

          {/* Progress Photo */}
          <TaskItem
            icon="📸"
            title="Take Progress Picture"
            subtitle="Daily photo required"
            completed={completion.photo}
            onToggle={() => router.push('/camera')}
            onReminderPress={() => openReminder('Progress Picture')}
          />

          {/* Reading */}
          <View className="bg-dark-200 border border-dark-400 rounded-xl mb-3 overflow-hidden">
            <View className="flex-row items-center p-4">
              <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
                completion.reading ? 'bg-accent' : 'bg-accent/20 border border-accent'
              }`}>
                <Text className="text-lg">📖</Text>
              </View>
              <View className="flex-1">
                <Text className={`text-base font-semibold ${completion.reading ? 'text-gray-500 line-through' : 'text-white'}`}>
                  {READING_GOAL_PAGES} Pages of Reading
                </Text>
                <Text className="text-gray-500 text-sm">{pagesRead} / {READING_GOAL_PAGES} pages</Text>
              </View>
              <View className="flex-row items-center mr-3">
                <Pressable onPress={() => addPages(-1)} className="bg-dark-400 w-8 h-8 rounded-full items-center justify-center">
                  <Text className="text-white font-bold">−</Text>
                </Pressable>
                <Text className="text-white mx-3 font-bold min-w-[24px] text-center">{pagesRead}</Text>
                <Pressable onPress={() => addPages(1)} className="bg-accent w-8 h-8 rounded-full items-center justify-center">
                  <Text className="text-white font-bold">+</Text>
                </Pressable>
              </View>
              <Pressable onPress={() => !completion.reading && addPages(READING_GOAL_PAGES - pagesRead)}>
                <View className={`w-7 h-7 rounded border-2 items-center justify-center ${
                  completion.reading ? 'bg-accent border-accent' : 'border-accent'
                }`}>
                  {completion.reading && <Text className="text-white text-sm font-bold">✓</Text>}
                </View>
              </Pressable>
            </View>
          </View>

          {/* Water */}
          <View className="bg-dark-200 border border-dark-400 rounded-xl mb-3 overflow-hidden">
            <View className="flex-row items-center p-4">
              <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
                completion.water ? 'bg-accent' : 'bg-accent/20 border border-accent'
              }`}>
                <Text className="text-lg">💧</Text>
              </View>
              <View className="flex-1">
                <Text className={`text-base font-semibold ${completion.water ? 'text-gray-500 line-through' : 'text-white'}`}>
                  Drink a Gallon of Water
                </Text>
                <Text className="text-gray-500 text-sm">{waterOz} / {WATER_GOAL_OZ} oz</Text>
              </View>
              <View className="flex-row items-center mr-3">
                <Pressable onPress={() => addWater(-bottleSize)} className="bg-dark-400 px-2 h-8 rounded-full items-center justify-center">
                  <Text className="text-white text-xs">−{bottleSize}</Text>
                </Pressable>
                <Pressable onPress={() => addWater(bottleSize)} className="bg-accent px-2 h-8 rounded-full items-center justify-center ml-2">
                  <Text className="text-white text-xs">+{bottleSize}</Text>
                </Pressable>
              </View>
              <Pressable onPress={() => !completion.water && addWater(WATER_GOAL_OZ - waterOz)}>
                <View className={`w-7 h-7 rounded border-2 items-center justify-center ${
                  completion.water ? 'bg-accent border-accent' : 'border-accent'
                }`}>
                  {completion.water && <Text className="text-white text-sm font-bold">✓</Text>}
                </View>
              </Pressable>
            </View>
          </View>

          {/* Follow Diet */}
          <TaskItem
            icon="🥗"
            title="Follow a Diet"
            subtitle="No cheat meals"
            completed={completion.diet}
            onToggle={toggleDiet}
            showReminder={false}
          />

          {/* No Alcohol */}
          <TaskItem
            icon="🚫"
            title="No Cheat Meals or Alcohol"
            subtitle="Stay disciplined"
            completed={completion.diet}
            onToggle={toggleDiet}
            showReminder={false}
          />
        </View>

        {/* Notes Section */}
        <View className="px-4 mt-4">
          <View className="bg-dark-200 border border-dark-400 rounded-xl p-4">
            <Text className="text-gray-500 text-sm mb-2 font-semibold">NOTE:</Text>
            <TextInput
              className="text-gray-400 text-sm"
              placeholder="Make notes of any challenges, insights, or breakthroughs..."
              placeholderTextColor="#4b5563"
              multiline
              numberOfLines={3}
              value={notes}
              onChangeText={updateNotes}
              style={{ minHeight: 60, textAlignVertical: 'top' }}
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0 bg-dark-200 border-t border-dark-400">
        <SafeAreaView edges={['bottom']}>
          <View className="flex-row justify-around py-3">
            <NavButton icon="🏠" label="Today" active onPress={() => {}} />
            <NavButton icon="📅" label="Calendar" onPress={() => router.push('/calendar')} />
            <NavButton icon="📸" label="Photos" onPress={() => router.push('/photos')} />
            <NavButton icon="📊" label="Stats" onPress={() => router.push('/stats')} />
            <NavButton icon="⚙️" label="Settings" onPress={() => router.push('/settings')} />
          </View>
        </SafeAreaView>
      </View>

      {/* Reminder Modal */}
      <ReminderModal
        visible={reminderModal.visible}
        taskName={reminderModal.taskName}
        onClose={() => setReminderModal({ visible: false, taskName: '' })}
        onSave={(days, hour, minute, isPM) => {
          console.log('Reminder set:', { days, hour, minute, isPM });
        }}
      />
    </SafeAreaView>
  );
}

function NavButton({
  icon,
  label,
  active,
  onPress,
}: {
  icon: string;
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="items-center px-4">
      <Text className="text-xl mb-1">{icon}</Text>
      <Text className={`text-xs ${active ? 'text-accent' : 'text-gray-500'}`}>{label}</Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const { state, isLoading } = useChallenge();

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#E63946" />
      </SafeAreaView>
    );
  }

  if (!state.hasCompletedOnboarding || !state.startDate || state.currentDay === 0) {
    return <OnboardingScreen />;
  }

  return <DashboardScreen />;
}
