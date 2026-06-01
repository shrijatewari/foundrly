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

export default function DashboardScreen() {
  const { tasks, toggleTask } = useDashboardStore();
  const { name, stage, progress, aiSuggestions, upcomingEvent } = startupHealth;

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
        <View style={styles.card}>
          <Text style={styles.cardLabel}>STARTUP HEALTH</Text>
          <Text style={styles.startupName}>{name}</Text>
          <Text style={styles.stageBadgeText}>{stage}</Text>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <View style={styles.progressRow}>
            <Text style={styles.progressPercent}>{Math.round(progress * 100)}% complete</Text>
          </View>
        </View>

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
    paddingBottom: 32,
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

  // Startup Health
  startupName: {
    ...typography.subheading,
    color: colors.text,
    marginBottom: 4,
  },
  stageBadgeText: {
    ...typography.caption,
    color: colors.text,
    opacity: 0.6,
    marginBottom: 16,
  },
  progressTrack: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 4,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  progressPercent: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '600',
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
