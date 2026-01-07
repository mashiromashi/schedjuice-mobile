import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { formatDateMonthYear, formatEventTime } from '@/lib/helpers/date';
import { Pressable, View, ScrollView, Linking } from 'react-native';
import { hourRange } from '@/lib/helpers/hour-range';
import { StatusPill } from '@/components/classes/status-pill';
import { card } from '@/components/classes/status-pill';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { TimeSlot, TimeSlotStatus } from '@/lib/timeslot';
import {
  Calendar,
  CircleUserRound,
  Clock,
  MapPinHouse,
  MessageCircle,
  ScanQrCode,
} from 'lucide-react-native';
import { Icon } from '../ui/icon';
import { getSlotStatus } from '@/lib/helpers/time-slot';
import { useColorScheme } from '@/lib/use-color-scheme';

interface TimeSlotCardProps {
  slot: TimeSlot;
}

export function TimeSlotCard({ slot }: TimeSlotCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { colorScheme } = useColorScheme();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(expanded ? 100 : 0, { duration: 250 }),
      opacity: withTiming(expanded ? 1 : 0, { duration: 250 }),
    };
  });
  const cardStatus = getSlotStatus(slot);
  const bgBarColor =
    cardStatus === TimeSlotStatus.LIVE
      ? card.liveBar
      : cardStatus === TimeSlotStatus.NEXT
        ? card.nextBar
        : card.upcomingBar;

  return (
    <Pressable onPress={() => setExpanded(!expanded)}>
      <Card className="relative overflow-hidden rounded-2xl shadow dark:bg-neutral-900/60">
        {/* left colored bar */}
        <View
          style={{ backgroundColor: bgBarColor }}
          className="absolute left-3 top-5 h-5/6 w-[8px] rounded-2xl"
        />

        {/* header */}
        <CardHeader className="mb-1 ml-3 pb-0">
          <View className="flex-row items-center justify-between">
            <CardTitle className="text-lg text-textcolor dark:text-foreground">
              {slot.title}
            </CardTitle>
            <StatusPill status={cardStatus} colorScheme={colorScheme} />
          </View>
        </CardHeader>

        {/* always visible */}
        <CardContent className="mb-1 ml-2 flex-col pb-0 pt-1">
          <View className="mb-1 ml-1 flex-row items-center gap-2">
            <Icon as={Clock} size={18} className="text-iconbackground dark:text-foreground" />
            <CardDescription className="text-[15px] text-textcolor dark:text-foreground">
              {formatEventTime(slot.time_from)} - {formatEventTime(slot.time_to)}
            </CardDescription>
          </View>

          {/* animated area */}
          <Animated.View style={animatedStyle} className="overflow-hidden">
            <View>
              <View className="mb-1 ml-1 mt-1 flex-row items-center gap-2">
                <Icon
                  as={Calendar}
                  size={18}
                  className="text-iconbackground dark:text-foreground"
                />
                <CardDescription className="text-[15px] text-textcolor dark:text-foreground">
                  {formatDateMonthYear(slot.date)}
                </CardDescription>
              </View>

              {/*<View className="mb-1 ml-1 mt-1 flex-row items-center gap-2">
                <CircleUserRound size={18} className="text-iconbackground" />
                <CardDescription className="text-[15px] text-textcolor">
                  {slot.teachers.map((teacher) => teacher.name).join(', ')}
                </CardDescription>
              </View>*/}

              {/*<View className="ml-1 mt-1 flex-row items-center gap-2">
                <MapPinHouse size={18} className="text-iconbackground" />
                <CardDescription className="text-[15px]">
                  {slot.room || 'To be Announced'}
                </CardDescription>
              </View>*/}

              <View className="mt-3 flex-row items-center gap-3">
                <Button
                  onPress={() => Linking.openURL(slot.meeting_link)}
                  variant="outline"
                  className="h-14 flex-row items-center px-4">
                  <Icon
                    as={MessageCircle}
                    size={17}
                    className="mr-2 text-iconbackground dark:text-white"
                  />
                  <Text className="font-medium text-[13px] text-textcolor dark:text-foreground">
                    Join Class
                  </Text>
                </Button>

                {/*<Button variant="default" className="h-14 flex-row items-center px-4">
                  <ScanQrCode color="white" size={17} className="mr-2" />
                  <Text className="font-medium text-[12px] text-white">Submit Attendance</Text>
                </Button>*/}
              </View>
            </View>
          </Animated.View>
        </CardContent>
      </Card>
    </Pressable>
  );
}
