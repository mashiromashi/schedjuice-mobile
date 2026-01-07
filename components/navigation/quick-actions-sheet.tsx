import React, { forwardRef, useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useColorScheme } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera, IdCard, LucideIcon, QrCode, X } from 'lucide-react-native';

export interface QuickAction {
  id: string;
  icon: LucideIcon;
  title: string;
  onPress?: () => void;
}

interface QuickActionsSheetProps {
  actions: QuickAction[];
  snapPoints?: string[];
  onActionPress?: (actionId: string) => void;
  onClose?: () => void;
  onChange?: (index: number) => void;
}

const quickShortcuts: { id: string; label: string; icon: LucideIcon }[] = [
  { id: 'check-in', label: 'Check In', icon: Camera },
  { id: 'generate-qr', label: 'Generate QR', icon: QrCode },
  { id: 'show-id', label: 'Show ID', icon: IdCard },
];

export const QuickActionsSheet = forwardRef<BottomSheet, QuickActionsSheetProps>(
  ({ actions, snapPoints = ['40%'], onActionPress, onClose, onChange }, ref) => {
    const { colorScheme } = useColorScheme();
    const insets = useSafeAreaInsets();

    const isDark = colorScheme === 'dark';

    const memoizedSnapPoints = useMemo(() => snapPoints, [snapPoints]);

    const handleActionPress = (action: QuickAction) => {
      if (action.onPress) {
        action.onPress();
      }
      if (onActionPress) {
        onActionPress(action.id);
      }
      if (onClose) {
        onClose();
      }
    };

    const handleSheetChanges = (index: number) => {
      if (onChange) {
        onChange(index);
      }
    };

    return (
      <BottomSheet
        ref={ref}
        index={-1} // Start closed
        snapPoints={memoizedSnapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose
        bottomInset={65 + insets.bottom} // Start from the end of navigation bar
        backgroundStyle={{
          backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
        }}
        handleIndicatorStyle={{
          backgroundColor: isDark ? '#48484A' : '#C7C7CC',
        }}>
        <BottomSheetView className="flex-1 p-6 px-4">
          <View className="gap-4">
            <View className="flex w-full flex-row items-center px-10">
              <Text className="font-sora-bold mr-auto w-full text-center text-xl text-foreground">
                Quick Access
              </Text>
              <Button
                variant="ghost"
                onPress={onClose}
                className="ml-auto w-10 rounded-full bg-[#E8F2EC]">
                <Icon as={X} size={30} height={30} color="#102C24" />
              </Button>
            </View>

            <View className="flex w-full flex-row gap-3">
              {quickShortcuts.map((shortcut) => (
                <Button
                  key={shortcut.id}
                  variant="ghost"
                  className="flex h-20 flex-1 basis-0 flex-col items-center justify-center gap-1 rounded-2xl bg-[#E8F2EC] px-4 py-4 active:bg-[#DDEDE5]"
                  accessibilityLabel={shortcut.label}>
                  <Icon as={shortcut.icon} size={24} height={24} color="#0F3026" />
                  <Text variant="p" className="font-semibold text-xs text-[#0F3026]">
                    {shortcut.label}
                  </Text>
                </Button>
              ))}
            </View>

            <View className="overflow-hidden rounded-3xl border border-[#C9E0D6] bg-[#E8F2EC]">
              {actions.map((action, index) => {
                const isLastAction = index === actions.length - 1;
                const iconHexColor = '#0F3026';
                return (
                  <TouchableOpacity
                    key={action.id}
                    className={cn(
                      'flex-row items-center gap-3 px-5 py-4',
                      !isLastAction && 'border-b border-[#C4DBD1]'
                    )}
                    onPress={() => handleActionPress(action)}>
                    <Icon as={action.icon} size={22} color={iconHexColor} />
                    <Text className="flex-1 font-medium text-base text-[#0F3026]">
                      {action.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);
