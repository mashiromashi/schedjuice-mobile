import React from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { useAuthStore } from './auth-store';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  fallback?: string;
}

export function AuthGuard({
  children,
  requireAuth = true,
  fallback = '/login' as const,
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" className="text-primary" />
        <Text className="mt-4 text-muted-foreground">Loading...</Text>
      </View>
    );
  }

  // Handle protected routes
  if (requireAuth && !isAuthenticated) {
    return <Redirect href={fallback as any} />;
  }

  // Handle public routes (redirect authenticated users away from auth pages)
  if (!requireAuth && isAuthenticated) {
    return <Redirect href="/" />;
  }

  // Render children if auth state matches requirements
  return <>{children}</>;
}

// Higher-order component for easier usage
export function withAuthGuard<T extends object>(
  Component: React.ComponentType<T>,
  options?: Omit<AuthGuardProps, 'children'>
) {
  return function AuthGuardedComponent(props: T) {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}
