// components/ui/haptic-tab-button.tsx
import * as Haptics from 'expo-haptics';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { TouchableOpacity } from 'react-native';

export const HapticTabButton = ({ onPress, children, style }: BottomTabBarButtonProps) => (
  <TouchableOpacity
    style={[style, { flex: 1 }]}
    onPress={(event) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress?.(event);
    }}>
    {children}
  </TouchableOpacity>
);
