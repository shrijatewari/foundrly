import { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  useWindowDimensions,
  View,
  type TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

// The three words, each carrying its own gradient pair. These mirror the
// gradient-1/2/3 start/end tokens from the original tailwind config:
//   Build.  -> accent  -> primary
//   Learn.  -> primary -> accent
//   Launch. -> accent  -> white (fade)
// CSS bg-clip-text gradients and keyframes don't exist in React Native, so the
// "animated gradient foreground" is reproduced by looping Animated color
// interpolation, staggered per word like the original animation delays.
const WORDS = [
  { text: 'Build.', from: colors.accent, to: colors.primary },
  { text: 'Learn.', from: colors.primary, to: colors.accent },
  { text: 'Launch.', from: colors.accent, to: '#FFFFFF' },
] as const;

const CRIMSON_BORDER = 'rgba(255,59,92,0.15)';

interface AnimatedWordProps {
  word: (typeof WORDS)[number];
  delay: number;
}

function AnimatedWord({ word, delay }: AnimatedWordProps) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(progress, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: false,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: false,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [progress, delay]);

  const color = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [word.from, word.to],
  });

  return <Animated.Text style={[styles.word, { color }]}>{word.text}</Animated.Text>;
}

export default function AnimatedTagline() {
  const { width } = useWindowDimensions();
  // Original layout: flex-col on mobile, flex-row on lg (>=1024px).
  const isWide = width >= 1024;

  return (
    <View style={styles.maskBox}>
      {/* Corner plus icons (recolored to accent, positions unchanged). */}
      <Ionicons name="add" size={28} color={colors.accent} style={styles.plusTopLeft} />
      <Ionicons name="add" size={28} color={colors.accent} style={styles.plusBottomLeft} />
      <Ionicons name="add" size={28} color={colors.accent} style={styles.plusTopRight} />
      <Ionicons name="add" size={28} color={colors.accent} style={styles.plusBottomRight} />

      <View style={[styles.words, isWide ? styles.wordsRow : styles.wordsCol]}>
        {WORDS.map((word, index) => (
          <AnimatedWord key={word.text} word={word} delay={index * 220} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // border-[rgba(255,59,92,0.15)]; the radial mask-image has no RN equivalent.
  maskBox: {
    position: 'relative',
    padding: 28,
    borderWidth: 1,
    borderColor: CRIMSON_BORDER,
  },
  words: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  wordsCol: {
    flexDirection: 'column',
  },
  word: {
    fontFamily: fonts.grotesk.bold,
    fontSize: 52,
    lineHeight: 56,
    letterSpacing: -1.5,
    textAlign: 'center',
    paddingHorizontal: 10,
  } as TextStyle,
  plusTopLeft: { position: 'absolute', top: -14, left: -14 },
  plusBottomLeft: { position: 'absolute', bottom: -14, left: -14 },
  plusTopRight: { position: 'absolute', top: -14, right: -14 },
  plusBottomRight: { position: 'absolute', bottom: -14, right: -14 },
});
