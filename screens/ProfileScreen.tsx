import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const PROFILE = {
  name: 'Alex Rivera',
  role: 'Full Stack Founder',
  school: 'IIT Delhi — Class of 2026',
  startupCount: 2,
  skills: ['React Native', 'UI/UX', 'Growth', 'Pitching'],
  achievements: [
    'Winner — National Startup Pitch 2025',
    'Top 1% on Foundrly Builder Leaderboard',
    'Raised pre-seed round of $250K',
  ],
};

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export default function ProfileScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={[colors.primary, colors.background]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.header}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(PROFILE.name)}</Text>
        </View>
        <Text style={styles.name}>{PROFILE.name}</Text>
        <Text style={styles.role}>{PROFILE.role}</Text>
        <Text style={styles.school}>{PROFILE.school}</Text>

        <View style={styles.startupBadge}>
          <Ionicons name="rocket" size={14} color={colors.text} />
          <Text style={styles.startupBadgeText}>
            {PROFILE.startupCount} {PROFILE.startupCount === 1 ? 'Startup' : 'Startups'}
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skills</Text>
        <View style={styles.chipRow}>
          {PROFILE.skills.map((skill) => (
            <View key={skill} style={styles.chip}>
              <Text style={styles.chipText}>{skill}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        {PROFILE.achievements.map((achievement) => (
          <View key={achievement} style={styles.achievementRow}>
            <View style={styles.trophyCircle}>
              <Ionicons name="trophy" size={16} color={colors.accent} />
            </View>
            <Text style={styles.achievementText}>{achievement}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    paddingTop: 64,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 16,
  },
  avatarText: {
    ...typography.heading,
    color: colors.text,
  },
  name: {
    ...typography.heading,
    color: colors.text,
  },
  role: {
    ...typography.subheading,
    color: colors.text,
    opacity: 0.85,
    marginTop: 4,
  },
  school: {
    ...typography.body,
    color: colors.text,
    opacity: 0.65,
    marginTop: 4,
  },
  startupBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  startupBadgeText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '700',
    fontSize: 13,
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 28,
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.text,
    marginBottom: 14,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    backgroundColor: colors.secondary,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,59,92,0.4)',
  },
  chipText: {
    ...typography.caption,
    color: colors.text,
    fontSize: 13,
  },
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  trophyCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,59,92,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  achievementText: {
    ...typography.body,
    color: colors.text,
    flexShrink: 1,
  },
});
