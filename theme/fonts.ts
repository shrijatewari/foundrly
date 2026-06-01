/**
 * Font family tokens.
 *
 * The string values match the export names from the @expo-google-fonts
 * packages, which are also the keys passed to `useFonts` in App.tsx.
 *   - Space Grotesk: all UI text, labels, buttons
 *   - Space Mono:    numbers / metrics only (e.g. the "72%" style figures)
 */
export const fonts = {
  grotesk: {
    regular: 'SpaceGrotesk_400Regular',
    medium: 'SpaceGrotesk_500Medium',
    semibold: 'SpaceGrotesk_600SemiBold',
    bold: 'SpaceGrotesk_700Bold',
  },
  mono: {
    regular: 'SpaceMono_400Regular',
    bold: 'SpaceMono_700Bold',
  },
} as const;

export default fonts;
