import { ScrollView, View } from 'react-native';
import TopCalender from './top-calender';
import { useScheduleStore } from '@/store/schedule';
import { Text } from '@/components/ui/text';
import { format, isSameDay } from 'date-fns';
import { Icon } from '@/components/ui/icon';
import { ListIcon, RefreshCcw, WalletCards } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import Timeline from './timeline';
import { TimeSlotCard } from '@/components/classes/timeslot-card';
import { useAuth } from '@/lib/auth/auth-context';
import { useQuery } from '@tanstack/react-query';
import { searchEntities } from '@/lib/helpers/utils';
import { operatorEnum } from '@/types/api';
import { eventType } from '@/types/course';
import { TimeSlot } from '@/lib/timeslot';

export default function WeeklySchedule() {
  const { selectedDate, setSelectedDate } = useScheduleStore();
  const { user } = useAuth();
  const [listType, setListType] = useState<'list' | 'timeline'>('list');

  const getUserCourseEvents = useQuery({
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
    enabled: Boolean(user?.id),
  });

  type CourseWithEvents = {
    id: number | string;
    title: string;
    meeting_link?: string;
    events?: eventType[];
  };

  const courses = getUserCourseEvents.data?.data?.data as CourseWithEvents[] | undefined;

  const eventsForSelectedDate = useMemo<TimeSlot[]>(() => {
    if (!courses) {
      return [];
    }

    return courses.flatMap((course) =>
      (course.events ?? [])
        .map((event) => {
          const eventDate = event.date instanceof Date ? event.date : new Date(event.date);

          return {
            id: event.id,
            title: event.title || course.title,
            date: eventDate,
            time_from: event.time_from,
            time_to: event.time_to,
            is_delete: Boolean(event.is_delete),
            meeting_link: course.meeting_link ?? '',
          } satisfies TimeSlot;
        })
        .filter((slot) => isSameDay(slot.date, selectedDate))
    );
  }, [courses, selectedDate]);

  return (
    <View className="w-full flex-1">
      <TopCalender />
      <View className="mt-4 w-full flex-row items-center justify-between px-4">
        <View className="flex-row gap-4">
          <Text className="text-base text-foreground">
            {format(selectedDate, 'EEEE - do MMM yyyy')}
          </Text>
          <Icon
            as={RefreshCcw}
            size={24}
            className="text-foreground"
            onPress={() => setSelectedDate(new Date())}
          />
        </View>
        <Button
          variant="ghost"
          onPress={() => setListType(listType === 'list' ? 'timeline' : 'list')}>
          {listType === 'list' ? (
            <Icon as={ListIcon} size={24} color="#000" />
          ) : (
            <Icon as={WalletCards} size={24} color="#000" />
          )}
        </Button>
      </View>
      {listType === 'list' && (
        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ gap: 10 }}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}>
          {eventsForSelectedDate.map((slot) => (
            <TimeSlotCard key={slot.id} slot={slot} />
          ))}
        </ScrollView>
      )}
      {listType === 'timeline' && <Timeline events={eventsForSelectedDate} />}
    </View>
  );
}
