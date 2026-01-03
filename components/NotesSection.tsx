import { View, Text, TextInput } from 'react-native';
import { useChallenge } from '@/context/ChallengeContext';

export function NotesSection() {
  const { state, updateNotes } = useChallenge();
  const notes = state.todayProgress?.notes || '';

  return (
    <View className="mt-6 pt-4">
      <Text className="text-white text-xl font-bold mb-2">NOTES:</Text>
      <View className="border-t border-gray-700 pt-4">
        <TextInput
          className="text-gray-400 text-base min-h-[100px]"
          placeholder="Make notes of any challenges, insights, or breakthroughs you achieve."
          placeholderTextColor="#6b7280"
          value={notes}
          onChangeText={updateNotes}
          multiline
          textAlignVertical="top"
        />
      </View>
    </View>
  );
}
