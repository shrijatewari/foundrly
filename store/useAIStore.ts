import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { AIMessage } from '../types';

const STORAGE_KEY = '@foundrly/ai-messages';

const INITIAL_MESSAGE: AIMessage = {
  id: 'init-1',
  role: 'assistant',
  content:
    "Hey, I'm your AI co-founder. Ask me anything about building, growing, or funding your startup.",
  timestamp: new Date().toISOString(),
};

const AI_RESPONSES = [
  'Talk to 20 potential users and identify recurring pain points before writing another line of code.',
  'Your pitch deck should answer one question in the first 30 seconds: why now? Investors fund timing, not just ideas.',
  'Focus on one acquisition channel until it converts predictably, then layer a second. Parallel experiments dilute learning.',
  'Churn is a product problem disguised as a sales problem. Fix retention before scaling spend.',
  "A great co-founder isn't someone who agrees with you — it's someone who makes your blind spots impossible to ignore.",
  'Revenue cures almost everything. One paying customer teaches you more than a hundred free users.',
];

let responseIndex = 0;

interface AIStore {
  messages: AIMessage[];
  isTyping: boolean;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  sendMessage: (content: string) => void;
}

export const useAIStore = create<AIStore>((set, get) => ({
  messages: [INITIAL_MESSAGE],
  isTyping: false,
  hydrated: false,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as AIMessage[];
        set({ messages: saved.length > 0 ? saved : [INITIAL_MESSAGE], hydrated: true });
      } else {
        set({ hydrated: true });
      }
    } catch {
      set({ hydrated: true });
    }
  },

  sendMessage: (content: string) => {
    const userMessage: AIMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    const withUser = [...get().messages, userMessage];
    set({ messages: withUser, isTyping: true });

    setTimeout(() => {
      const aiResponse: AIMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: AI_RESPONSES[responseIndex % AI_RESPONSES.length],
        timestamp: new Date().toISOString(),
      };
      responseIndex += 1;

      const withAI = [...get().messages, aiResponse];
      set({ messages: withAI, isTyping: false });
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(withAI)).catch(() => {});
    }, 1000);
  },
}));

// Hydrate immediately on module load.
useAIStore.getState().hydrate();
