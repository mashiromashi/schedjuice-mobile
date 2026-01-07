import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Ellipsis, Megaphone, Speaker } from 'lucide-react-native';
import { View, Image, Pressable } from 'react-native';

export default function CourseAnnouncement() {
  return (
    <Card>
      <CardContent>
        <View className="flex-row items-center gap-2">
          <Icon as={Megaphone} size={15} />
          <Text>Class Related Announcements</Text>
        </View>
        <View className="flex-row gap-2 bg-white py-4">
          <Image
            source={require('assets/images/profile-demo.png')}
            style={{ width: 38, height: 38 }}
            className="rounded-full"
          />
          <View className="flex flex-1 flex-col pr-3">
            <View className="flex-1 flex-row items-center gap-4">
              <Text className="font-semibold text-sm">John Doe</Text>
              <Text className="text-sm text-gray-500">1h</Text>
              <Icon as={Ellipsis} size={15} className="ml-auto" />
            </View>
            <View className="w-full flex-1 flex-row">
              <Text className="text-sm text-gray-500">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl eget
                aliquam aliquet, nisl nisl aliquet nisl, eget aliquam nisl nisl eget aliquam.
              </Text>
            </View>
          </View>
        </View>
      </CardContent>
    </Card>
  );
}
