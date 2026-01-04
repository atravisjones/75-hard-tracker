import { View, Text, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useChallenge } from '@/context/ChallengeContext';

export function PhotoCard() {
  const { state } = useChallenge();
  const router = useRouter();
  const photoUri = state.todayProgress?.photoUri;
  const hasPhoto = photoUri !== null;

  return (
    <View className="bg-dark-300 rounded-2xl p-5 mb-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Text className="text-2xl mr-2">📸</Text>
          <View>
            <Text className="text-white text-lg font-semibold">Progress Photo</Text>
            <Text className="text-gray-500 text-sm">Daily photo required</Text>
          </View>
        </View>
        {hasPhoto && (
          <View className="bg-accent rounded-full px-3 py-1">
            <Text className="text-white text-xs font-bold">DONE</Text>
          </View>
        )}
      </View>

      {/* Photo Preview or Take Photo Button */}
      {hasPhoto ? (
        <Pressable
          onPress={() => router.push('/photos')}
          className="rounded-xl overflow-hidden"
        >
          <Image
            source={{ uri: photoUri }}
            className="w-full h-48 bg-dark-400"
            resizeMode="cover"
          />
          <View className="absolute bottom-0 left-0 right-0 bg-black/50 py-2">
            <Text className="text-white text-center text-sm">
              Tap to view gallery →
            </Text>
          </View>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => router.push('/camera')}
          className="bg-dark-400 rounded-xl h-48 items-center justify-center border-2 border-dashed border-gray-600"
        >
          <Text className="text-4xl mb-2">📷</Text>
          <Text className="text-white font-semibold">Add Today's Photo</Text>
          <Text className="text-gray-500 text-sm mt-1">Take photo or upload from gallery</Text>
        </Pressable>
      )}

      {/* View all photos link */}
      <Pressable
        onPress={() => router.push('/photos')}
        className="mt-4 py-3 bg-dark-400 rounded-xl"
      >
        <Text className="text-white text-center">View All Progress Photos</Text>
      </Pressable>
    </View>
  );
}
