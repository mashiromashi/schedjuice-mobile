import { useMemo } from 'react';
import { View } from 'react-native';
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  type WeekOptions,
} from 'date-fns';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth/auth-context';
import { searchEntities } from '@/lib/helpers/utils';
import { operatorEnum } from '@/types/api';
import { RawEvent } from '@/components/course/schedule';

type CalendarEvent = {
  id: string;
  title: string;
  color: 'emerald' | 'purple' | 'teal';
};

type CalendarEventsMap = Record<string, CalendarEvent[]>;

type CalendarDay = {
  date: Date;
  iso: string;
  isCurrentMonth: boolean;
  isSelected: boolean;
  dayNumber: string;
  events: CalendarEvent[];
};

const WEEK_OPTIONS: WeekOptions = { weekStartsOn: 0 };
const DAYS_IN_WEEK = 7;
const WEEKDAY_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const EVENT_STYLE: Record<CalendarEvent['color'], string> = {
  emerald: 'bg-[#E6F5EC]',
  purple: 'bg-[#F1E7FF]',
  teal: 'bg-[#E0F7F6]',
};

const EVENT_TEXT: Record<CalendarEvent['color'], string> = {
  emerald: 'text-[#215C3A]',
  purple: 'text-[#5D3DB3]',
  teal: 'text-[#1A5E63]',
};

const EVENT_DOT: Record<CalendarEvent['color'], string> = {
  emerald: 'bg-[#2EB67D]',
  purple: 'bg-[#7E5BEF]',
  teal: 'bg-[#2CB5AD]',
};

const MONTH_ANCHOR = new Date(); // September 2021 to mirror design mock
const SELECTED_DATE = new Date();

type CourseWithEvents = {
  id: number | string;
  title: string;
  meeting_link?: string;
  events?: RawEvent[];
};

function flattenCourseEvents(courses?: CourseWithEvents[]): RawEvent[] {
  if (!courses) {
    return [];
  }

  return courses.flatMap((course) =>
    (course.events ?? []).map((event) => ({
      ...event,
      title: event.title || course.title,
    }))
  );
}

function buildCourseEvents(rawEvents: RawEvent[] = []): CalendarEventsMap {
  return rawEvents.reduce<CalendarEventsMap>((acc, evt) => {
    const iso = evt.date;
    const entry: CalendarEvent = {
      id: String(evt.id),
      title: `${evt.title} ${evt.time_from}–${evt.time_to}`,
      color: evt.color ?? 'purple',
    };
    acc[iso] = acc[iso] ? [...acc[iso], entry] : [entry];
    return acc;
  }, {});
}

function buildCalendar(
  referenceDate: Date,
  eventsByDay: CalendarEventsMap,
  selectedDate: Date
): CalendarDay[][] {
  const monthStart = startOfMonth(referenceDate);
  const monthEnd = endOfMonth(referenceDate);
  const rangeStart = startOfWeek(monthStart, WEEK_OPTIONS);
  const rangeEnd = endOfWeek(monthEnd, WEEK_OPTIONS);
  const days = eachDayOfInterval({ start: rangeStart, end: rangeEnd });

  const weeks: CalendarDay[][] = [];

  for (let index = 0; index < days.length; index += DAYS_IN_WEEK) {
    const slice = days.slice(index, index + DAYS_IN_WEEK);
    const week: CalendarDay[] = slice.map((date) => {
      const iso = format(date, 'yyyy-MM-dd');
      return {
        date,
        iso,
        isCurrentMonth: isSameMonth(date, monthStart),
        isSelected: isSameDay(date, selectedDate),
        dayNumber: format(date, 'd'),
        events: eventsByDay[iso] ?? [],
      };
    });

    weeks.push(week);
  }

  return weeks;
}

