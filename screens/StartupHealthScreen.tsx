import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CircularProgress from '../components/CircularProgress';
import ProgressBar from '../components/ProgressBar';
import type { ProgressVariant } from '../components/ProgressBar';
import type { RootStackParamList } from '../navigation/types';

// ── Data ──────────────────────────────────────────────────────────────────────

interface Metric {
  label: string;
  value: number;
  variant: ProgressVariant;
}

const METRICS: Metric[] = [
  { label: 'Product Development', value: 85, variant: 'success' },
  { label: 'Marketing Reach',     value: 60, variant: 'default' },
  { label: 'Funding Progress',    value: 40, variant: 'error'   },
  { label: 'Team Strength',       value: 55, variant: 'warning' },
  { label: 'User Traction',       value: 70, variant: 'success' },
];

const INSIGHTS = [
  'Strong product development momentum. Focus on marketing to match your build velocity.',
  'Funding progress is below target. Consider applying for 2 startup grants this month.',
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function metricColor(value: number): string {
  if (value >= 70) return '#4CAF50';
  if (value >= 50) return '#FF9800';
  return '#FF3B5C';
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function StartupHealthScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Startup Health</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Overall Health */}
        <View style={styles.overallSection}>
          <CircularProgress progress={72} size={120} strokeWidth={10} />
          <Text style={styles.overallLabel}>Overall Health Score</Text>
          <Text style={styles.overallSub}>EcoTech · MVP Development</Text>
        </View>

        {/* Key Metrics */}
        <Text style={styles.sectionTitle}>Key Metrics</Text>

        {METRICS.map((metric) => (
          <View key={metric.label} style={styles.metricCard}>
            <View style={styles.metricRow}>
              <Text style={styles.metricName}>{metric.label}</Text>
              <Text style={[styles.metricValue, { color: metricColor(metric.value) }]}>
                {metric.value}%
              </Text>
            </View>
            <ProgressBar
              progress={metric.value}
              variant={metric.variant}
              size="sm"
            />
          </View>
        ))}

        {/* AI Insights */}
        <Text style={[styles.sectionTitle, styles.insightsTitleSpacing]}>
          AI Insights
        </Text>

        {INSIGHTS.map((text, index) => (
          <View key={index} style={styles.insightCard}>
            <Text style={styles.insightText}>{text}</Text>
          </View>
        ))}

        {/* Last updated */}
        <Text style={styles.lastUpdated}>Last updated · Just now</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0B0B0F',
  },

  // Header
  header: {
    backgroundColor: '#0B0B0F',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 12,
  },

  // Scroll
  scrollContent: {
    paddingBottom: 48,
  },

  // Overall Health
  overallSection: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  overallLabel: {
    fontSize: 14,
    color: '#666666',
    marginTop: 12,
  },
  overallSub: {
    fontSize: 13,
    color: '#FF3B5C',
    marginTop: 4,
  },

  // Section titles
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  insightsTitleSpacing: {
    marginTop: 8,
  },

  // Metric cards
  metricCard: {
    backgroundColor: '#111114',
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  metricName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '700',
  },

  // Insight cards
  insightCard: {
    backgroundColor: '#0F0A0B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,59,92,0.2)',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  insightText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },

  // Footer
  lastUpdated: {
    fontSize: 11,
    color: '#444444',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
});
