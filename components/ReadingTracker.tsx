import { View, Text, Pressable, TextInput } from 'react-native';
import { useChallenge } from '@/context/ChallengeContext';
import { READING_GOAL_PAGES } from '@/constants/challenge';

export function ReadingTracker() {
  const { state, addPages, setBookTitle, getTaskCompletion } = useChallenge();
  const pagesRead = state.todayProgress?.pagesRead || 0;
  const bookTitle = state.todayProgress?.bookTitle || '';
  const { reading: isComplete } = getTaskCompletion();
  const progress = Math.min((pagesRead / READING_GOAL_PAGES) * 100, 100);

  return (
    <View className="bg-dark-300 rounded-2xl p-5 mb-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Text className="text-2xl mr-2">📖</Text>
          <View>
            <Text className="text-white text-lg font-semibold">Reading</Text>
            <Text className="text-gray-500 text-sm">{READING_GOAL_PAGES} pages minimum</Text>
          </View>
        </View>
        {isComplete && (
          <View className="bg-accent rounded-full px-3 py-1">
            <Text className="text-white text-xs font-bold">DONE</Text>
          </View>
        )}
      </View>

      {/* Page Count Display */}
      <View className="items-center mb-4">
        <Text className={`text-5xl font-bold ${isComplete ? 'text-accent' : 'text-white'}`}>
          {pagesRead}
        </Text>
        <Text className="text-gray-500 text-lg">pages read today</Text>
      </View>

      {/* Progress Bar */}
      <View className="h-3 bg-dark-400 rounded-full overflow-hidden mb-5">
        <View
          className={`h-full rounded-full ${isComplete ? 'bg-accent' : 'bg-purple-500'}`}
          style={{ width: `${progress}%` }}
        />
      </View>

      {/* Page Counter Buttons */}
      <View className="flex-row justify-center items-center gap-6 mb-5">
        <Pressable
          onPress={() => addPages(-5)}
          className="bg-dark-400 w-14 h-14 rounded-full items-center justify-center active:bg-dark-200"
        >
          <Text className="text-white text-lg">-5</Text>
        </Pressable>

        <Pressable
          onPress={() => addPages(-1)}
          className="bg-dark-400 w-12 h-12 rounded-full items-center justify-center active:bg-dark-200"
        >
          <Text className="text-white text-lg">-1</Text>
        </Pressable>

        <Pressable
          onPress={() => addPages(1)}
          className="bg-purple-600 w-12 h-12 rounded-full items-center justify-center active:bg-purple-700"
        >
          <Text className="text-white text-lg font-bold">+1</Text>
        </Pressable>

        <Pressable
          onPress={() => addPages(5)}
          className="bg-purple-600 w-14 h-14 rounded-full items-center justify-center active:bg-purple-700"
        >
          <Text className="text-white text-lg font-bold">+5</Text>
        </Pressable>

        <Pressable
          onPress={() => addPages(10)}
          className="bg-purple-600 w-16 h-16 rounded-full items-center justify-center active:bg-purple-700"
        >
          <Text className="text-white text-lg font-bold">+10</Text>
        </Pressable>
      </View>

      {/* Book Title Input */}
      <View>
        <Text className="text-gray-500 text-sm mb-2">Currently Reading (optional)</Text>
        <TextInput
          className="bg-dark-400 text-white rounded-xl px-4 py-3"
          placeholder="Enter book title..."
          placeholderTextColor="#6b7280"
          value={bookTitle}
          onChangeText={setBookTitle}
        />
      </View>

      {/* Stats */}
      <View className="flex-row justify-between mt-4 pt-4 border-t border-dark-400">
        <View>
          <Text className="text-gray-500 text-xs">Total this challenge</Text>
          <Text className="text-white font-semibold">{state.totalPagesRead} pages</Text>
        </View>
        <View className="items-end">
          <Text className="text-gray-500 text-xs">Remaining today</Text>
          <Text className="text-white font-semibold">
            {Math.max(0, READING_GOAL_PAGES - pagesRead)} pages
          </Text>
        </View>
      </View>
    </View>
  );
}
