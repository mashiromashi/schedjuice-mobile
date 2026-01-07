import { PickerAsset } from '@/components/document-picker';
import * as SecureStore from 'expo-secure-store';
import { retrieveParsedDataFromSecureStore } from './helpers/json-helper';
import { organizationType } from '@/types/organization';

const FALLBACK_MIME_TYPE = 'application/octet-stream';
const UPLOAD_PATH = '/attachments/upload';

const extensionMimeMap: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  heic: 'image/heic',
  heif: 'image/heif',
  bmp: 'image/bmp',
  svg: 'image/svg+xml',
  pdf: 'application/pdf',
  txt: 'text/plain',
  csv: 'text/csv',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

function resolveMimeType(file: PickerAsset) {
  if (file.mimeType) return file.mimeType;

  const extension = file.name?.split('.').pop()?.toLowerCase();
  if (extension && extensionMimeMap[extension]) {
    return extensionMimeMap[extension];
  }

  return FALLBACK_MIME_TYPE;
}

function getUploadUrl() {
  const baseUrl = process.env.EXPO_PUBLIC_JUICEBOX_ORIGIN;

  if (!baseUrl) {
    throw new Error('Missing EXPO_PUBLIC_JUICEBOX_ORIGIN for uploads.');
  }

  return `${baseUrl.replace(/\/$/, '')}${UPLOAD_PATH}`;
}

interface uploadToJuiceBoxProps {
  files: PickerAsset[];
  tableName: string;
  foreignKey: string;
  isPublic?: boolean;
  purge?: boolean;
}

export default async function uploadToJuiceBox({
  files,
  tableName,
  foreignKey,
  isPublic = false,
  purge = false,
}: uploadToJuiceBoxProps) {
  if (!files?.length) {
    throw new Error('At least one file is required for upload.');
  }

  const formData = new FormData();

  files.forEach((file) => {
    if (!file.uri) {
      return;
    }

    formData.append('attachments[]', {
      uri: file.uri,
      name: file.name ?? 'attachment',
      type: resolveMimeType(file),
    } as any);
  });

  formData.append('table_name', tableName);
  formData.append('foreign_key', foreignKey);
  formData.append('is_public', isPublic.toString());
  formData.append('purge', purge.toString());
  const token = await SecureStore.getItemAsync('access');
  const schema = await SecureStore.getItemAsync('schema');

  const response = await fetch(getUploadUrl(), {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
      'x-schema': schema!,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'File upload failed');
    throw new Error(errorBody || 'File upload failed');
  }

  return response.json();
}
