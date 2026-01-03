import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useChallenge } from '@/context/ChallengeContext';
import { CHALLENGE_DAYS, WATER_GOAL_OZ } from '@/constants/challenge';

export default function StatsScreen() {
  const { state } = useChallenge();
  const router = useRouter();

  // Safe access with fallbacks
  const history = state.history || [];
  const attempts = state.attempts || [];

  const completedDays = history.filter((d) => d.completed).length;
  const progressPercent = Math.round((state.currentDay / CHALLENGE_DAYS) * 100);

  // Calculate averages
  const totalWater = history.reduce((sum, d) => sum + (d.waterOz || 0), 0);
  const totalPages = history.reduce((sum, d) => sum + (d.pagesRead || 0), 0);
  const totalWorkouts = history.reduce(
    (sum, d) => sum + (d.workout1?.completed ? 1 : 0) + (d.workout2?.completed ? 1 : 0),
    0
  );
  const avgWater = history.length > 0 ? Math.round(totalWater / history.length) : 0;
  const avgPages = history.length > 0 ? Math.round(totalPages / history.length) : 0;

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
          <Text className="text-accent text-2xl font-bold">STATISTICS</Text>
          <View className="w-10" />
        </View>

        {/* Main Progress */}
        <View className="bg-dark-300 rounded-2xl p-6 mb-4">
          <Text className="text-gray-500 text-center mb-2">Challenge Progress</Text>
          <Text className="text-accent text-6xl font-bold text-center">
            {progressPercent}%
          </Text>
          <View className="h-4 bg-dark-400 rounded-full overflow-hidden mt-4 mb-2">
            <View
              className="h-full bg-accent rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </View>
          <Text className="text-gray-500 text-center">
            Day {state.currentDay} of {CHALLENGE_DAYS}
          </Text>
        </View>

        {/* Quick Stats Grid */}
        <View className="flex-row gap-3 mb-4">
          <StatCard
            icon="🔥"
            value={state.streak.toString()}
            label="Current Streak"
            color="text-orange-500"
          />
          <StatCard
            icon="✅"
            value={completedDays.toString()}
            label="Days Complete"
            color="text-green-500"
          />
        </View>

        {/* Totals Section */}
        <View className="bg-dark-300 rounded-2xl p-5 mb-4">
          <Text className="text-white text-lg font-bold mb-4">Total Stats</Text>

          <View className="gap-4">
            <StatRow
              icon="💪"
              label="Workouts Completed"
              value={`${totalWorkouts} workouts`}
            />
            <StatRow
              icon="💧"
              label="Water Consumed"
              value={`${totalWater} oz (${Math.round(totalWater / 128)} gallons)`}
            />
            <StatRow
              icon="📖"
              label="Pages Read"
              value={`${totalPages} pages`}
            />
            <StatRow
              icon="📸"
              label="Photos Taken"
              value={`${history.filter((d) => d.photoUri).length} photos`}
            />
          </View>
        </View>

        {/* Averages Section */}
        <View className="bg-dark-300 rounded-2xl p-5 mb-4">
          <Text className="text-white text-lg font-bold mb-4">Daily Averages</Text>

          <View className="gap-4">
            <StatRow
              icon="💧"
              label="Water per Day"
              value={`${avgWater} oz`}
              target={`Goal: ${WATER_GOAL_OZ} oz`}
            />
            <StatRow
              icon="📖"
              label="Pages per Day"
              value={`${avgPages} pages`}
              target="Goal: 10 pages"
            />
          </View>
        </View>

        {/* Attempt History */}
        {attempts.length > 0 && (
          <View className="bg-dark-300 rounded-2xl p-5">
            <Text className="text-white text-lg font-bold mb-4">Previous Attempts</Text>

            {attempts.map((attempt, index) => (
              <View
                key={attempt.id}
                className="flex-row justify-between items-center py-3 border-b border-dark-400"
              >
                <View>
                  <Text className="text-white">Attempt {index + 1}</Text>
                  <Text className="text-gray-500 text-sm">{attempt.reason}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-accent font-bold">
                    {attempt.daysCompleted} days
                  </Text>
                  <Text className="text-gray-500 text-xs">{attempt.startDate}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: string;
  value: string;
  label: string;
  color: string;
}) {
  return (
    <View className="flex-1 bg-dark-300 rounded-xl p-4 items-center">
      <Text className="text-2xl mb-2">{icon}</Text>
      <Text className={`text-3xl font-bold ${color}`}>{value}</Text>
      <Text className="text-gray-500 text-sm">{label}</Text>
    </View>
  );
}

function StatRow({
  icon,
  label,
  value,
  target,
}: {
  icon: string;
  label: string;
  value: string;
  target?: string;
}) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center">
        <Text className="text-xl mr-3">{icon}</Text>
        <Text className="text-gray-400">{label}</Text>
      </View>
      <View className="items-end">
        <Text className="text-white font-semibold">{value}</Text>
        {target && <Text className="text-gray-600 text-xs">{target}</Text>}
      </View>
    </View>
  );
}
