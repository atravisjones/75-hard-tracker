import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useChallenge } from '@/context/ChallengeContext';
import { formatDate, getDayOfWeek } from '@/utils/dateUtils';
import { DayProgress } from '@/types';
import { DAILY_TASKS } from '@/constants/challenge';

interface DayCardProps {
  day: DayProgress;
  dayNumber: number;
}

function DayCard({ day, dayNumber }: DayCardProps) {
  // Count completed tasks
  const taskFields: (keyof DayProgress)[] = ['workout1', 'workout2', 'reading', 'water', 'diet', 'noAlcohol'];
  const completedTasks = taskFields.filter((field) => day[field] === true).length;
  const totalTasks = taskFields.length;

  return (
    <View className="bg-dark-300 rounded-xl p-4 mb-3">
      {/* Header */}
      <View className="flex-row justify-between items-start mb-4">
        <View>
          <Text className="text-accent text-2xl font-bold">DAY {dayNumber}</Text>
          <Text className="text-gray-500 text-sm">
            {getDayOfWeek(day.date)}, {formatDate(day.date)}
          </Text>
        </View>
        <View
          className={`px-3 py-1 rounded-full ${
            day.completed ? 'bg-accent' : 'bg-dark-400'
          }`}
        >
          <Text className="text-white text-sm font-medium">
            {completedTasks}/{totalTasks}
          </Text>
        </View>
      </View>

      {/* Tasks */}
      {DAILY_TASKS.map((task) => {
        const isChecked = day[task.id] as boolean;
        return (
          <View
            key={task.id}
            className="flex-row items-center py-2 border-b border-dark-400"
          >
            <View
              className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-3 ${
                isChecked
                  ? 'bg-accent border-accent'
                  : 'border-gray-600 bg-transparent'
              }`}
            >
              {isChecked && (
                <Text className="text-white text-xs font-bold">✓</Text>
              )}
            </View>
            <Text
              className={`text-sm ${
                isChecked ? 'text-gray-500 line-through' : 'text-white'
              }`}
            >
              {task.label}
            </Text>
          </View>
        );
      })}

      {/* Notes preview */}
      {day.notes && (
        <View className="mt-3 pt-3 border-t border-dark-400">
          <Text className="text-gray-500 text-xs uppercase mb-1">Notes</Text>
          <Text className="text-gray-400 text-sm" numberOfLines={2}>
            {day.notes}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function HistoryScreen() {
  const { state, resetChallenge } = useChallenge();
  const router = useRouter();
  const { history, currentDay, streak } = state;

  // Sort history by date descending (most recent first)
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const completedDays = history.filter((d) => d.completed).length;

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Pressable onPress={() => router.back()} className="p-2">
            <Text className="text-white text-2xl">←</Text>
          </Pressable>
          <Text className="text-accent text-2xl font-bold">HISTORY</Text>
          <View className="w-10" />
        </View>

        {/* Stats */}
        <View className="bg-dark-300 rounded-xl p-4 mb-6 flex-row justify-around">
          <View className="items-center">
            <Text className="text-gray-500 text-xs uppercase mb-1">
              Current Day
            </Text>
            <Text className="text-accent text-3xl font-bold">{currentDay}</Text>
          </View>
          <View className="w-px bg-dark-400" />
          <View className="items-center">
            <Text className="text-gray-500 text-xs uppercase mb-1">Streak</Text>
            <Text className="text-white text-3xl font-bold">{streak}</Text>
          </View>
          <View className="w-px bg-dark-400" />
          <View className="items-center">
            <Text className="text-gray-500 text-xs uppercase mb-1">
              Completed
            </Text>
            <Text className="text-white text-3xl font-bold">
              {completedDays}
            </Text>
          </View>
        </View>

        {/* History List */}
        {history.length === 0 ? (
          <View className="items-center py-12">
            <Text className="text-gray-500 text-lg">No history yet</Text>
            <Text className="text-gray-600 text-sm mt-2">
              Start your challenge to see your progress
            </Text>
          </View>
        ) : (
          sortedHistory.map((day, index) => (
            <DayCard
              key={day.date}
              day={day}
              dayNumber={history.length - index}
            />
          ))
        )}

        {/* Reset Button */}
        {history.length > 0 && (
          <Pressable
            onPress={resetChallenge}
            className="mt-6 py-4 items-center border border-accent rounded-xl"
          >
            <Text className="text-accent font-medium">Reset Challenge</Text>
          </Pressable>
        )}

        {/* Bottom padding */}
        <View className="h-4" />
      </ScrollView>
    </SafeAreaView>
  );
}
