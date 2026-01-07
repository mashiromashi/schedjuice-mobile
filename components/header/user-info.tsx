// components/layout/UserInfo.tsx
import React from 'react';
import { View, Text } from 'react-native';

type UserInfoProps = {
  name: string;
  variant?: 'light' | 'dark';
  align?: 'left' | 'center' | 'right';
  nameSize?: string;
  subtitleSize?: string;
};
export function UserInfo({
  name,
  variant = 'light',
  align = 'left',
  nameSize = 'text-lg',
}: UserInfoProps) {
  const titleColor = variant === 'light' ? 'text-black' : 'text-foreground';

  // flex alignment for container
  const alignStyle =
    align === 'center' ? 'items-center' : align === 'right' ? 'items-end' : 'items-start';

  // text alignment for Text components
  const textAlign =
    align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';

  return (
    <View className={`justify-start ${alignStyle}`}>
      <Text className={`${titleColor} font-bold text-xl`}>Welcome, </Text>
      <Text className={`${nameSize} text-md font-sora-regular ${titleColor} ${textAlign}`}>
        {name}
      </Text>
    </View>
  );
}
