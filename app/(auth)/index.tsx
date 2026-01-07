import React from 'react';
import { View } from 'react-native';
import { Stack, Link, Redirect } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAuthStore } from '@/lib/auth/auth-store';

export default function WelcomeScreen() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }
  return (
    <>
      <View className="flex-1 items-center justify-center"></View>
    </>
  );
}
