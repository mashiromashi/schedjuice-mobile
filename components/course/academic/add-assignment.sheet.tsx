import { PickerAsset } from '@/components/document-picker';
import FilePicker from '@/components/file-picker';
import { Button } from '@/components/ui/button';
import DateTimeField from '@/components/ui/date-time-picker';
import GenericInput from '@/components/ui/generic-input';
import { Icon } from '@/components/ui/icon';
import { Textarea } from '@/components/ui/textarea';
import uploadToJuiceBox from '@/lib/file-upload';
import { makePostRequest } from '@/lib/helpers/utils';
import { cn } from '@/lib/utils';
import { useCourseStore } from '@/store/course';
import { assignmentCreateSchema, assignmentCreateType } from '@/types/assignment';
import { attendanceSchema } from '@/types/attendance';
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import * as DocumentPicker from 'expo-document-picker';
import { CheckIcon, Trash2, UploadIcon, X } from 'lucide-react-native';
import React, { forwardRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View, Text, ActivityIndicator } from 'react-native';
import { Toast } from 'toastify-react-native';
import z from 'zod';

interface AddAssignmentSheetProps {
  onClose: () => void;
}

type DateFieldName = 'available_datetime' | 'due_datetime';

const DATE_FIELD_LABELS: Record<DateFieldName, string> = {
  available_datetime: 'Available Date',
  due_datetime: 'Due Date',
};

const DATE_FIELD_PLACEHOLDERS: Record<DateFieldName, string> = {
  available_datetime: 'Select available date & time',
  due_datetime: 'Select due date & time',
};

function ensureDate(value: unknown): Date | undefined {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const next = new Date(value);
    if (!Number.isNaN(next.getTime())) {
      return next;
    }
  }

  return undefined;
}

