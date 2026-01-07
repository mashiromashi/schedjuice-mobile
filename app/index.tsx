import React from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/auth/auth-store';

export default function IndexScreen() {
  const { isAuthenticated, isLoading, checkAuthState } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/(protected)/' as any);
      } else {
        router.replace('/(auth)/' as any);
      }
    }
  }, [isAuthenticated, isLoading]);

  // Show loading spinner while checking auth state
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" className="text-primary" />
      <Text className="mt-4 text-muted-foreground">Loading...</Text>
    </View>
  );
}
