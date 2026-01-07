import React, { useCallback, useEffect } from 'react';
import { Pressable, View } from 'react-native';
import { CheckCircle2, X } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { Toast } from 'toastify-react-native';
import { ToastConfigParams, ToastShowParams } from 'toastify-react-native/utils/interfaces';
import { COLORS } from '@/theme/colors';

function SuccessToastCard(props: ToastConfigParams) {
  const handleDismiss = () => {
    Toast.hide();
  };

  return (
    <View className="w-full px-4">
      <View
        className="self-center overflow-hidden rounded-3xl bg-white px-4 py-3 shadow-lg shadow-black/15"
        style={{ width: '100%', maxWidth: 360 }}>
        <View className="flex-row items-start gap-3">
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="font-semibold text-base text-slate-800">
                {props.text1 ?? 'Success'}
              </Text>
              <CheckCircle2 size={18} color={'#60A17E'} />
            </View>
            {props.text2 ? (
              <Text className="mt-1 text-sm text-slate-600">{props.text2}</Text>
            ) : null}
          </View>
          <Pressable
            accessibilityHint="Dismiss notification"
            accessibilityLabel="Close toast"
            accessibilityRole="button"
            hitSlop={8}
            onPress={handleDismiss}
            className="-mr-1 -mt-1 rounded-full p-1">
            <X size={24} color="#4B5563" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function ErrorToastCard(props: ToastConfigParams) {
  const handleDismiss = () => {
    Toast.hide();
  };

  return (
    <View className="w-full px-4">
      <View
        className="self-center overflow-hidden rounded-3xl bg-white px-4 py-3 shadow-lg shadow-black/15"
        style={{ width: '100%', maxWidth: 360 }}>
        <View className="flex-row items-start gap-3">
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="font-semibold text-base text-slate-800">
                {props.text1 ?? 'Error'}
              </Text>
              <X size={18} color={'#EF4444'} />
            </View>
            {props.text2 ? (
              <Text className="mt-1 text-sm text-slate-600">{props.text2}</Text>
            ) : null}
          </View>
          <Pressable
            accessibilityHint="Dismiss notification"
            accessibilityLabel="Close toast"
            accessibilityRole="button"
            hitSlop={8}
            onPress={handleDismiss}
            className="-mr-1 -mt-1 rounded-full p-1">
            <X size={24} color="#4B5563" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export const toastConfig = {
  success: (params: any) => <SuccessToastCard {...params} />,
  error: (params: any) => <ErrorToastCard {...params} />,
};

export type ToastVariant = keyof typeof toastConfig;
