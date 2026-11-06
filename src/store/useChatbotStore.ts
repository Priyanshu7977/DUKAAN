import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NLPEngine, SentimentAnalysisResult, SentimentType } from '../utils/nlpEngine';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  type?: 'text' | 'order_card' | 'return_card' | 'product_card' | 'ticket_card';
  data?: any;
  sentiment?: SentimentAnalysisResult;
  quickReplies?: string[];
}

interface ChatbotState {
  isOpen: boolean;
  isMinimized: boolean;
  isTyping: boolean;
  unreadCount: number;
  activeSentiment: SentimentType;
  hasInteracted: boolean;
  messages: ChatMessage[];
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  minimizeChat: () => void;
  clearHistory: () => void;
  markAsRead: () => void;
  sendMessage: (
    userText: string,
    context?: {
      orders?: any[];
      products?: any[];
      activeUser?: any;
    }
  ) => Promise<void>;
  generateSupportTicket: (reason: string) => string;
}

const INITIAL_GREETING: ChatMessage = {
  id: 'msg-welcome-01',
  sender: 'bot',
  text: 'Welcome to DUKAAN Client Care. I am your personal Atelier Concierge, trained to assist with live order tracking, 7-day doorstep size exchanges, fabric care, or personalized styling advice. How may I assist you today?',
  timestamp: 'Just now',
  type: 'text',
  quickReplies: [
    '📦 Track My Order',
    '🔄 Returns & Exchanges',
    '📐 Size & Fit Guide',
    '🌿 Fabric Care Guide',
    '💬 Speak to Human Concierge',
  ],
};

export const useChatbotStore = create<ChatbotState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      isMinimized: false,
      isTyping: false,
      unreadCount: 0,
      activeSentiment: 'neutral',
      hasInteracted: false,
      messages: [INITIAL_GREETING],

      openChat: () => {
        set({ isOpen: true, isMinimized: false, unreadCount: 0 });
      },

      closeChat: () => {
        set({ isOpen: false });
      },

      toggleChat: () => {
        const { isOpen } = get();
        if (isOpen) {
          set({ isOpen: false });
        } else {
          set({ isOpen: true, isMinimized: false, unreadCount: 0 });
        }
      },

      minimizeChat: () => {
        set((state) => ({ isMinimized: !state.isMinimized }));
      },

      clearHistory: () => {
        set({
          messages: [
            {
              ...INITIAL_GREETING,
              id: `msg-welcome-${Date.now()}`,
              timestamp: 'Just now',
            },
          ],
          activeSentiment: 'neutral',
          unreadCount: 0,
        });
      },

      markAsRead: () => {
        set({ unreadCount: 0 });
      },

      generateSupportTicket: (reason: string) => {
        const ticketId = `TCK-${Math.floor(100000 + Math.random() * 900000)}`;
        return ticketId;
      },

      sendMessage: async (userText: string, context) => {
        const trimmed = userText.trim();
        if (!trimmed) return;

        const classification = NLPEngine.processInput(trimmed);

        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const userMsg: ChatMessage = {
          id: `msg-u-${Date.now()}`,
          sender: 'user',
          text: trimmed,
          timestamp: timeStr,
          sentiment: classification.sentiment,
        };

        set((state) => ({
          messages: [...state.messages, userMsg],
          isTyping: true,
          hasInteracted: true,
          activeSentiment: classification.sentiment.type,
        }));

        await new Promise((resolve) => setTimeout(resolve, 600));

        const botPayload = NLPEngine.generateResponse(classification, context);

        const botMsg: ChatMessage = {
          id: `msg-b-${Date.now()}`,
          sender: 'bot',
          text: botPayload.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: botPayload.type,
          data: botPayload.data,
          quickReplies: botPayload.quickReplies,
        };

        const { isOpen } = get();

        set((state) => ({
          messages: [...state.messages, botMsg],
          isTyping: false,
          unreadCount: isOpen ? 0 : state.unreadCount + 1,
        }));
      },
    }),
    {
      name: 'dukaan_chatbot_storage',
      partialize: (state) => ({
        messages: state.messages.slice(-30),
        hasInteracted: state.hasInteracted,
      }),
    }
  )
);
