import { QuickAction } from '@/components/navigation/quick-actions-sheet';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import * as Haptics from 'expo-haptics';
import {
  Camera,
  ClipboardList,
  FileIcon,
  FileTextIcon,
  IdCard,
  LucideIcon,
  MessageCircleIcon,
  QrCode,
} from 'lucide-react-native';
import { View, TouchableOpacity } from 'react-native';

export default function CourseActions() {
  const quickShortcuts: { id: string; label: string; icon: LucideIcon }[] = [
    { id: 'check-in', label: 'Check In', icon: Camera },
    { id: 'generate-qr', label: 'Generate QR', icon: QrCode },
    { id: 'show-id', label: 'Show ID', icon: IdCard },
  ];
  const quickActions: QuickAction[] = [
    {
      id: 'chatroom',
      icon: MessageCircleIcon,
      title: 'Chatroom',
    },
    {
      id: 'assignments',
      icon: ClipboardList,
      title: 'Assignments',
    },
    {
      id: 'materials',
      icon: FileIcon,
      title: 'Materials',
    },
    {
      id: 'classroom_roster',
      icon: FileTextIcon,
      title: 'Classroom Roster',
    },
  ];
  // const handleActionPress = (action: QuickAction) => {
  //     if (action.onPress) {
  //       action.onPress();
  //     }
  //     if (onActionPress) {
  //       onActionPress(action.id);
  //     }
  //     if (onClose) {
  //       onClose();
  //     }
  //   };
  return (
    <View className="gap-4">
      <View className="flex w-full flex-row gap-3">
        {quickShortcuts.map((shortcut) => (
          <Button
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            key={shortcut.id}
            variant="ghost"
            className="flex h-20 flex-1 basis-0 flex-col items-center justify-center gap-1 rounded-2xl border border-[#C9E0D6] bg-slate-50 px-4 py-4 active:bg-[#DDEDE5] dark:border-neutral-800 dark:bg-neutral-950 dark:text-foreground"
            accessibilityLabel={shortcut.label}>
            <Icon as={shortcut.icon} size={24} height={24} color="#0F3026" />
            <Text variant="p" className="font-semibold text-xs text-[#0F3026] dark:text-foreground">
              {shortcut.label}
            </Text>
          </Button>
        ))}
      </View>
      <View className="overflow-hidden rounded-3xl border border-[#C9E0D6] bg-slate-50 shadow dark:border-neutral-800 dark:bg-neutral-950">
        {quickActions.map((action, index) => {
          const isLastAction = index === quickActions.length - 1;
          const iconHexColor = '#0F3026';
          return (
            <TouchableOpacity
              key={action.id}
              className={cn(
                'flex-row items-center gap-3 px-5 py-4',
                !isLastAction && 'border-b border-[#C4DBD1] dark:border-neutral-800'
              )}
              // onPress={() => handleActionPress(action)}
            >
              <Icon as={action.icon} size={18} color={iconHexColor} />
              <Text className="flex-1 font-sora-regular text-sm text-[#0F3026] dark:text-foreground">
                {action.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
