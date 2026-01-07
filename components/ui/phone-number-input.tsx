import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';

import CustomSelect from './custom-select';
import { countries } from '@/config/countries';
import { ChevronDown } from 'lucide-react-native';

interface PhoneNumberInputProps {
  label: string;
  extension: string;
  value: string;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({ label, extension, value }) => {
  const [selected, setSelected] = React.useState(extension);
  const [phNumber, setPhNumber] = React.useState(value);
  return (
    <View style={styles.container}>
      <Text style={styles.label} className="text-secondary">
        {label}
      </Text>
      <View style={styles.inputRow} className="rounded-xl border border-border bg-popover">
        <View style={styles.extensionWrapper} className="border-transparent">
          <Input
            value={selected}
            keyboardType="phone-pad"
            style={styles.extensionInput}
            className="border-transparent bg-transparent"
            onChangeText={setSelected}
          />
          <CustomSelect options={countries} onChange={setSelected} />
        </View>

        <View style={styles.numberWrapper} className="border-transparent">
          <Input
            value={phNumber}
            placeholder="000000000"
            keyboardType="phone-pad"
            onChangeText={setPhNumber}
            style={styles.numberInput}
            className="border-transparent bg-popover"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'visible',
  },
  extensionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    width: 100,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    overflow: 'visible',
  },
  extensionInput: {
    flex: 1,
    height: '100%',
    textAlign: 'center',
    fontSize: 16,
    paddingHorizontal: 0,
  },
  dropdownIcon: {
    marginLeft: 5,
  },
  numberWrapper: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 15,
  },
  numberInput: {
    height: '100%',
    fontSize: 16,
    paddingHorizontal: 0,
  },
});

export default PhoneNumberInput;
