import { ScrollView, View } from 'react-native';
import UpcomingSessionCard from './upcoming-session.card';
import CourseActions from './actions';
import CourseAnnouncement from './course-announcement';
import { useAuth } from '@/lib/auth/auth-context';
import { useQuery } from '@tanstack/react-query';
import { searchEntities } from '@/lib/helpers/utils';
import { operatorEnum } from '@/types/api';
import { useCourseStore } from '@/store/course';
import { useCourseEvents } from '@/lib/hooks/useCourseEvents';

export default function CourseOverview() {
  const { data: eventData } = useCourseEvents();

  return (
    <ScrollView>
      <View className="h-full w-full gap-4 px-4">
        <UpcomingSessionCard events={eventData?.data.data} />
        <CourseActions />
        {/*<CourseAnnouncement />*/}
      </View>
    </ScrollView>
  );
}
