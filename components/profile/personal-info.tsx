import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ChevronLeft, KeyIcon } from 'lucide-react-native';
import { useAuth } from '@/lib/auth/auth-context';

interface StatCard {
  header: string;
  value: string;
  description: string;
}

interface PersonalInfoSectionProps {
  onBack?: () => void;
  onChangePassword: () => void;
  attendance?: StatCard;
  assignments?: StatCard;
  upcomingTest?: StatCard;
  recentTest?: StatCard;
  finalExam?: StatCard;
  customStat?: StatCard;
}

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * PersonalInfoSection displays a grid of stats cards, a change password button, and a back button.
 * @param {PersonalInfoSectionProps} props - props containing stat cards, an onBack function, and an onChangePassword function.
 * @returns {JSX.Element} - a JSX element containing a grid of stats cards, a change password button, and a back button.
 */
export function PersonalInfoSection({
  onBack,
  onChangePassword,
  attendance = {
    header: 'Attendance',
    value: '98%',
    description: '98/100 attended',
  },
  assignments = {
    header: 'Assignments',
    value: '90%',
    description: '18/20 Submitted',
  },
  upcomingTest = {
    header: 'Upcoming Test',
    value: 'Maths',
    description: '19/5/2025',
  },
  recentTest = {
    header: 'Recent Test',
    value: 'B+',
    description: 'Midterm English',
  },
  finalExam = {
    header: 'Final Exam (G12)',
    value: 'A-',
    description: 'Marks - 90/100',
  },
  customStat = {
    header: 'Loren',
    value: 'Ipsum',
    description: 'Dilor isit',
  },
}: PersonalInfoSectionProps) {
  const { user } = useAuth();

  return (
    <View className="gap-3">
      {/* Stats Grid */}
      <View className="flex-row flex-wrap justify-between gap-2 px-2">
        <View className="min-h-[120px] w-[48%] rounded-lg border border-border bg-card p-3 sm:w-[45%] md:w-[30%] lg:w-[22%]">
          <View className="flex-1 justify-center gap-2">
            <Text className="font-medium text-sm text-primary">{attendance.header}</Text>
            <Text className="font-medium text-2xl text-foreground">{attendance.value}</Text>
            <Text className="font-medium text-sm text-muted-foreground">
              {attendance.description}
            </Text>
          </View>
        </View>

        <View className="min-h-[120px] w-[48%] rounded-lg border border-border bg-card p-3 sm:w-[45%] md:w-[30%] lg:w-[22%]">
          <View className="flex-1 justify-center gap-2">
            <Text className="font-medium text-sm text-primary">{assignments.header}</Text>
            <Text className="font-medium text-2xl text-foreground">{assignments.value}</Text>
            <Text className="font-medium text-sm text-muted-foreground">
              {assignments.description}
            </Text>
          </View>
        </View>

        <View className="min-h-[120px] w-[48%] rounded-lg border border-border bg-card p-3 sm:w-[45%] md:w-[30%] lg:w-[22%]">
          <View className="flex-1 justify-center gap-2">
            <Text className="font-medium text-sm text-primary">{upcomingTest.header}</Text>
            <Text className="font-medium text-2xl text-foreground">{upcomingTest.value}</Text>
            <Text className="font-medium text-sm text-muted-foreground">
              {upcomingTest.description}
            </Text>
          </View>
        </View>

        <View className="min-h-[120px] w-[48%] rounded-lg border border-border bg-card p-3 sm:w-[45%] md:w-[30%] lg:w-[22%]">
          <View className="flex-1 justify-center gap-2">
            <Text className="font-medium text-sm text-primary">{recentTest.header}</Text>
            <Text className="font-medium text-2xl text-sky-500">{recentTest.value}</Text>
            <Text className="font-medium text-sm text-muted-foreground">
              {recentTest.description}
            </Text>
          </View>
        </View>

        <View className="min-h-[120px] w-[48%] rounded-lg border border-border bg-card p-3 sm:w-[45%] md:w-[30%] lg:w-[22%]">
          <View className="flex-1 justify-center gap-2">
            <Text className="font-medium text-sm text-primary">{finalExam.header}</Text>
            <Text className="font-medium text-2xl text-foreground">{finalExam.value}</Text>
            <Text className="font-medium text-sm text-muted-foreground">
              {finalExam.description}
            </Text>
          </View>
        </View>

        <View className="min-h-[120px] w-[48%] rounded-lg border border-border bg-card p-3 sm:w-[45%] md:w-[30%] lg:w-[22%]">
          <View className="flex-1 justify-center gap-2">
            <Text className="font-medium text-sm text-primary">{customStat.header}</Text>
            <Text className="font-medium text-2xl text-foreground">{customStat.value}</Text>
            <Text className="font-medium text-sm text-muted-foreground">
              {customStat.description}
            </Text>
          </View>
        </View>
      </View>

      {/* Change Password Button */}
      <Button
        onPress={onChangePassword}
        className="mt-1 h-12 w-full flex-row items-center justify-center gap-1 rounded-lg shadow-md">
        <Icon as={KeyIcon} size={16} className="text-primary-foreground" />
        <Text className="font-medium text-sm leading-7 text-primary-foreground">
          Change Password
        </Text>
      </Button>

      <Button
        onPress={onBack}
        className="mt-1 h-12 w-full flex-row items-center justify-center gap-1 rounded-lg bg-card shadow-md">
        <Icon as={ChevronLeft} size={16} className="text-foreground" />
        <Text className="font-medium text-sm leading-7 text-foreground">Back</Text>
      </Button>
    </View>
  );
}
