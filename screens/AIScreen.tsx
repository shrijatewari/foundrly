import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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

const INPUT_BG = '#1C1C24';
const BORDER = 'rgba(255,255,255,0.10)';
const PLACEHOLDER = 'rgba(255,255,255,0.30)';
const ICON_COLOR = 'rgba(255,255,255,0.35)';

const CHIPS = [
  'Validate my idea',
  'Find co-founders',
  'Pitch tips',
  'Raise funding',
  'Build faster',
];

export default function AIScreen() {
  const { messages, isTyping, sendMessage } = useAIStore();
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList<AIMessage>>(null);

  const inChatMode = messages.length > 0;
  const hasText = input.trim().length > 0;

  useEffect(() => {
    if (inChatMode) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
    }
  }, [messages, isTyping, inChatMode]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput('');
    sendMessage(trimmed);
  };

  // ─── Shared sub-components ────────────────────────────────────────────────

  const SendButton = ({ compact }: { compact?: boolean }) => (
    <TouchableOpacity
      onPress={handleSend}
      disabled={!hasText}
      activeOpacity={0.75}
      style={[
        styles.sendBtn,
        compact && styles.sendBtnCompact,
        hasText ? styles.sendBtnActive : styles.sendBtnIdle,
      ]}
    >
      <Ionicons
        name="arrow-up"
        size={compact ? 16 : 18}
        color={hasText ? '#000000' : ICON_COLOR}
      />
    </TouchableOpacity>
  );

  // ─── Render: Initial state ────────────────────────────────────────────────

  if (!inChatMode) {
    return (
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.initialWrapper}>
            <Text style={styles.heading}>What can I help{'\n'}you build?</Text>

            {/* Main input card */}
            <View style={styles.inputCard}>
              <TextInput
                style={styles.inputCardText}
                value={input}
                onChangeText={setInput}
                placeholder="Ask your AI co-founder..."
                placeholderTextColor={PLACEHOLDER}
                multiline
                maxLength={500}
              />
              <View style={styles.inputCardRow}>
                <TouchableOpacity activeOpacity={0.6}>
                  <Ionicons name="attach-outline" size={22} color={ICON_COLOR} />
                </TouchableOpacity>
                <SendButton />
              </View>
            </View>

            {/* Suggestion chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsContent}
              style={styles.chipsScroll}
            >
              {CHIPS.map((chip) => (
                <TouchableOpacity
                  key={chip}
                  style={styles.chip}
                  onPress={() => setInput(chip)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.chipText}>{chip}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ─── Render: Chat state ───────────────────────────────────────────────────

  const renderMessage = ({ item }: { item: AIMessage }) => {
    const isUser = item.role === 'user';

    if (isUser) {
      return (
        <View style={styles.rowUser}>
          <View style={styles.bubbleUser}>
            <Text style={styles.bubbleTextUser}>{item.content}</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.rowAI}>
        <Text style={styles.aiLabel}>AI ✦</Text>
        <View style={styles.bubbleAI}>
          <Text style={styles.bubbleTextAI}>{item.content}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Message list */}
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            isTyping ? (
              <View style={styles.rowAI}>
                <Text style={styles.aiLabel}>AI ✦</Text>
                <View style={styles.bubbleAI}>
                  <View style={styles.typingRow}>
                    <View style={[styles.dot, { opacity: 1 }]} />
                    <View style={[styles.dot, { opacity: 0.6 }]} />
                    <View style={[styles.dot, { opacity: 0.3 }]} />
                  </View>
                </View>
              </View>
            ) : null
          }
        />

        {/* Compact bottom input bar */}
        <View style={styles.chatInputArea}>
          <View style={styles.chatInputBar}>
            <TextInput
              style={styles.chatInputText}
              value={input}
              onChangeText={setInput}
              placeholder="Ask your AI co-founder..."
              placeholderTextColor={PLACEHOLDER}
              multiline
              maxLength={500}
            />
            <SendButton compact />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },

  // ── Initial state ──────────────────────────────────────────────────────────
  initialWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 40,
    marginBottom: 24,
  },

  // Input card
  inputCard: {
    backgroundColor: INPUT_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
  },
  inputCardText: {
    ...typography.body,
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
    minHeight: 60,
    maxHeight: 200,
    backgroundColor: 'transparent',
    textAlignVertical: 'top',
    padding: 0,
  },
  inputCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },

  // Send button (shared)
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnCompact: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  sendBtnIdle: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  sendBtnActive: {
    backgroundColor: colors.text,
  },

  // Chips
  chipsScroll: {
    marginTop: 16,
  },
  chipsContent: {
    gap: 8,
    paddingRight: 4,
  },
  chip: {
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  chipText: {
    ...typography.caption,
    color: colors.text,
    fontSize: 13,
    fontWeight: '500',
  },

  // ── Chat state ─────────────────────────────────────────────────────────────
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },

  rowUser: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  rowAI: {
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  bubbleUser: {
    backgroundColor: colors.accent,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    maxWidth: '80%',
  },
  bubbleTextUser: {
    ...typography.body,
    color: colors.text,
    fontSize: 15,
    lineHeight: 21,
  },

  aiLabel: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.35)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.6,
    marginBottom: 4,
    marginLeft: 2,
  },
  bubbleAI: {
    backgroundColor: INPUT_BG,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    maxWidth: '80%',
  },
  bubbleTextAI: {
    ...typography.body,
    color: colors.text,
    fontSize: 15,
    lineHeight: 21,
  },

  // Typing dots
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },

  // Compact chat input bar
  chatInputArea: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 110,
    backgroundColor: colors.background,
  },
  chatInputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: INPUT_BG,
    borderRadius: 999,
    paddingVertical: 8,
    paddingLeft: 18,
    paddingRight: 8,
    gap: 8,
  },
  chatInputText: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    fontSize: 15,
    lineHeight: 21,
    maxHeight: 120,
    backgroundColor: 'transparent',
    paddingTop: 4,
    paddingBottom: 4,
    padding: 0,
  },
});
