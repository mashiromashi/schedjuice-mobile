import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useAttachments } from '@/lib/hooks/useAttachments';
import { submissionType } from '@/types/assignment';
import { Paperclip } from 'lucide-react-native';
import { useState } from 'react';
import { Linking, TouchableOpacity } from 'react-native';
import { View } from 'react-native';

interface ViewSubmissionProps {
  submission: submissionType[];
}

export default function ViewSubmission({ submission }: ViewSubmissionProps) {
  const [viewSubmission, setViewSubmission] = useState(false);
  const currentSubmission = submission[0];
  const { data } = useAttachments({
    resource: 'submission',
    foreignKey: String(currentSubmission?.id) || '',
  });
  return (
    <View>
      <Button onPress={() => setViewSubmission(!viewSubmission)}>
        <Text>View Submission</Text>
      </Button>
      {viewSubmission ? (
        <View className="mt-4 gap-4">
          <Text className="font-sora-bold">Submission Details</Text>
          <Text>{currentSubmission?.description}</Text>
          <View className="gap-4">
            {data.attachments ? (
              data.attachments.map((attachment: any) => (
                <TouchableOpacity
                  className="w-full items-center justify-start"
                  onPress={() => Linking.openURL(attachment.downloadUrl)}
                  key={attachment.id}>
                  <View className="flex-row items-center">
                    <Icon as={Paperclip} className="mr-2 h-6 w-6 text-gray-400" />
                    <Text className="font-sora-regular text-blue-500">{attachment.filename}</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text>There are no attachments</Text>
            )}
          </View>
        </View>
      ) : null}
    </View>
  );
}
