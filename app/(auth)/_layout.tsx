import React from 'react';
import { Stack } from 'expo-router';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { useAuthStore } from '@/lib/auth/auth-store';

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" className="text-primary" />
        <Text className="mt-4 text-muted-foreground">Loading...</Text>
      </View>
    );
  }

  // Redirect authenticated users to dashboard
  if (isAuthenticated) {
    return <Redirect href="/" />;
  }

  // Render auth routes for unauthenticated users
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
