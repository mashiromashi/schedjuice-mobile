import { Card } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { UserIcon } from 'lucide-react-native'
import { View } from 'react-native'
import { Icon } from './ui/icon'


type User = {
  name: string;
  email: string;
  roles: string[];
};

export function UserInfo({ user }: { user: User | null }) {
return (
    <>
      <View className="rounded-lg border border-border bg-card p-4">
            <View className="flex-row items-center gap-3">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Icon as={UserIcon} size={24} className="text-primary" />
              </View>
              <View className="flex-1">
                <Text className="font-medium text-foreground">{user?.name}</Text>
                <Text className="text-sm text-muted-foreground">{user?.email}</Text>
                {user?.roles && user.roles.length > 0 && (
                  <Text className="text-xs capitalize text-muted-foreground">
                    {user.roles.join(', ')}
                  </Text>
                )}
              </View>
            </View>
          </View>
    </>
)
        
}