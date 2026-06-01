import { useState } from 'react';
import {
  FlatList,
  ListRenderItem,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { posts as initialPosts, type Post } from '../data/posts';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const AVATAR_FALLBACK_COLORS = ['#6E0F1A', '#2A4D8F', '#2E7D5B', '#8A5A2B', '#1F6F78'];

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

function avatarColorFor(post: Post, index: number): string {
  return post.avatarColor ?? AVATAR_FALLBACK_COLORS[index % AVATAR_FALLBACK_COLORS.length];
}

type PostCardProps = {
  post: Post;
  avatarColor: string;
};

function PostCard({ post, avatarColor }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const toggleLike = () => {
    setLiked((prev) => {
      setLikeCount((count) => count + (prev ? -1 : 1));
      return !prev;
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
          <Text style={styles.avatarText}>{getInitials(post.startupName)}</Text>
        </View>
        <Text style={styles.startupName}>{post.startupName}</Text>
      </View>

      <Text style={styles.content}>{post.content}</Text>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.actionButton, pressed && styles.actionPressed]}
          onPress={toggleLike}
          hitSlop={8}
        >
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={20}
            color={liked ? colors.accent : 'rgba(255,255,255,0.6)'}
          />
          <Text style={[styles.actionCount, liked && styles.actionCountActive]}>{likeCount}</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.actionButton, pressed && styles.actionPressed]}
          hitSlop={8}
        >
          <Ionicons name="chatbubble-outline" size={19} color="rgba(255,255,255,0.6)" />
          <Text style={styles.actionCount}>{post.comments}</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function CommunityScreen() {
  const renderItem: ListRenderItem<Post> = ({ item, index }) => (
    <PostCard post={item} avatarColor={avatarColorFor(item, index)} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={initialPosts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<Text style={styles.heading}>Community</Text>}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  heading: {
    ...typography.heading,
    color: colors.text,
    marginVertical: 16,
  },
  card: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '700',
    fontSize: 14,
  },
  startupName: {
    ...typography.subheading,
    color: colors.accent,
    flexShrink: 1,
  },
  content: {
    ...typography.body,
    color: colors.text,
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionPressed: {
    opacity: 0.6,
  },
  actionCount: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  actionCountActive: {
    color: colors.accent,
  },
});
