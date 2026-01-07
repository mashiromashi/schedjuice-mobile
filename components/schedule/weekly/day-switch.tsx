import { Pressable, View } from 'react-native';
import { WeekDay } from './top-calender';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

interface DaySwitchProps {
  day: WeekDay;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  isSelected: boolean;
}

export default function DaySwitch({
  day,
  selectedDate,
  setSelectedDate,
  isSelected,
}: DaySwitchProps) {
  return (
    <Pressable
      accessibilityLabel={`Select ${day.weekday}`}
      onPress={() => setSelectedDate(day.date)}
      className={` ${isSelected ? 'border bg-summary-green/70 dark:border-[#166534]' : 'border-neutral-800 bg-neutral-800/60'} rounded-lg px-1 py-2`}>
      <Text className={cn('text-center', isSelected && 'text-white')}>{day.weekday}</Text>
      <Text className={cn('text-center', isSelected && 'text-white')}>{day.dayNumber}</Text>
    </Pressable>
  );
}
