import * as React from 'react';
import AssignmentsTab from './assignments';
import { canEditCourse } from '@/lib/auth/authorization';
import { useAuth } from '@/lib/auth/auth-context';
import { useCourseStore } from '@/store/course';
import BottomSheet from '@gorhom/bottom-sheet';
import { AddAssignmentSheet } from './add-assignment.sheet';
import { CourseFloatingActionButton } from '../floating-action-button';
import { View } from 'react-native';

export default function CourseAcademics() {
  const { user } = useAuth();
  const { selectedCourse } = useCourseStore();
  const isTeacher = canEditCourse(
    user!,
    selectedCourse?.user_courses.map((userCourse: any) => userCourse.user.id)
  );
  const addAssignmentSheetRef = React.useRef<BottomSheet>(null);
  const [isAddAssignmentSheetOpen, setIsAddAssignmentSheetOpen] = React.useState(false);

  // Bottom sheet callbacks
  const openBottomSheet = React.useCallback(() => {
    addAssignmentSheetRef.current?.expand();
    setIsAddAssignmentSheetOpen(true);
  }, []);

  const closeBottomSheet = React.useCallback(() => {
    addAssignmentSheetRef.current?.close();
    setIsAddAssignmentSheetOpen(false);
  }, []);

  return (
    <View className="flex-1">
      {isTeacher && (
        <CourseFloatingActionButton
          isActive={isAddAssignmentSheetOpen}
          onPress={() => openBottomSheet()}
        />
      )}
      <AssignmentsTab />
      <AddAssignmentSheet ref={addAssignmentSheetRef} onClose={closeBottomSheet} />
    </View>
  );
}
