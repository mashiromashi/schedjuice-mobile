import { AssignmentCard } from '@/components/assignment/assignment-card';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/lib/auth/auth-context';
import { getAssignmentStatus } from '@/lib/helpers/assignment';
import { searchEntities } from '@/lib/helpers/utils';
import { useCourseStore } from '@/store/course';
import { operatorEnum } from '@/types/api';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ScrollView, View } from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';

export default function AssignmentsTab() {
  const { selectedCourse } = useCourseStore();
  const { user } = useAuth();
  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage, refetch } =
    useInfiniteQuery({
      queryKey: ['fetchAssignments', selectedCourse?.id],
      queryFn: ({ pageParam }) => {
        return searchEntities(
          'assignments',
          {
            page: pageParam,
            size: 6,
            sorts: ['-created_at'],
            expand: ['submissions'],
          },
          {
            filter_params: [
              {
                field_name: 'course',
                value: String(selectedCourse?.id),
                operator: operatorEnum.exact,
              },
            ],
          }
        );
      },
      initialPageParam: 1,
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage, pages) => {
        return lastPage.data.links.next ? pages.length + 1 : undefined;
      },
    });
  return (
    <ScrollView
      className="p-4"
      refreshControl={<RefreshControl onRefresh={refetch} refreshing={isLoading} />}>
      <View className="gap-4">
        {user &&
          data?.pages.map((page) =>
            page.data.data.map((assignment: any) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                status={getAssignmentStatus(assignment, user)}
              />
            ))
          )}
      </View>
    </ScrollView>
  );
}
