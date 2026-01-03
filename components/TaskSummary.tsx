import { View, Text } from 'react-native';
import { useChallenge } from '@/context/ChallengeContext';
import { DAILY_TASKS } from '@/constants/challenge';

export function TaskSummary() {
  const { getTaskCompletion } = useChallenge();
  const completion = getTaskCompletion();

  const tasks = [
    { id: 'diet', icon: '🥗', label: 'Diet', done: completion.diet },
    { id: 'workouts', icon: '💪', label: 'Workouts', done: completion.workouts },
    { id: 'water', icon: '💧', label: 'Water', done: completion.water },
    { id: 'reading', icon: '📖', label: 'Reading', done: completion.reading },
    { id: 'photo', icon: '📸', label: 'Photo', done: completion.photo },
  ];

  const completedCount = tasks.filter((t) => t.done).length;
  const allDone = completedCount === tasks.length;

  return (
    <View className="bg-dark-300 rounded-2xl p-5 mb-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-white text-lg font-semibold">Today's Progress</Text>
        <View className={`px-3 py-1 rounded-full ${allDone ? 'bg-accent' : 'bg-dark-400'}`}>
          <Text className="text-white text-sm font-bold">{completedCount}/5</Text>
        </View>
      </View>

      {/* Task Icons Row */}
      <View className="flex-row justify-between">
        {tasks.map((task) => (
          <View key={task.id} className="items-center">
            <View
              className={`w-14 h-14 rounded-full items-center justify-center mb-2 ${
                task.done ? 'bg-accent' : 'bg-dark-400'
              }`}
            >
              <Text className="text-2xl">{task.icon}</Text>
            </View>
            <Text className={`text-xs ${task.done ? 'text-accent' : 'text-gray-500'}`}>
              {task.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Completion Message */}
      {allDone && (
        <View className="mt-4 bg-accent/20 rounded-lg p-3">
          <Text className="text-accent text-center font-bold">
            🎉 All tasks complete! Great job!
          </Text>
        </View>
      )}
    </View>
  );
}
