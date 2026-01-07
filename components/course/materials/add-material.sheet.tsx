import { DocumentPickerField, PickerAsset } from '@/components/document-picker';
import { Button } from '@/components/ui/button';
import GenericInput from '@/components/ui/generic-input';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { createMaterialSchema } from '@/types/materials';
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react-native';
import { forwardRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

interface AddMaterialSheetProps {
  onClose: () => void;
}

export const AddMaterialSheet = forwardRef<BottomSheet, AddMaterialSheetProps>((props, ref) => {
  const { onClose } = props;
  const createMaterialForm = useForm({
    resolver: zodResolver(createMaterialSchema),
  });

  return (
    <BottomSheet ref={ref} index={-1} snapPoints={['100%']} onClose={props.onClose}>
      <View className="flex w-full flex-row items-center px-10">
        <Text className="mr-auto w-full text-center font-sora-bold text-xl text-foreground">
          Add Material
        </Text>
        <Button
          variant="ghost"
          onPress={props.onClose}
          className="ml-auto w-10 rounded-full bg-[#E8F2EC]">
          <Icon as={X} size={30} height={30} color="#102C24" />
        </Button>
      </View>
      <BottomSheetScrollView
        contentContainerClassName="gap-4 px-4"
        showsVerticalScrollIndicator={false}>
        <View className="flex flex-col gap-4">
          <Controller
            name="title"
            control={createMaterialForm.control}
            rules={{ required: 'Title is required' }}
            render={({ field }) => (
              <GenericInput
                icon={null}
                type="text"
                label="Title"
                defaultValue=""
                placeholder="Enter material title"
                {...field}
              />
            )}
          />
          <Controller
            name="description"
            control={createMaterialForm.control}
            rules={{ required: 'Description is required' }}
            render={({ field }) => (
              <GenericInput
                icon={null}
                type="text"
                label="Description"
                defaultValue=""
                placeholder="Enter material description"
                {...field}
              />
            )}
          />
          <Controller
            name="files"
            control={createMaterialForm.control}
            rules={{ required: 'File is required' }}
            render={({ field, fieldState }) => (
              <DocumentPickerField
                label="File"
                value={field.value as PickerAsset[]}
                onChange={field.onChange}
                multiple
                accept={['image/*', 'application/pdf']}
                sizeLimitBytes={50 * 1024 * 1024}
                helperText="PDF or Images, max 50MB each"
              />
            )}
          />
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
});
