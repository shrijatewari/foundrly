import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { AIMessage } from '../types';

const STORAGE_KEY = '@foundrly/ai-messages';

const AI_RESPONSES = [
  'Talk to 20 potential users and identify recurring pain points.',
  'Focus on one core problem before building any features.',
  'Your pitch deck needs a clear problem slide above everything else.',
  'Validate with a landing page before writing a single line of code.',
  'The best co-founder is someone who fills your exact skill gaps.',
  'Revenue is the best fundraising strategy for early stage startups.',
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
  messages: [],
  isTyping: false,
  hydrated: false,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as AIMessage[];
        set({ messages: saved, hydrated: true });
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

useAIStore.getState().hydrate();
