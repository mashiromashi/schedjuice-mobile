import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  School,
  MailIcon,
  PhoneIcon,
  IdCard,
  MapPinIcon,
} from 'lucide-react-native';
import { useState } from 'react';
import Animated, { FadeInDown, FadeOutUp, LinearTransition } from 'react-native-reanimated';
import { UserInfoDropdownProps } from '@/types/profile';

export function UserInfoDropdown({
  userName = 'Ms. Myulurym MiMi',
  school = 'Year 12 - Racoon University',
  email = 'mememyuu@ruedu.com',
  phone = '+959 712371237',
  studentId = '297642579888',
  address = 'No. 313, Park Avenue, Waldorf Astoria, New York City, America.',
  defaultExpanded = false,
}: UserInfoDropdownProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <View className="mb-6 mt-4">
      <Pressable
        onPress={() => setIsExpanded(!isExpanded)}
        className="mx-auto flex-row items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 shadow-sm active:scale-[0.98] active:opacity-80">
        <Text className="font-medium text-sm text-foreground">{userName}</Text>
        <Icon
          as={isExpanded ? ChevronUpIcon : ChevronDownIcon}
          size={16}
          className="text-muted-foreground"
        />
      </Pressable>

      {/* Expanded Personal Info */}
      {isExpanded && (
        <Animated.View
          layout={LinearTransition}
          entering={FadeInDown.duration(300)}
          className="mt-3 rounded-xl border border-border bg-card p-6 shadow-sm">
          <View className="gap-1">
            <View className="flex-row items-center gap-4 py-3">
              <Icon as={School} size={24} className="text-foreground" />
              <Text className="flex-1 text-base text-foreground">{school}</Text>
            </View>
            <View className="h-[1px] bg-border" />

            <View className="flex-row items-center gap-4 py-3">
              <Icon as={MailIcon} size={24} className="text-foreground" />
              <Text className="flex-1 text-base text-foreground">{email}</Text>
            </View>
            <View className="h-[1px] bg-border" />

            <View className="flex-row items-center gap-4 py-3">
              <Icon as={PhoneIcon} size={24} className="text-foreground" />
              <Text className="flex-1 text-base text-foreground">{phone}</Text>
            </View>
            <View className="h-[1px] bg-border" />

            <View className="flex-row items-center gap-4 py-3">
              <Icon as={IdCard} size={24} className="text-foreground" />
              <Text className="flex-1 text-base text-foreground">ID : {studentId}</Text>
            </View>
            <View className="h-[1px] bg-border" />

            <View className="flex-row items-start gap-4 py-3">
              <Icon as={MapPinIcon} size={24} className="text-foreground" />
              <Text className="flex-1 text-base text-foreground">{address}</Text>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
}
