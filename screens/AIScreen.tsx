import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAIStore } from '../store/useAIStore';
import { AIMessage } from '../types';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export default function AIScreen() {
  const { messages, isTyping, sendMessage } = useAIStore();
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList<AIMessage>>(null);
  const hasText = input.trim().length > 0;

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput('');
    sendMessage(trimmed);
  };

  const renderMessage = ({ item, index }: { item: AIMessage; index: number }) => {
    const isUser = item.role === 'user';
    const prevItem = index > 0 ? messages[index - 1] : null;
    const isFirstInGroup = !prevItem || prevItem.role !== item.role;

    if (isUser) {
      return (
        <View style={[styles.rowUser, !isFirstInGroup && styles.rowGrouped]}>
          <View style={styles.bubbleUser}>
            <Text style={styles.bubbleTextUser}>{item.content}</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.rowAI, !isFirstInGroup && styles.rowGrouped]}>
        {isFirstInGroup && <Text style={styles.aiLabel}>AI</Text>}
        <View style={[styles.bubbleAI, !isFirstInGroup && styles.bubbleAIGrouped]}>
          <Text style={styles.bubbleTextAI}>{item.content}</Text>
        </View>
      </View>
    );
  };

  const TypingIndicator = () => (
    <View style={styles.rowAI}>
      <Text style={styles.aiLabel}>AI</Text>
      <View style={styles.bubbleAI}>
        <View style={styles.typingDotsRow}>
          <View style={[styles.dot, styles.dot1]} />
          <View style={[styles.dot, styles.dot2]} />
          <View style={[styles.dot, styles.dot3]} />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerDot} />
          <View>
            <Text style={styles.headerTitle}>AI Co-Founder</Text>
            <Text style={styles.headerStatus}>Online · Ready to help</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
        />

        {/* Input area */}
        <View style={styles.inputArea}>
          <View style={styles.inputContainer}>
            {/* Attach button */}
            <TouchableOpacity style={styles.attachButton} activeOpacity={0.6}>
              <Ionicons
                name="attach"
                size={22}
                color={`${colors.text}50`}
                style={styles.attachIcon}
              />
            </TouchableOpacity>

            {/* Text field */}
            <TextInput
              style={styles.textInput}
              value={input}
              onChangeText={setInput}
              placeholder="Message your co-founder..."
              placeholderTextColor={`${colors.text}30`}
              multiline
              maxLength={500}
              returnKeyType="default"
            />

            {/* Send button */}
            <TouchableOpacity
              style={[styles.sendButton, hasText && styles.sendButtonActive]}
              onPress={handleSend}
              disabled={!hasText}
              activeOpacity={0.8}
            >
              <Ionicons
                name="arrow-up"
                size={18}
                color={hasText ? colors.text : `${colors.text}40`}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const DOT_SIZE = 7;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerDot: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    fontSize: 16,
  },
  headerStatus: {
    ...typography.caption,
    color: colors.accent,
    fontSize: 12,
    marginTop: 1,
  },

  // ── Message list ─────────────────────────────────────────────────────────────
  listContent: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 12,
  },

  rowUser: {
    alignItems: 'flex-end',
    marginTop: 16,
  },
  rowAI: {
    alignItems: 'flex-start',
    marginTop: 16,
  },
  rowGrouped: {
    marginTop: 4,
  },

  // AI label above bubble
  aiLabel: {
    ...typography.caption,
    color: `${colors.text}45`,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: 4,
    marginLeft: 2,
  },

  // Bubbles
  bubbleUser: {
    backgroundColor: colors.accent,
    borderRadius: 20,
    borderBottomRightRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 11,
    maxWidth: '78%',
  },
  bubbleAI: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    borderBottomLeftRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 11,
    maxWidth: '78%',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  bubbleAIGrouped: {
    borderTopLeftRadius: 20,
  },
  bubbleTextUser: {
    ...typography.body,
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
  bubbleTextAI: {
    ...typography.body,
    color: `${colors.text}DD`,
    fontSize: 15,
    lineHeight: 22,
  },

  // Typing indicator — three animated-style dots
  typingDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 2,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: `${colors.text}50`,
  },
  dot1: {},
  dot2: { opacity: 0.65 },
  dot3: { opacity: 0.35 },

  // ── Input ────────────────────────────────────────────────────────────────────
  inputArea: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 110,
    backgroundColor: colors.background,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: 26,
    paddingHorizontal: 6,
    paddingVertical: 6,
    gap: 4,
  },
  attachButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  attachIcon: {
    transform: [{ rotate: '45deg' }],
  },
  textInput: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    fontSize: 15,
    lineHeight: 21,
    paddingTop: 7,
    paddingBottom: 7,
    paddingHorizontal: 4,
    maxHeight: 130,
    // Transparent — border lives on the container
    backgroundColor: 'transparent',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  sendButtonActive: {
    backgroundColor: colors.accent,
  },
});
