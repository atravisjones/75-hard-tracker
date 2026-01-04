import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useChallenge } from '@/context/ChallengeContext';
import { Header } from '@/components/Header';
import { TaskSummary } from '@/components/TaskSummary';
import { DietCard } from '@/components/DietCard';
import { WorkoutCard } from '@/components/WorkoutCard';
import { WaterTracker } from '@/components/WaterTracker';
import { ReadingTracker } from '@/components/ReadingTracker';
import { PhotoCard } from '@/components/PhotoCard';
import { NotesSection } from '@/components/NotesSection';
import { StickyProgressHeader } from '@/components/StickyProgressHeader';
import { CHALLENGE_DAYS, MILESTONES } from '@/constants/challenge';

function OnboardingScreen() {
  const { startChallenge, completeOnboarding } = useChallenge();
  const router = useRouter();

  const handleStart = () => {
    completeOnboarding();
    startChallenge();
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View className="items-center mb-8 mt-8">
          <View className="flex-row items-center mb-4">
            <View className="bg-white rounded-lg p-3 mr-2">
              <Text className="text-black text-4xl">♠️</Text>
            </View>
            <Text className="text-white text-5xl font-bold">75</Text>
          </View>
          <Text className="text-accent text-4xl font-bold">HARD</Text>
          <Text className="text-gray-400 text-lg mt-2">Mental Toughness Program</Text>
        </View>

        {/* Rules */}
        <View className="bg-dark-300 rounded-2xl p-6 mb-6">
          <Text className="text-white text-xl font-bold mb-4">
            The 5 Daily Tasks
          </Text>
          <Text className="text-gray-400 mb-4">
            Complete ALL tasks every day for 75 days. Miss one? Start over at Day 1.
          </Text>

          <View className="gap-4">
            <TaskRule
              icon="📸"
              title="Take a Progress Photo"
              desc="Document your journey daily"
            />
            <TaskRule
              icon="💧"
              title="Drink 1 Gallon of Water"
              desc="128 oz throughout the day"
            />
            <TaskRule
              icon="💪"
              title="Two 45-min Workouts"
              desc="One must be outdoors, 3+ hours apart"
            />
            <TaskRule
              icon="📖"
              title="Read 10 Pages"
              desc="Non-fiction / self-development"
            />
            <TaskRule
              icon="🥗"
              title="Follow a Diet"
              desc="No cheat meals, no alcohol"
            />
          </View>
        </View>

        {/* Warning */}
        <View className="bg-accent/20 rounded-xl p-4 mb-8">
          <Text className="text-accent text-center font-semibold">
            ⚠️ No modifications. No substitutions. No excuses.
          </Text>
        </View>

        {/* Start Button */}
        <Pressable
          onPress={handleStart}
          className="bg-accent py-5 rounded-xl active:bg-accent-dark"
        >
          <Text className="text-white text-center text-xl font-bold">
            Start 75 Hard Challenge
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function TaskRule({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <View className="flex-row items-center">
      <View className="w-12 h-12 bg-dark-400 rounded-full items-center justify-center mr-4">
        <Text className="text-xl">{icon}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-white font-semibold">{title}</Text>
        <Text className="text-gray-500 text-sm">{desc}</Text>
      </View>
    </View>
  );
}

// Minimized completed task card
function CompletedTaskCard({ icon, title }: { icon: string; title: string }) {
  return (
    <View className="bg-dark-300/60 rounded-xl px-4 py-3 mb-2 flex-row items-center justify-between">
      <View className="flex-row items-center">
        <View className="w-8 h-8 bg-accent rounded-full items-center justify-center mr-3">
          <Text className="text-sm">{icon}</Text>
        </View>
        <Text className="text-gray-400 font-medium">{title}</Text>
      </View>
      <Text className="text-accent font-bold">✓</Text>
    </View>
  );
}

function DashboardScreen() {
  const { state, getTaskCompletion } = useChallenge();
  const router = useRouter();
  const [showStickyHeader, setShowStickyHeader] = useState(false);

  const completion = getTaskCompletion();

  // Check for milestone
  const isMilestone = MILESTONES.includes(state.currentDay);
  const isComplete = state.currentDay >= CHALLENGE_DAYS && state.todayProgress?.completed;

  // Handle scroll to show/hide sticky header
  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowStickyHeader(offsetY > 200);
  }, []);

  // Separate completed and incomplete tasks
  const taskComponents = [
    { id: 'photo', done: completion.photo, icon: '📸', title: 'Photo', component: <PhotoCard key="photo" /> },
    { id: 'water', done: completion.water, icon: '💧', title: 'Water', component: <WaterTracker key="water" /> },
    { id: 'workout1', done: state.todayProgress?.workout1?.completed && (state.todayProgress?.workout1?.duration || 0) >= 45, icon: '💪', title: 'Workout 1', component: <WorkoutCard key="workout1" workoutNum={1} /> },
    { id: 'workout2', done: state.todayProgress?.workout2?.completed && (state.todayProgress?.workout2?.duration || 0) >= 45, icon: '💪', title: 'Workout 2', component: <WorkoutCard key="workout2" workoutNum={2} /> },
    { id: 'reading', done: completion.reading, icon: '📖', title: 'Reading', component: <ReadingTracker key="reading" /> },
    { id: 'diet', done: completion.diet, icon: '🥗', title: 'Diet', component: <DietCard key="diet" /> },
  ];

  const incompleteTasks = taskComponents.filter(t => !t.done);
  const completedTasks = taskComponents.filter(t => t.done);

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Sticky Header */}
      <StickyProgressHeader visible={showStickyHeader} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <Header />

        {/* Milestone Banner */}
        {isMilestone && (
          <View className="bg-accent/20 rounded-xl p-4 mb-4">
            <Text className="text-accent text-center font-bold text-lg">
              🎉 Day {state.currentDay} Milestone!
            </Text>
          </View>
        )}

        {/* Completion Banner */}
        {isComplete && (
          <View className="bg-accent rounded-xl p-6 mb-4">
            <Text className="text-white text-center font-bold text-2xl mb-2">
              🏆 CHALLENGE COMPLETE! 🏆
            </Text>
            <Text className="text-white text-center">
              You've completed 75 Hard!
            </Text>
          </View>
        )}

        {/* Task Summary */}
        <TaskSummary />

        {/* Incomplete Tasks First */}
        {incompleteTasks.map(task => task.component)}

        {/* Completed Tasks Section */}
        {completedTasks.length > 0 && (
          <View className="mt-2 mb-4">
            <Text className="text-gray-500 text-sm font-medium mb-2 ml-1">
              COMPLETED ({completedTasks.length})
            </Text>
            {completedTasks.map(task => (
              <CompletedTaskCard key={task.id} icon={task.icon} title={task.title} />
            ))}
          </View>
        )}

        {/* Notes Section */}
        <NotesSection />
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

  // Show onboarding if not completed
  if (!state.hasCompletedOnboarding) {
    return <OnboardingScreen />;
  }

  // Show start screen if challenge hasn't begun
  if (!state.startDate || state.currentDay === 0) {
    return <OnboardingScreen />;
  }

  return <DashboardScreen />;
}
