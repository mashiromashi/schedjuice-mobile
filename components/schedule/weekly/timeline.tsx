import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { TimeSlot, TimeSlotStatus } from '@/lib/timeslot';
import { useScheduleStore } from '@/store/schedule';
import { format, isSameDay } from 'date-fns';
import { Clock } from 'lucide-react-native';
import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { getSlotStatus } from '@/lib/helpers/time-slot';

const START_HOUR = 1;
const END_HOUR = 24;
const HOUR_BLOCK_HEIGHT = 50;
const MIN_SLOT_HEIGHT = 30;

const HOURS = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, index) => START_HOUR + index);
const TOTAL_TIMELINE_MINUTES = (END_HOUR - START_HOUR) * 60;
const TIMELINE_HEIGHT = (END_HOUR - START_HOUR) * HOUR_BLOCK_HEIGHT;

const statusStyleMap: Record<
  TimeSlotStatus,
  { container: string; title: string; accentText: string; indicator: string }
> = {
  [TimeSlotStatus.LIVE]: {
    container: 'border-emerald-500 bg-emerald-100',
    title: 'text-emerald-900',
    accentText: 'text-emerald-600',
    indicator: 'bg-emerald-500',
  },
  [TimeSlotStatus.NEXT]: {
    container: 'border-amber-500 bg-amber-100',
    title: 'text-amber-900',
    accentText: 'text-amber-600',
    indicator: 'bg-amber-500',
  },
  [TimeSlotStatus.UPCOMING]: {
    container: 'border-sky-500 bg-sky-100',
    title: 'text-sky-900',
    accentText: 'text-sky-600',
    indicator: 'bg-sky-500',
  },
};

interface TimelineProps {
  events?: TimeSlot[];
}

type TimelineSlot = {
  slot: TimeSlot;
  slotDate: Date;
  startTime: Date;
  endTime: Date;
};