export const AddAssignmentSheet = forwardRef<BottomSheet, AddAssignmentSheetProps>((props, ref) => {
  const createAssignmentForm = useForm({
    // The schema uses z.coerce.number(), which narrows output to number but keeps
    // input as unknown in the Zod type. This confuses the resolver's overloads.
    // Casting here preserves runtime behavior while aligning with our form value type.
    resolver: zodResolver(assignmentCreateSchema),
    defaultValues: {
      title: '',
      instructions: '',
      available_datetime: new Date(),
      due_datetime: new Date(),
      available_score: 1,
      max_attempts: 1,
    },
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [activePicker, setActivePicker] = React.useState<DateFieldName | null>(null);
  const [pendingValue, setPendingValue] = React.useState<Date | null>(null);
  const [isPickerVisible, setPickerVisible] = React.useState(false);
  const [attachments, setAttachments] = React.useState<PickerAsset[]>([]);
  const { selectedCourse } = useCourseStore();

  const handleOpenPicker = React.useCallback((field: DateFieldName, currentValue?: Date) => {
    const initialValue = currentValue ?? new Date();
    setActivePicker(field);
    setPendingValue(initialValue);
    setPickerVisible(true);
  }, []);

  const handleConfirmPicker = React.useCallback(
    (next: Date) => {
      if (!activePicker) {
        return;
      }

      const finalDate = next;

      createAssignmentForm.setValue(activePicker, finalDate, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      setPendingValue(finalDate);
      setPickerVisible(false);
      setActivePicker(null);
    },
    [activePicker, createAssignmentForm]
  );

  const handlePreviewChange = React.useCallback((next: Date) => {
    setPendingValue(next);
  }, []);

  const activePickerTitle = React.useMemo(() => {
    if (!activePicker) {
      return undefined;
    }

    return activePicker === 'available_datetime' ? 'Available Date & Time' : 'Due Date & Time';
  }, [activePicker]);

  const handleCancelPicker = React.useCallback(() => {
    setPickerVisible(false);
    setActivePicker(null);
    setPendingValue(null);
  }, []);

  const assignmentCreateMutation = useMutation({
    mutationKey: ['assignmentCreate'],
    mutationFn: (data: any) => {
      setIsLoading(false);
      return makePostRequest('assignments', {
        ...data,
        course: selectedCourse?.id,
        instructions: {
          type: 'doc',
          content: [{ type: 'paragraph', content: [{ text: data.instructions, type: 'text' }] }],
        },
      });
    },
    onSuccess: async (data) => {
      Toast.show({
        type: 'success',
        text1: 'Assignment has been created sucessfully.',
      });
      if (attachments.length > 0) {
        await uploadToJuiceBox({
          files: attachments,
          tableName: 'assignment',
          foreignKey: data.data.data.id,
          isPublic: false,
          purge: false,
        });
        Toast.show({
          type: 'success',
          text1: 'Assignment has been created sucessfully.',
        });
      }
      props.onClose();
      createAssignmentForm.reset();
      setIsLoading(false);
    },
    onError: (e) => {
      Toast.show({
        type: 'error',
        text1: 'Error while creating assignment',
        text2: 'Please try again.',
      });
    },
  });

  async function handleAddAssignment(data: any) {
    assignmentCreateMutation.mutateAsync(data);
  }
  function handleOnClose() {
    props.onClose();
    createAssignmentForm.reset();
  }

  return (
    <>
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={['100%']}
        onClose={() => handleOnClose()}
        backgroundStyle={{ backgroundColor: 'transparent' }}
        handleIndicatorStyle={{ backgroundColor: 'transparent' }}>
        <BottomSheetScrollView contentContainerClassName="gap-4 px-4 mb-10 dark:bg-background">
          <View className="mb-10 flex flex-col gap-4">
            <View className="flex w-full flex-row items-center px-10">
              <Text className="mr-auto w-full text-center font-sora-bold text-xl text-foreground">
                Add Assignment
              </Text>
              <Button
                variant="ghost"
                onPress={props.onClose}
                className="ml-auto w-10 rounded-full bg-[#E8F2EC] dark:bg-background">
                <Icon
                  as={X}
                  size={30}
                  height={30}
                  className="text-[#102C24] dark:text-foreground"
                />
              </Button>
            </View>
            <View className="flex flex-col gap-4">
              <Controller
                name="title"
                control={createAssignmentForm.control}
                rules={{ required: 'Title is required' }}
                render={({ field }) => (
                  <GenericInput
                    icon={null}
                    type="text"
                    label="Title"
                    placeholder="Enter assignment title"
                    {...field}
                  />
                )}
              />
              <Controller
                name="available_datetime"
                control={createAssignmentForm.control}
                rules={{ required: 'Available Date is required' }}
                render={({ field, fieldState }) => {
                  const currentDate = ensureDate(field.value);
                  return (
                    <View className="flex-1">
                      <Text className="mb-2 text-sm text-secondary dark:text-foreground">
                        {DATE_FIELD_LABELS.available_datetime}
                      </Text>
                      <Button
                        variant="outline"
                        className="h-12 w-full justify-start rounded-xl border border-border bg-popover px-4 dark:bg-background"
                        onPress={() => handleOpenPicker('available_datetime', currentDate)}>
                        <Text
                          className={cn(
                            'flex-1 text-base',
                            currentDate ? 'text-foreground' : 'text-muted-foreground'
                          )}>
                          {currentDate
                            ? format(currentDate, 'MMM d, yyyy @ HH:mm')
                            : DATE_FIELD_PLACEHOLDERS.available_datetime}
                        </Text>
                      </Button>
                      {fieldState.error ? (
                        <Text className="mt-1 text-xs text-destructive">
                          {fieldState.error.message}
                        </Text>
                      ) : null}
                    </View>
                  );
                }}
              />
              <Controller
                name="due_datetime"
                control={createAssignmentForm.control}
                rules={{ required: 'Due Date is required' }}
                render={({ field, fieldState }) => {
                  const currentDate = ensureDate(field.value);
                  return (
                    <View className="flex-1">
                      <Text className="mb-2 text-sm text-secondary dark:text-foreground">
                        {DATE_FIELD_LABELS.due_datetime}
                      </Text>
                      <Button
                        variant="outline"
                        className="h-12 w-full justify-start rounded-xl border border-border bg-popover px-4 dark:bg-background"
                        onPress={() => handleOpenPicker('due_datetime', currentDate)}>
                        <Text
                          className={cn(
                            'flex-1 text-base',
                            currentDate ? 'text-foreground' : 'text-muted-foreground'
                          )}>
                          {currentDate
                            ? format(currentDate, 'MMM d, yyyy @ HH:mm')
                            : DATE_FIELD_PLACEHOLDERS.due_datetime}
                        </Text>
                      </Button>
                      {fieldState.error ? (
                        <Text className="mt-1 text-xs text-destructive">
                          {fieldState.error.message}
                        </Text>
                      ) : null}
                    </View>
                  );
                }}
              />
              <View className="flex flex-1 flex-row gap-2">
                <Controller
                  name="available_score"
                  control={createAssignmentForm.control}
                  rules={{ required: 'Available Score is required' }}
                  render={({ field }) => (
                    <View className="flex-1">
                      <GenericInput
                        icon={null}
                        type="number"
                        label="Available Score"
                        defaultValue=""
                        placeholder="Enter available score"
                        {...field}
                      />
                    </View>
                  )}
                />
                <Controller
                  name="max_attempts"
                  control={createAssignmentForm.control}
                  rules={{ required: 'Max Attempt is required' }}
                  render={({ field }) => (
                    <View className="flex-1">
                      <GenericInput
                        icon={null}
                        type="number"
                        label="Max Attempts"
                        defaultValue=""
                        placeholder="Enter max attempts"
                        {...field}
                      />
                    </View>
                  )}
                />
              </View>
              <Controller
                name="instructions"
                control={createAssignmentForm.control}
                rules={{ required: 'Instructions are required' }}
                render={({ field: { value, onChange } }) => (
                  <View>
                    <Text className="mb-2 text-sm text-secondary dark:text-foreground">
                      Instructions
                    </Text>
                    <Textarea
                      value={value}
                      onChangeText={onChange}
                      placeholder="Enter Instruction"
                      className="h-36 placeholder:text-muted dark:bg-background dark:text-foreground"
                    />
                  </View>
                )}
              />
              <FilePicker attachments={attachments} setAttachments={setAttachments} />
              <Button onPress={() => createAssignmentForm.handleSubmit(handleAddAssignment)()}>
                <Icon as={CheckIcon} className="text-white" />
                <Text className="text-foreground">Confirm</Text>
                {/*{assignmentCreateMutation.status === 'success' ? ( <>
                    <Icon as={CheckIcon} className="text-white shadow" />
                    <Text className="text-white">Confirm</Text>
                  </>
                ) : (
                  <ActivityIndicator size="small" color="white" />
                )}*/}
              </Button>
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
      <DateTimeField
        isVisible={isPickerVisible}
        mode="datetime"
        date={pendingValue ?? new Date()}
        onConfirm={handleConfirmPicker}
        onCancel={handleCancelPicker}
      />
    </>
  );
});
