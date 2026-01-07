import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { addDays, addWeeks, format, isSameDay, startOfWeek, type WeekOptions } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useScheduleStore } from '@/store/schedule';
import DaySwitch from './day-switch';

export type WeekDay = {
  date: Date;
  iso: string;
  weekday: string;
  dayNumber: string;
  isToday: boolean;
};

const WEEK_OPTIONS: WeekOptions = { weekStartsOn: 1 };
const DAYS_IN_WEEK = 7;

function buildWeek(referenceDate: Date): WeekDay[] {
  const start = startOfWeek(referenceDate, WEEK_OPTIONS);

  return Array.from({ length: DAYS_IN_WEEK }, (_, index) => {
    const date = addDays(start, index);

    return {
      date,
      iso: format(date, 'yyyy-MM-dd'),
      weekday: format(date, 'EEE'),
      dayNumber: format(date, 'd'),
      isToday: isSameDay(date, new Date()),
    };
  });
}

export default function TopCalender() {
  const [anchorDate, setAnchorDate] = useState(new Date());
  const { selectedDate, setSelectedDate } = useScheduleStore();

  const weekDays = useMemo(() => buildWeek(anchorDate), [anchorDate]);

  const handleSelectDay = (date: Date) => {
    setSelectedDate(date);
  };

  const handleShiftWeek = (offset: number) => {
    setAnchorDate((current) => addWeeks(current, offset));
  };

  return (
    <View className="w-full flex-row items-center px-0 py-3 shadow-sm shadow-black/5">
      <Pressable
        accessibilityLabel="Previous week"
        accessibilityRole="button"
        className=""
        hitSlop={8}
        onPress={() => handleShiftWeek(-1)}>
        <Icon as={ChevronLeftIcon} className="text-muted-foreground" size={24} />
      </Pressable>

      <View className="flex-1 flex-row justify-between">
        {weekDays.map((day) => {
          const isSelected = isSameDay(day.date, selectedDate);
          return (
            <View key={day.iso} className="mx-0.5 flex-1">
              <DaySwitch
                day={day}
                isSelected={isSelected}
                selectedDate={selectedDate}
                setSelectedDate={handleSelectDay}
              />
            </View>
          );
        })}
      </View>

      <Pressable
        accessibilityLabel="Next week"
        accessibilityRole="button"
        className=""
        hitSlop={8}
        onPress={() => handleShiftWeek(1)}>
        <Icon as={ChevronRightIcon} className="text-muted-foreground" size={24} />
      </Pressable>
    </View>
  );
}
