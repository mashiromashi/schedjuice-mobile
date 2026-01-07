import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Bell, LucideIcon } from 'lucide-react-native';
import { Icon } from './ui/icon';

type IconWithNotifBadgeProps = {
  count?: number;
  onPress?: () => void;
  IconName: LucideIcon;
};

export function IconWithNotifBadge({ count = 0, onPress, IconName }: IconWithNotifBadgeProps) {
  return (
    <Pressable onPress={onPress} className="relative mr-1">
      {/* Bell icon */}
      <Icon as={IconName} size={28} className="text-black dark:text-white" />

      {/* Badge (only if count > 0) */}
      {count > 0 && (
        <View
          style={{
            position: 'absolute',
            top: -4, // smaller = closer, larger negative = higher
            right: 0, // larger negative = further right
          }}
          className="h-2 w-2 flex-1 items-center justify-center rounded-full bg-bell-red">
          {/*// notif count*/}
          {/*<Text style={{ color: 'white', fontSize: 10, marginTop: -1, fontWeight: '600' }}>
            {count}
          </Text>*/}
        </View>
      )}
    </Pressable>
  );
}
