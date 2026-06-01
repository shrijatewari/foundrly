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

  const renderMessage = ({ item }: { item: AIMessage }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.messageRow, isUser ? styles.messageRowUser : styles.messageRowAI]}>
        {!isUser && (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AI</Text>
          </View>
        )}
        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
          <Text style={styles.bubbleText}>{item.content}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Co-Founder</Text>
        <Text style={styles.headerSub}>Powered by Foundrly</Text>
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
          ListFooterComponent={
            isTyping ? (
              <View style={[styles.messageRow, styles.messageRowAI]}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>AI</Text>
                </View>
                <View style={[styles.bubble, styles.bubbleAI, styles.typingBubble]}>
                  <Text style={styles.typingDots}>• • •</Text>
                </View>
              </View>
            ) : null
          }
        />

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask your AI co-founder..."
            placeholderTextColor={`${colors.text}40`}
            multiline
            maxLength={500}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!input.trim()}
            activeOpacity={0.8}
          >
            <Text style={styles.sendButtonText}>↑</Text>
          </TouchableOpacity>
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

  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
  },
  headerTitle: {
    ...typography.subheading,
    color: colors.text,
  },
  headerSub: {
    ...typography.caption,
    color: colors.accent,
    marginTop: 1,
  },

  // Message list
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowAI: {
    justifyContent: 'flex-start',
  },

  // Avatar
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Bubbles
  bubble: {
    maxWidth: '76%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: colors.secondary,
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    ...typography.body,
    color: colors.text,
    fontSize: 15,
    lineHeight: 21,
  },
  typingBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  typingDots: {
    color: colors.accent,
    fontSize: 18,
    letterSpacing: 3,
  },

  // Input bar
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    // Clear the floating FoundrlyDock (bottom: 24, ~86 tall).
    marginBottom: 100,
    borderTopWidth: 1,
    borderTopColor: colors.secondary,
    backgroundColor: colors.background,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    ...typography.body,
    color: colors.text,
    fontSize: 15,
    maxHeight: 120,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.primary,
    opacity: 0.5,
  },
  sendButtonText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
  },
});
