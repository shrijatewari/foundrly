import { create } from 'zustand';
import { AIMessage } from '../types';

const AI_RESPONSES = [
  'Talk to 20 potential users first.',
  'Focus on one problem before building.',
  'Validate with a landing page first.',
  'The best co-founder fills your skill gaps.',
  'Revenue is the best fundraising strategy.',
  'Your pitch needs a clear problem slide.',
];

let responseIndex = 0;

interface AIStore {
  messages: AIMessage[];
  isTyping: boolean;
  sendMessage: (content: string) => void;
  clearMessages: () => void;
}

export const useAIStore = create<AIStore>((set, get) => ({
  messages: [],
  isTyping: false,

  clearMessages: () => set({ messages: [], isTyping: false }),

  sendMessage: (content: string) => {
    const userMessage: AIMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    set({ messages: [...get().messages, userMessage], isTyping: true });

    setTimeout(() => {
      const aiResponse: AIMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: AI_RESPONSES[responseIndex % AI_RESPONSES.length],
        timestamp: new Date().toISOString(),
      };
      responseIndex += 1;

      set({ messages: [...get().messages, aiResponse], isTyping: false });
    }, 1000);
  },
}));
