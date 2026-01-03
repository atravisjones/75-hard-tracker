import { useRef } from 'react';
import { View, Text, Pressable, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useChallenge } from '@/context/ChallengeContext';

// Camera screen - uses file picker on all platforms
// Full camera functionality requires running on a physical device via Expo Go
export default function CameraScreen() {
  const router = useRouter();
  const { setPhoto } = useChallenge();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Web: use native file input
  const handleWebFileSelect = (event: any) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setPhoto(dataUrl);
        Alert.alert(
          'Photo Selected!',
          "Today's progress photo has been set.",
          [{ text: 'OK', onPress: () => router.back() }]
        );
      };
      reader.readAsDataURL(file);
    }
  };

  // Native: use expo-image-picker (dynamically imported)
  const pickFromGallery = async () => {
    if (Platform.OS === 'web') {
      fileInputRef.current?.click();
      return;
    }

    try {
      const ImagePicker = await import('expo-image-picker');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        allowsEditing: true,
        aspect: [3, 4],
      });

      if (!result.canceled && result.assets[0]) {
        setPhoto(result.assets[0].uri);
        Alert.alert(
          'Photo Selected!',
          "Today's progress photo has been set.",
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to open gallery. Please try again.');
    }
  };

  // Native: use device camera via expo-image-picker
  const takePhoto = async () => {
    if (Platform.OS === 'web') {
      // On web, fall back to file picker
      fileInputRef.current?.click();
      return;
    }

    try {
      const ImagePicker = await import('expo-image-picker');

      // Request camera permission
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Camera permission is needed to take photos.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
        allowsEditing: true,
        aspect: [3, 4],
      });

      if (!result.canceled && result.assets[0]) {
        setPhoto(result.assets[0].uri);
        Alert.alert(
          'Photo Saved!',
          "Today's progress photo has been captured.",
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to open camera. Please try again.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Hidden file input for web */}
      {Platform.OS === 'web' && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleWebFileSelect}
          style={{ display: 'none' }}
        />
      )}

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <Pressable
          onPress={() => router.back()}
          className="w-12 h-12 rounded-full bg-dark-300 items-center justify-center"
        >
          <Text className="text-white text-2xl">✕</Text>
        </Pressable>
        <Text className="text-white text-xl font-bold">Progress Photo</Text>
        <View className="w-12" />
      </View>

      {/* Main Content */}
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-6xl mb-6">📸</Text>
        <Text className="text-white text-2xl font-bold text-center mb-2">
          Add Today's Photo
        </Text>
        <Text className="text-gray-400 text-center mb-8">
          {Platform.OS === 'web'
            ? 'Upload a photo from your device'
            : 'Take a new photo or choose from your gallery'}
        </Text>

        {/* Action Buttons */}
        <View className="w-full gap-4">
          {/* Take Photo Button (Native only shows camera option) */}
          <Pressable
            onPress={takePhoto}
            className="bg-accent py-4 rounded-xl flex-row items-center justify-center"
          >
            <Text className="text-2xl mr-3">📷</Text>
            <Text className="text-white font-bold text-lg">
              {Platform.OS === 'web' ? 'Choose Photo' : 'Take Photo'}
            </Text>
          </Pressable>

          {/* Gallery Button (Native only) */}
          {Platform.OS !== 'web' && (
            <Pressable
              onPress={pickFromGallery}
              className="bg-dark-300 py-4 rounded-xl flex-row items-center justify-center"
            >
              <Text className="text-2xl mr-3">🖼️</Text>
              <Text className="text-white font-bold text-lg">Choose from Gallery</Text>
            </Pressable>
          )}
        </View>

        {/* Tips */}
        <View className="mt-8 bg-dark-300 rounded-xl p-4 w-full">
          <Text className="text-accent font-bold mb-2">Photo Tips:</Text>
          <Text className="text-gray-400 text-sm">• Take full body photos for best comparison</Text>
          <Text className="text-gray-400 text-sm">• Use consistent lighting and pose</Text>
          <Text className="text-gray-400 text-sm">• Take photos at the same time each day</Text>
        </View>
      </View>

      {/* Cancel Button */}
      <View className="px-6 pb-6">
        <Pressable
          onPress={() => router.back()}
          className="py-4"
        >
          <Text className="text-gray-500 text-center font-semibold">Cancel</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
