import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useChallenge } from '@/context/ChallengeContext';

export function Header() {
  const { state } = useChallenge();
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between py-4 px-2">
      {/* 75 Logo with Spade */}
      <View className="flex-row items-center">
        <View className="bg-white rounded-lg p-2">
          <Text className="text-black text-2xl font-bold">♠️</Text>
        </View>
        <Text className="text-white text-3xl font-bold ml-1">75</Text>
      </View>

      {/* Day Counter */}
      <Text className="text-accent text-4xl font-bold tracking-wider">
        DAY {state.currentDay || 1}
      </Text>

      {/* Calendar/Grid Icon */}
      <Pressable
        onPress={() => router.push('/history')}
        className="p-2"
      >
        <View className="border-2 border-white rounded p-1">
          <View className="flex-row">
            <View className="w-2 h-2 border border-white m-0.5" />
            <View className="w-2 h-2 border border-white m-0.5" />
          </View>
          <View className="flex-row">
            <View className="w-2 h-2 border border-white m-0.5" />
            <View className="w-2 h-2 border border-white m-0.5" />
          </View>
        </View>
      </Pressable>
    </View>
  );
}
