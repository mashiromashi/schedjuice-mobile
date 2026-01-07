import { useAuth } from '@/lib/auth/auth-context';
import { usePathname } from 'expo-router';
import { Image, View } from 'react-native';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ProfileContainerProps {
  children: React.ReactNode;
}

export default function ProfileContainer({ children }: ProfileContainerProps) {
  const { user } = useAuth();
  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="pb-4">
      <View className="h-40 w-full">
        <Image
          source={{
            uri:
              user?.cover_image ||
              'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
          }}
          className="h-full w-full"
          resizeMode="cover"
        />
      </View>
      <View className="-mt-5 flex-1 rounded-t-3xl bg-slate-50 px-4 pt-6 dark:bg-background sm:px-6 md:px-10">
        <View className="absolute -top-12 left-6 mt-2">
          <View className="h-20 w-20 rounded-full border-2 border-border bg-card shadow-sm">
            <Image
              source={{
                uri:
                  user?.profile_image ||
                  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
              }}
              className="h-full w-full rounded-full"
              resizeMode="cover"
            />
          </View>
        </View>
        {children}
      </View>
    </ScrollView>
  );
}
