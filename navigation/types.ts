import type { NavigatorScreenParams } from '@react-navigation/native';

/**
 * Tabs shown inside the main (authenticated) experience.
 */
export type MainTabParamList = {
  Dashboard: undefined;
  Community: undefined;
  AI: undefined;
  Profile: undefined;
};

/**
 * Top-level stack. Auth screens (Splash, Login) sit alongside the
 * tab navigator, which is mounted as the `Main` route.
 */
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
