import { create } from 'zustand';
import { ChatMessage, Expert, Consultation } from '@/types';

interface AIState {
  messages: ChatMessage[];
  experts: Expert[];
  consultations: Consultation[];
  isTyping: boolean;
  codeOutput: string;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  setExperts: (experts: Expert[]) => void;
  setConsultations: (consultations: Consultation[]) => void;
  setIsTyping: (typing: boolean) => void;
  setCodeOutput: (code: string) => void;
  clearMessages: () => void;
}

export const useAIStore = create<AIState>((set) => ({
  messages: [],
  experts: [],
  consultations: [],
  isTyping: false,
  codeOutput: '',
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setExperts: (experts) => set({ experts }),
  setConsultations: (consultations) => set({ consultations }),
  setIsTyping: (typing) => set({ isTyping: typing }),
  setCodeOutput: (code) => set({ codeOutput: code }),
  clearMessages: () => set({ messages: [] }),
}));