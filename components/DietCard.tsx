import { View, Text, Pressable } from 'react-native';
import { useChallenge } from '@/context/ChallengeContext';

export function DietCard() {
  const { state, toggleDiet } = useChallenge();
  const dietFollowed = state.todayProgress?.dietFollowed || false;

  return (
    <View className="bg-dark-300 rounded-2xl p-5 mb-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <Text className="text-2xl mr-3">🥗</Text>
          <View className="flex-1">
            <Text className="text-white text-lg font-semibold">Follow Diet</Text>
            <Text className="text-gray-500 text-sm">No cheat meals, no alcohol</Text>
          </View>
        </View>

        <Pressable
          onPress={toggleDiet}
          className={`w-16 h-16 rounded-full items-center justify-center ${
            dietFollowed ? 'bg-accent' : 'bg-dark-400 border-2 border-gray-600'
          }`}
        >
          {dietFollowed && (
            <Text className="text-white text-2xl font-bold">✓</Text>
          )}
        </Pressable>
      </View>

      {dietFollowed && (
        <View className="mt-4 bg-accent/20 rounded-lg p-3">
          <Text className="text-accent text-center font-medium">
            Great job staying on track! 💪
          </Text>
        </View>
      )}
    </View>
  );
}
