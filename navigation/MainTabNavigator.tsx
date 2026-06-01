import {
  createBottomTabNavigator,
  type BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from './types';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import FoundrlyDock from '../components/FoundrlyDock';
import DashboardScreen from '../screens/DashboardScreen';
import CommunityScreen from '../screens/CommunityScreen';
import AIScreen from '../screens/AIScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Adapts React Navigation's tab bar contract to the FoundrlyDock's
// { activeTab, onTabChange } API. Route names map to dock ids by lowercasing.
function FoundrlyTabBar({ state, navigation }: BottomTabBarProps) {
  const activeRoute = state.routes[state.index];
  const activeTab = activeRoute.name.toLowerCase();

  const handleTabChange = (tabId: string) => {
    const route = state.routes.find((r) => r.name.toLowerCase() === tabId);
    if (!route) return;

    const isFocused = route.key === activeRoute.key;
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name as never);
    }
  };

  return <FoundrlyDock activeTab={activeTab} onTabChange={handleTabChange} />;
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <FoundrlyTabBar {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { ...typography.subheading, color: colors.text },
        headerTintColor: colors.text,
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="AI" component={AIScreen} />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
