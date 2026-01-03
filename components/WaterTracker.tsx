import { View, Text, Pressable } from 'react-native';
import { useChallenge } from '@/context/ChallengeContext';
import { WATER_GOAL_OZ } from '@/constants/challenge';

export function WaterTracker() {
  const { state, addWater, getTaskCompletion } = useChallenge();
  const waterOz = state.todayProgress?.waterOz || 0;
  const { water: isComplete } = getTaskCompletion();
  const progress = Math.min((waterOz / WATER_GOAL_OZ) * 100, 100);

  // Get custom bottle size from settings (default 16oz)
  const bottleSize = state.userSettings?.waterBottleSize || 16;

  return (
    <View className="bg-dark-300 rounded-2xl p-5 mb-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Text className="text-2xl mr-2">💧</Text>
          <View>
            <Text className="text-white text-lg font-semibold">Water Intake</Text>
            <Text className="text-gray-500 text-sm">{WATER_GOAL_OZ} oz goal</Text>
          </View>
        </View>
        {isComplete && (
          <View className="bg-accent rounded-full px-3 py-1">
            <Text className="text-white text-xs font-bold">DONE</Text>
          </View>
        )}
      </View>

      {/* Progress Display */}
      <View className="items-center mb-4">
        <Text className={`text-5xl font-bold ${isComplete ? 'text-accent' : 'text-white'}`}>
          {waterOz}
        </Text>
        <Text className="text-gray-500 text-lg">oz of {WATER_GOAL_OZ} oz</Text>
      </View>

      {/* Progress Bar */}
      <View className="h-4 bg-dark-400 rounded-full overflow-hidden mb-5">
        <View
          className={`h-full rounded-full ${isComplete ? 'bg-accent' : 'bg-blue-500'}`}
          style={{ width: `${progress}%` }}
        />
      </View>

      {/* Increment Buttons */}
      <View className="flex-row justify-center gap-4">
        <Pressable
          onPress={() => addWater(-bottleSize)}
          className="bg-dark-400 w-14 h-14 rounded-full items-center justify-center active:bg-dark-200"
        >
          <Text className="text-white text-lg">-{bottleSize}</Text>
        </Pressable>

        <Pressable
          onPress={() => addWater(bottleSize)}
          className="bg-blue-600 w-20 h-20 rounded-full items-center justify-center active:bg-blue-700"
        >
          <Text className="text-white text-2xl font-bold">+{bottleSize}</Text>
        </Pressable>

        <Pressable
          onPress={() => addWater(8)}
          className="bg-blue-600/70 w-14 h-14 rounded-full items-center justify-center active:bg-blue-700"
        >
          <Text className="text-white text-lg font-bold">+8</Text>
        </Pressable>
      </View>

      {/* Quick info */}
      <Text className="text-gray-600 text-xs text-center mt-4">
        {Math.max(0, WATER_GOAL_OZ - waterOz)} oz remaining • Bottle: {bottleSize}oz
      </Text>
    </View>
  );
}
