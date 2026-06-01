import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View, type TextStyle, type ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import SegmentedProgress from './SegmentedProgress';

export interface StartupHealthCardProps {
  startupName: string;
  stage: string;
  progress: number; // 0-100
}

export default function StartupHealthCard({
  startupName,
  stage,
  progress,
}: StartupHealthCardProps) {
  return (
    <View style={styles.card}>
      {/* Top row: name + stage pill + chevron */}
      <View style={styles.topRow}>
        <Text style={styles.name} numberOfLines={1}>
          {startupName}
        </Text>
        <View style={styles.pill}>
          <Text style={styles.pillText}>{stage}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#444444" style={styles.chevron} />
      </View>

      {/* Segmented completion bar */}
      <SegmentedProgress value={progress} segments={20} label="completion" />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(255,59,92,0.12)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  } as ViewStyle,
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  chevron: {
    marginLeft: 8,
  },
  name: {
    fontFamily: fonts.grotesk.semibold,
    fontSize: 18,
    color: colors.text,
    flex: 1,
    marginRight: 8,
  } as TextStyle,
  pill: {
    backgroundColor: 'rgba(255,59,92,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,59,92,0.2)',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  pillText: {
    fontFamily: fonts.grotesk.medium,
    fontSize: 11,
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
  } as TextStyle,
});
