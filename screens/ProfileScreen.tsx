import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const STATS = [
  { value: '2',   label: 'Startups' },
  { value: '847', label: 'Network'  },
  { value: '12',  label: 'Mentors'  },
];

const MY_STARTUPS = [
  { name: 'EcoTech', stage: 'MVP Development' },
  { name: 'GreenAI', stage: 'Idea Stage'      },
];

const ACHIEVEMENTS = [
  'Winner — National Startup Pitch 2025',
  'Top 1% on Foundrly Builder Leaderboard',
  'Raised pre-seed round of $250K',
];

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export default function ProfileScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () =>
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] }),
        },
      ]
    );
  };

  const [profileName,   setProfileName]   = useState('Alex Rivera');
  const [profileRole,   setProfileRole]   = useState('Full Stack Founder');
  const [profileSchool, setProfileSchool] = useState('IIT Delhi — Class of 2026');
  const [skills,        setSkills]        = useState(['React Native', 'UI/UX', 'Growth', 'Pitching']);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName,   setEditName]   = useState(profileName);
  const [editRole,   setEditRole]   = useState(profileRole);
  const [editSchool, setEditSchool] = useState(profileSchool);
  const [editSkills, setEditSkills] = useState(skills.join(', '));

  const openEdit = () => {
    setEditName(profileName);
    setEditRole(profileRole);
    setEditSchool(profileSchool);
    setEditSkills(skills.join(', '));
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    setProfileName(editName);
    setProfileRole(editRole);
    setProfileSchool(editSchool);
    setSkills(editSkills.split(',').map((s) => s.trim()).filter(Boolean));
    setIsEditModalOpen(false);
  };

  return (
    <>
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
          <TouchableOpacity style={styles.editBtn} activeOpacity={0.7} onPress={openEdit}>
            <View style={styles.editBtnInner}>
              <Text style={styles.editBtnText}>Edit</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(profileName)}</Text>
          </View>
          <Text style={styles.name}>{profileName}</Text>
          <Text style={styles.role}>{profileRole}</Text>
          <Text style={styles.school}>{profileSchool}</Text>

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
            {skills.map((skill) => (
              <View key={skill} style={styles.chip}>
                <Text style={styles.chipText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          {ACHIEVEMENTS.map((achievement) => (
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

        {/* Logout button */}
        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.7}
          style={styles.logoutBtn}
        >
          <View style={styles.logoutInner}>
            <Ionicons name="log-out-outline" size={18} color="#FF3B5C" />
            <Text style={styles.logoutText}>Log Out</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsEditModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            {/* Modal header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setIsEditModalOpen(false)} activeOpacity={0.7}>
                <Ionicons name="close" size={22} color="#666666" />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Full Name</Text>
            <TextInput
              style={styles.fieldInput}
              value={editName}
              onChangeText={setEditName}
              placeholderTextColor="#444444"
            />

            <Text style={styles.fieldLabel}>Role</Text>
            <TextInput
              style={styles.fieldInput}
              value={editRole}
              onChangeText={setEditRole}
              placeholderTextColor="#444444"
            />

            <Text style={styles.fieldLabel}>School</Text>
            <TextInput
              style={styles.fieldInput}
              value={editSchool}
              onChangeText={setEditSchool}
              placeholderTextColor="#444444"
            />

            <Text style={styles.fieldLabel}>Skills</Text>
            <TextInput
              style={styles.fieldInput}
              value={editSkills}
              onChangeText={setEditSkills}
              placeholder="Comma separated"
              placeholderTextColor="#444444"
            />

            {/* Save button */}
            <TouchableOpacity onPress={handleSave} activeOpacity={0.8}>
              <View style={styles.saveBtn}>
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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

  // ── Logout ───────────────────────────────────────────────────────────────────
  logoutBtn: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 32,
  },
  logoutInner: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,59,92,0.3)',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FF3B5C',
  },

  // ── Edit Modal ───────────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#111114',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  fieldLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 6,
  },
  fieldInput: {
    backgroundColor: '#1C1C24',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 16,
  },
  saveBtn: {
    backgroundColor: '#FF3B5C',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
