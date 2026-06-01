import { useEffect, useRef } from 'react';
import { Animated, SafeAreaView, StyleSheet, View, type TextStyle } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import AnimatedTagline from '../components/AnimatedTagline';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SPLASH_DURATION_MS = 2500;
const FADE_IN_MS = 700;
const FADE_OUT_MS = 400;

export default function SplashScreen({ navigation }: Props) {
  const screenOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(screenOpacity, {
        toValue: 1,
        duration: FADE_IN_MS,
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: FADE_IN_MS,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: FADE_IN_MS,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      // Fade the whole splash out over 400ms, then advance (the RN-navigation
      // equivalent of the spec's onFinish -> setShowSplash(false)).
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: FADE_OUT_MS,
        useNativeDriver: true,
      }).start(() => navigation.replace('Login'));
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [navigation, screenOpacity, contentOpacity, translateY]);

  return (
    <Animated.View style={[styles.fill, { opacity: screenOpacity }]}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Animated.View
            style={{ opacity: contentOpacity, transform: [{ translateY }], alignItems: 'center' }}
          >
            <Animated.Text style={styles.wordmark}>Foundrly</Animated.Text>
            <AnimatedTagline />
          </Animated.View>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  wordmark: {
    fontFamily: fonts.grotesk.bold,
    fontSize: 32,
    color: colors.accent,
    letterSpacing: -0.6,
    textAlign: 'center',
    marginBottom: 16,
  } as TextStyle,
});
