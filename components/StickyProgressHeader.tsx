import { View, Text, Animated } from 'react-native';
import { useChallenge } from '@/context/ChallengeContext';

interface StickyProgressHeaderProps {
  visible: boolean;
}

export function StickyProgressHeader({ visible }: StickyProgressHeaderProps) {
  const { getTaskCompletion, state } = useChallenge();
  const completion = getTaskCompletion();

  const tasks = [
    { id: 'diet', icon: '🥗', done: completion.diet },
    { id: 'workouts', icon: '💪', done: completion.workouts },
    { id: 'water', icon: '💧', done: completion.water },
    { id: 'reading', icon: '📖', done: completion.reading },
    { id: 'photo', icon: '📸', done: completion.photo },
  ];

  const completedCount = tasks.filter((t) => t.done).length;

  if (!visible) return null;

  return (
    <View className="absolute top-0 left-0 right-0 z-50 bg-black/95 border-b border-dark-400 px-4 py-2">
      <View className="flex-row items-center justify-between">
        {/* Day indicator */}
        <View className="flex-row items-center">
          <Text className="text-white font-bold text-sm">Day {state.currentDay}</Text>
          <Text className="text-gray-500 text-xs ml-2">{completedCount}/5</Text>
        </View>

        {/* Mini task icons */}
        <View className="flex-row items-center gap-2">
          {tasks.map((task) => (
            <View
              key={task.id}
              className={`w-8 h-8 rounded-full items-center justify-center ${
                task.done ? 'bg-accent' : 'bg-dark-400'
              }`}
            >
              <Text className="text-sm">{task.icon}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
