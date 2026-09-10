import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { chatService, QUICK_PROMPTS } from '../../services/chatService';
import { ChatMessage } from '../../types/chat';
import { Role } from '../../types/auth';
import { AIMessageItem } from './AIMessageItem';
import {
  Sparkles,
  Send,
  X,
  Minus,
  RotateCcw,
  Bot,
  MessageSquare,
  Shield,
  HelpCircle,
  AlertCircle,
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

type MascotState = 'IDLE' | 'LISTENING' | 'THINKING' | 'TALKING' | 'SUCCESS' | 'ERROR';

export const FloatingAIChatbot: React.FC = () => {
  const { user, role } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const currentRole: Role = role || 'STAFF';

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showConfirmNewChat, setShowConfirmNewChat] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>('IDLE');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial greeting
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-welcome',
        sender: 'ai',
        timestamp: new Date().toISOString(),
        content: "Hi! I'm LeadIQ AI, your sales copilot. Ask me anything about high-intent leads, pipeline health, or next actions.",
        roleScope: currentRole
      }
    ];
  });

  // Suggested Prompts
  const suggestedPrompts = [
    { label: '🔥 Top Leads to Contact', prompt: 'Which leads should I contact today?' },
    { label: '📊 Conversion Drop Reasons', prompt: 'Why did conversions drop this week?' },
    { label: '⚡ High-Intent Pipeline', prompt: 'Show me high-intent leads.' },
    { label: '✉️ Follow-up Draft', prompt: 'Draft a follow-up for Rahul.' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen, isMinimized]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || !user) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toISOString(),
      content: query,
      roleScope: currentRole
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setIsTyping(true);
    setMascotState('THINKING');

    try {
      const response = await chatService.sendQuery(query, currentRole, user);
      setMascotState('TALKING');
      setMessages(prev => [...prev, response]);
      setTimeout(() => setMascotState('IDLE'), 1200);
    } catch (err: any) {
      setMascotState('ERROR');
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        content: `Error generating response: ${err.message}`,
        roleScope: currentRole
      };
      setMessages(prev => [...prev, errorMsg]);
      setTimeout(() => setMascotState('IDLE'), 2000);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        content: `Conversation reset. How can I assist you with your ${currentRole} workspace today?`,
        roleScope: currentRole
      }
    ]);
    setShowConfirmNewChat(false);
  };

  return (
    <>
      {/* 1. FLOATING BUTTON */}
      {!isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 999
          }}
        >
          <button
            onClick={() => setIsOpen(true)}
            className="floating-ai-btn"
            style={{
              padding: '0.65rem 1.15rem 0.65rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              background: isLight
                ? '#FFFFFF'
                : 'linear-gradient(135deg, #0B1C17 0%, #102620 100%)',
              border: isLight
                ? '1.5px solid #10B981'
                : '1.5px solid rgba(79, 242, 176, 0.4)',
              boxShadow: isLight
                ? '0 6px 24px rgba(16, 185, 129, 0.2), 0 2px 8px rgba(0,0,0,0.06)'
                : '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(79, 242, 176, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            title="Open LeadIQ AI Assistant"
            aria-label="Open LeadIQ AI Assistant"
          >
            {/* Pulsing Avatar */}
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: isLight
                  ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #4FF2B0 0%, #20C997 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isLight ? '#FFFFFF' : '#06110F',
                boxShadow: isLight
                  ? '0 0 10px rgba(16, 185, 129, 0.4)'
                  : '0 0 12px rgba(79, 242, 176, 0.45)',
                position: 'relative',
                flexShrink: 0
              }}
            >
              <Bot size={18} />
              <span
                style={{
                  position: 'absolute',
                  top: '-1px',
                  right: '-1px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  border: isLight ? '1.5px solid #FFFFFF' : '1.5px solid #06110F',
                  boxShadow: '0 0 6px #10B981'
                }}
              />
            </div>

            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: isLight ? '#0B1324' : '#F4F7F6', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>LeadIQ AI</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--brand-primary)', fontWeight: 600 }}>
                Sales Copilot
              </div>
            </div>
          </button>
        </div>
      )}

      {/* 2. FLOATING CHAT WINDOW */}
      {isOpen && (
        <div
          className="glass-panel floating-chat-window"
          role="dialog"
          aria-label="LeadIQ AI Assistant Window"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: isMinimized ? '340px' : '420px',
            height: isMinimized ? 'auto' : '640px',
            maxHeight: isMinimized ? '60px' : 'calc(100vh - 48px)',
            maxWidth: 'calc(100vw - 24px)',
            backgroundColor: isLight ? '#FFFFFF' : 'rgba(8, 24, 20, 0.92)',
            borderRadius: '20px',
            border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(79, 242, 176, 0.25)',
            boxShadow: isLight
              ? '0 16px 48px rgba(0, 0, 0, 0.1), 0 0 24px rgba(16, 185, 129, 0.1)'
              : '0 24px 60px rgba(0, 0, 0, 0.5), 0 0 30px rgba(79, 242, 176, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 1000,
            backdropFilter: 'blur(24px) saturate(140%)',
            WebkitBackdropFilter: 'blur(24px) saturate(140%)',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* HEADER */}
          <div
            style={{
              padding: '0.875rem 1.125rem',
              background: isLight
                ? 'linear-gradient(135deg, #ECFDF5 0%, #FFFFFF 100%)'
                : 'linear-gradient(135deg, rgba(79, 242, 176, 0.1) 0%, rgba(32, 201, 151, 0.05) 100%)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0
            }}
          >
            {/* Mascot Avatar & Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: isLight
                    ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, #4FF2B0 0%, #20C997 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isLight ? '#FFFFFF' : '#06110F',
                  boxShadow: isLight ? '0 0 10px rgba(16, 185, 129, 0.3)' : '0 0 14px rgba(79, 242, 176, 0.4)',
                  position: 'relative',
                  flexShrink: 0
                }}
              >
                {mascotState === 'THINKING' ? (
                  <Sparkles size={18} className="animate-spin" />
                ) : mascotState === 'ERROR' ? (
                  <AlertTriangle size={18} />
                ) : mascotState === 'SUCCESS' ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <Bot size={18} />
                )}

                <span
                  style={{
                    position: 'absolute',
                    top: '-1px',
                    right: '-1px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: mascotState === 'ERROR' ? '#ef4444' : '#10B981',
                    border: isLight ? '1.5px solid #FFFFFF' : '1.5px solid #06110F',
                    boxShadow: '0 0 6px #10B981'
                  }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    LeadIQ AI
                  </span>
                  <span
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      padding: '0.1rem 0.4rem',
                      borderRadius: '4px',
                      background: 'var(--brand-primary-light)',
                      color: 'var(--brand-primary)',
                      border: '1px solid var(--brand-primary-border)'
                    }}
                  >
                    COPILOT
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {mascotState === 'THINKING'
                    ? 'Neural reasoning in progress...'
                    : mascotState === 'TALKING'
                    ? 'Synthesizing response...'
                    : 'Your sales copilot • Online'}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {!isMinimized && (
                <button
                  onClick={() => setShowConfirmNewChat(true)}
                  className="btn-ghost"
                  title="New Chat"
                  aria-label="Start New Chat"
                  style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)' }}
                >
                  <RotateCcw size={15} />
                </button>
              )}

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="btn-ghost"
                title={isMinimized ? 'Expand' : 'Minimize'}
                aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
                style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)' }}
              >
                <Minus size={15} />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="btn-ghost"
                title="Close AI assistant"
                aria-label="Close AI assistant"
                style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)' }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* CONFIRM NEW CHAT POPUP */}
          {showConfirmNewChat && (
            <div
              style={{
                padding: '0.875rem 1rem',
                backgroundColor: isLight ? '#F8FAF9' : 'rgba(12, 32, 27, 0.95)',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                animation: 'fadeIn 0.2s ease-out'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                <AlertCircle size={15} style={{ color: 'var(--brand-primary)' }} />
                <span>Start fresh conversation?</span>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  onClick={() => setShowConfirmNewChat(false)}
                  className="btn-ghost btn-sm"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleNewChat}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                >
                  New Chat
                </button>
              </div>
            </div>
          )}

          {/* CONVERSATION STREAM & QUICK CHIPS */}
          {!isMinimized && (
            <>
              {/* Suggested Prompts Strip */}
              <div
                style={{
                  padding: '0.5rem 0.875rem',
                  backgroundColor: isLight ? '#F8FAF9' : 'rgba(6, 17, 15, 0.6)',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  gap: '0.4rem',
                  overflowX: 'auto',
                  scrollbarWidth: 'none',
                  flexShrink: 0
                }}
              >
                {suggestedPrompts.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(item.prompt)}
                    disabled={isTyping}
                    style={{
                      padding: '0.3rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: isLight ? '#FFFFFF' : 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-subtle)',
                      color: isLight ? '#475569' : 'var(--text-primary)',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      transition: 'all var(--transition-fast)'
                    }}
                    className="quick-chip-btn"
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Message List */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {messages.map(msg => (
                  <AIMessageItem key={msg.id} message={msg} />
                ))}

                {isTyping && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: 'var(--brand-primary)',
                      fontSize: '0.78rem',
                      padding: '0.5rem 0.25rem'
                    }}
                  >
                    <Sparkles size={14} className="animate-spin" />
                    <span>LeadIQ AI is analyzing CRM datasets...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* INPUT BAR */}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSend();
                }}
                style={{
                  padding: '0.75rem 1rem',
                  borderTop: '1px solid var(--border-subtle)',
                  backgroundColor: isLight ? '#FFFFFF' : 'rgba(8, 24, 20, 0.95)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  flexShrink: 0
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputQuery}
                  onChange={e => setInputQuery(e.target.value)}
                  placeholder="Ask LeadIQ about leads, revenue, deals..."
                  disabled={isTyping}
                  style={{
                    flex: 1,
                    padding: '0.625rem 0.875rem',
                    fontSize: '0.84rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: isLight ? '#F8FAF9' : 'rgba(6, 17, 15, 0.8)',
                    color: 'var(--text-primary)',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  disabled={isTyping || !inputQuery.trim()}
                  className="btn btn-primary"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: isLight ? '0 2px 8px rgba(16, 185, 129, 0.3)' : '0 2px 10px rgba(79, 242, 176, 0.3)'
                  }}
                  aria-label="Send query"
                >
                  <Send size={15} />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* Embedded CSS */}
      <style>{`
        .floating-ai-btn:hover {
          transform: translateY(-2px);
          border-color: var(--brand-primary);
        }

        .quick-chip-btn:hover {
          border-color: var(--brand-primary) !important;
          background-color: var(--brand-primary-light) !important;
          color: var(--brand-primary) !important;
        }

        @media (max-width: 640px) {
          .floating-chat-window {
            left: 12px !important;
            right: 12px !important;
            bottom: 12px !important;
            width: auto !important;
            height: calc(100vh - 24px) !important;
            max-height: calc(100vh - 24px) !important;
            border-radius: 18px !important;
          }
        }
      `}</style>
    </>
  );
};
