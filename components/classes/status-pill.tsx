import { TimeSlotStatus } from '@/lib/timeslot';
import { Text } from '@/components/ui/text';
import { View } from 'react-native';

export const card = {
  //This is the color of the bar on the left side of each card
  liveBar: '#34C759',
  nextBar: '#ff8f00',
  upcomingBar: '#737373',
  //This is the color of the background pill on the right side of each card
  livePillBg: '#E7F5EC',
  livePillText: '#2E7D32',

  nextPillBg: '#FFF3E0',
  nextPillText: '#8D6E63',

  upcomingPillBg: '#EAECEF',
  upcomingPillText: '#4B5563',
};

export function StatusPill({
  status,
  colorScheme,
}: {
  status: TimeSlotStatus;
  colorScheme: 'light' | 'dark';
}) {
  const { bg, text, label } =
    status === TimeSlotStatus.LIVE
      ? { bg: card.livePillBg, text: card.livePillText, label: 'Live' }
      : status === TimeSlotStatus.NEXT
        ? { bg: card.nextPillBg, text: card.nextPillText, label: 'Next' }
        : {
            bg: colorScheme === 'light' ? card.upcomingPillBg : '#262626',
            text: colorScheme === 'light' ? card.upcomingPillText : '#A3A3A3',
            label: 'Upcoming',
          };

  return (
    <View style={{ backgroundColor: bg }} className="rounded-full px-4 py-1">
      <Text style={{ color: text }} className="font-medium text-sm">
        {label}
      </Text>
    </View>
  );
}
