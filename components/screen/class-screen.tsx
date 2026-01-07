import React from 'react';
import { ScrollView, View } from 'react-native';
import { DateHeader } from '../date-header';
import { TimeSlotCard } from '../classes/timeslot-card';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth/auth-context';
import { isStudent } from '@/lib/auth/authorization';
import { searchEntities } from '@/lib/helpers/utils';
import { operatorEnum } from '@/types/api';
import { formatDate, formatDateMonthYear } from '@/lib/helpers/date';
import { eventType } from '@/types/course';

export default function ClassScreen() {
  const { user } = useAuth();

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

  return (
    <ScrollView
      style={{ flex: 1, padding: 12 }}
      contentContainerStyle={{ gap: 12, paddingBottom: 40 }}>
      <DateHeader />
      {getUserCourseEvents?.data?.data?.data.map((course: any) => {
        return course.events
          .filter((event: eventType) => event.date === formatDate(new Date(), 'yyyy-MM-dd'))
          .map((event: eventType) => {
            return (
              <TimeSlotCard key={event.id} slot={{ ...event, meeting_link: course.meeting_link }} />
            );
          });
      })}
    </ScrollView>
  );
}
