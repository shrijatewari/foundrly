import { useEffect, useId, useRef, type ReactNode } from 'react';
import { Animated, StyleSheet, Text, View, type TextStyle } from 'react-native';
import Svg, { Circle, Defs, G, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { VARIANT_COLORS, type ProgressVariant } from './ProgressBar';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface CircularProgressProps {
  progress: number; // 0-100
  size?: number; // diameter in px
  strokeWidth?: number;
  variant?: ProgressVariant;
  showPercent?: boolean;
  children?: ReactNode; // custom center content (overrides percent)
  animated?: boolean;
}

const TRACK_COLOR = 'rgba(255,255,255,0.06)';

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export default function CircularProgress({
  progress,
  size = 88,
  strokeWidth = 8,
  variant = 'default',
  showPercent = true,
  children,
  animated = true,
}: CircularProgressProps) {
  const value = clamp(progress);
  const gradientId = `cp-grad-${useId()}`;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) {
      anim.setValue(value);
      return;
    }
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: value,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  }, [value, animated, anim]);

  const strokeDashoffset = anim.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  const isGradient = variant === 'default';
  const solidColor = VARIANT_COLORS[variant];

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {isGradient && (
          <Defs>
            <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={colors.primary} />
              <Stop offset="100%" stopColor={colors.accent} />
            </LinearGradient>
          </Defs>
        )}
        <G rotation={-90} origin={`${center}, ${center}`}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={TRACK_COLOR}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <AnimatedCircle
            cx={center}
            cy={center}
            r={radius}
            stroke={isGradient ? `url(#${gradientId})` : solidColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </G>
      </Svg>

      <View style={[StyleSheet.absoluteFill, styles.center]}>
        {children ?? (showPercent && <Text style={styles.percent}>{Math.round(value)}%</Text>)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  percent: {
    fontFamily: fonts.mono.bold,
    fontSize: 16,
    color: colors.text,
  } as TextStyle,
});
