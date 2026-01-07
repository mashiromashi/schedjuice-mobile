import React from "react";
import { Text, View } from "react-native";

type NotificationItemProps = {
  icon: React.ReactNode;
  created_at: number; // timestamp in milliseconds
  title: string;
  subtitle: string;
  type: string;
};

const timeAgoFromMs = (ms: number) => {
  const seconds = Math.floor((Date.now() - ms) / 1000);

  const units: [unit: string, secs: number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
    ["second", 1],
  ];

  const sign = Math.sign(seconds); // negative = future
  const abs = Math.abs(seconds);

  for (const [unit, size] of units) {
    const n = Math.floor(abs / size);
    if (n >= 1) {
      const s = n === 1 ? unit : `${unit}s`;
      return sign >= 0 ? `${n} ${s} ago` : `in ${n} ${s}`;
    }
  }
  return "just now";
};

const NotificationItem: React.FC<NotificationItemProps> = ({
  icon,
  created_at,
  title,
  subtitle,
  type
}) => {
  return (
    <View className="w-full mb-3 border-[1px] border-[#E2E8F0] p-5 rounded-xl flex flex-row items-start gap-4 bg-white">
      {type == "warning" && <View className="rounded-lg bg-[#FEF3C7] p-2.5">{icon}</View>}
      {type == "danger" && <View className="rounded-lg bg-[#FEE2E2] p-2.5">{icon}</View>}
      {type == "success" && <View className="rounded-lg bg-[#E8F4EF] p-2.5">{icon}</View>}
      <View className="flex gap-1.5 w-[80%]">
        <Text className="text-base font-medium">{title}</Text>
        <Text className="font-light">{subtitle}</Text>
        <Text className="font-medium text-gray-500 text-right">
          {timeAgoFromMs(created_at)}
        </Text>
      </View>
    </View>
  );
};

export default NotificationItem;
