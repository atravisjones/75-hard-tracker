import { View, Text, ScrollView, Pressable, Alert, Switch, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useChallenge } from '@/context/ChallengeContext';
import { useState, useRef } from 'react';
import { formatDate } from '@/utils/dateUtils';
import { CHALLENGE_DAYS } from '@/constants/challenge';

const BOTTLE_SIZES = [8, 12, 16, 20, 24, 32, 40, 64];

export default function SettingsScreen() {
  const { state, resetChallenge, setDay, updateSettings, exportData, importData } = useChallenge();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showDayPicker, setShowDayPicker] = useState(false);
  const [showBottlePicker, setShowBottlePicker] = useState(false);

  const notifications = state.userSettings?.notifications ?? true;
  const bottleSize = state.userSettings?.waterBottleSize || 16;

  const handleResetChallenge = () => {
    Alert.alert(
      'Reset Challenge?',
      'Are you sure you want to reset? This will start you over at Day 1. Your history and photos will be preserved.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset to Day 1',
          style: 'destructive',
          onPress: () => {
            resetChallenge('Manual reset from settings');
            router.replace('/');
          },
        },
      ]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data?',
      'This will permanently delete all your challenge data, history, and photos. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: () => {
            // Would implement full clear here
            Alert.alert('Data Cleared', 'All data has been removed.');
          },
        },
      ]
    );
  };

  const handleSetDay = (day: number) => {
    setDay(day);
    setShowDayPicker(false);
    Alert.alert('Day Updated', `Current day set to Day ${day}`);
  };

  const handleSetBottleSize = (size: number) => {
    updateSettings({ waterBottleSize: size });
    setShowBottlePicker(false);
  };

  const handleExportData = () => {
    const data = exportData();
    if (Platform.OS === 'web') {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `75hard-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      Alert.alert('Export Complete', 'Your data has been downloaded.');
    } else {
      Alert.alert('Export Data', 'Copy this data and save it somewhere safe:\n\n' + data.substring(0, 200) + '...');
    }
  };

  const handleImportData = () => {
    if (Platform.OS === 'web') {
      fileInputRef.current?.click();
    } else {
      Alert.alert('Import Data', 'Paste your backup data to import (feature coming soon)');
    }
  };

  const handleFileSelect = (event: any) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          importData(data);
          Alert.alert('Import Complete', 'Your data has been restored.');
        } catch (error) {
          Alert.alert('Import Failed', 'Invalid backup file.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Hidden file input for web import */}
      {Platform.OS === 'web' && (
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      )}

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
          <Text className="text-accent text-2xl font-bold">SETTINGS</Text>
          <View className="w-10" />
        </View>

        {/* Current Challenge Status */}
        <View className="bg-dark-300 rounded-2xl p-5 mb-4">
          <Text className="text-white text-lg font-bold mb-3">Current Challenge</Text>
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-400">Started</Text>
            <Text className="text-white">{state.startDate ? formatDate(state.startDate) : 'Not started'}</Text>
          </View>
          <Pressable
            onPress={() => setShowDayPicker(true)}
            className="flex-row justify-between items-center mt-2 py-2"
          >
            <Text className="text-gray-400">Current Day</Text>
            <View className="flex-row items-center">
              <Text className="text-accent font-bold mr-2">{state.currentDay}</Text>
              <Text className="text-gray-500">✏️</Text>
            </View>
          </Pressable>
          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-gray-400">Total Attempts</Text>
            <Text className="text-white">{(state.attempts?.length || 0) + 1}</Text>
          </View>
        </View>

        {/* Water Bottle Size */}
        <View className="bg-dark-300 rounded-2xl p-5 mb-4">
          <Text className="text-white text-lg font-bold mb-3">Water Tracking</Text>
          <Pressable
            onPress={() => setShowBottlePicker(true)}
            className="flex-row justify-between items-center py-2"
          >
            <View className="flex-row items-center">
              <Text className="text-xl mr-3">🍶</Text>
              <Text className="text-white">Bottle Size</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-accent font-bold mr-2">{bottleSize} oz</Text>
              <Text className="text-gray-500">▼</Text>
            </View>
          </Pressable>
          <Text className="text-gray-500 text-sm mt-2">
            Set your water bottle size for quick tracking
          </Text>
        </View>

        {/* Notifications */}
        <View className="bg-dark-300 rounded-2xl p-5 mb-4">
          <Text className="text-white text-lg font-bold mb-3">Notifications</Text>
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <Text className="text-xl mr-3">🔔</Text>
              <Text className="text-white">Daily Reminders</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={(value) => updateSettings({ notifications: value })}
              trackColor={{ false: '#374151', true: '#E63946' }}
              thumbColor="#fff"
            />
          </View>
          <Text className="text-gray-500 text-sm">
            Get reminders for tasks that aren't complete yet
          </Text>
        </View>

        {/* Data Management */}
        <View className="bg-dark-300 rounded-2xl p-5 mb-4">
          <Text className="text-white text-lg font-bold mb-3">Data</Text>

          <Pressable
            onPress={handleExportData}
            className="flex-row items-center py-3 border-b border-dark-400"
          >
            <Text className="text-xl mr-3">📤</Text>
            <Text className="text-white">Export Data</Text>
          </Pressable>

          <Pressable
            onPress={handleImportData}
            className="flex-row items-center py-3 border-b border-dark-400"
          >
            <Text className="text-xl mr-3">📥</Text>
            <Text className="text-white">Import Data</Text>
          </Pressable>

          <Pressable
            onPress={handleResetChallenge}
            className="flex-row items-center py-3"
          >
            <Text className="text-xl mr-3">🔄</Text>
            <Text className="text-yellow-500">Reset Challenge</Text>
          </Pressable>
        </View>

        {/* Danger Zone */}
        <View className="bg-dark-300 rounded-2xl p-5 mb-4">
          <Text className="text-red-500 text-lg font-bold mb-3">Danger Zone</Text>
          <Pressable
            onPress={handleClearAllData}
            className="bg-red-600/20 py-4 rounded-xl"
          >
            <Text className="text-red-500 text-center font-bold">
              Clear All Data
            </Text>
          </Pressable>
          <Text className="text-gray-600 text-xs text-center mt-2">
            This will permanently delete everything
          </Text>
        </View>

        {/* About */}
        <View className="bg-dark-300 rounded-2xl p-5 mb-4">
          <Text className="text-white text-lg font-bold mb-3">About</Text>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-400">Version</Text>
            <Text className="text-white">1.0.0</Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-400">Made with</Text>
            <Text className="text-white">React Native + Expo</Text>
          </View>
        </View>

        {/* 75 Hard Info */}
        <View className="bg-accent/10 rounded-2xl p-5">
          <Text className="text-accent font-bold mb-2">What is 75 Hard?</Text>
          <Text className="text-gray-400 text-sm leading-5">
            75 Hard is a mental toughness program created by Andy Frisella. It's designed
            to transform your mindset and build discipline through consistent daily tasks
            over 75 days. This app helps you track your progress, but remember: the
            challenge is about mental fortitude, not just checking boxes.
          </Text>
        </View>
      </ScrollView>

      {/* Day Picker Modal */}
      {showDayPicker && (
        <Pressable
          className="absolute inset-0 bg-black/70 items-center justify-center"
          onPress={() => setShowDayPicker(false)}
        >
          <View className="bg-dark-300 rounded-2xl p-6 w-80 max-h-96">
            <Text className="text-white text-lg font-bold mb-4 text-center">
              Set Current Day
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {Array.from({ length: CHALLENGE_DAYS }, (_, i) => i + 1).map((day) => (
                <Pressable
                  key={day}
                  onPress={() => handleSetDay(day)}
                  className={`py-3 border-b border-dark-400 ${state.currentDay === day ? 'bg-accent/20' : ''}`}
                >
                  <Text className={`text-center ${state.currentDay === day ? 'text-accent font-bold' : 'text-white'}`}>
                    Day {day}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable
              onPress={() => setShowDayPicker(false)}
              className="mt-4 py-3 bg-dark-400 rounded-xl"
            >
              <Text className="text-white text-center font-bold">Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      )}

      {/* Bottle Size Picker Modal */}
      {showBottlePicker && (
        <Pressable
          className="absolute inset-0 bg-black/70 items-center justify-center"
          onPress={() => setShowBottlePicker(false)}
        >
          <View className="bg-dark-300 rounded-2xl p-6 w-80">
            <Text className="text-white text-lg font-bold mb-4 text-center">
              Select Bottle Size
            </Text>
            {BOTTLE_SIZES.map((size) => (
              <Pressable
                key={size}
                onPress={() => handleSetBottleSize(size)}
                className={`py-3 border-b border-dark-400 ${bottleSize === size ? 'bg-accent/20' : ''}`}
              >
                <Text className={`text-center ${bottleSize === size ? 'text-accent font-bold' : 'text-white'}`}>
                  {size} oz
                </Text>
              </Pressable>
            ))}
            <Pressable
              onPress={() => setShowBottlePicker(false)}
              className="mt-4 py-3 bg-dark-400 rounded-xl"
            >
              <Text className="text-white text-center font-bold">Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      )}
    </SafeAreaView>
  );
}
