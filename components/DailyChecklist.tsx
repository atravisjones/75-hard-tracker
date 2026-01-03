import { View, Text, Pressable } from 'react-native';
import { useChallenge } from '@/context/ChallengeContext';
import { DAILY_TASKS } from '@/constants/challenge';
import { DayProgress } from '@/types';

interface TaskRowProps {
  checked: boolean;
  onPress: () => void;
  label: string;
}

function TaskRow({ checked, onPress, label }: TaskRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center py-4 border-b border-dark-400"
    >
      {/* Circular Checkbox */}
      <View
        className={`w-10 h-10 rounded-full border-2 items-center justify-center mr-4 ${
          checked
            ? 'bg-accent border-accent'
            : 'border-gray-600 bg-transparent'
        }`}
      >
        {checked && (
          <Text className="text-white text-lg font-bold">✓</Text>
        )}
      </View>

      {/* Label with strikethrough when checked */}
      <View className="flex-1">
        <Text
          className={`text-lg ${
            checked ? 'text-gray-500 line-through' : 'text-white'
          }`}
        >
          {label}
        </Text>
        <View className="flex-row items-center mt-1">
          <Text className="text-gray-600 text-sm mr-1">⊕</Text>
          <Text className="text-gray-600 text-sm">Add Reminder</Text>
        </View>
      </View>
    </Pressable>
  );
}

export function DailyChecklist() {
  const { state, updateTask } = useChallenge();
  const { todayProgress } = state;

  if (!todayProgress) {
    return null;
  }

  const handleToggle = (taskId: keyof DayProgress) => {
    const currentValue = todayProgress[taskId];
    updateTask(taskId, !currentValue);
  };

  return (
    <View>
      {DAILY_TASKS.map((task) => (
        <TaskRow
          key={task.id}
          checked={todayProgress[task.id] as boolean}
          onPress={() => handleToggle(task.id)}
          label={task.label}
        />
      ))}
    </View>
  );
}
