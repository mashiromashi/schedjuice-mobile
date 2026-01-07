import { Pressable, View } from 'react-native';
import { Calendar, ChevronDown, ChevronUp, Clock, ClockFading, Pin } from 'lucide-react-native';
import { useState } from 'react';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { eventSchema } from '@/types/course';
import * as z from 'zod';
import { formatDate, formatEventTime } from '@/lib/helpers/date';

interface UpcomingSessionCardProps {
  events: z.infer<typeof eventSchema>[];
}

export default function UpcomingSessionCard({ events }: UpcomingSessionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const animatedStyle = useAnimatedStyle(() => ({
    height: withTiming(expanded ? 250 : 0, { duration: 100 }),
    opacity: withTiming(expanded ? 1 : 0, { duration: 250 }),
  }));

  function handlePress() {
    setExpanded(!expanded);
  }
  return (
    <Pressable onPress={handlePress}>
      <Card className="relative overflow-hidden shadow dark:bg-neutral-950">
        <CardHeader>
          <View className="flex w-full flex-row items-center">
            <Icon as={ClockFading} className="mr-2 h-5 w-5 text-orange-500" />
            <Text>Upcoming Sessions</Text>
            <Icon
              as={expanded ? ChevronUp : ChevronDown}
              className="ml-auto h-5 w-5 text-orange-500"
            />
          </View>
        </CardHeader>
        {events?.length > 0 ? (
          <CardContent className="mt-2">
            {/*Always visible part*/}
            <View className="gap-3">
              <View className="flex w-full flex-row items-center">
                <Icon as={Calendar} className="mr-2 h-5 w-5 text-textcolor dark:text-foreground" />
                <Text>{formatDate(events[0].date, 'dd/MM/yyyy') || 'No date available'}</Text>
              </View>
              <View className="flex w-full flex-row items-center">
                <Icon as={Clock} className="mr-2 h-5 w-5 text-textcolor dark:text-foreground" />
                <Text>
                  {formatEventTime(events[0].time_from)} - {formatEventTime(events[0].time_to)}
                </Text>
              </View>
            </View>

            {/*Animated Part*/}
            <Animated.View style={animatedStyle} className="overflow-hidden">
              {events.slice(1, 1 + 3).map((event, index) => (
                <View className="mt-2 gap-3" key={event.id as string}>
                  <View className="h-0.5 w-full bg-[#E2E8F0]" />
                  <View className="flex w-full flex-row items-center">
                    <Icon
                      as={Calendar}
                      className="mr-2 h-5 w-5 text-textcolor dark:text-foreground"
                    />
                    <Text>{formatDate(event.date, 'dd/MM/yyyy')}</Text>
                  </View>
                  <View className="flex w-full flex-row items-center">
                    <Icon as={Clock} className="mr-2 h-5 w-5 text-textcolor dark:text-foreground" />
                    <Text>
                      {formatEventTime(event.time_from)} - {formatEventTime(event.time_to)}
                    </Text>
                  </View>
                </View>
              ))}
            </Animated.View>
          </CardContent>
        ) : null}
      </Card>
    </Pressable>
  );
}
