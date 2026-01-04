import { View, Text, Pressable } from 'react-native';
import { useState } from 'react';

interface TaskItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  time?: string;
  completed: boolean;
  onToggle: () => void;
  onReminderPress?: () => void;
  showReminder?: boolean;
}

export function TaskItem({
  icon,
  title,
  subtitle,
  time,
  completed,
  onToggle,
  onReminderPress,
  showReminder = true,
}: TaskItemProps) {
  return (
    <View className="bg-dark-200 border border-dark-400 rounded-xl mb-3 overflow-hidden">
      <Pressable
        onPress={onToggle}
        className="flex-row items-center p-4 active:bg-dark-300"
      >
        {/* Icon Circle */}
        <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
          completed ? 'bg-accent' : 'bg-accent/20 border border-accent'
        }`}>
          <Text className="text-lg">{icon}</Text>
        </View>

        {/* Content */}
        <View className="flex-1">
          <Text className={`text-base font-semibold ${
            completed ? 'text-gray-500 line-through' : 'text-white'
          }`}>
            {title}
          </Text>
          {subtitle && (
            <Text className="text-gray-500 text-sm mt-0.5">{subtitle}</Text>
          )}
          {time && (
            <View className="flex-row items-center mt-1">
              <Text className="text-accent text-xs">⏰ {time}</Text>
            </View>
          )}
        </View>

        {/* Checkbox */}
        <View className={`w-7 h-7 rounded border-2 items-center justify-center ${
          completed ? 'bg-accent border-accent' : 'border-accent'
        }`}>
          {completed && (
            <Text className="text-white text-sm font-bold">✓</Text>
          )}
        </View>
      </Pressable>

      {/* Reminder Row */}
      {showReminder && onReminderPress && (
        <Pressable
          onPress={onReminderPress}
          className="flex-row items-center px-4 py-2 border-t border-dark-400 bg-dark-300/50"
        >
          <Text className="text-accent text-xs mr-2">⏰</Text>
          <Text className="text-gray-500 text-xs">Set Reminder</Text>
        </Pressable>
      )}
    </View>
  );
}
