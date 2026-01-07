import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
const CustomSelect = ({
  options,
  onChange,
}: {
  options: { name: string; code: string }[];
  onChange: (code: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (option: string) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setOpen((prev) => !prev)} activeOpacity={0.7}>
        <Text>{open ? <ChevronUp /> : <ChevronDown />}</Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdown} className="w-20 rounded-sm border-border bg-popover">
          <FlatList
            style={styles.flatListStyle}
            data={options}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.option} onPress={() => handleSelect(item.code)}>
                <ScrollView>
                  <Text style={styles.optionText}>{item.code}</Text>
                </ScrollView>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={true}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    aspectRatio: 1,
  },
  flatListStyle: {
    flexGrow: 1,
    height: '100%',
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    left: -10,
    right: 0,
    borderWidth: 1,
    zIndex: 9999,
    height: 150,
  },
  option: {
    padding: 12,
  },
  optionText: {
    fontSize: 16,
  },
});

export default CustomSelect;
