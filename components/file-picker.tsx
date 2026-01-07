import { PickerAsset } from '@/components/document-picker';
import { useCallback, useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { View } from 'react-native';
import { Button } from './ui/button';
import { Icon } from './ui/icon';
import { Trash2, UploadIcon } from 'lucide-react-native';
import { Text } from './ui/text';

function formatAttachmentSize(bytes?: number | null) {
  if (!bytes) {
    return '0 KB';
  }

  const kb = bytes / 1024;
  if (kb >= 1024) {
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(kb))} KB`;
}

interface FilePickerProps {
  attachments: PickerAsset[];
  setAttachments: React.Dispatch<React.SetStateAction<PickerAsset[]>>;
}

export default function FilePicker({ attachments, setAttachments }: FilePickerProps) {
  const [uploadError, setUploadError] = useState<string | null>(null);

  const ATTACHMENT_ACCEPTED_TYPES = [
    'image/*',
    'video/*',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ];
  const ATTACHMENT_SIZE_LIMIT_MB = 25;
  const ATTACHMENT_SIZE_LIMIT_BYTES = ATTACHMENT_SIZE_LIMIT_MB * 1024 * 1024;

  const handlePickAttachments = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ATTACHMENT_ACCEPTED_TYPES,
        multiple: true,
        copyToCacheDirectory: false,
      });

      if (result.canceled) {
        return;
      }

      const assets = result.assets ?? [];
      const oversizeAsset = assets.find((asset) => (asset.size ?? 0) > ATTACHMENT_SIZE_LIMIT_BYTES);

      if (oversizeAsset) {
        setUploadError(`"${oversizeAsset.name}" exceeds the ${ATTACHMENT_SIZE_LIMIT_MB} MB limit.`);
        return;
      }

      setUploadError(null);
      setAttachments((current: PickerAsset[]) => {
        const merged = [...current, ...assets];
        const uniqueByUri = new Map<string, PickerAsset>();

        merged.forEach((asset) => {
          uniqueByUri.set(asset.uri, asset);
        });

        return Array.from(uniqueByUri.values());
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to open your files right now.';
      setUploadError(message);
    }
  }, []);

  const handleRemoveAttachment = useCallback((uri: string) => {
    setAttachments((current) => current.filter((asset) => asset.uri !== uri));
  }, []);

  return (
    <View className="w-full flex-1 gap-4">
      <Button variant="outline" onPress={handlePickAttachments}>
        <Icon as={UploadIcon} color="brand-green" />
        <Text className="text-brand-green dark:text-foreground">Upload</Text>
      </Button>
      {uploadError ? (
        <Text className="text-xs text-destructive">{uploadError}</Text>
      ) : (
        <Text className="text-xs text-muted-foreground">
          Optional: upload supporting PDFs or images (max {ATTACHMENT_SIZE_LIMIT_MB} MB each).
        </Text>
      )}
      <View className="gap-2">
        {attachments.length === 0 ? (
          <Text className="text-sm text-muted-foreground">No files selected yet.</Text>
        ) : (
          attachments.map((asset) => (
            <View
              key={asset.uri}
              className="flex-row items-center justify-between rounded-xl border border-border bg-background px-3 py-2">
              <View className="flex-1 pr-3">
                <Text className="font-sora-semibold text-foreground">
                  {asset.name ?? 'Untitled file'}
                </Text>
                <Text className="text-xs text-muted-foreground">
                  {(asset.mimeType ?? 'application/octet-stream') +
                    ' - ' +
                    formatAttachmentSize(asset.size)}
                </Text>
              </View>
              <Button
                variant="ghost"
                className="h-9 w-9 rounded-full"
                onPress={() => handleRemoveAttachment(asset.uri)}>
                <Icon as={Trash2} className="text-destructive" size={18} />
              </Button>
            </View>
          ))
        )}
      </View>
    </View>
  );
}
