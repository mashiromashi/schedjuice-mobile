// components/layout/UserAvatar.tsx
import React from 'react';
import { Image, Pressable, ImageSourcePropType } from 'react-native';

type UserAvatarProps = {
  source?: ImageSourcePropType;
  size?: number;
  onPress?: () => void;
  accessibilityLabel?: string;
};

export function Profile({
  source,
  size,
  onPress,
  accessibilityLabel = 'Open profile',
}: UserAvatarProps) {
  return (
    <Pressable
      onPress={onPress}
      className=""
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}>
      <Image
        source={source ?? require('../../assets/images/profile-demo.png')}
        style={{ width: size, height: size }}
        className="rounded-full"
      />
    </Pressable>
  );
}
