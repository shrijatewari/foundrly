import { TextStyle } from 'react-native';

/**
 * Foundrly type scale.
 * Four roles cover the app's needs: heading, subheading, body, and caption.
 * Values are plain objects so they can be spread directly into StyleSheet
 * entries or passed to a Text component's `style` prop.
 */
export const typography = {
  heading: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  subheading: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600',
    letterSpacing: 0.15,
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    letterSpacing: 0.25,
  },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;

export default typography;
