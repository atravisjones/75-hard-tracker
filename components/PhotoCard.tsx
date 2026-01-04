import { View, Text, Pressable, Image, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useChallenge } from '@/context/ChallengeContext';

export function PhotoCard() {
  const { state, setPhoto } = useChallenge();
  const router = useRouter();
  const photoUri = state.todayProgress?.photoUri;
  const hasPhoto = photoUri !== null;

  // Direct gallery picker for native platforms
  const pickFromGallery = async () => {
    if (Platform.OS === 'web') {
      // On web, go to camera screen which handles file input
      router.push('/camera');
      return;
    }

    try {
      const ImagePicker = await import('expo-image-picker');

      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Gallery access permission is needed to select photos.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [3, 4],
      });

      if (!result.canceled && result.assets[0]) {
        setPhoto(result.assets[0].uri);
        Alert.alert(
          'Photo Selected!',
          "Today's progress photo has been set.",
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to open gallery. Please try again.');
    }
  };

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
        <View>
          {/* Action Buttons */}
          <View className="flex-row gap-2 mb-3">
            {/* Take Photo Button */}
            <Pressable
              onPress={() => router.push('/camera')}
              className="flex-1 bg-accent rounded-xl py-4 items-center justify-center"
            >
              <Text className="text-2xl mb-1">📷</Text>
              <Text className="text-white font-semibold text-sm">Take Photo</Text>
            </Pressable>

            {/* Upload from Gallery Button */}
            <Pressable
              onPress={pickFromGallery}
              className="flex-1 bg-dark-400 rounded-xl py-4 items-center justify-center border-2 border-dashed border-gray-600"
            >
              <Text className="text-2xl mb-1">🖼️</Text>
              <Text className="text-white font-semibold text-sm">
                {Platform.OS === 'web' ? 'Choose File' : 'From Gallery'}
              </Text>
            </Pressable>
          </View>

          {/* Info text */}
          <Text className="text-gray-500 text-xs text-center mb-3">
            Take a new photo or upload an existing one from your gallery
          </Text>
        </View>
      )}

      {/* View all photos link */}
      <Pressable
        onPress={() => router.push('/photos')}
        className="mt-1 py-3 bg-dark-400 rounded-xl"
      >
        <Text className="text-white text-center">View All Progress Photos</Text>
      </Pressable>
    </View>
  );
}
