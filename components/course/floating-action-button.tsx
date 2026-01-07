import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Icon } from '@/components/ui/icon';
import { LucideIcon, Zap, X, Plus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FloatingActionButtonProps {
  onPress: () => void;
  backgroundColor?: string;
  icon?: LucideIcon;
  activeIcon?: LucideIcon;
  isActive?: boolean;
  size?: number;
  position?: Partial<{
    bottom: number;
    left: string;
    marginLeft: number;
  }>;
}

export function CourseFloatingActionButton({
  onPress,
  backgroundColor = '#4D8165',
  icon: IconComponent = Plus,
  activeIcon: ActiveIcon = X,
  isActive = false,
  size = 60,
  position,
}: FloatingActionButtonProps) {
  const insets = useSafeAreaInsets();

  const defaultPosition = {
    bottom: insets.bottom + 16,
    right: 24,
    marginLeft: -(size / 2),
  };

  const finalPosition = { ...defaultPosition, ...position };

  const fabStyle = {
    ...styles.fab,
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor,
    ...finalPosition,
  } as ViewStyle;

  const CurrentIcon = isActive ? ActiveIcon : IconComponent;
  if (isActive) {
    return null;
  }

  return (
    <TouchableOpacity style={fabStyle} onPress={onPress}>
      <Icon as={CurrentIcon} size={24} className="text-white" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
});
