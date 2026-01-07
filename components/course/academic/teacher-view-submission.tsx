import { Card, CardHeader } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { searchEntities } from '@/lib/helpers/utils';
import { useCourseStore } from '@/store/course';
import { operatorEnum } from '@/types/api';
import { assignmentType, submissionType } from '@/types/assignment';
import { role } from '@/types/user';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, View } from 'react-native';

interface TeacherViewSubmissionProps {
  assignment: assignmentType;
}

export default function TeacherViewSubmission({ assignment }: TeacherViewSubmissionProps) {
  const { selectedCourse } = useCourseStore();
  const [mappedData, setMappedData] = useState<submissionType[]>([]);
  const router = useRouter();
  const getStudents = useQuery({
    queryKey: ['getStudents', assignment.id, selectedCourse?.id],
    queryFn: () =>
      searchEntities(
        'user-courses',
        { size: -1, expand: ['user'] },
        {
          filter_params: [
            {
              field_name: 'course',
              value: String(selectedCourse?.id),
              operator: operatorEnum.exact,
            },
            {
              field_name: 'assigned_as',
              operator: operatorEnum.contains,
              value: role.student,
            },
          ],
        }
      ),
    enabled: !!selectedCourse,
  });
  useEffect(() => {
    if (getStudents.data && assignment.course) {
      const submissions: submissionType[] = [];
      assignment.submissions.forEach((submission: submissionType) => {
        submissions.push({
          ...submission,
          is_submitted: true,
        });
      });

      getStudents.data.data.data
        .filter((s: any) => {
          const x =
            assignment.submissions.filter((ss: any) => ss.created_by.id === s.user.id).length === 0;
          return x;
        })
        .forEach((s: any) => {
          // @ts-ignore
          submissions.push({
            is_submitted: false,
            created_by: {
              ...s.user,
            },
          });
        });

      setMappedData(submissions);
    }
  }, [getStudents.data, assignment.course]);

  return (
    <View className="flex flex-col gap-4">
      <Text className="font-sora-bold">Student Submissions</Text>
      <View className="gap-4">
        {mappedData.map((submission, index) => {
          return (
            <Pressable
              key={index}
              onPress={() =>
                router.push({
                  pathname: '/(protected)/(tabs)/class/course/assignment/submission/[id]',
                  params: { id: submission.id },
                })
              }>
              <Card className="shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
                <CardHeader>
                  <View className="flex-row items-center gap-4">
                    <Image
                      source={{ uri: submission.created_by.profile_image }}
                      className="h-10 w-10 rounded-full"
                    />
                    <Text>{submission.created_by.name}</Text>
                    {submission.is_submitted ? (
                      <Text className="ml-auto text-summary-green">Submitted</Text>
                    ) : (
                      <Text className="ml-auto text-bell-red">Not Submitted</Text>
                    )}
                  </View>
                </CardHeader>
              </Card>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
