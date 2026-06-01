import { create } from 'zustand';
import { AIMessage } from '../types';

const AI_RESPONSES = [
  'Talk to 20 potential users and identify recurring pain points before writing another line of code.',
  'Your pitch deck should answer one question in the first 30 seconds: why now? Investors fund timing, not just ideas.',
  'Focus on one acquisition channel until it converts predictably, then layer a second. Parallel experiments dilute learning.',
  'Churn is a product problem disguised as a sales problem. Fix retention before scaling spend.',
  'A great co-founder isn't someone who agrees with you — it's someone who makes your blind spots impossible to ignore.',
  'Revenue cures almost everything. One paying customer teaches you more than a hundred free users.',
];

let responseIndex = 0;

interface AIStore {
  messages: AIMessage[];
  isTyping: boolean;
  sendMessage: (content: string) => void;
}

export const useAIStore = create<AIStore>((set, get) => ({
  messages: [
    {
      id: 'init-1',
      role: 'assistant',
      content: "Hey, I'm your AI co-founder. Ask me anything about building, growing, or funding your startup.",
      timestamp: new Date().toISOString(),
    },
  ],
  isTyping: false,

  sendMessage: (content: string) => {
    const userMessage: AIMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, userMessage],
      isTyping: true,
    }));

    setTimeout(() => {
      const aiResponse: AIMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: AI_RESPONSES[responseIndex % AI_RESPONSES.length],
        timestamp: new Date().toISOString(),
      };
      responseIndex += 1;

      set((state) => ({
        messages: [...state.messages, aiResponse],
        isTyping: false,
      }));
    }, 1000);
  },
}));
