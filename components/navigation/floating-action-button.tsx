import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Icon } from '@/components/ui/icon';
import { LucideIcon, Zap, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { usePathname } from 'expo-router';

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

export function FloatingActionButton({
  onPress,
  backgroundColor = '#bfd9cb',
  icon: IconComponent = Zap,
  activeIcon: ActiveIcon = X,
  isActive = false,
  size = 60,
  position,
}: FloatingActionButtonProps) {
  const insets = useSafeAreaInsets();
  const path = usePathname();

  const defaultPosition = {
    bottom: insets.bottom,
    left: '50%' as any, // Type assertion for percentage string
    marginLeft: -(size / 2.5),
  };

  const finalPosition = { ...defaultPosition, ...position };

  const fabStyle = {
    ...styles.fab,
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor,
    display: path.includes('notification') ? 'none' : 'flex',
    ...finalPosition,
  } as ViewStyle;

  const CurrentIcon = isActive ? ActiveIcon : IconComponent;

  return (
    <TouchableOpacity style={fabStyle} onPress={onPress}>
      <Icon as={CurrentIcon} size={24} color="#102C24" />
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
