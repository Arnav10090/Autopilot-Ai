'use client';

import { useState, useRef, useEffect, KeyboardEvent, useCallback } from 'react';
import { useChat } from '@/contexts/ChatContext';

// Quick reply suggestions
const QUICK_REPLIES = [
  'How do I create a project?',
  'What templates are available?',
  'How does analytics work?',
  'Help me get started',
];

export function ChatWidget() {
  const {
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
  } = useChat();

  const [input, setInput] = useState('');
  const [feedbackGiven, setFeedbackGiven] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Drag state
  const [position, setPosition] = useState({ x: 24, y: 24 }); // Distance from right/bottom
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null);

  // Handle drag start
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (isFullScreen) return;
    e.preventDefault();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    dragRef.current = {
      startX: clientX,
      startY: clientY,
      startPosX: position.x,
      startPosY: position.y,
    };
    setIsDragging(true);
  }, [isFullScreen, position]);

  // Handle drag move
  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!dragRef.current) return;
      
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      const deltaX = dragRef.current.startX - clientX;
      const deltaY = dragRef.current.startY - clientY;
      
      const newX = Math.max(0, Math.min(window.innerWidth - 420, dragRef.current.startPosX + deltaX));
      const newY = Math.max(0, Math.min(window.innerHeight - 550, dragRef.current.startPosY + deltaY));
      
      setPosition({ x: newX, y: newY });
    };

    const handleEnd = () => {
      setIsDragging(false);
      dragRef.current = null;
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', handleEnd);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Focus trap for full-screen mode
  useEffect(() => {
    if (!isFullScreen || !isOpen) return;

    const handleTab = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Tab' || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isFullScreen, isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (isFullScreen) {
          toggleFullScreen();
        } else {
          toggleOpen();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, isFullScreen, toggleOpen, toggleFullScreen]);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;
    const message = input;
    setInput('');
    await sendMessage(message);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleQuickReply = (reply: string) => {
    setInput(reply);
    inputRef.current?.focus();
  };

  const handleFeedback = async (responseId: string, rating: 'up' | 'down') => {
    if (feedbackGiven.has(responseId)) return;
    await submitFeedback(responseId, rating);
    setFeedbackGiven(prev => new Set([...prev, responseId]));
  };

  // Render markdown-like content
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, i) => {
      line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      if (line.startsWith('• ') || line.startsWith('- ')) {
        return <li key={i} className="ml-4" dangerouslySetInnerHTML={{ __html: line.slice(2) }} />;
      }
      const numMatch = line.match(/^(\d+)\.\s/);
      if (numMatch) {
        return <li key={i} className="ml-4" dangerouslySetInnerHTML={{ __html: line.slice(numMatch[0].length) }} />;
      }
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="mb-1" dangerouslySetInnerHTML={{ __html: line }} />;
    });
  };

  // Floating button with drag position
  const FloatingButton = () => (
    <button
      onClick={toggleOpen}
      style={{ right: `${position.x}px`, bottom: `${position.y}px` }}
      className="fixed z-50 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg shadow-neutral-900/30 ring-4 ring-white/50 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-neutral-900/40 active:scale-95 dark:bg-gradient-to-br dark:from-accent dark:to-accent-2 dark:ring-neutral-900/50 dark:shadow-accent/20 dark:hover:shadow-accent/30 sm:h-14 sm:w-14"
      aria-label={isOpen ? 'Close chat' : 'Open chat assistant'}
      aria-expanded={isOpen}
    >
      {isOpen ? (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse" />
        </>
      )}
    </button>
  );

  // Chat panel positioning
  const isMobileSheet = isMobile && isOpen;

  const panelClasses = isFullScreen || isMobileSheet
    ? 'fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm md:items-center'
    : 'fixed z-50';

  const panelStyle = isFullScreen || isMobileSheet
    ? {}
    : { right: `${position.x}px`, bottom: `${position.y + 72}px` };

  const contentClasses = isMobileSheet
    ? 'h-[100dvh] w-full rounded-none md:h-auto md:w-[90vw] md:max-w-4xl md:rounded-2xl'
    : isFullScreen
    ? 'h-[85vh] w-[90vw] max-w-4xl rounded-2xl'
    : 'h-[min(32rem,calc(100dvh-6rem))] w-[calc(100vw-2rem)] max-w-sm rounded-2xl sm:w-96';

  if (!isOpen) {
    return <FloatingButton />;
  }

  return (
    <>
      <FloatingButton />
      
      <div className={panelClasses} style={panelStyle} role="dialog" aria-modal={isFullScreen} aria-label="Chat assistant">
        <div
          ref={panelRef}
          className={`${contentClasses} bg-white dark:bg-neutral-900 shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden animate-scale-in ${isDragging ? 'cursor-grabbing' : ''}`}
        >
          {/* Header - Draggable */}
          <div
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            className={`flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/50 ${!isFullScreen && !isMobile ? 'cursor-grab active:cursor-grabbing' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center">
                <span className="text-sm">🤖</span>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 text-sm">AI Assistant</h3>
                <p className="text-xs text-neutral-500">{!isFullScreen ? 'Drag to move • ' : ''}Always here to help</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {!isMobile && (
                <button
                  onClick={toggleFullScreen}
                  className="rounded-lg p-2 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  aria-label={isFullScreen ? 'Exit full screen' : 'Enter full screen'}
                >
                  <svg className="h-4 w-4 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isFullScreen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    )}
                  </svg>
                </button>
              )}
              <button
                onClick={clearChat}
                className="rounded-lg p-2 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700"
                aria-label="Clear chat"
              >
                <svg className="w-4 h-4 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                onClick={toggleOpen}
                className="rounded-lg p-2 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700"
                aria-label="Close chat"
              >
                <svg className="w-4 h-4 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" aria-live="polite">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    msg.role === 'user'
                      ? 'bg-accent text-neutral-900 dark:text-white rounded-br-md'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-bl-md'
                  }`}
                >
                  <div className="text-sm leading-relaxed">
                    {renderContent(msg.content)}
                  </div>
                  
                  {msg.role === 'assistant' && msg.responseId && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-neutral-200/50 dark:border-neutral-700/50">
                      <span className="text-xs text-neutral-500">Helpful?</span>
                      <button
                        onClick={() => handleFeedback(msg.responseId!, 'up')}
                        disabled={feedbackGiven.has(msg.responseId)}
                        className={`p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors ${
                          feedbackGiven.has(msg.responseId) ? 'opacity-50' : ''
                        }`}
                        aria-label="Thumbs up"
                      >
                        👍
                      </button>
                      <button
                        onClick={() => handleFeedback(msg.responseId!, 'down')}
                        disabled={feedbackGiven.has(msg.responseId)}
                        className={`p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors ${
                          feedbackGiven.has(msg.responseId) ? 'opacity-50' : ''
                        }`}
                        aria-label="Thumbs down"
                      >
                        👎
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex justify-center">
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg px-4 py-2 text-sm">
                  {error}
                  <button
                    onClick={() => sendMessage(messages.filter(m => m.role === 'user').pop()?.content || '')}
                    className="ml-2 underline hover:no-underline"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 1 && (
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-2">
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleQuickReply(reply)}
                    className="px-3 py-1.5 text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-full hover:bg-accent/20 dark:hover:bg-accent hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-neutral-200 p-4 dark:border-neutral-800">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                rows={1}
                className="min-h-[44px] flex-1 resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900 transition-all placeholder-neutral-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                disabled={isLoading}
                aria-label="Message input"
              />
              <button
                onClick={handleSubmit}
                disabled={!input.trim() || isLoading}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-accent px-4 py-2.5 text-white transition-colors hover:bg-accent-2 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Send message"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