export default function MonthlySchedule() {
  // fetch all events at once instead of individually
  const { user } = useAuth();

  /**
   * only the active events
   */
  const getUserCourseEvents = useQuery({
    // enabled: user ? true : false,
    queryKey: [`getUserCourseEvents${user?.id}`],
    queryFn: () => {
      return searchEntities(
        'courses',
        {
          expand: ['events'],
          size: -1,
          fields: ['id', 'title', 'events', 'meeting_link'],
        },
        {
          filter_params: [
            {
              field_name: 'user_courses__user_id',
              operator: operatorEnum.exact,
              value: String(user?.id),
            },
            {
              field_name: 'status',
              operator: operatorEnum.exact,
              value: 'active',
            },
          ],
        }
      );
    },
  });
  const coursesWithEvents = getUserCourseEvents.data?.data?.data as CourseWithEvents[] | undefined;

  const eventsByDay = useMemo(() => {
    const flattenedEvents = flattenCourseEvents(coursesWithEvents);
    return buildCourseEvents(flattenedEvents);
  }, [coursesWithEvents]);
  const calendar = useMemo(
    () => buildCalendar(MONTH_ANCHOR, eventsByDay, SELECTED_DATE),
    [eventsByDay]
  );

  return (
    <View className="flex-1 bg-slate-50 dark:bg-background">
      <View className="flex flex-row items-center gap-1 px-6">
        <Text className="font-semibold text-[28px] text-foreground">
          {format(MONTH_ANCHOR, 'LLLL')}
        </Text>
        <Text className="text-sm text-foreground">{format(MONTH_ANCHOR, 'yyyy')}</Text>
      </View>

      <View className="mt-4 flex-row justify-between px-6">
        {WEEKDAY_LABELS.map((label) => (
          <Text key={label} className="font-semibold text-[11px] text-[#94A3B8]">
            {label}
          </Text>
        ))}
      </View>

      <View className="mt-3 flex-1">
        <View className="flex-1 overflow-hidden border border-[#E2E8F0] bg-slate-50 dark:bg-background">
          {calendar.map((week, weekIndex) => (
            <View key={`week-${weekIndex}`} className="flex-1 flex-row">
              {week.map((day, dayIndex) => {
                const visibleEvents = day.events.slice(0, 1);
                const extraCount = day.events.length - visibleEvents.length;
                const summaryColor = visibleEvents[0]?.color ?? 'purple';

                return (
                  <View
                    key={day.iso}
                    className={cn(
                      'flex-1 border-[#E2E8F0] py-3.5',
                      dayIndex !== week.length - 1 && 'border-r',
                      weekIndex !== calendar.length - 1 && 'border-b',
                      !day.isCurrentMonth && 'bg-[#F4F8F5] dark:bg-neutral-900'
                    )}>
                    <View className="mx-auto flex-row justify-end">
                      {day.isSelected ? (
                        <Text className="font-semibold text-sm text-brand-green">
                          {day.dayNumber}
                        </Text>
                      ) : (
                        <Text
                          className={cn(
                            'font-semibold text-sm text-[#1F2937] dark:text-slate-50',
                            !day.isCurrentMonth && 'text-[#94A3B8]'
                          )}>
                          {day.dayNumber}
                        </Text>
                      )}
                    </View>

                    {visibleEvents.length > 0 && (
                      <View className="mt-1.5 gap-1.5 px-0.5">
                        {visibleEvents.map((event) => (
                          <View
                            key={event.id}
                            className={cn(
                              'w-full flex-row items-center self-start rounded-lg px-1 py-0.5',
                              EVENT_STYLE[event.color]
                            )}>
                            <Text
                              numberOfLines={1}
                              className={cn('font-semibold text-xs', EVENT_TEXT[event.color])}>
                              {event.title}
                            </Text>
                          </View>
                        ))}

                        {extraCount > 0 && (
                          <View
                            className={cn(
                              'w-full flex-row items-center self-start rounded-lg px-1 py-0.5',
                              EVENT_STYLE[summaryColor]
                            )}>
                            <Text
                              numberOfLines={1}
                              className={cn('font-semibold text-xs', EVENT_TEXT[summaryColor])}>
                              +{extraCount} more
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
