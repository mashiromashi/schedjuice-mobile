import { COLORS } from '@/theme/colors';
import React from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

type PickerMode = 'date' | 'time' | 'datetime';

interface DateTimeFieldProps {
  isVisible: boolean;
  mode?: PickerMode;
  date?: Date;
  onConfirm: (next: Date) => void;
  onCancel: () => void;
}

export default function DateTimeField({
  isVisible,
  mode = 'datetime',
  date,
  onConfirm,
  onCancel,
}: DateTimeFieldProps) {
  return (
    <DateTimePickerModal
      isVisible={isVisible}
      mode={mode}
      date={date ?? new Date()}
      onConfirm={onConfirm}
      onCancel={onCancel}
      accentColor={COLORS.light.primary}
    />
  );
}
