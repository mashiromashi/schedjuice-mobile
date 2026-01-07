import React, { useCallback, useRef, useState } from 'react';
import { useColorScheme } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet from '@gorhom/bottom-sheet';
import { MessageCircleIcon, FileTextIcon, ClipboardList, File } from 'lucide-react-native';

import { BottomTabs } from '@/components/navigation/bottom-tabs';
import { FloatingActionButton } from '@/components/navigation/floating-action-button';
import { QuickActionsSheet, QuickAction } from '@/components/navigation/quick-actions-sheet';
import { ProtectedHeaderContainer } from './proctected-header-container';
import { usePathname, useRouter } from 'expo-router';
import { useNotificationStore } from '@/store/notification';

interface ProtectedLayoutContainerProps {
  children?: React.ReactNode;
}

export function ProtectedLayoutContainer({ children }: ProtectedLayoutContainerProps) {
  const router = useRouter();
  const { setUnreadCount } = useNotificationStore();

  // Bottom sheet ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  // Bottom sheet callbacks
  const openBottomSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
    setIsBottomSheetOpen(true);
  }, []);

  const closeBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
    setIsBottomSheetOpen(false);
  }, []);

  const toggleBottomSheet = useCallback(() => {
    if (isBottomSheetOpen) {
      closeBottomSheet();
    } else {
      openBottomSheet();
    }
  }, [isBottomSheetOpen, closeBottomSheet, openBottomSheet]);

  const handleSheetChange = useCallback((index: number) => {
    setIsBottomSheetOpen(index >= 0);
  }, []);

  // Quick actions for bottom sheet
  const quickActions: QuickAction[] = [
    {
      id: 'chatroom',
      icon: MessageCircleIcon,
      title: 'Chatroom',
    },
    {
      id: 'assignments',
      icon: ClipboardList,
      title: 'Assignments',
    },
    {
      id: 'materials',
      icon: File,
      title: 'Materials',
    },
    {
      id: 'classroom_roster',
      icon: FileTextIcon,
      title: 'Classroom Roster',
    },
  ];

  const route = usePathname();

  const handleActionPress = (actionId: string) => {
    console.log(`Selected: ${actionId}`);
    // Handle the action here
  };

  function handleNotificationPress() {
    if (route.includes('/notification')) {
      router.back();
    } else {
      // clears the unread count
      setUnreadCount(0);
      router.push('/notification');
    }
  }

  return (
    <>
      {!route?.includes('profile') && (
        <ProtectedHeaderContainer
          onAvatarPress={toggleBottomSheet}
          onNotificationPress={handleNotificationPress}
          onChatPress={() => {}}
          pageTitle=""
        />
      )}
      {children}

      {/*<FloatingActionButton onPress={toggleBottomSheet} isActive={isBottomSheetOpen} />*/}

      <QuickActionsSheet
        ref={bottomSheetRef}
        actions={quickActions}
        onActionPress={handleActionPress}
        onClose={closeBottomSheet}
        onChange={handleSheetChange}
      />
    </>
  );
}
