import { useQuery } from '@tanstack/react-query';
import { searchEntities } from '@/lib/helpers/utils';
import { operatorEnum } from '@/types/api';
import { useCourseStore } from '@/store/course';

export function useCourseEvents() {
  const { selectedCourse } = useCourseStore();

  return useQuery({
    enabled: Boolean(selectedCourse?.id),
    queryKey: ['courseEvents', selectedCourse?.id],
    queryFn: () =>
      searchEntities(
        'events',
        { size: -1 },
        {
          filter_params: [
            {
              field_name: 'course_id',
              operator: operatorEnum.exact,
              value: String(selectedCourse?.id),
            },
          ],
        }
      ),
  });
}
