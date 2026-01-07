import React from 'react';
import { View, Text } from 'react-native';
import { format } from 'date-fns'; // ← make sure this import exists

type DateHeaderProps = {
  className?: string; // optional Tailwind override
};

export function DateHeader({ className = '' }: DateHeaderProps) {
  const parsedDate = new Date();

  // Format like "Friday - 8 Oct 2025"
  const formattedDate = format(parsedDate, 'EEEE - d MMM yyyy');

  return (
    <View className={`w-full px-1 py-2 ${className}`}>
      <Text className="font-medium text-[15px] text-foreground">{formattedDate}</Text>
    </View>
  );
}
