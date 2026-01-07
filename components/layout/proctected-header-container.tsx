import React from 'react';
import { View } from 'react-native';
import { HeaderBar } from '../header/header-bar';
import TopTabs from '../navigation/top-tabs';
import { DashboardSummary } from '../ui/dashboard-summary';
import { useAuth } from '@/lib/auth/auth-context';
import { useTenant } from '@/lib/hooks/useTenant';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePathname, useRouter } from 'expo-router';
import { useCourseStore } from '@/store/course';
import { useAssignmentStore } from '@/store/assignment';

type ProctedHeaderProps = {
  pageTitle: string;
  onAvatarPress: () => void;
  onNotificationPress: () => void;
  onChatPress: () => void;
};

export function ProtectedHeaderContainer({
  pageTitle,
  onAvatarPress,
  onNotificationPress,
  onChatPress,
}: ProctedHeaderProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { selectedCourse } = useCourseStore();
  const { selectedAssignment } = useAssignmentStore();
  const isCoursePage = pathname?.includes('/class/course');
  const isAssignmentPage = pathname?.includes('/assignment');

  const resolvedTitle =
    isAssignmentPage && selectedAssignment?.title
      ? selectedAssignment.title
      : isCoursePage && selectedCourse?.title
        ? selectedCourse.title
        : pageTitle;
  const showBackButton = Boolean(isCoursePage);
  const handleBackPress = () => {
    router.back();
  };
  return (
    <SafeAreaView>
      <View>
        <HeaderBar
          user={user!}
          onAvatarPress={onAvatarPress}
          onNotificationPress={onNotificationPress}
          onChatPress={onChatPress}
          avatarSource={{ uri: user?.profile_image! }}
          pageTitle={resolvedTitle}
          showBackButton={showBackButton}
          onBackPress={handleBackPress}
        />
      </View>
    </SafeAreaView>
  );
}
