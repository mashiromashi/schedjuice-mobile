import React from 'react';
import { View, Pressable } from 'react-native';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { AssignmentStatusPill } from './assignmentslot-status';
import { formatDateMonthYear, getDaysLeft } from '@/lib/helpers/date';
import { Calendar, BellRing, Image as ImageIcon, ImageUp, Eye } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { assignmentStatus, assignmentType } from '@/types/assignment';
import { RCTRenderer } from '../rct-renderer';
import { getAssignmentStatus } from '@/lib/helpers/assignment';
import { canEditCourse } from '@/lib/auth/authorization';
import { useAuth } from '@/lib/auth/auth-context';
import { useCourseStore } from '@/store/course';
import { useRouter } from 'expo-router';

type Props = {
  assignment: assignmentType;
  status: assignmentStatus;
  onReminder?: (id: number) => void;
  onSubmit?: (id: number) => void;
  onResubmit?: (id: number) => void;
  onView?: (id: number) => void;
  onSubmitImage?: (id: number) => void;
};

export function AssignmentCard({
  assignment,
  status,
  onReminder,
  onSubmit,
  onResubmit,
  onView,
  onSubmitImage,
}: Props) {
  const { user } = useAuth();
  const { selectedCourse } = useCourseStore();
  const daysLeft = getDaysLeft(assignment.due_datetime);
  const shouldShowOneDayLeft = daysLeft === 1 && !!assignment.due_datetime;
  const isTeacher = canEditCourse(
    user!,
    selectedCourse?.user_courses.map((userCourse: any) => userCourse.user.id)
  );
  const router = useRouter();

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: '/(protected)/(tabs)/class/course/assignment/[id]',
          params: { id: assignment.id },
        })
      }>
      <Card className="relative overflow-hidden rounded-2xl shadow-lg dark:bg-background">
        {/* header */}
        <CardHeader className="mb-1 pb-0">
          <View className="flex-row items-center justify-between">
            <CardTitle className="text-lg text-textcolor dark:text-foreground">
              {assignment.title}
            </CardTitle>

            <AssignmentStatusPill status={status} daysLeft={daysLeft ?? undefined} />
          </View>

          <CardDescription className="mt-1 text-[15px] text-textcolor dark:text-foreground">
            <RCTRenderer docToRender={assignment.instructions} />
          </CardDescription>
        </CardHeader>

        {/* content */}
        <CardContent className="mb-1 flex-col pb-3 pt-1">
          <View className="mb-2 flex-row items-center gap-2">
            <Icon as={Calendar} size={18} className="text-iconbackground dark:text-foreground" />
            <CardDescription className="text-[15px] text-textcolor dark:text-foreground">
              Due : {assignment.due_datetime ? formatDateMonthYear(assignment.due_datetime) : '—'}
            </CardDescription>
            <CardDescription className="text-[15px] text-textcolor"></CardDescription>
          </View>
        </CardContent>
      </Card>
    </Pressable>
  );
}
