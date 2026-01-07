// components/form/document-picker-field.tsx
import * as React from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Trash2 } from 'lucide-react-native';

export type PickerAsset = DocumentPicker.DocumentPickerAsset;

type DocumentPickerFieldProps = {
  label?: string;
  value: PickerAsset[];
  onChange: (next: PickerAsset[]) => void;
  accept?: string | string[];
  multiple?: boolean;
  disabled?: boolean;
  helperText?: string;
  emptyHint?: string;
  sizeLimitBytes?: number;
  onError?: (error: Error | string) => void;
};

export function DocumentPickerField({
  label,
  value,
  onChange,
  accept = '*/*',
  multiple = false,
  disabled = false,
  helperText = 'Please select files',
  emptyHint = 'No files selected yet.',
  sizeLimitBytes,
  onError,
}: DocumentPickerFieldProps) {
  const handleSelect = React.useCallback(async () => {
    if (disabled) return;

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: accept,
        multiple,
        copyToCacheDirectory: false,
      });

      if (result.canceled) return;

      const assets = result.assets ?? [];

      if (sizeLimitBytes) {
        const oversize = assets.find((asset) => (asset.size ?? 0) > sizeLimitBytes);
        if (oversize) {
          onError?.(
            new Error(
              `"${oversize.name}" exceeds the ${Math.round(sizeLimitBytes / 1024)} KB limit.`
            )
          );
          return;
        }
      }

      onChange(multiple ? assets : assets.slice(0, 1));
    } catch (err) {
      const message = err instanceof Error ? err : new Error('Document pick failed');
      onError?.(message);
    }
  }, [accept, disabled, multiple, onChange, onError, sizeLimitBytes]);

  const handleRemove = React.useCallback(
    (index: number) => {
      onChange(value.filter((_, i) => i !== index));
    },
    [onChange, value]
  );

  return (
    <View className="gap-3">
      {label ? <Text className="text-sm text-secondary">{label}</Text> : null}

      <Button
        onPress={handleSelect}
        disabled={disabled}
        className="rounded-xl border border-border bg-popover">
        <Text className="text-sm text-secondary">{multiple ? 'Pick files' : 'Pick a file'}</Text>
      </Button>

      {helperText ? <Text className="text-xs text-muted-foreground">{helperText}</Text> : null}

      {!value || value.length === 0 ? (
        <Text className="text-sm text-muted-foreground">{emptyHint}</Text>
      ) : (
        value.map((asset, index) => (
          <View
            key={`${asset.uri}-${index}`}
            className="flex-row items-center justify-between rounded-xl border border-border bg-background px-3 py-2">
            <View className="flex-1 pr-3">
              <Text className="font-sora-semibold text-foreground">{asset.name}</Text>
              <Text className="text-xs text-muted-foreground">
                {asset.mimeType ?? 'unknown type'} · {Math.round((asset.size ?? 0) / 1024)} KB
              </Text>
            </View>
            <Button
              variant="ghost"
              className="h-9 w-9 rounded-full"
              onPress={() => handleRemove(index)}>
              <Icon as={Trash2} className="text-destructive" size={18} />
            </Button>
          </View>
        ))
      )}
    </View>
  );
}
