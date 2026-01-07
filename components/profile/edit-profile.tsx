import {
  View,
  Text,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Check, ChevronLeft, X } from 'lucide-react-native';

import { Icon } from '../ui/icon';
import { Input } from '../ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '../ui/textarea';
import { UserInfoDropdownProps } from '@/types/profile';
import { useAuth } from '@/lib/auth/auth-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { accountEditSchema, accountType } from '@/types/user';
import { useMutation, useQuery } from '@tanstack/react-query';
import { updateEntity } from '@/lib/helpers/utils';
import { Toast } from 'toastify-react-native';
import { useRouter } from 'expo-router';
import z from 'zod';
import { formatDateMonthYear } from '@/lib/helpers/date';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { countries } from '@/config/countries';

export default function EditProfile() {
  const { user, checkAuthState } = useAuth();
  const form = useForm({
    defaultValues: {
      name: user?.name,
      email: user?.email,
      communication_email: user?.communication_email,
      phone_number: user?.phone_number,
      house_number: user?.house_number,
      street: user?.street,
      township: user?.township,
      city: user?.city,
      region: user?.region,
      country: user?.country,
      gender: user?.gender,
      date_of_birth: user?.date_of_birth,
    },
    resolver: zodResolver(accountEditSchema),
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isCountryPickerVisible, setIsCountryPickerVisible] = useState(false);

  const { mutateAsync } = useMutation({
    mutationFn: async (data: any) => updateEntity('users', user?.id!, data),
    onSuccess: async (response) => {
      Toast.success('Profile updated successfully');
      // Store updated account data in AsyncStorage (not SecureStore)
      await AsyncStorage.setItem('account', JSON.stringify(response.data.data));
      await checkAuthState();
      router.push('/');
    },
  });

  async function handleUpdateProfile(data: z.infer<typeof accountEditSchema>) {
    // setLoading(true);
    await mutateAsync({
      ...data,
      date_of_birth: formatDateMonthYear(data.date_of_birth, 'yyyy-MM-dd'),
    });
    // setLoading(false);
  }

  return (
    <View className="my-8">
      {/* Name Input  */}
      <View className="mb-4 gap-1">
        <Text className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
          NAME
        </Text>
        <View className="relative">
          <Controller
            control={form.control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                placeholder="user name"
                autoCapitalize="none"
                className={`h-12 border-input text-base ${form.formState.errors.email ? 'border-red-500' : ''}`}
              />
            )}
          />
        </View>
      </View>
      {/* Email Input */}
      <View className="mb-4 gap-1">
        <Text className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
          PRIMARY EMAIL
        </Text>
        <View className="relative">
          <Controller
            control={form.control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                placeholder="example@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                className={`h-12 border-input text-base ${form.formState.errors.email ? 'border-red-500' : ''}`}
              />
            )}
          />
        </View>
      </View>
      <View className="mb-4 gap-1">
        <Text className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
          COMMUNICATION EMAIL
        </Text>
        <View className="relative">
          <Controller
            control={form.control}
            name="communication_email"
            render={({ field: { onChange, value } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                placeholder="example@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                className={`h-12 border-input text-base ${form.formState.errors.communication_email ? 'border-red-500' : ''}`}
              />
            )}
          />
        </View>
      </View>
      {/* Password Input */}
      <View className="mb-4 gap-1">
        <Text className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
          PHONE NUMBER
        </Text>
        <View className="relative">
          <Controller
            control={form.control}
            name="phone_number"
            render={({ field: { onChange, value } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                placeholder="xxxxxxxxxxx"
                className={`h-12 border-input text-base`}
              />
            )}
          />
        </View>
      </View>
      {/* Address Input  */}
      <View className="mb-4 gap-1">
        <Text className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
          House Number
        </Text>
        <View className="relative">
          <Controller
            control={form.control}
            name="house_number"
            render={({ field: { onChange, value } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                placeholder="House Number"
                className={`h-12 border-input text-base`}
              />
            )}
          />
        </View>
      </View>
      <View className="mb-4 gap-1">
        <Text className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
          Street
        </Text>
        <View className="relative">
          <Controller
            control={form.control}
            name="street"
            render={({ field: { onChange, value } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                placeholder="Street"
                className={`h-12 border-input text-base`}
              />
            )}
          />
        </View>
      </View>
      <View className="mb-4 gap-1">
        <Text className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
          Country
        </Text>
        <View className="relative">
          <Controller
            control={form.control}
            name="country"
            render={({ field: { onChange, value } }) => {
              const selectedCountry =
                countries.find((country) => country.code === value) ?? countries[0];

              if (Platform.OS === 'ios') {
                return (
                  <>
                    <TouchableOpacity
                      onPress={() => setIsCountryPickerVisible(true)}
                      className="h-12 flex-row items-center justify-between rounded-lg border border-input px-3">
                      <Text className="text-base text-foreground">
                        {selectedCountry?.name ?? 'Select country'}
                      </Text>
                      <Icon
                        as={ChevronLeft}
                        size={16}
                        className="-rotate-90 text-muted-foreground"
                      />
                    </TouchableOpacity>
                    <Modal
                      visible={isCountryPickerVisible}
                      transparent
                      animationType="slide"
                      onRequestClose={() => setIsCountryPickerVisible(false)}>
                      <View className="flex-1 justify-end">
                        <TouchableWithoutFeedback onPress={() => setIsCountryPickerVisible(false)}>
                          <View className="flex-1 bg-black/30" />
                        </TouchableWithoutFeedback>
                        <View className="rounded-t-3xl border border-border bg-background p-4">
                          <View className="mb-3 flex-row items-center justify-between">
                            <TouchableOpacity onPress={() => setIsCountryPickerVisible(false)}>
                              <Text className="text-base text-muted-foreground">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => {
                                setIsCountryPickerVisible(false);
                              }}>
                              <Text className="font-medium text-base text-primary">Done</Text>
                            </TouchableOpacity>
                          </View>
                          <Picker
                            selectedValue={value}
                            onValueChange={(itemValue) => {
                              onChange(itemValue);
                            }}>
                            {countries.map((country) => (
                              <Picker.Item
                                key={country.code}
                                label={country.name}
                                value={country.code}
                              />
                            ))}
                          </Picker>
                        </View>
                      </View>
                    </Modal>
                  </>
                );
              }

              return (
                <View className="h-12 justify-center rounded-lg border border-input">
                  <Picker selectedValue={value} onValueChange={onChange} className="h-full w-full">
                    {countries.map((country) => (
                      <Picker.Item key={country.code} label={country.name} value={country.code} />
                    ))}
                  </Picker>
                </View>
              );
            }}
          />
        </View>
      </View>
      <View className="mb-4 gap-1">
        <Text className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
          Region
        </Text>
        <View className="relative">
          <Controller
            control={form.control}
            name="region"
            render={({ field: { onChange, value } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                placeholder="Region"
                className={`h-12 border-input text-base`}
              />
            )}
          />
        </View>
      </View>
      <View className="mb-4 gap-1">
        <Text className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
          City
        </Text>
        <View className="relative">
          <Controller
            control={form.control}
            name="city"
            render={({ field: { onChange, value } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                placeholder="City"
                className={`h-12 border-input text-base`}
              />
            )}
          />
        </View>
      </View>
      <View className="mb-4 gap-1">
        <Text className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
          Township
        </Text>
        <View className="relative">
          <Controller
            control={form.control}
            name="township"
            render={({ field: { onChange, value } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                placeholder="Township"
                className={`h-12 border-input text-base`}
              />
            )}
          />
        </View>
      </View>
      <Button
        onPress={() => form.handleSubmit(handleUpdateProfile)()}
        className="mt-3 h-12 w-full flex-row items-center justify-center gap-1 bg-primary hover:bg-primary/90"
        disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <>
            <Icon as={Check} size={16} className="text-primary-foreground" />
            <Text className="font-medium text-base text-primary-foreground">Done</Text>
          </>
        )}
      </Button>
    </View>
  );
}
