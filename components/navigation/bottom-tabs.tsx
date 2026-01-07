import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { Icon } from '@/components/ui/icon';
import {
  HomeIcon,
  UserIcon,
  BellIcon,
  SettingsIcon,
  LucideIcon,
  CalendarClockIcon,
  BookText,
} from 'lucide-react-native';
import { EdgeInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/lib/auth/auth-context';
import { HapticTabButton } from '../ui/haptic-tab-button';
import { ProtectedHeaderContainer } from '../layout/proctected-header-container';

interface BottomTabsProps {
  colorScheme: 'light' | 'dark' | undefined;
  insets: EdgeInsets;
}

export function BottomTabs({ colorScheme, insets }: BottomTabsProps) {
  const isDark = colorScheme === 'dark';
  const { user } = useAuth();
  const tabBarColors = {
    backgroundColor: isDark ? '#09090B' : '#F8FAFC',
    borderTopColor: isDark ? '#38383A' : '#E5E5EA',
    activeTintColor: isDark ? '#E8F2EC' : '#102C24',
    inactiveTintColor: isDark ? '#8E8E93' : '#94A3B8',
    activeIconBackground: isDark ? '#102C24' : '#E8F2EC',
    inactiveIconBackground: isDark ? '#1C1C1E' : '#94A3B8',
  };

  const renderTabIcon =
    (IconComponent: LucideIcon | string) =>
    ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
      <View
        style={[
          styles.iconWrapper,
          focused && styles.iconWrapperActive,
          focused && { backgroundColor: tabBarColors.activeIconBackground },
        ]}>
        {typeof IconComponent === 'string' ? (
          <Image
            source={{ uri: IconComponent }}
            style={{ width: size + 7, height: size + 7, borderRadius: 999999 }}
            className="rounded-full"
          />
        ) : (
          <Icon
            as={IconComponent as LucideIcon}
            size={size}
            className={`${focused ? '' : 'text-slate-400'}`}
          />
        )}
      </View>
    );

  return (
    <Tabs
      screenOptions={{
        header: (props) => {
          return props.options.title !== 'Profile' ? (
            <ProtectedHeaderContainer
              pageTitle={props.options.title ?? props.route.name}
              onChatPress={() => console.log('Chat pressed')}
              onAvatarPress={() => console.log('Avatar pressed')}
              onNotificationPress={() => console.log('notification pressed')}
            />
          ) : null;
        },
        headerShown: true,
        tabBarShowLabel: false,
        tabBarActiveTintColor: tabBarColors.activeTintColor,
        tabBarInactiveTintColor: tabBarColors.inactiveTintColor,
        tabBarButton: (props) => <HapticTabButton {...props} />,
        tabBarStyle: {
          backgroundColor: tabBarColors.backgroundColor,
          borderTopColor: tabBarColors.borderTopColor,
          borderTopWidth: 1,
          paddingBottom: insets.bottom + 8,
          paddingTop: 8,
          height: 65 + insets.bottom,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarIconStyle: styles.iconSlot,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: renderTabIcon(HomeIcon),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Schedule',
          tabBarIcon: renderTabIcon(CalendarClockIcon),
        }}
      />
      {/* Hidden tab for the middle button */}
      {/*Will uncomment when we decide to add in quick access*/}
      {/*<Tabs.Screen
        name="create"
        options={{
          title: '',
          tabBarItemStyle: styles.fabSpacerItem,
          tabBarButton: () => <View pointerEvents="none" style={styles.fabSpacerButton} />,
        }}
      />*/}
      <Tabs.Screen
        name="class"
        options={{
          title: 'Class',
          tabBarIcon: renderTabIcon(BookText),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: user ? renderTabIcon(user?.profile_image!) : renderTabIcon(UserIcon),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    width: 80,
    height: 55,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  iconWrapperActive: {
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 4,
  },
  iconSlot: {
    marginBottom: 4,
  },
  // fabSpacerItem: {
  //   width: 40,
  // },
  fabSpacerButton: {
    width: 40,
    height: '100%',
  },
});
