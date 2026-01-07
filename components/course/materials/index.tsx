import { useAuth } from '@/lib/auth/auth-context';
import { CourseFloatingActionButton } from '../floating-action-button';
import { useCourseStore } from '@/store/course';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { canEditCourse } from '@/lib/auth/authorization';
import { Text } from '@/components/ui/text';
import { Card, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { BookOpen } from 'lucide-react-native';
import React from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { AddMaterialSheet } from './add-material.sheet';

export default function CourseMaterials() {
  const { user } = useAuth();
  const { selectedCourse } = useCourseStore();
  const isTeacher = canEditCourse(
    user!,
    selectedCourse?.user_courses.map((userCourse: any) => userCourse.user.id)
  );
  const demoMats = [
    {
      id: 'demo1',
      title: 'Demo Material 1',
      description: 'This is a demo material',
      type: 'file',
      url: 'https://example.com/demo1.pdf',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'demo2',
      title: 'Demo Material 2',
      description: 'This is another demo material',
      type: 'link',
      url: 'https://example.com/demo2',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  async function handleMaterialPress(material: any) {
    // if (material.type === 'file') {
    //   Linking.openURL(material.url);
    // } else if (material.type === 'link') {
    //   Linking.openURL(material.url);
    // }
  }
  const addMaterialSheetRef = React.useRef<BottomSheet>(null);
  const [isAddMaterialSheetOpen, setIsAddMaterialSheetOpen] = React.useState(false);

  // Bottom sheet callbacks
  const openBottomSheet = React.useCallback(() => {
    addMaterialSheetRef.current?.expand();
    setIsAddMaterialSheetOpen(true);
  }, []);

  const closeBottomSheet = React.useCallback(() => {
    addMaterialSheetRef.current?.close();
    setIsAddMaterialSheetOpen(false);
  }, []);

  return (
    <View className="relative flex-1">
      {isTeacher && (
        <CourseFloatingActionButton
          onPress={() => openBottomSheet()}
          isActive={isAddMaterialSheetOpen}
        />
      )}
      <ScrollView className="p-4">
        <View className="gap-2">
          {demoMats.map((mat) => (
            <TouchableOpacity key={mat.id} onPress={() => handleMaterialPress(mat)}>
              <Card className="flex-1 flex-row border border-border">
                <View className="flex-1 items-center justify-start">
                  <View className="rounded-lg bg-[#E3F2FD] p-1.5">
                    <Icon as={BookOpen} className="h-7 w-7 text-[#007AFF]" />
                  </View>
                </View>
                <View className="w-4/5">
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1 gap-2">
                      <CardTitle className="text-lg text-foreground">{mat.title}</CardTitle>
                    </View>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <AddMaterialSheet ref={addMaterialSheetRef} onClose={closeBottomSheet} />
    </View>
  );
}
