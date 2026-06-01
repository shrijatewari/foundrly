import { ScrollView, StyleSheet, Text, View, type TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgressBar from '../components/ProgressBar';
import CircularProgress from '../components/CircularProgress';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

export default function ProgressShowcaseScreen() {
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Bars */}
        <Text style={styles.h1}>Progress Bars</Text>

        <View style={styles.barRow}>
          <Text style={styles.caption}>Default Progress</Text>
          <ProgressBar progress={21} showPercent />
        </View>

        <View style={styles.barRow}>
          <Text style={styles.caption}>Small Size</Text>
          <ProgressBar progress={92} size="sm" />
        </View>

        <View style={styles.barRow}>
          <ProgressBar progress={42} size="lg" label="Large with Label" showPercent />
        </View>

        <View style={styles.barRow}>
          <Text style={styles.caption}>Success Variant</Text>
          <ProgressBar progress={68} variant="success" />
        </View>

        <View style={styles.barRow}>
          <Text style={styles.caption}>Warning Variant</Text>
          <ProgressBar progress={48} variant="warning" />
        </View>

        <View style={styles.barRow}>
          <Text style={styles.caption}>Error Variant</Text>
          <ProgressBar progress={27} variant="error" />
        </View>

        {/* Circular Progress */}
        <Text style={[styles.h1, styles.h1Spaced]}>Circular Progress</Text>

        <View style={styles.circleGrid}>
          <View style={styles.circleItem}>
            <CircularProgress progress={72} />
            <Text style={styles.circleLabel}>Default</Text>
          </View>
          <View style={styles.circleItem}>
            <CircularProgress progress={94} variant="success" />
            <Text style={styles.circleLabel}>Success</Text>
          </View>
          <View style={styles.circleItem}>
            <CircularProgress progress={15} variant="warning" />
            <Text style={styles.circleLabel}>Warning</Text>
          </View>
          <View style={styles.circleItem}>
            <CircularProgress progress={40} variant="error" />
            <Text style={styles.circleLabel}>Error</Text>
          </View>
          <View style={styles.circleItem}>
            <CircularProgress progress={94} size={96}>
              <Text style={styles.customTop}>Loading</Text>
              <Text style={styles.customPercent}>94%</Text>
            </CircularProgress>
            <Text style={styles.circleLabel}>Custom Content</Text>
          </View>
          <View style={styles.circleItem}>
            <CircularProgress progress={62} size={110} strokeWidth={10} />
            <Text style={styles.circleLabel}>Large</Text>
          </View>
        </View>

        {/* Mixed Layout */}
        <Text style={[styles.h1, styles.h1Spaced]}>Mixed Layout</Text>

        <View style={styles.mixedRow}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Upload Progress</Text>
            <ProgressBar progress={64} showPercent />
            <Text style={styles.cardCaption}>Uploading files to server…</Text>
          </View>

          <View style={[styles.card, styles.cardCenter]}>
            <Text style={styles.cardTitle}>Processing</Text>
            <CircularProgress progress={94} variant="success" size={96} />
            <Text style={styles.cardCaption}>Processing your request…</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 48,
  },
  h1: {
    fontFamily: fonts.grotesk.bold,
    fontSize: 22,
    color: colors.text,
    marginBottom: 20,
  } as TextStyle,
  h1Spaced: {
    marginTop: 36,
  },
  barRow: {
    marginBottom: 22,
  },
  caption: {
    fontFamily: fonts.grotesk.regular,
    fontSize: 12,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  } as TextStyle,
  circleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  circleItem: {
    alignItems: 'center',
    width: 96,
  },
  circleLabel: {
    fontFamily: fonts.grotesk.medium,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 10,
    textAlign: 'center',
  } as TextStyle,
  customTop: {
    fontFamily: fonts.grotesk.regular,
    fontSize: 10,
    color: colors.textMuted,
  } as TextStyle,
  customPercent: {
    fontFamily: fonts.mono.bold,
    fontSize: 16,
    color: colors.text,
  } as TextStyle,
  mixedRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  card: {
    flexGrow: 1,
    flexBasis: 260,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 20,
  },
  cardCenter: {
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: fonts.grotesk.semibold,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
  } as TextStyle,
  cardCaption: {
    fontFamily: fonts.grotesk.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 16,
  } as TextStyle,
});
