import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Notification } from '../store/useNotificationStore';
import { useNotificationStore } from '../store/useNotificationStore';

// ── Type config ───────────────────────────────────────────────────────────────

type NotifType = Notification['type'];

const TYPE_CONFIG: Record<
  NotifType,
  { bg: string; icon: React.ComponentProps<typeof Ionicons>['name']; color: string }
> = {
  mentor:    { bg: 'rgba(59,130,246,0.15)',  icon: 'person-outline',   color: '#3B82F6' },
  community: { bg: 'rgba(255,59,92,0.15)',   icon: 'people-outline',   color: '#FF3B5C' },
  event:     { bg: 'rgba(16,185,129,0.15)',  icon: 'calendar-outline', color: '#10B981' },
  ai:        { bg: 'rgba(139,92,246,0.15)',  icon: 'flash-outline',    color: '#8B5CF6' },
  funding:   { bg: 'rgba(245,158,11,0.15)',  icon: 'cash-outline',     color: '#F59E0B' },
};

// ── Notification item ─────────────────────────────────────────────────────────

function NotifItem({ item }: { item: Notification }) {
  const markRead = useNotificationStore((s) => s.markRead);
  const cfg = TYPE_CONFIG[item.type];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => markRead(item.id)}
    >
      <View
        style={[
          styles.item,
          { backgroundColor: item.isRead ? '#0B0B0F' : '#0F0A0C' },
        ]}
      >
        {/* Icon */}
        <View style={[styles.iconCircle, { backgroundColor: cfg.bg }]}>
          <Ionicons name={cfg.icon} size={18} color={cfg.color} />
        </View>

        {/* Text */}
        <View style={styles.itemBody}>
          <Text style={[styles.itemTitle, { fontWeight: item.isRead ? '400' : '600' }]}>
            {item.title}
          </Text>
          <Text style={styles.itemMessage}>{item.message}</Text>
          <Text style={styles.itemTime}>{item.time}</Text>
        </View>

        {/* Unread dot */}
        {!item.isRead && <View style={styles.unreadDot} />}
      </View>
    </TouchableOpacity>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const { today, earlier, markAllRead } = useNotificationStore();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
        <TouchableOpacity onPress={markAllRead} activeOpacity={0.7}>
          <Text style={styles.markAllText}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        {/* Today */}
        <Text style={styles.sectionHeader}>TODAY</Text>
        {today.map((item) => (
          <NotifItem key={item.id} item={item} />
        ))}

        {/* Earlier */}
        <Text style={styles.sectionHeader}>EARLIER</Text>
        {earlier.map((item) => (
          <NotifItem key={item.id} item={item} />
        ))}
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
  scroll: {
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
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  markAllText: {
    fontSize: 13,
    color: '#FF3B5C',
  },

  // Section headers
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#0B0B0F',
  },

  // Notification item
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemBody: {
    flex: 1,
    marginHorizontal: 12,
  },
  itemTitle: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  itemMessage: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
    lineHeight: 18,
  },
  itemTime: {
    fontSize: 11,
    color: '#444444',
    marginTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B5C',
    marginTop: 4,
  },
});
