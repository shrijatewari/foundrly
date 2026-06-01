/**
 * Foundrly color palette.
 * Dark-first theme: deep near-black backgrounds with a crimson primary
 * and a vivid accent used for highlights and calls-to-action.
 */
export const colors = {
  background: '#0B0B0F',
  secondary: '#121217',
  primary: '#6E0F1A',
  accent: '#FF3B5C',
  text: '#FFFFFF',
} as const;

export type ColorName = keyof typeof colors;

export default colors;
