import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TabList from '../ui/tab-list';
import ClassScreen from '../screen/class-screen';
import AssignmentScreen from '../screen/assignment-screen';
import AnnouncementScreen from '../screen/announcements-screen';
import Notification from '@/app/(protected)/notification';

export default function TopTabs() {
  const [tabValue, setTabValue] = useState('Classes');

  const tabs = [
    { title: 'Classes', content: <ClassScreen /> },
    { title: 'Assignments', content: <AssignmentScreen /> },
    { title: 'Announcements', content: <AnnouncementScreen /> },
  ];

  return (
    <View className="flex-1">
      <View className="mx-auto w-full flex-1 pt-4">
        <TabList
          tabs={tabs}
          value={tabValue}
          setValue={setTabValue}
          className="sticky w-full flex-1"
          listClassName="ml-4"
          contentClassName="flex-1 w-full"
        />
      </View>
    </View>
  );
}
