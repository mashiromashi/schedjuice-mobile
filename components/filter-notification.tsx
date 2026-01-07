import React from "react";
import { Text, View } from "react-native";
import { WheelPickerOption } from "@ncdai/react-wheel-picker";
import Picker from "./picker";
import DatePicker from "./date-picker";

const notiTypes = ["Category", "Subject"];

const options: WheelPickerOption[] = [
  { label: "All", value: "All" },
  { label: "Important", value: "Important" },
  { label: "General", value: "General" },
];

const sub_options: WheelPickerOption[] = [
  { label: "All", value: "All" },
  { label: "Myanmar", value: "Myanmar" },
  { label: "English", value: "English" },
  { label: "Mathematics", value: "Mathematics" },
  { label: "Science", value: "Science" },
  { label: "History", value: "History" },
  { label: "Geo", value: "Geo" },
];

const FilterNotification: React.FC = () => {
  return (
    <View className="text-left space-y-2">
      <Text className="text-lg">Filter Notifications</Text>

      <View className="w-[90%] flex flex-row justify-between gap-3">
        <View className="w-[30%] space-y-2">
          <DatePicker />
        </View>

        {notiTypes.map((notiType) => (
          <View className="w-[30%] space-y-2" key={notiType}>
            <Picker
                options={notiType === "Category" ? options : sub_options}
                content={notiType}
                defaultValue={
                    notiType === "Category"
                    ? options[0].value
                    : sub_options[0].value
                }
            />
          </View>
        ))}
      </View>
    </View>
  );
};

export default FilterNotification;
