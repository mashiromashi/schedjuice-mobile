import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View, Text, Pressable } from 'react-native';
import { Input } from '../ui/input';
import { Icon } from '../ui/icon';
import { Check, ChevronLeft, EyeIcon, EyeOffIcon } from 'lucide-react-native';
import { Button } from '../ui/button';

type PasswordType = 'oldPassword' | 'newPassword' | 'confirmPassword';
type FormValues = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  show: {
    oldPassword: boolean;
    newPassword: boolean;
    confirmPassword: boolean;
  };
};

export default function ChangePassword({ onBack }: { onBack: () => void }) {
  const { control, formState, register, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      show: {
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
      },
    },
  });

  const show = watch('show');
  return (
    <View className="space-y-5">
      {(
        ['oldPassword', 'newPassword', 'confirmPassword'].map((prop) => prop) as PasswordType[]
      ).map((key) => (
        <View key={key} className="mb-7 gap-1 space-y-2">
          <Text className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
            {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
          </Text>
          <View className="relative">
            <Controller
              control={control}
              name={key}
              render={({ field: { onChange, value } }) => (
                <>
                  <Input
                    value={value}
                    onChangeText={onChange}
                    placeholder="Password"
                    secureTextEntry={!show[key]}
                    className={`h-12 border-input bg-background text-base ${formState.errors[key] ? 'border-red-500' : ''}`}
                  />
                  <Pressable
                    onPress={() => setValue(`show.${key}`, !show[key])}
                    className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Icon
                      as={show[key] ? EyeIcon : EyeOffIcon}
                      size={16}
                      className="text-muted-foreground"
                    />
                  </Pressable>
                </>
              )}
            />
          </View>
        </View>
      ))}
      <Button className="mb-7 mt-6 h-12 w-full flex-row items-center justify-center gap-1 bg-primary hover:bg-primary/90">
        <Icon as={Check} size={18} className="text-primary-foreground" />
        <Text className="font-medium text-base text-primary-foreground">Done</Text>
      </Button>
      <Button
        onPress={onBack}
        className="mt-1 h-12 w-full flex-row items-center justify-center gap-1 rounded-lg bg-card shadow-md">
        <Icon as={ChevronLeft} size={16} className="text-foreground" />
        <Text className="font-medium text-sm leading-7 text-foreground">Back</Text>
      </Button>
    </View>
  );
}
