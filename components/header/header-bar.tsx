import React from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserInfo } from './user-info';
import { Profile } from './profile';
import { accountType } from '@/types/user';
import { useNotificationStore } from '@/store/notification';
import { useChatStore } from '@/store/chat';
import { IconWithNotifBadge } from '../icon-with-notif-badge';
import { Bell, ChevronLeft, MessageSquare } from 'lucide-react-native';
import { Text } from '../ui/text';
import { Icon } from '../ui/icon';
import { useColorScheme } from '@/lib/use-color-scheme';

type HeaderBarProps = {
  pageTitle: string;
  user: accountType;
  onAvatarPress: () => void;
  onNotificationPress: () => void;
  onChatPress: () => void;
  onBackPress?: () => void;
  avatarSource?: Parameters<typeof Profile>[0]['source'];
  notifCount?: number;
  showBackButton?: boolean;
};

export function HeaderBar({
  pageTitle,
  user,
  onAvatarPress,
  onNotificationPress,
  onChatPress,
  onBackPress,
  avatarSource,
  notifCount = 3,
  showBackButton = false,
}: HeaderBarProps) {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const { unreadCount: notificationCount } = useNotificationStore();
  const { unreadCount: chatCount } = useChatStore();

  return (
    <View className="w-full flex-row items-center justify-between px-4" style={{ paddingTop: 16 }}>
      {/* Left side: profile + info */}
      <View className="flex-row items-center justify-between">
        {showBackButton && (
          <Pressable onPress={onBackPress} hitSlop={8} className="mr-2">
            <Icon as={ChevronLeft} size={24} className="text-foreground" />
          </Pressable>
        )}
        {pageTitle !== 'Home' ? (
          <Text className="font-bold text-xl">{pageTitle}</Text>
        ) : (
          <UserInfo
            name={user.name}
            variant={colorScheme === 'light' ? 'light' : 'dark'}
            align="left"
          />
        )}
      </View>
      <View className="flex-row gap-4">
        <IconWithNotifBadge
          count={notificationCount}
          onPress={onNotificationPress}
          IconName={Bell}
        />
        {/*<IconWithNotifBadge count={chatCount} onPress={onChatPress} IconName={MessageSquare} />*/}
      </View>
    </View>
  );
}
