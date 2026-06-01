import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { startupHealth } from '../data/dashboard';
import { useDashboardStore } from '../store/useDashboardStore';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import StartupHealthCard from '../components/StartupHealthCard';
import ProgressBar from '../components/ProgressBar';

export default function DashboardScreen() {
  const { tasks, toggleTask } = useDashboardStore();
  const { aiSuggestions, upcomingEvent } = startupHealth;

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const taskPercent = totalCount ? (completedCount / totalCount) * 100 : 0;
  const allDone = totalCount > 0 && completedCount === totalCount;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome header */}
        <Text style={styles.welcomeText}>Welcome, Founder 👋</Text>

        {/* Startup Health Card */}
        <StartupHealthCard
          startupName="EcoTech"
          stage="MVP Development"
          progress={72}
        />

        {/* AI Suggestions Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>AI SUGGESTIONS</Text>
          {aiSuggestions.map((suggestion, index) => (
            <View key={index} style={styles.suggestionRow}>
              <Text style={styles.lightningIcon}>⚡</Text>
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </View>
          ))}
        </View>

        {/* Daily Tasks Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>DAILY TASKS</Text>

          <View style={styles.taskProgress}>
            <ProgressBar
              progress={taskPercent}
              variant={allDone ? 'success' : 'default'}
              size="sm"
              label={`${completedCount} of ${totalCount} done`}
              showPercent
            />
          </View>

          {tasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              style={styles.taskRow}
              onPress={() => toggleTask(task.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, task.completed && styles.checkboxDone]}>
                {task.completed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={[styles.taskTitle, task.completed && styles.taskTitleDone]}>
                {task.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upcoming Event Card */}
        <View style={[styles.card, styles.eventCard]}>
          <View style={styles.eventAccentBar} />
          <View style={styles.eventContent}>
            <Text style={styles.cardLabel}>UPCOMING EVENT</Text>
            <Text style={styles.eventTitle}>{upcomingEvent.title}</Text>
            <View style={styles.eventMeta}>
              <Text style={styles.eventMetaIcon}>📅</Text>
              <Text style={styles.eventMetaText}>{upcomingEvent.date}</Text>
            </View>
            <View style={styles.eventMeta}>
              <Text style={styles.eventMetaIcon}>🕐</Text>
              <Text style={styles.eventMetaText}>{upcomingEvent.time}</Text>
            </View>
            <View style={styles.eventMeta}>
              <Text style={styles.eventMetaIcon}>📍</Text>
              <Text style={styles.eventMetaText}>{upcomingEvent.location}</Text>
            </View>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 112,
  },

  // Header
  welcomeText: {
    ...typography.heading,
    color: colors.text,
    marginBottom: 24,
  },

  // Cards
  card: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardLabel: {
    ...typography.caption,
    color: colors.accent,
    letterSpacing: 1.2,
    fontWeight: '700',
    marginBottom: 12,
  },

  // AI Suggestions
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  lightningIcon: {
    fontSize: 14,
    marginRight: 8,
    marginTop: 2,
  },
  suggestionText: {
    ...typography.body,
    color: colors.text,
    opacity: 0.85,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },

  // Daily Tasks
  taskProgress: {
    marginBottom: 12,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.accent,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  checkmark: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  taskTitle: {
    ...typography.body,
    color: colors.text,
    flex: 1,
    fontSize: 15,
  },
  taskTitleDone: {
    opacity: 0.4,
    textDecorationLine: 'line-through',
  },

  // Upcoming Event
  eventCard: {
    flexDirection: 'row',
    padding: 0,
    overflow: 'hidden',
  },
  eventAccentBar: {
    width: 4,
    backgroundColor: colors.accent,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  eventContent: {
    flex: 1,
    padding: 20,
  },
  eventTitle: {
    ...typography.subheading,
    color: colors.text,
    fontSize: 17,
    marginBottom: 12,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  eventMetaIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  eventMetaText: {
    ...typography.body,
    color: colors.text,
    opacity: 0.75,
    fontSize: 14,
  },
});
