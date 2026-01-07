import React, { useState } from 'react';
import { Pressable, View, Text } from 'react-native';
import { ImageSourcePropType } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, EllipsisIcon, Pin } from 'lucide-react-native';
import { countDaysFromToday } from '@/lib/helpers/date';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Profile } from '../header/profile';
import AnnouncementSlot, { AnnouncementStatus } from '@/lib/announcement-slot';
import { Post } from '../announcement-post/post';
import { announcementType } from '@/types/announcement';
import { RCTRenderer } from '../rct-renderer';

export function AnnouncementCard({ slot: announcement }: { slot: announcementType }) {
  const [expanded, setExpanded] = useState(true);

  // @ts-expect-error -- expanded created_by
  const source: ImageSourcePropType = { uri: announcement.created_by?.profile_image };

  const isPinned = announcement.is_pinned && AnnouncementStatus.PIN;

  return (
    <Card className="relative overflow-hidden rounded-2xl shadow">
      <CardHeader className="mb-1 pb-2">
        {/* Header row */}
        <View className="flex-row items-center">
          {/* Left section */}
          <View className="flex-row items-center gap-3">
            <View className="-ml-2">
              <Profile source={source} size={40} onPress={() => {}} />
            </View>
            <CardTitle className="font-semibold text-sm">{announcement.title}</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              {`${countDaysFromToday(announcement.created_at)}`}
            </CardDescription>

            {isPinned && <Pin size={12} color="#007AFF" />}
          </View>

          {/* Right section */}
          {/*<View className="ml-auto pr-2">
            <EllipsisIcon size={16} />
          </View>*/}
        </View>

        {/* Animated content */}
        <Animated.View layout={LinearTransition.duration(220)}>
          <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(140)}>
            <RCTRenderer docToRender={announcement.json_data} />
            {expanded && (
              <View className="mt-3 flex-row gap-3">
                <Post />
              </View>
            )}
          </Animated.View>
        </Animated.View>

        {/* Toggle link */}
        {/*<Pressable onPress={() => setExpanded((p) => !p)}>
          <View className="mt-1 flex-row items-center gap-1">
            <Text className="font-medium text-xs text-icon-blue">
              {expanded ? 'See Less' : 'More Details'}
            </Text>
            {expanded ? (
              <ChevronUp size={12} color="#007AFF" />
            ) : (
              <ChevronDown size={12} color="#007AFF" />
            )}
          </View>
        </Pressable>*/}
      </CardHeader>
    </Card>
  );
}
