import { useEffect, useRef } from 'react';
import { Animated, SafeAreaView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SPLASH_DURATION_MS = 2000;
const FADE_IN_MS = 900;

export default function SplashScreen({ navigation }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
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
      navigation.replace('Login');
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [navigation, opacity, translateY]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={{ opacity, transform: [{ translateY }] }}>
          <Animated.Text style={styles.wordmark}>Foundrly</Animated.Text>
          <Animated.Text style={styles.tagline}>Build. Learn. Launch.</Animated.Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: {
    ...typography.heading,
    fontSize: 44,
    lineHeight: 50,
    color: colors.accent,
    textAlign: 'center',
  },
  tagline: {
    ...typography.body,
    color: colors.text,
    opacity: 0.75,
    textAlign: 'center',
    marginTop: 10,
    letterSpacing: 1.5,
  },
});
