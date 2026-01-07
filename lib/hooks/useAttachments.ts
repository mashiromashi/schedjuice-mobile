import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getItemAsync } from 'expo-secure-store';

interface useAttachmentProps {
  resource: string;
  foreignKey: string;
}
export function useAttachments({ resource, foreignKey }: useAttachmentProps) {
  return useQuery({
    queryKey: [resource, foreignKey],
    queryFn: async () => {
      const token = await getItemAsync('access');
      const schema = await getItemAsync('schema');
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_JUICEBOX_ORIGIN}/attachments/${resource}/${foreignKey}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'x-schema': schema,
          },
        }
      );
      return response.data;
    },
  });
}
