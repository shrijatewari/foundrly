import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  FlatList,
  ListRenderItem,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { posts as initialPosts } from '../data/posts';
import { Post } from '../types';

// ── Types ─────────────────────────────────────────────────────────────────────

interface PostItem extends Post {
  avatarColor: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const AVATAR_COLORS = ['#6E0F1A', '#0F3D6E', '#0F6E3D', '#6E4F0F', '#4F0F6E'];

const INITIAL_POSTS: PostItem[] = initialPosts.map((post, index) => ({
  ...post,
  avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
}));

// ── PostCard ──────────────────────────────────────────────────────────────────

interface PostCardProps {
  post: PostItem;
  avatarColor: string;
  onLike: () => void;
}

function PostCard({ post, avatarColor, onLike }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const initials = (
    post.founderName?.split(' ').map((n) => n[0]).join('').slice(0, 2) ||
    post.startupName?.slice(0, 2) ||
    'FO'
  ).toUpperCase();

  const handleLike = () => {
    setIsLiked((prev) => {
      setLikeCount((c) => c + (prev ? -1 : 1));
      return !prev;
    });
    onLike();
  };

  return (
    <View style={styles.card}>
      {/* Header row: avatar + name + timeAgo */}
      <View style={styles.cardHeader}>
        <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <View style={styles.nameBlock}>
          <Text style={styles.founderName}>{post.founderName}</Text>
          <Text style={styles.startupName}>{post.startupName}</Text>
        </View>

        <Text style={styles.timeAgo}>{post.timeAgo}</Text>
      </View>

      {/* Content */}
      <Text style={styles.content}>{post.content}</Text>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionRow}
          onPress={handleLike}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={17}
            color={isLiked ? '#FF3B5C' : '#555555'}
          />
          <Text style={[styles.actionCount, isLiked && styles.actionCountLiked]}>
            {likeCount}
          </Text>
        </TouchableOpacity>

        <View style={styles.actionRow}>
          <Ionicons name="chatbubble-outline" size={17} color="#555555" />
          <Text style={styles.actionCount}>{post.comments}</Text>
        </View>
      </View>
    </View>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <Ionicons name="newspaper-outline" size={48} color="#333333" style={styles.emptyIcon} />
      <Text style={styles.emptyTitle}>No posts yet</Text>
      <Text style={styles.emptySub}>
        Be the first to share something with the community
      </Text>
    </View>
  );
}

// ── CommunityScreen ───────────────────────────────────────────────────────────

export default function CommunityScreen() {
  const [posts, setPosts] = useState<PostItem[]>(INITIAL_POSTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPostText, setNewPostText] = useState('');

  const handlePost = () => {
    if (!newPostText.trim()) return;
    const newPost: PostItem = {
      id: Date.now().toString(),
      founderName: 'Alex Rivera',
      startupName: 'EcoTech',
      content: newPostText,
      likes: 0,
      comments: 0,
      timeAgo: 'Just now',
      avatarColor: '#6E0F1A',
    };
    setPosts([newPost, ...posts]);
    setNewPostText('');
    setIsModalOpen(false);
  };

  const renderItem: ListRenderItem<PostItem> = ({ item }) => (
    <PostCard
      post={item}
      avatarColor={item.avatarColor}
      onLike={() => {}}
    />
  );

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setIsModalOpen(true)}
          activeOpacity={0.8}
        >
          <View style={styles.postBtn}>
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.postBtnText}>Post</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Posts */}
      <FlatList
        style={styles.flex}
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState />}
      />

      {/* Create Post Modal */}
      <Modal
        visible={isModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            {/* Modal header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Post</Text>
              <TouchableOpacity
                onPress={() => setIsModalOpen(false)}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={22} color="#666666" />
              </TouchableOpacity>
            </View>

            {/* Author row */}
            <View style={styles.modalAuthorRow}>
              <View style={styles.modalAuthorAvatar}>
                <Text style={styles.modalAuthorInitials}>AR</Text>
              </View>
              <View style={styles.modalAuthorInfo}>
                <Text style={styles.modalAuthorName}>Alex Rivera</Text>
                <Text style={styles.modalAuthorStartup}>EcoTech</Text>
              </View>
            </View>

            {/* Text input */}
            <TextInput
              multiline
              value={newPostText}
              onChangeText={setNewPostText}
              placeholder="Share something with the founder community..."
              placeholderTextColor="#444444"
              style={styles.modalInput}
              textAlignVertical="top"
            />

            {/* Action buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.flex}
                onPress={() => setIsModalOpen(false)}
                activeOpacity={0.8}
              >
                <View style={styles.cancelBtn}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.flex}
                onPress={handlePost}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.submitBtn,
                    { backgroundColor: newPostText.trim() ? '#FF3B5C' : '#333333' },
                  ]}
                >
                  <Text style={styles.submitBtnText}>Post</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0B0B0F',
  },
  flex: {
    flex: 1,
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  postBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B5C',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  postBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // ── List ────────────────────────────────────────────────────────────────────
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },

  // ── Empty state ──────────────────────────────────────────────────────────────
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444444',
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
    paddingHorizontal: 32,
  },

  // ── Post card ────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: '#111114',
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  nameBlock: {
    marginLeft: 10,
    flex: 1,
  },
  founderName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  startupName: {
    fontSize: 12,
    color: '#FF3B5C',
    marginTop: 1,
  },
  timeAgo: {
    fontSize: 11,
    color: '#444444',
  },
  content: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.82)',
    lineHeight: 22,
    marginBottom: 14,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionCount: {
    fontSize: 13,
    color: '#555555',
    marginLeft: 5,
  },
  actionCountLiked: {
    color: '#FF3B5C',
  },

  // ── Modal ────────────────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
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
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalAuthorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6E0F1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalAuthorInitials: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalAuthorInfo: {
    marginLeft: 10,
  },
  modalAuthorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalAuthorStartup: {
    fontSize: 12,
    color: '#FF3B5C',
  },
  modalInput: {
    color: '#FFFFFF',
    backgroundColor: '#1C1C24',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    lineHeight: 22,
    minHeight: 130,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  submitBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
