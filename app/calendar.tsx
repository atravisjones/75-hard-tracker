import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useChallenge } from '@/context/ChallengeContext';
import { formatDate, getDayOfWeek } from '@/utils/dateUtils';
import { CHALLENGE_DAYS } from '@/constants/challenge';

export default function CalendarScreen() {
  const { state } = useChallenge();
  const router = useRouter();
  const { history, currentDay } = state;

  // Create array of 75 days
  const days = Array.from({ length: CHALLENGE_DAYS }, (_, i) => i + 1);

  // Get day status
  const getDayStatus = (dayNum: number) => {
    if (dayNum > currentDay) return 'future';
    if (dayNum === currentDay) return 'current';

    const dayRecord = history[dayNum - 1];
    if (!dayRecord) return 'missed';
    return dayRecord.completed ? 'complete' : 'incomplete';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-green-600';
      case 'incomplete':
        return 'bg-red-600';
      case 'current':
        return 'bg-accent';
      case 'future':
        return 'bg-dark-400';
      default:
        return 'bg-dark-400';
    }
  };

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
          <Text className="text-accent text-2xl font-bold">CALENDAR</Text>
          <View className="w-10" />
        </View>

        {/* Progress Stats */}
        <View className="bg-dark-300 rounded-xl p-4 mb-6 flex-row justify-around">
          <View className="items-center">
            <Text className="text-accent text-3xl font-bold">{currentDay}</Text>
            <Text className="text-gray-500 text-xs">Current Day</Text>
          </View>
          <View className="w-px bg-dark-400" />
          <View className="items-center">
            <Text className="text-green-500 text-3xl font-bold">
              {history.filter((d) => d.completed).length}
            </Text>
            <Text className="text-gray-500 text-xs">Completed</Text>
          </View>
          <View className="w-px bg-dark-400" />
          <View className="items-center">
            <Text className="text-white text-3xl font-bold">
              {CHALLENGE_DAYS - currentDay}
            </Text>
            <Text className="text-gray-500 text-xs">Remaining</Text>
          </View>
        </View>

        {/* Legend */}
        <View className="flex-row justify-center gap-6 mb-6">
          <View className="flex-row items-center">
            <View className="w-4 h-4 rounded bg-green-600 mr-2" />
            <Text className="text-gray-400 text-sm">Complete</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-4 h-4 rounded bg-red-600 mr-2" />
            <Text className="text-gray-400 text-sm">Incomplete</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-4 h-4 rounded bg-accent mr-2" />
            <Text className="text-gray-400 text-sm">Today</Text>
          </View>
        </View>

        {/* Calendar Grid */}
        <View className="flex-row flex-wrap justify-center gap-2">
          {days.map((day) => {
            const status = getDayStatus(day);
            const statusColor = getStatusColor(status);

            return (
              <View
                key={day}
                className={`w-10 h-10 rounded-lg items-center justify-center ${statusColor}`}
              >
                <Text
                  className={`font-bold ${
                    status === 'future' ? 'text-gray-600' : 'text-white'
                  }`}
                >
                  {day}
                </Text>
              </View>
            );
          })}
        </View>

        {/* History Details */}
        <View className="mt-8">
          <Text className="text-white text-xl font-bold mb-4">Recent Days</Text>
          {history
            .slice()
            .reverse()
            .slice(0, 7)
            .map((day, index) => {
              const dayNum = history.length - index;
              return (
                <View
                  key={day.date}
                  className={`bg-dark-300 rounded-xl p-4 mb-3 ${
                    day.completed ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
                  }`}
                >
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text className="text-white font-bold">Day {dayNum}</Text>
                      <Text className="text-gray-500 text-sm">
                        {getDayOfWeek(day.date)}, {formatDate(day.date)}
                      </Text>
                    </View>
                    <View
                      className={`px-3 py-1 rounded-full ${
                        day.completed ? 'bg-green-600' : 'bg-red-600'
                      }`}
                    >
                      <Text className="text-white text-xs font-bold">
                        {day.completed ? 'COMPLETE' : 'INCOMPLETE'}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
