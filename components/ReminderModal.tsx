import { View, Text, Pressable, Modal } from 'react-native';
import { useState } from 'react';

interface ReminderModalProps {
  visible: boolean;
  onClose: () => void;
  taskName: string;
  onSave: (days: string[], hour: number, minute: number, isPM: boolean) => void;
}

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = ['00', '15', '30', '45'];

export function ReminderModal({ visible, onClose, taskName, onSave }: ReminderModalProps) {
  const [selectedDays, setSelectedDays] = useState<boolean[]>([true, true, true, true, true, true, true]);
  const [hour, setHour] = useState(8);
  const [minute, setMinute] = useState('00');
  const [isPM, setIsPM] = useState(false);

  const toggleDay = (index: number) => {
    const newDays = [...selectedDays];
    newDays[index] = !newDays[index];
    setSelectedDays(newDays);
  };

  const handleSave = () => {
    const days = DAYS.filter((_, i) => selectedDays[i]);
    onSave(days, hour, parseInt(minute), isPM);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/80 justify-center items-center px-6">
        <View className="bg-dark-200 rounded-2xl w-full max-w-sm overflow-hidden">
          {/* Header */}
          <View className="bg-dark-300 px-5 py-4 border-b border-dark-400">
            <Text className="text-white text-lg font-semibold text-center">
              Reminder: {taskName}
            </Text>
          </View>

          {/* Days Selection */}
          <View className="px-5 py-4">
            <Text className="text-gray-500 text-sm mb-3">Every Day</Text>
            <View className="flex-row justify-between">
              {DAYS.map((day, index) => (
                <Pressable
                  key={index}
                  onPress={() => toggleDay(index)}
                  className={`w-9 h-9 rounded-full items-center justify-center ${
                    selectedDays[index] ? 'bg-accent' : 'bg-dark-400'
                  }`}
                >
                  <Text className={`text-sm font-semibold ${
                    selectedDays[index] ? 'text-white' : 'text-gray-500'
                  }`}>
                    {day}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Time Selection */}
          <View className="px-5 py-4 border-t border-dark-400">
            <Text className="text-gray-500 text-sm mb-3">Time</Text>

            <View className="flex-row items-center justify-center gap-2">
              {/* Hour */}
              <View className="bg-dark-400 rounded-xl px-4 py-3">
                <Pressable onPress={() => setHour(h => h < 12 ? h + 1 : 1)}>
                  <Text className="text-white text-3xl font-bold text-center w-12">
                    {hour}
                  </Text>
                </Pressable>
              </View>

              <Text className="text-white text-3xl font-bold">:</Text>

              {/* Minute */}
              <View className="bg-dark-400 rounded-xl px-4 py-3">
                <Pressable onPress={() => {
                  const idx = MINUTES.indexOf(minute);
                  setMinute(MINUTES[(idx + 1) % MINUTES.length]);
                }}>
                  <Text className="text-white text-3xl font-bold text-center w-12">
                    {minute}
                  </Text>
                </Pressable>
              </View>

              {/* AM/PM */}
              <View className="bg-dark-400 rounded-xl overflow-hidden">
                <Pressable
                  onPress={() => setIsPM(false)}
                  className={`px-3 py-2 ${!isPM ? 'bg-accent' : ''}`}
                >
                  <Text className={`text-sm font-bold ${!isPM ? 'text-white' : 'text-gray-500'}`}>
                    AM
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setIsPM(true)}
                  className={`px-3 py-2 ${isPM ? 'bg-accent' : ''}`}
                >
                  <Text className={`text-sm font-bold ${isPM ? 'text-white' : 'text-gray-500'}`}>
                    PM
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View className="flex-row border-t border-dark-400">
            <Pressable
              onPress={onClose}
              className="flex-1 py-4 items-center border-r border-dark-400"
            >
              <Text className="text-gray-500 font-semibold">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              className="flex-1 py-4 items-center bg-accent"
            >
              <Text className="text-white font-semibold">Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
