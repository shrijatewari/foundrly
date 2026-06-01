import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type TextStyle,
} from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

export interface SegmentedProgressProps {
  value?: number; // 0-100
  segments?: number;
  label?: string;
  showPercentage?: boolean;
  animated?: boolean;
}

const UNFILLED = 'rgba(255,255,255,0.06)';
const USE_NATIVE_DRIVER = Platform.OS !== 'web';

const clamp = (n: number) => Math.max(0, Math.min(100, n));

// Linear interpolation between two hex colors -> "rgb(r,g,b)".
function lerpColor(a: string, b: string, t: number): string {
  const ah = parseInt(a.slice(1), 16);
  const bh = parseInt(b.slice(1), 16);
  const ar = ah >> 16, ag = (ah >> 8) & 0xff, ab = ah & 0xff;
  const br = bh >> 16, bg = (bh >> 8) & 0xff, bb = bh & 0xff;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `rgb(${r},${g},${bl})`;
}

interface SegmentProps {
  index: number;
  filled: boolean;
  color: string;
  hoveredSegment: number | null;
  onHover: (index: number | null) => void;
}

function Segment({ index, filled, color, hoveredSegment, onHover }: SegmentProps) {
  const scaleY = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let scale = 1;
    let ty = 0;
    if (hoveredSegment !== null) {
      const distance = Math.abs(hoveredSegment - index);
      if (distance === 0) {
        scale = 1.3;
        ty = -1;
      } else if (distance <= 3) {
        const falloff = Math.cos((distance / 3) * (Math.PI / 2));
        scale = 1 + 0.2 * falloff;
        ty = -0.5 * falloff;
      }
    }
    Animated.parallel([
      Animated.timing(scaleY, { toValue: scale, duration: 300, useNativeDriver: USE_NATIVE_DRIVER }),
      Animated.timing(translateY, { toValue: ty, duration: 300, useNativeDriver: USE_NATIVE_DRIVER }),
    ]).start();
  }, [hoveredSegment, index, scaleY, translateY]);

  return (
    <Pressable
      style={styles.segmentHit}
      onHoverIn={() => onHover(index)}
      onHoverOut={() => onHover(null)}
    >
      <Animated.View
        style={[
          styles.segment,
          {
            backgroundColor: filled ? color : UNFILLED,
            transform: [{ scaleY }, { translateY }],
          },
          filled && hoveredSegment === index ? styles.segmentGlow : null,
        ]}
      />
    </Pressable>
  );
}

export default function SegmentedProgress({
  value = 0,
  segments = 20,
  label = 'Progress',
  showPercentage = true,
  animated = true,
}: SegmentedProgressProps) {
  const target = clamp(value);
  const [displayValue, setDisplayValue] = useState(animated ? 0 : target);
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const rafRef = useRef<number | null>(null);

  // Cubic ease-out count-up from the current displayed value to the target,
  // re-running whenever `value` changes (so it stays dynamic / live).
  useEffect(() => {
    if (!animated) {
      setDisplayValue(target);
      return;
    }
    const duration = 800;
    const startValue = displayValue;
    const startTime = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(startValue + (target - startValue) * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // displayValue intentionally omitted: we snapshot it as the start value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, animated]);

  const filledSegments = Math.round((displayValue / 100) * segments);

  return (
    <View style={styles.wrap}>
      {(label || showPercentage) && (
        <View style={styles.header}>
          {label ? <Text style={styles.label}>{label}</Text> : <View />}
          {showPercentage && (
            <Text style={styles.percent}>{Math.round(displayValue)}%</Text>
          )}
        </View>
      )}

      <View style={styles.segmentRow}>
        {Array.from({ length: segments }).map((_, index) => (
          <Segment
            key={index}
            index={index}
            filled={index < filledSegments}
            color={lerpColor(colors.primary, colors.accent, segments > 1 ? index / (segments - 1) : 1)}
            hoveredSegment={hoveredSegment}
            onHover={setHoveredSegment}
          />
        ))}
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
    marginBottom: 10,
  },
  label: {
    fontFamily: fonts.grotesk.medium,
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  } as TextStyle,
  percent: {
    fontFamily: fonts.mono.bold,
    fontSize: 13,
    color: colors.accent,
  } as TextStyle,
  segmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 4,
  },
  segmentHit: {
    flex: 1,
  },
  segment: {
    height: 12,
    borderRadius: 4,
    width: '100%',
  },
  segmentGlow: {
    shadowColor: colors.accent,
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
});
