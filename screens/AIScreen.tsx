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
import RadarEffect from '../components/RadarEffect';
import { useAIStore } from '../store/useAIStore';
import { AIMessage } from '../types';

// ── Design tokens (spec-exact) ───────────────────────────────────────────────
const BG = '#0B0B0F';
const SURFACE = '#171717';
const ACCENT = '#FF3B5C';
const BORDER_COLOR = '#262626';
const BORDER_SUBTLE = '#3F3F3F';
const TEXT_PRIMARY = '#FFFFFF';
const TEXT_MUTED = '#A1A1A1';
const TEXT_DIM = '#525252';

// ── Chip definitions ─────────────────────────────────────────────────────────
const CHIPS: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string }[] = [
  { icon: 'bulb-outline',      label: 'Validate my idea' },
  { icon: 'cash-outline',      label: 'How to raise funding' },
  { icon: 'people-outline',    label: 'Find a co-founder' },
  { icon: 'megaphone-outline', label: 'How to pitch investors' },
  { icon: 'rocket-outline',    label: 'Launch faster' },
];

// ── Send button (defined outside to prevent remount) ─────────────────────────
function SendButton({
  hasText,
  onPress,
}: {
  hasText: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} disabled={!hasText} activeOpacity={0.75}>
      <View
        style={[
          styles.sendBtn,
          { backgroundColor: hasText ? TEXT_PRIMARY : 'transparent' },
        ]}
      >
        <Ionicons
          name="arrow-up-outline"
          size={16}
          color={hasText ? '#000000' : TEXT_MUTED}
        />
      </View>
    </TouchableOpacity>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function AIScreen() {
  const { messages, isTyping, sendMessage, clearMessages } = useAIStore();
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

  // ── Initial state ──────────────────────────────────────────────────────────
  if (!inChatMode) {
    return (
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.initialCenter}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Idle radar state — AI "scanning" the startup */}
            <View style={styles.emptyState}>
              <Text style={styles.statusLabel}>AI Co-Founder Online</Text>
              <RadarEffect />
              <Text style={styles.emptySubtext}>
                Ask me anything about your startup — runway, hiring, growth strategy.
              </Text>
            </View>

            {/* Input container */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputField}
                value={input}
                onChangeText={setInput}
                placeholder="Ask your AI co-founder..."
                placeholderTextColor={TEXT_DIM}
                multiline
                maxLength={500}
                textAlignVertical="top"
                returnKeyType="default"
              />

              {/* Bottom row: attach | [project btn] [send btn] */}
              <View style={styles.inputBottomRow}>
                {/* Left — attach */}
                <TouchableOpacity style={styles.attachBtn} activeOpacity={0.7}>
                  <Ionicons name="attach-outline" size={16} color={TEXT_PRIMARY} />
                </TouchableOpacity>

                {/* Right — project + send */}
                <View style={styles.inputRightBtns}>
                  <TouchableOpacity activeOpacity={0.7}>
                    <View style={styles.projectBtn}>
                      <Ionicons name="add-outline" size={16} color={TEXT_MUTED} />
                      <Text style={styles.projectBtnText}>Project</Text>
                    </View>
                  </TouchableOpacity>

                  <SendButton hasText={hasText} onPress={handleSend} />
                </View>
              </View>
            </View>

            {/* Chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipsScroll}
              contentContainerStyle={styles.chipsContent}
            >
              {CHIPS.map((chip) => (
                <TouchableOpacity
                  key={chip.label}
                  style={styles.chip}
                  onPress={() => setInput(chip.label)}
                  activeOpacity={0.7}
                >
                  <Ionicons name={chip.icon} size={14} color={TEXT_MUTED} />
                  <Text style={styles.chipText}>{chip.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ── Chat state ─────────────────────────────────────────────────────────────
  const renderMessage = ({ item }: { item: AIMessage }) => {
    const isUser = item.role === 'user';

    if (isUser) {
      return (
        <View style={styles.bubbleUser}>
          <Text style={styles.bubbleText}>{item.content}</Text>
        </View>
      );
    }

    return (
      <View style={styles.bubbleAIWrapper}>
        <Text style={styles.aiLabel}>AI ✦</Text>
        <View style={styles.bubbleAI}>
          <Text style={styles.bubbleText}>{item.content}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Chat header with reset button */}
      <View style={styles.chatHeader}>
        <Text style={styles.chatHeaderTitle}>AI Co-Founder</Text>
        <TouchableOpacity onPress={clearMessages} activeOpacity={0.7}>
          <Ionicons name="refresh-outline" size={20} color="#666666" />
        </TouchableOpacity>
      </View>

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
              <View style={styles.bubbleAIWrapper}>
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

        {/* Bottom input bar */}
        <View style={styles.chatInputArea}>
          <View style={styles.chatInputBar}>
            <TextInput
              style={styles.chatInputField}
              value={input}
              onChangeText={setInput}
              placeholder="Ask your AI co-founder..."
              placeholderTextColor={TEXT_DIM}
              multiline
              maxLength={500}
              returnKeyType="default"
            />
            <SendButton hasText={hasText} onPress={handleSend} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },
  flex: {
    flex: 1,
  },

  // ── Initial state ────────────────────────────────────────────────────────────
  initialCenter: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  emptyState: {
    alignItems: 'center',
    alignSelf: 'stretch',
    marginBottom: 24,
    gap: 12,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: TEXT_MUTED,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  emptySubtext: {
    fontSize: 12,
    color: '#444455',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 18,
  },

  // Input container
  inputContainer: {
    width: '100%',
    backgroundColor: SURFACE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    padding: 12,
  },
  inputField: {
    color: TEXT_PRIMARY,
    backgroundColor: 'transparent',
    fontSize: 14,
    lineHeight: 20,
    minHeight: 60,
    maxHeight: 200,
    textAlignVertical: 'top',
    padding: 0,
  },
  inputBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  attachBtn: {
    padding: 8,
  },
  inputRightBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  projectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: BORDER_SUBTLE,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  projectBtnText: {
    fontSize: 12,
    color: TEXT_MUTED,
  },

  // Send button (shared between both states)
  sendBtn: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER_SUBTLE,
    padding: 6,
  },

  // Chips
  chipsScroll: {
    marginTop: 16,
    width: '100%',
    height: 36,
  },
  chipsContent: {
    paddingRight: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: SURFACE,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    marginRight: 8,
    height: 36,
  },
  chipText: {
    fontSize: 12,
    color: TEXT_MUTED,
  },

  // ── Chat header ───────────────────────────────────────────────────────────────
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  chatHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_PRIMARY,
  },

  // ── Chat state ────────────────────────────────────────────────────────────────
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },

  bubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: ACCENT,
    borderRadius: 18,
    padding: 12,
    marginBottom: 8,
    maxWidth: '80%',
  },
  bubbleAIWrapper: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    maxWidth: '80%',
  },
  aiLabel: {
    color: TEXT_DIM,
    fontSize: 11,
    marginBottom: 4,
    marginLeft: 2,
  },
  bubbleAI: {
    backgroundColor: SURFACE,
    borderRadius: 18,
    padding: 12,
  },
  bubbleText: {
    fontSize: 14,
    color: TEXT_PRIMARY,
    lineHeight: 20,
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
    backgroundColor: TEXT_MUTED,
  },

  // Chat bottom bar
  chatInputArea: {
    paddingBottom: 94,
    backgroundColor: BG,
  },
  chatInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 16,
  },
  chatInputField: {
    flex: 1,
    color: TEXT_PRIMARY,
    fontSize: 14,
    lineHeight: 20,
    maxHeight: 120,
    backgroundColor: 'transparent',
    padding: 0,
    paddingRight: 8,
    textAlignVertical: 'top',
  },
});
