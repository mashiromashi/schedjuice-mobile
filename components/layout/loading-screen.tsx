import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <View className="bg-background flex-1 items-center justify-center">
      <ActivityIndicator size="large" className="text-brand-green" />
      <Text className="mt-4 text-muted-foreground">{message}</Text>
    </View>
  );
}
