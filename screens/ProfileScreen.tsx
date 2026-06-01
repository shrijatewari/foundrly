import { Alert, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const PROFILE = {
  name: 'Alex Rivera',
  role: 'Full Stack Founder',
  school: 'IIT Delhi — Class of 2026',
  skills: ['React Native', 'UI/UX', 'Growth', 'Pitching'],
  achievements: [
    'Winner — National Startup Pitch 2025',
    'Top 1% on Foundrly Builder Leaderboard',
    'Raised pre-seed round of $250K',
  ],
};

const STATS = [
  { value: '2',   label: 'Startups' },
  { value: '847', label: 'Network'  },
  { value: '12',  label: 'Mentors'  },
];

const MY_STARTUPS = [
  { name: 'EcoTech', stage: 'MVP Development' },
  { name: 'GreenAI', stage: 'Idea Stage'      },
];

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
        {/* Edit button */}
        <TouchableOpacity
          style={styles.editBtn}
          activeOpacity={0.7}
          onPress={() => Alert.alert('Edit profile coming soon!')}
        >
          <View style={styles.editBtnInner}>
            <Text style={styles.editBtnText}>Edit</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(PROFILE.name)}</Text>
        </View>
        <Text style={styles.name}>{PROFILE.name}</Text>
        <Text style={styles.role}>{PROFILE.role}</Text>
        <Text style={styles.school}>{PROFILE.school}</Text>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {STATS.map((stat) => (
            <View key={stat.label} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Startups</Text>
        {MY_STARTUPS.map((startup) => (
          <View key={startup.name} style={styles.startupCard}>
            <View style={styles.startupIcon}>
              <Ionicons name="rocket-outline" size={20} color="#FF3B5C" />
            </View>
            <View style={styles.startupInfo}>
              <Text style={styles.startupName}>{startup.name}</Text>
              <Text style={styles.startupStage}>{startup.stage}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#333333" />
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
    paddingBottom: 112,
  },
  header: {
    alignItems: 'center',
    paddingTop: 64,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  editBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  editBtnInner: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  editBtnText: {
    fontSize: 13,
    color: '#FFFFFF',
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
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
  startupCard: {
    backgroundColor: '#111114',
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  startupIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(110,15,26,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startupInfo: {
    marginLeft: 12,
    flex: 1,
  },
  startupName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  startupStage: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
});
