/**
 * Foundrly color palette.
 * Dark-first theme: deep near-black backgrounds with a crimson primary
 * and a vivid accent used for highlights and calls-to-action.
 */
export const colors = {
  background: '#0B0B0F',
  secondary: '#121217',
  surface: '#121217',
  primary: '#6E0F1A',
  accent: '#FF3B5C',
  text: '#FFFFFF',
  textMuted: '#888899',
  textSubtle: '#CCCCDD',
  placeholder: '#444455',
  border: 'rgba(255, 59, 92, 0.12)',
  inputBorder: 'rgba(255, 255, 255, 0.08)',
  hairline: 'rgba(255, 255, 255, 0.1)',
} as const;

export type ColorName = keyof typeof colors;

export default colors;
