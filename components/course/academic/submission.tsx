import { PickerAsset } from '@/components/document-picker';
import FilePicker from '@/components/file-picker';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';
import { isStudent } from '@/lib/auth/authorization';
import uploadToJuiceBox from '@/lib/file-upload';
import { getAssignmentStatus } from '@/lib/helpers/assignment';
import { makePostRequest, searchEntities } from '@/lib/helpers/utils';
import { useSubmissionStore } from '@/store/submission';
import { operatorEnum } from '@/types/api';
import { assignmentStatus, assignmentType, submissionType } from '@/types/assignment';
import { accountType } from '@/types/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Upload } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { Toast } from 'toastify-react-native';
import ViewSubmission from './student-view-submission';

interface SubmissionProps {
  user: accountType;
  assignment: assignmentType;
}

export default function Submission({ user, assignment }: SubmissionProps) {
  const { selectedSubmission, setSelectedSubmission } = useSubmissionStore();
  const [description, setDescription] = React.useState('');
  const [attachments, setAttachments] = React.useState<PickerAsset[]>([]);
  const queryClient = useQueryClient();
  const getAttempts = useQuery({
    queryKey: ['getAttempts', assignment.id],
    queryFn: async () => {
      const res = await searchEntities(
        'submissions',
        { size: 1, sorts: ['-attempt_count'], expand: ['attachments'] },
        {
          filter_params: [
            {
              operator: operatorEnum.exact,
              field_name: 'created_by',
              value: String(user!.id),
            },
            {
              operator: operatorEnum.exact,
              field_name: 'assignment',
              value: String(assignment.id),
            },
          ],
        }
      );
      setSelectedSubmission(res.data.data[0]);
      return res;
    },
    enabled: !!assignment.id && isStudent(user!),
  });

  const isMaxAttemptsExceeded =
    getAttempts.data?.data.data[0]?.attempt_count >= assignment.max_attempts!;

  const submissionCreateMutation = useMutation({
    mutationKey: ['submissionCreate'],
    mutationFn: (data: Partial<submissionType>) => makePostRequest('submissions', data),
    onSuccess: async (response: any) => {
      if (attachments.length > 0) {
        await uploadToJuiceBox({
          files: attachments,
          tableName: 'submission',
          foreignKey: response.data.data.id,
          isPublic: false,
          purge: false,
        });
        queryClient.invalidateQueries({
          queryKey: ['assignments', 'getAttempts'],
        });
        Toast.show({
          type: 'success',
          text1: 'Submission created successfully.',
        });
      }
    },
    onSettled: (response) => {
      setDescription('');
      setAttachments([]);
      queryClient.invalidateQueries({
        queryKey: ['assignments', 'getAttempts'],
      });
      Toast.show({
        type: 'success',
        text1: 'Submission created successfully.',
      });
    },
  });

  function getAssignmentButtons(assignment: assignmentType, user: accountType) {
    if (!assignment) return null;
    const status = getAssignmentStatus(assignment, user!);
    switch (status) {
      case assignmentStatus.available_to_submit:
      case assignmentStatus.submitted:
        return isMaxAttemptsExceeded ? (
          <View className="gap-4">
            <ViewSubmission submission={assignment.submissions} />
            <Text className="text-center text-bell-red">Attempts Exceeded</Text>
          </View>
        ) : (
          <>
            <View>
              <Text className="mb-2 font-sora-regular text-sm text-secondary dark:text-foreground">
                Description
              </Text>
              <Textarea value={description} onChangeText={(e) => setDescription(e)} />
            </View>
            <View className="flex-col items-center gap-4">
              <FilePicker attachments={attachments} setAttachments={setAttachments} />
              <Button className="w-full" onPress={() => onSubmitHandler()}>
                <Text className="font-sora-regular text-white">Submit</Text>
              </Button>
            </View>
          </>
        );

      case assignmentStatus.require_resubmission:
        return (
          <>
            <View>
              <Text className="mb-2 font-sora-regular text-sm text-secondary">Description</Text>
              <Textarea value={description} onChangeText={(e) => setDescription(e)} />
            </View>
            <View className="flex-col items-center gap-4">
              <FilePicker attachments={attachments} setAttachments={setAttachments} />
              <Button className="w-full" onPress={() => onSubmitHandler()}>
                <Text className="font-sora-regular text-white">Resubmit</Text>
              </Button>
            </View>
          </>
        );
      case assignmentStatus.graded:
        return (
          <View className="flex-col items-center gap-4">
            <Button className="w-full">
              <Text className="font-sora-regular text-white">View Grade</Text>
            </Button>
          </View>
        );
      case assignmentStatus.overdue:
        return (
          <View className="flex-row items-center justify-center">
            <Text className="font-sora-regular text-red-500">Assignment is overdue</Text>
          </View>
        );
    }
  }
  async function onSubmitHandler() {
    if (isMaxAttemptsExceeded) {
      Toast.show({
        text1: 'Max Attempts Exceeded',
        text2: 'You have reached the maximum number of attempts for this assignment.',
        type: 'error',
      });
      return;
    }
    if (attachments.length === 0) {
      Toast.show({
        text1: 'No Files Selected',
        text2: 'Please select at least one file to submit.',
        type: 'error',
      });
      return;
    }
    if (attachments.length > 10) {
      Toast.show({
        text1: 'Too Many Files',
        text2: 'You can only submit up to 10 files.',
        type: 'error',
      });
      return;
    }
    await submissionCreateMutation.mutateAsync({
      assignment: assignment.id,
      description: description,
    });
  }

  return (
    <View className="gap-4">
      <Text className="text-center text-foreground">
        Attempts ({getAttempts.data?.data.data[0]?.attempt_count || 1}/{assignment?.max_attempts})
      </Text>
      {getAssignmentButtons(assignment, user)}
    </View>
  );
}
