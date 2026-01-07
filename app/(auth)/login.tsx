import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import OTPCodeInput from '@/components/ui/otp-input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { Stack, useRouter } from 'expo-router';
import { EyeIcon, EyeOffIcon, KeyIcon, MailIcon, ChevronDownIcon } from 'lucide-react-native';
import React, { useState, useRef } from 'react';
import { Pressable, ScrollView, View, Image, TextInput } from 'react-native';
import z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from '@/lib/auth';
import TabList from '@/components/ui/tab-list';
import { Toast } from 'toastify-react-native';
import PhoneNumberInput from '@/components/ui/phone-number-input';
import { useAuthStore } from '@/lib/auth/auth-store';

export default function LoginScreen() {
  const [activeTab, setActiveTab] = useState('Email');
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [smsStep, setSmsStep] = useState('phone'); // 'phone' or 'verification'
  const [countryCode, setCountryCode] = useState('+95');
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { checkAuthState } = useAuthStore();

  const loginSchema = z.object({
    email: z.email('Invalid email address!'),
    password: z.string({ message: 'Password is empty!' }),
  });

  const form = useForm({
    resolver: zodResolver(loginSchema),
  });

  const loginTabs = [
    {
      title: 'Email',
      content: (
        <TabsContent value="Email" className="mt-2 space-y-5">
          {/* Email Input */}
          <View className="mb-4 gap-1 space-y-2">
            <Text className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              EMAIL
            </Text>
            <View className="relative">
              <View className="absolute left-3 top-1/2 z-10 -translate-y-1/2">
                <Icon as={MailIcon} size={16} className="text-muted-foreground" />
              </View>
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
                    className={`h-12 border-input pl-10 text-base ${form.formState.errors.email ? 'border-red-500' : ''}`}
                  />
                )}
              />
            </View>
          </View>

          {/* Password Input */}
          <View className="gap-1 space-y-2">
            <Text className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              PASSWORD
            </Text>
            <View className="relative">
              <View className="absolute left-3 top-1/2 z-10 -translate-y-1/2">
                <Icon as={KeyIcon} size={16} className="text-muted-foreground" />
              </View>
              <Controller
                control={form.control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <>
                    <Input
                      value={value}
                      onChangeText={onChange}
                      placeholder="Password"
                      secureTextEntry={!showPassword}
                      className={`h-12 border-input pl-10 text-base ${form.formState.errors.password ? 'border-red-500' : ''}`}
                    />
                    <Pressable
                      onPress={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Icon
                        as={showPassword ? EyeOffIcon : EyeIcon}
                        size={16}
                        className="text-muted-foreground"
                      />
                    </Pressable>
                  </>
                )}
              />
            </View>
          </View>
        </TabsContent>
      ),
    },
    {
      title: 'SMS',
      content: (
        <TabsContent value="SMS" className="mt-2 space-y-5">
          {smsStep === 'phone' ? (
            // Phone Number Input Stage
            <>
              <View className="mb-4 gap-1 space-y-2">
                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <PhoneNumberInput label="Phone Number" value={phoneNumber} extension="" />
                  </View>
                </View>
              </View>

              {/* Get OTP Button */}
              <Button
                className="mt-6 h-12 w-full bg-primary hover:bg-primary/90"
                onPress={() => setSmsStep('verification')}>
                <Text className="text-base font-medium text-primary-foreground">Get OTP Code</Text>
              </Button>
            </>
          ) : (
            // Verification Code Input Stage
            <>
              <View className="mb-6 space-y-4">
                <Text className="text-sm leading-5 text-foreground">
                  We've sent you a 6-digit verification code to your mobile number.
                </Text>
                <Text className="font-medium text-foreground">
                  {countryCode} {phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1$2$3')}
                </Text>
              </View>

              {/* Verification Code Input */}
              <View className="space-y-4">
                <OTPCodeInput />

                {/* Resend Code Link */}
                <View className="mt-4 flex-row justify-center">
                  <Pressable>
                    <Text className="text-sm text-primary">Resend code</Text>
                  </Pressable>
                </View>
              </View>

              {/* Verify Button */}
              <Button className="mt-6 h-12 w-full bg-primary hover:bg-primary/90">
                <Text className="text-base font-medium text-primary-foreground">
                  Verify & Log In
                </Text>
              </Button>

              {/* Cancel Button */}
              <Button
                variant="outline"
                className="mt-4 h-12 w-full border-border"
                onPress={() => setSmsStep('phone')}>
                <Text className="text-base text-foreground">Cancel</Text>
              </Button>
            </>
          )}
        </TabsContent>
      ),
    },
  ];

  async function submitHandler(data: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    const response = await login({
      email: data.email,
      password: data.password,
      isMicrosoft: false,
      onError: (e) => {
        setIsLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: 'Please check your credentials and try again.',
        });
      },
    });
    if (response.data) {
      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: 'Redirecting...',
      });
      // Refresh auth state and navigate to dashboard
      await checkAuthState();
      router.replace('/(protected)/' as any);
    }
    setIsLoading(false);
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerTransparent: true,
          headerShadowVisible: false,
          headerBackVisible: false,
        }}
      />
      <ScrollView className="flex-1">
        <View className="flex-1 gap-5 px-6 pt-20">
          {/* Header */}
          <View className="mb-8">
            <Text variant="h2" className="mb-2 border-0 pb-0 text-3xl font-bold text-foreground">
              Log in
            </Text>
            <Text className="text-base text-muted-foreground">Login via email or SMS code</Text>
          </View>

          <View className="space-y-6">
            {/* Tabs for Email/SMS */}
            <TabList tabs={loginTabs} value={activeTab} setValue={setActiveTab} />
            {/* Login Button - Only show for Email tab */}
            {activeTab === 'Email' && (
              <Button
                className="mt-6 h-12 w-full bg-primary hover:bg-primary/90"
                onPress={() => form.handleSubmit(submitHandler)()}>
                <Text className="text-base font-medium text-primary-foreground">Log In</Text>
              </Button>
            )}

            {/* Forgot Password Link - Only show for Email tab */}
            {activeTab === 'Email' && (
              <View className="mt-4 flex-row justify-end">
                <Pressable>
                  <Text className="text-sm text-primary">Forgot Password?</Text>
                </Pressable>
              </View>
            )}

            {/* Divider and Microsoft Login - Show for Email tab or SMS phone stage */}
            {(activeTab === 'Email' || (activeTab === 'SMS' && smsStep === 'phone')) && (
              <>
                {/* Divider */}
                <View className="my-8 flex-row items-center gap-4">
                  <View className="h-px flex-1 bg-border" />
                  <Text className="text-xs text-muted-foreground">or</Text>
                  <View className="h-px flex-1 bg-border" />
                </View>

                {/* Microsoft Login */}
                <Button variant="outline" className="h-12 w-full border-border">
                  <View className="flex-row items-center gap-3">
                    {/* Microsoft Logo */}
                    <Image
                      source={require('@/assets/images/microsoft.png')}
                      style={{ width: 16, height: 16 }}
                      resizeMode="contain"
                    />
                    <Text className="text-sm text-foreground">Login via Microsoft account</Text>
                  </View>
                </Button>
              </>
            )}
          </View>

          {/* Footer Links */}
          <View className="mb-8 mt-auto flex-row items-center justify-center gap-2">
            <Pressable>
              <Text className="text-xs text-muted-foreground">Privacy Policy</Text>
            </Pressable>
            <Text className="text-xs text-muted-foreground">|</Text>
            <Pressable>
              <Text className="text-xs text-muted-foreground">Terms of Use</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
