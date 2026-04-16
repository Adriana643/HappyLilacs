import { Tabs } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AppColors } from '@/constants/app-colors';

const TAB_ICON_SIZE = 26;
const TAB_ROW_MIN_HEIGHT = 52;
const TAB_TOP_PADDING = 8;
const TAB_EXTRA_HEIGHT = 10;

const TAB_SCREENS = [
  { name: 'index' as const, title: 'Home', icon: 'house.fill' as const },
  { name: 'my-plants' as const, title: 'My Plants', icon: 'leaf.fill' as const },
  { name: 'library' as const, title: 'Library', icon: 'book.fill' as const },
  { name: 'profile' as const, title: 'Profile', icon: 'person.crop.circle.fill' as const },
];

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = TAB_ROW_MIN_HEIGHT + insets.bottom + TAB_EXTRA_HEIGHT;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: AppColors.white,
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.72)',
        tabBarLabelStyle: styles.tabLabel,
        tabBarActiveBackgroundColor: AppColors.tabBarActivePill,
        tabBarStyle: [
          styles.tabBar,
          {
            height: tabBarHeight,
            paddingBottom: insets.bottom,
            paddingTop: TAB_TOP_PADDING,
            paddingHorizontal: 0,
            marginHorizontal: 0,
            backgroundColor: AppColors.tabBar,
          },
        ],
      }}>
      {TAB_SCREENS.map(({ name, title, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color }) => (
              <IconSymbol size={TAB_ICON_SIZE} name={icon} color={color} />
            ),
          }}
        />
      ))}
      <Tabs.Screen
        name="plants-info"
        options={{ href: null, headerShown: false }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.12)',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: Platform.OS === 'android' ? 4 : 0,
  },
});
