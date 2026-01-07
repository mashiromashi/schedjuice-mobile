import React from 'react';
import { View, ScrollView } from 'react-native';
import { AssignmentCard } from '@/components/assignment/assignment-card';
import { DashboardSummary } from '../ui/dashboard-summary';
import { DateHeader } from '../date-header';
import { assignmentStatus } from '@/types/assignment';
import { useAuth } from '@/lib/auth/auth-context';
import { useQuery } from '@tanstack/react-query';
import { isStudent } from '@/lib/auth/authorization';
import { searchEntities } from '@/lib/helpers/utils';
import { operatorEnum } from '@/types/api';
import { formatDate } from '@/lib/helpers/date';

export default function AssignmentScreen() {
  const { user } = useAuth();
  const getUserAssignments = useQuery({
    enabled: user && isStudent(user) ? true : false,
    queryKey: [`getUserCourseEvents${user?.id}`],
    queryFn: () => {
      return searchEntities(
        'courses',
        {
          expand: ['assignments'],
          size: -1,
        },
        {
          filter_params: [
            {
              field_name: 'user_courses__user_id',
              operator: operatorEnum.exact,
              value: String(user?.id),
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

      {/*{assignment_slot.map((slot) => (
        <AssignmentCard key={slot.id} assignment={slot} />
      ))}*/}
    </ScrollView>
  );
}