const normalizeSlotDate = (value: Date | string): Date | null => {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const buildDateWithTime = (date: Date, time: string): Date => {
  const [hours = 0, minutes = 0, seconds = 0] = (time ?? '')
    .split(':')
    .map((part) => Number.parseInt(part, 10) || 0);

  const result = new Date(date);
  result.setHours(hours, minutes, seconds, 0);
  return result;
};

export default function Timeline({ events = [] }: TimelineProps) {
  const { selectedDate } = useScheduleStore();
  const isToday = isSameDay(selectedDate, new Date());
  const dayStart = useMemo(() => {
    const start = new Date(selectedDate);
    start.setHours(START_HOUR, 0, 0, 0);
    return start;
  }, [selectedDate]);
  const nowOffset = useMemo(() => {
    if (!isToday) {
      return null;
    }

    const now = new Date();
    const minutesFromStart = (now.getTime() - dayStart.getTime()) / 60000;

    if (minutesFromStart < 0 || minutesFromStart > TOTAL_TIMELINE_MINUTES) {
      return null;
    }

    return (minutesFromStart / 60) * HOUR_BLOCK_HEIGHT;
  }, [dayStart, isToday]);

  const formatHourLabel = (hour: number) => {
    const date = new Date(selectedDate);
    date.setHours(hour, 0, 0, 0);
    return format(date, 'HH:mm');
  };

  const dailySlots = useMemo<TimelineSlot[]>(() => {
    return events
      .map((slot) => {
        const slotDate = normalizeSlotDate(slot.date);
        if (!slotDate) {
          return null;
        }

        const startTime = buildDateWithTime(slotDate, slot.time_from);
        const endTime = buildDateWithTime(slotDate, slot.time_to);

        return { slot, slotDate, startTime, endTime };
      })
      .filter((entry): entry is TimelineSlot =>
        Boolean(entry && isSameDay(entry.slotDate, selectedDate))
      )
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }, [events, selectedDate]);

  return (
    <View className="mt-5 flex-1 px-4">
      <ScrollView className="flex-1" nestedScrollEnabled showsVerticalScrollIndicator={false}>
        <View className="">
          <View className="flex-row">
            <View style={{ height: TIMELINE_HEIGHT }} className="relative w-10">
              {HOURS.map((hour, index) => {
                const top =
                  index === HOURS.length - 1
                    ? TIMELINE_HEIGHT - 12
                    : Math.max(0, index * HOUR_BLOCK_HEIGHT - 8);

                return (
                  <Text
                    key={`label-${hour}`}
                    className="absolute right-0 font-medium text-xs text-muted-foreground"
                    style={{ top }}>
                    {formatHourLabel(hour)}
                  </Text>
                );
              })}
            </View>
            <View className="flex-1 pl-0">
              <View style={{ height: TIMELINE_HEIGHT }} className="relative">
                <View
                  className="absolute left-0 h-full border-l border-border"
                  style={{ opacity: 0.4 }}
                />
                {HOURS.slice(0, -1).map((_, index) => (
                  <View
                    key={`grid-${index}`}
                    className="absolute left-0 right-0 border-t border-border"
                    style={{ top: index * HOUR_BLOCK_HEIGHT, opacity: 0.2 }}
                  />
                ))}
                <View
                  className="absolute bottom-0 left-0 right-0 border-t border-border"
                  style={{ opacity: 0.2 }}
                />

                {typeof nowOffset === 'number' && (
                  <View
                    pointerEvents="none"
                    style={{ top: nowOffset }}
                    className="absolute left-0 right-0 z-10 flex-row items-center">
                    <View
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: '#111827',
                        marginLeft: -6,
                      }}
                    />
                    <View
                      style={{
                        marginLeft: 8,
                        height: 1,
                        flex: 1,
                        backgroundColor: '#111827',
                        opacity: 0.25,
                      }}
                    />
                    <Text className="ml-2 font-semibold text-xs text-foreground">
                      {format(new Date(), 'HH:mm')}
                    </Text>
                  </View>
                )}

                {dailySlots.length === 0 && (
                  <View className="absolute inset-0 items-center justify-center">
                    <Text className="text-sm text-muted-foreground">No sessions scheduled.</Text>
                  </View>
                )}

                {dailySlots.map(({ slot, startTime, endTime }) => {
                  const rawStart = (startTime.getTime() - dayStart.getTime()) / 60000;
                  const rawEnd = (endTime.getTime() - dayStart.getTime()) / 60000;

                  const clampedStart = Math.max(0, Math.min(TOTAL_TIMELINE_MINUTES, rawStart));
                  const clampedEnd = Math.max(
                    clampedStart,
                    Math.min(TOTAL_TIMELINE_MINUTES, Math.max(rawEnd, rawStart + 15))
                  );

                  const durationMinutes = Math.max(clampedEnd - clampedStart, 15);

                  const top = (clampedStart / 60) * HOUR_BLOCK_HEIGHT;
                  const height = Math.max(
                    (durationMinutes / 60) * HOUR_BLOCK_HEIGHT,
                    MIN_SLOT_HEIGHT
                  );

                  const status = getSlotStatus(slot);
                  const styles = statusStyleMap[status] || statusStyleMap[TimeSlotStatus.UPCOMING];

                  return (
                    <View
                      key={slot.id}
                      style={{ top, height }}
                      className="absolute left-0 right-0 px-4 pr-0">
                      <View
                        className={`mb-2 flex h-full items-start justify-center gap-1 rounded-md px-4 ${styles.container}`}>
                        <View className="flex-row items-center">
                          <View className={`mr-3 h-full w-1 ${styles.indicator}`} />
                          <Text className={`font-semibold text-sm ${styles.title}`}>
                            {slot.title}
                          </Text>
                          <Icon as={Clock} size={16} className={styles.accentText + ' ml-2'} />
                          <Text className={`ml-1 font-medium text-xs ${styles.accentText}`}>
                            {format(startTime, 'hh:mm a')} - {format(endTime, 'hh:mm a')}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
