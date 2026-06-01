import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet, Text, View } from 'react-native';

// ── Foundrly theme tokens (spec-exact) ───────────────────────────────────────
const ACCENT = '#FF3B5C';
const ICON_BG = '#121217';
const ICON_BORDER = 'rgba(255, 59, 92, 0.2)';
const ICON_COLOR = '#FF3B5C';
const LABEL_COLOR = '#888899';

const USE_NATIVE = Platform.OS !== 'web';

// ── Geometry ──────────────────────────────────────────────────────────────────
const RINGS = [176, 132, 88, 44]; // concentric diameters (outer → inner)
const SWEEP_RADIUS = RINGS[0] / 2; // beam length = outer radius

// ── Single rounded icon tile + label (port of IconContainer) ─────────────────
type IconName = React.ComponentProps<typeof Ionicons>['name'];

function IconContainer({
  icon,
  text,
  delay = 0,
}: {
  icon: IconName;
  text: string;
  delay?: number;
}) {
  const appear = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(appear, {
      toValue: 1,
      duration: 200,
      delay: delay * 1000,
      easing: Easing.out(Easing.quad),
      useNativeDriver: USE_NATIVE,
    }).start();
  }, [appear, delay]);

  const scale = appear.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] });

  return (
    <Animated.View
      style={[styles.iconWrap, { opacity: appear, transform: [{ scale }] }]}
    >
      <View style={styles.iconTile}>
        <Ionicons name={icon} size={22} color={ICON_COLOR} />
      </View>
      <Text style={styles.iconLabel} numberOfLines={1}>
        {text}
      </Text>
    </Animated.View>
  );
}

// ── Radar (concentric rings + rotating sweep + pulsing core) ─────────────────
function RadarCore() {
  const spin = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const ringsFade = useRef(RINGS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Continuous 10s sweep, matching the original 20deg → 380deg rotation.
    const sweep = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: USE_NATIVE,
      })
    );

    // Center dot heartbeat.
    const heartbeat = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: USE_NATIVE,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: USE_NATIVE,
        }),
      ])
    );

    // Staggered ring reveal (delay: idx * 0.1s from the original).
    const reveal = Animated.stagger(
      100,
      ringsFade.map((v) =>
        Animated.timing(v, {
          toValue: 1,
          duration: 200,
          useNativeDriver: USE_NATIVE,
        })
      )
    );

    sweep.start();
    heartbeat.start();
    reveal.start();

    return () => {
      sweep.stop();
      heartbeat.stop();
    };
  }, [spin, pulse, ringsFade]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['20deg', '380deg'],
  });
  const dotScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.7] });
  const dotOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 0.35] });

  return (
    <View style={styles.radarBg} pointerEvents="none">
      {RINGS.map((d, idx) => (
        <Animated.View
          key={`ring-${d}`}
          style={[
            styles.ring,
            {
              width: d,
              height: d,
              borderRadius: d / 2,
              borderColor: `rgba(255, 59, 92, ${1 - (idx + 1) * 0.1})`,
              opacity: ringsFade[idx],
            },
          ]}
        />
      ))}

      {/* Rotating sweep beam — pivots around the radar center */}
      <Animated.View style={[styles.sweepPivot, { transform: [{ rotate }] }]}>
        <LinearGradient
          colors={['transparent', ACCENT, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.sweepLine}
        />
      </Animated.View>

      {/* Pulsing core */}
      <Animated.View
        style={[
          styles.coreDot,
          { opacity: dotOpacity, transform: [{ scale: dotScale }] },
        ]}
      />
    </View>
  );
}

// ── Public Radar layout (rings behind, 7 Foundrly metric tiles on top) ───────
export function RadarEffect() {
  return (
    <View style={styles.wrap}>
      <RadarCore />

      {/* Row 1 — 3 tiles, spread */}
      <View style={styles.rowSpread}>
        <IconContainer icon="trending-up" text="Burn Rate" delay={0.2} />
        <IconContainer icon="people" text="Co-Founders" delay={0.3} />
        <IconContainer icon="locate" text="PMF Score" delay={0.4} />
      </View>

      {/* Row 2 — 2 tiles, centered */}
      <View style={styles.rowCenter}>
        <IconContainer icon="flash" text="AI Insights" delay={0.5} />
        <IconContainer icon="bar-chart" text="MRR Growth" delay={0.6} />
      </View>

      {/* Row 3 — 2 tiles, spread */}
      <View style={styles.rowSpread}>
        <IconContainer icon="globe" text="Market Fit" delay={0.7} />
        <IconContainer icon="rocket" text="Launch Stage" delay={0.8} />
      </View>
    </View>
  );
}

export default RadarEffect;

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
    paddingVertical: 8,
    justifyContent: 'space-between',
    minHeight: 220,
  },

  // Radar backdrop centered behind the tiles
  radarBg: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderWidth: 1,
  },
  sweepPivot: {
    position: 'absolute',
    width: 0,
    height: 0,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sweepLine: {
    position: 'absolute',
    left: 0,
    top: -1,
    height: 2,
    width: SWEEP_RADIUS,
  },
  coreDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: ACCENT,
  },

  // Tile rows
  rowSpread: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 64,
  },

  iconWrap: {
    alignItems: 'center',
    gap: 6,
  },
  iconTile: {
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: ICON_BORDER,
    backgroundColor: ICON_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: LABEL_COLOR,
    textAlign: 'center',
  },
});
