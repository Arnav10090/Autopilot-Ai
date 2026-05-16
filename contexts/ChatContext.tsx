'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { buildApiUrl } from '@/lib/api';

// Types
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  responseId?: string;
}

interface ChatContextType {
  isOpen: boolean;
  isFullScreen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  toggleOpen: () => void;
  toggleFullScreen: () => void;
  sendMessage: (message: string) => Promise<void>;
  submitFeedback: (responseId: string, rating: 'up' | 'down', comment?: string) => Promise<void>;
  clearChat: () => void;
  currentContext: AppContext;
}

interface AppContext {
  page: string;
  module: string;
  recentActions: string[];
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// API functions
async function sendChatMessage(message: string, sessionId: string, context: AppContext, userId?: string) {
  const response = await fetch(buildApiUrl('/api/chat'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId, context, userId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to send message');
  }

  return response.json();
}

async function sendChatMessageStream(
  message: string,
  sessionId: string,
  context: AppContext,
  userId: string | undefined,
  onChunk: (chunk: string) => void,
  onComplete: (responseId: string) => void,
  onError: (error: string, retryable: boolean) => void
) {
  try {
    const response = await fetch(buildApiUrl('/api/chat/stream'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sessionId, context, userId }),
    });

    if (!response.ok || !response.body) {
      throw new Error('Streaming not available');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let responseId = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value);
      const lines = text.split('\n').filter(line => line.startsWith('data: '));

      for (const line of lines) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.type === 'start') {
            responseId = data.responseId;
          } else if (data.type === 'chunk') {
            onChunk(data.chunk);
          } else if (data.type === 'done') {
            onComplete(responseId);
          } else if (data.error) {
            onError(data.error, data.retryable);
          }
        } catch (e) {
          // Ignore parse errors for partial chunks
        }
      }
    }
  } catch (error) {
    // Fallback to non-streaming
    throw error;
  }
}

async function submitChatFeedback(responseId: string, rating: 'up' | 'down', comment?: string) {
  await fetch(buildApiUrl('/api/chat/feedback'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ responseId, rating, comment }),
  });
}

// Provider
export function ChatProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [recentActions, setRecentActions] = useState<string[]>([]);

  // Derive module from pathname
  const getModule = (path: string): string => {
    if (path.startsWith('/create')) return 'project-form';
    if (path.startsWith('/project/')) return 'project-detail';
    if (path.startsWith('/projects')) return 'projects-list';
    if (path.startsWith('/templates')) return 'templates';
    if (path.startsWith('/analytics')) return 'analytics';
    if (path.startsWith('/settings')) return 'settings';
    if (path.startsWith('/help')) return 'help';
    return 'dashboard';
  };

  const currentContext: AppContext = {
    page: pathname,
    module: getModule(pathname),
    recentActions: recentActions.slice(-5),
  };

  // Track page visits as actions
  useEffect(() => {
    setRecentActions(prev => [...prev.slice(-4), `visited_${pathname}`]);
  }, [pathname]);

  // Add welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: "👋 Hi! I'm your AutoPilot AI assistant. I can help you:\n\n• Navigate the app and understand features\n• Create and manage projects\n• Explain how things work\n\nWhat would you like to know?",
        timestamp: Date.now(),
      }]);
    }
  }, [isOpen, messages.length]);

  const toggleOpen = useCallback(() => {
    setIsOpen(prev => !prev);
    setError(null);
  }, []);

  const toggleFullScreen = useCallback(() => {
    setIsFullScreen(prev => !prev);
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    // Get userId from localStorage
    let userId: string | undefined;
    try {
      const user = localStorage.getItem('user');
      if (user) userId = JSON.parse(user).id;
    } catch (e) {}

    // Prepare assistant message for streaming
    const assistantId = `assistant_${Date.now()}`;
    let streamedContent = '';

    try {
      // Try streaming first
      await sendChatMessageStream(
        message,
        sessionId,
        currentContext,
        userId,
        (chunk) => {
          streamedContent += chunk;
          setMessages(prev => {
            const existing = prev.find(m => m.id === assistantId);
            if (existing) {
              return prev.map(m => m.id === assistantId ? { ...m, content: streamedContent } : m);
            } else {
              return [...prev, {
                id: assistantId,
                role: 'assistant',
                content: streamedContent,
                timestamp: Date.now(),
              }];
            }
          });
        },
        (responseId) => {
          setMessages(prev => prev.map(m => 
            m.id === assistantId ? { ...m, responseId } : m
          ));
          setIsLoading(false);
        },
        (errorMsg, retryable) => {
          setError(errorMsg);
          setIsLoading(false);
        }
      );
    } catch (streamError) {
      // Fallback to non-streaming
      try {
        const response = await sendChatMessage(message, sessionId, currentContext, userId);
        setMessages(prev => [...prev, {
          id: assistantId,
          role: 'assistant',
          content: response.reply,
          timestamp: Date.now(),
          responseId: response.responseId,
        }]);
      } catch (fallbackError) {
        setError(fallbackError instanceof Error ? fallbackError.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }
  }, [isLoading, sessionId, currentContext]);

  const submitFeedback = useCallback(async (responseId: string, rating: 'up' | 'down', comment?: string) => {
    try {
      await submitChatFeedback(responseId, rating, comment);
    } catch (e) {
      console.error('Failed to submit feedback:', e);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return (
    <ChatContext.Provider value={{
      isOpen,
      isFullScreen,
      messages,
      isLoading,
      error,
      toggleOpen,
      toggleFullScreen,
      sendMessage,
      submitFeedback,
      clearChat,
      currentContext,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
}
