import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { ChallengeProvider } from '@/context/ChallengeContext';
import '@/global.css';

export default function RootLayout() {
  return (
    <ChallengeProvider>
      <View className="flex-1 bg-black">
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#000000' },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="history" />
          <Stack.Screen name="calendar" />
          <Stack.Screen name="photos" />
          <Stack.Screen name="stats" />
          <Stack.Screen name="settings" />
          <Stack.Screen
            name="camera"
            options={{
              animation: 'slide_from_bottom',
              presentation: 'fullScreenModal',
            }}
          />
        </Stack>
      </View>
    </ChallengeProvider>
  );
}
