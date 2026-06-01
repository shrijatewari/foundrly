import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
  type TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

export type ProgressVariant = 'default' | 'success' | 'warning' | 'error';
export type ProgressSize = 'sm' | 'md' | 'lg';

export interface ProgressBarProps {
  progress: number; // 0-100
  variant?: ProgressVariant;
  size?: ProgressSize;
  label?: string;
  showPercent?: boolean;
  animated?: boolean;
  duration?: number;
}

const TRACK_COLOR = 'rgba(255,255,255,0.06)';

const HEIGHTS: Record<ProgressSize, number> = { sm: 4, md: 8, lg: 12 };

// Default keeps Foundrly's signature crimson gradient; the semantic variants
// use status colors that read well on the dark surface.
export const VARIANT_COLORS: Record<ProgressVariant, string> = {
  default: colors.accent,
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
};

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export default function ProgressBar({
  progress,
  variant = 'default',
  size = 'md',
  label,
  showPercent = false,
  animated = true,
  duration = 800,
}: ProgressBarProps) {
  const value = clamp(progress);
  const [trackWidth, setTrackWidth] = useState(0);
  const fill = useRef(new Animated.Value(0)).current;

  // Animate from the bar's current width to the new target. The value starts at
  // 0, so first paint animates 0 -> progress; later prop changes (e.g. live task
  // completion) ease smoothly from wherever the bar currently sits.
  useEffect(() => {
    if (trackWidth === 0) return;
    const target = (trackWidth * value) / 100;
    if (!animated) {
      fill.setValue(target);
      return;
    }
    Animated.timing(fill, {
      toValue: target,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [trackWidth, value, animated, duration, fill]);

  const height = HEIGHTS[size];
  const showHeader = Boolean(label) || showPercent;

  return (
    <View style={styles.wrap}>
      {showHeader && (
        <View style={styles.header}>
          {label ? <Text style={styles.label}>{label}</Text> : <View />}
          {showPercent && <Text style={styles.percent}>{Math.round(value)}%</Text>}
        </View>
      )}

      <View
        style={[styles.track, { height, borderRadius: height }]}
        onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
      >
        <Animated.View style={{ width: fill, height: '100%', borderRadius: height, overflow: 'hidden' }}>
          {variant === 'default' ? (
            <LinearGradient
              colors={[colors.primary, colors.accent]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={[styles.fill, { borderRadius: height }]}
            />
          ) : (
            <View
              style={[styles.fill, { borderRadius: height, backgroundColor: VARIANT_COLORS[variant] }]}
            />
          )}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontFamily: fonts.grotesk.medium,
    fontSize: 13,
    color: colors.text,
  } as TextStyle,
  percent: {
    fontFamily: fonts.mono.bold,
    fontSize: 13,
    color: colors.accent,
  } as TextStyle,
  track: {
    width: '100%',
    backgroundColor: TRACK_COLOR,
    overflow: 'hidden',
  },
  fill: {
    flex: 1,
  },
});
