import { useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

export interface FoundrlyDockProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

type IoniconName = keyof typeof Ionicons.glyphMap;

interface DockItem {
  id: string;
  label: string;
  // lucide originals: LayoutDashboard, Users, Sparkles, UserCircle.
  // Mapped to Ionicons since lucide-react does not run in React Native and
  // the app already standardizes on @expo/vector-icons.
  icon: IoniconName;
}

const dockItems: DockItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'community', label: 'Community', icon: 'people' },
  { id: 'ai', label: 'AI', icon: 'sparkles' },
  { id: 'profile', label: 'Profile', icon: 'person-circle' },
];

// Crimson-tinted palette derived from the Foundrly accent (#FF3B5C).
const TINT = {
  itemBg: 'rgba(255,59,92,0.05)',
  itemBgHover: 'rgba(255,59,92,0.08)',
  itemBgActive: 'rgba(255,59,92,0.12)',
  border: 'rgba(255,59,92,0.12)',
  borderHover: 'rgba(255,59,92,0.25)',
  borderActive: 'rgba(255,59,92,0.3)',
  glow: 'rgba(255,59,92,0.15)',
} as const;

// react-native-web has no native animation module; keep transforms/opacity on
// the JS driver there to avoid the unsupported-driver warning.
const USE_NATIVE_DRIVER = Platform.OS !== 'web';

interface DockItemProps {
  item: DockItem;
  isActive: boolean;
  onPress: () => void;
}

function DockItemComponent({ item, isActive, onPress }: DockItemProps) {
  const [hovered, setHovered] = useState(false);

  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const tooltipOpacity = useRef(new Animated.Value(0)).current;
  const tooltipTranslateY = useRef(new Animated.Value(4)).current;

  const animateIn = () => {
    setHovered(true);
    Animated.parallel([
      // Active tab stays stable — no scale / translate.
      Animated.timing(scale, {
        toValue: isActive ? 1 : 1.1,
        duration: 300,
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
      Animated.timing(translateY, {
        toValue: isActive ? 0 : -4,
        duration: 300,
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
      Animated.timing(tooltipOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
      Animated.timing(tooltipTranslateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
    ]).start();
  };

  const animateOut = () => {
    setHovered(false);
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
      Animated.timing(tooltipOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
      Animated.timing(tooltipTranslateY, {
        toValue: 4,
        duration: 200,
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
    ]).start();
  };

  const iconColor = isActive
    ? colors.accent
    : hovered
    ? colors.textSubtle
    : colors.textMuted;

  const tileStyle: ViewStyle = {
    backgroundColor: isActive
      ? TINT.itemBgActive
      : hovered
      ? TINT.itemBgHover
      : TINT.itemBg,
    borderColor: isActive
      ? TINT.borderActive
      : hovered
      ? TINT.borderHover
      : TINT.border,
    ...(hovered && !isActive
      ? {
          shadowColor: TINT.glow,
          shadowOpacity: 1,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
        }
      : null),
  };

  return (
    <View style={styles.itemWrap}>
      {/* Tooltip */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.tooltip,
          { opacity: tooltipOpacity, transform: [{ translateY: tooltipTranslateY }] },
        ]}
      >
        <Text style={styles.tooltipText}>{item.label}</Text>
        <View style={styles.tooltipArrow} />
      </Animated.View>

      <Pressable
        onPress={onPress}
        onHoverIn={animateIn}
        onHoverOut={animateOut}
        onPressIn={animateIn}
        onPressOut={animateOut}
        accessibilityRole="button"
        accessibilityLabel={item.label}
        accessibilityState={{ selected: isActive }}
      >
        <Animated.View
          style={[styles.tile, tileStyle, { transform: [{ scale }, { translateY }] }]}
        >
          <Ionicons name={item.icon} size={26} color={iconColor} />
          {isActive && <View style={styles.activeDot} />}
        </Animated.View>
      </Pressable>
    </View>
  );
}

export default function FoundrlyDock({ activeTab, onTabChange }: FoundrlyDockProps) {
  return (
    <View style={styles.root} pointerEvents="box-none">
      <View style={styles.dock}>
        {dockItems.map((item) => (
          <DockItemComponent
            key={item.id}
            item={item}
            isActive={item.id === activeTab}
            onPress={() => onTabChange(item.id)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: 'center',
    zIndex: 50,
  },
  dock: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 22,
    backgroundColor: 'rgba(11,11,15,0.9)',
    borderWidth: 1,
    borderColor: TINT.border,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
    // backdrop-blur-xl (web only; native has no equivalent without expo-blur).
    ...(Platform.OS === 'web'
      ? ({ backdropFilter: 'blur(20px)' } as unknown as ViewStyle)
      : null),
  },
  itemWrap: {
    position: 'relative',
    alignItems: 'center',
  },
  tile: {
    width: 58,
    height: 58,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    position: 'absolute',
    bottom: 6,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.accent,
  },
  tooltip: {
    position: 'absolute',
    bottom: 70,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: 'rgba(255,59,92,0.08)',
  },
  tooltipText: {
    fontFamily: fonts.grotesk.regular,
    fontSize: 11,
    letterSpacing: 0.5,
    color: colors.textSubtle,
  } as TextStyle,
  tooltipArrow: {
    position: 'absolute',
    bottom: -3,
    width: 6,
    height: 6,
    backgroundColor: colors.secondary,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,59,92,0.08)',
    transform: [{ rotate: '45deg' }],
  },
});
