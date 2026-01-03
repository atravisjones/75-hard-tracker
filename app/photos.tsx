import { View, Text, ScrollView, Pressable, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useChallenge } from '@/context/ChallengeContext';
import { formatDate } from '@/utils/dateUtils';

const { width } = Dimensions.get('window');
const PHOTO_SIZE = (width - 48) / 3;

export default function PhotosScreen() {
  const { state } = useChallenge();
  const router = useRouter();

  // Get all photos from history
  const photosWithDates = state.history
    .filter((day) => day.photoUri)
    .map((day, index) => ({
      uri: day.photoUri!,
      date: day.date,
      dayNum: index + 1,
    }))
    .reverse();

  const firstPhoto = photosWithDates.length > 0 ? photosWithDates[photosWithDates.length - 1] : null;
  const latestPhoto = photosWithDates.length > 0 ? photosWithDates[0] : null;

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Pressable onPress={() => router.back()} className="p-2">
            <Text className="text-white text-2xl">←</Text>
          </Pressable>
          <Text className="text-accent text-2xl font-bold">PROGRESS PHOTOS</Text>
          <View className="w-10" />
        </View>

        {/* Comparison View */}
        {firstPhoto && latestPhoto && photosWithDates.length > 1 && (
          <View className="mb-6">
            <Text className="text-white text-lg font-bold mb-3">Comparison</Text>
            <View className="flex-row gap-2">
              <View className="flex-1">
                <Image
                  source={{ uri: firstPhoto.uri }}
                  className="w-full h-48 rounded-xl bg-dark-300"
                  resizeMode="cover"
                />
                <Text className="text-gray-400 text-center text-sm mt-2">
                  Day 1
                </Text>
              </View>
              <View className="flex-1">
                <Image
                  source={{ uri: latestPhoto.uri }}
                  className="w-full h-48 rounded-xl bg-dark-300"
                  resizeMode="cover"
                />
                <Text className="text-gray-400 text-center text-sm mt-2">
                  Day {latestPhoto.dayNum}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Stats */}
        <View className="bg-dark-300 rounded-xl p-4 mb-6">
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-accent text-3xl font-bold">{photosWithDates.length}</Text>
              <Text className="text-gray-500 text-sm">Photos Taken</Text>
            </View>
            <View className="w-px bg-dark-400" />
            <View className="items-center">
              <Text className="text-white text-3xl font-bold">
                {state.history.filter((d) => !d.photoUri).length}
              </Text>
              <Text className="text-gray-500 text-sm">Days Missed</Text>
            </View>
          </View>
        </View>

        {/* Gallery */}
        <Text className="text-white text-lg font-bold mb-3">All Photos</Text>
        {photosWithDates.length === 0 ? (
          <View className="bg-dark-300 rounded-xl p-8 items-center">
            <Text className="text-4xl mb-4">📷</Text>
            <Text className="text-white font-semibold">No photos yet</Text>
            <Text className="text-gray-500 text-sm mt-1">
              Start taking daily progress photos!
            </Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap gap-2">
            {photosWithDates.map((photo, index) => (
              <Pressable
                key={photo.date}
                className="relative"
                style={{ width: PHOTO_SIZE, height: PHOTO_SIZE }}
              >
                <Image
                  source={{ uri: photo.uri }}
                  className="w-full h-full rounded-lg bg-dark-300"
                  resizeMode="cover"
                />
                <View className="absolute bottom-0 left-0 right-0 bg-black/60 rounded-b-lg p-1">
                  <Text className="text-white text-xs text-center">
                    Day {photo.dayNum}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {/* Take Photo Button */}
        <Pressable
          onPress={() => router.push('/camera')}
          className="bg-accent py-4 rounded-xl mt-6"
        >
          <Text className="text-white text-center font-bold text-lg">
            📸 Take Today's Photo
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
