import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { chatService, QUICK_PROMPTS } from '../../services/chatService';
import { ChatMessage } from '../../types/chat';
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
  AlertCircle
} from 'lucide-react';

export const FloatingAIChatbot: React.FC = () => {
  const { user, role } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showConfirmNewChat, setShowConfirmNewChat] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial greeting
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-welcome',
        sender: 'ai',
        timestamp: new Date().toISOString(),
        content: "Hi! I'm Lead-IQ AI. Ask me anything about your CRM data.",
        roleScope: role || 'STAFF'
      }
    ];
  });

  // Role quick prompts
  const rolePrompts = role
    ? QUICK_PROMPTS.filter(p => p.allowedRoles.includes(role))
    : [];

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

  // If Admin, do not show CRM chatbot (or if role is null)
  if (role === 'ADMIN' || !role) {
    return null;
  }

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || !user) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toISOString(),
      content: query,
      roleScope: role
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setIsTyping(true);

    try {
      const aiResponse = await chatService.sendQuery(query, role, user);
      setMessages(prev => [...prev, aiResponse]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'ai',
          timestamp: new Date().toISOString(),
          content: `⚠️ Sorry, an error occurred while processing your request: ${err.message}`,
          roleScope: role
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: `msg-welcome-${Date.now()}`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        content: "Hi! I'm Lead-IQ AI. Ask me anything about your CRM data.",
        roleScope: role
      }
    ]);
    setShowConfirmNewChat(false);
  };

  return (
    <>
      {/* 1. FLOATING CHAT TRIGGER BUTTON */}
      {!isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 1000
          }}
        >
          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="floating-ai-btn"
            title="Ask Lead-IQ AI"
            aria-label="Open Lead-IQ AI Assistant"
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'var(--brand-gradient)',
              border: 'none',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 6px 24px rgba(59, 130, 246, 0.45), 0 0 20px rgba(139, 92, 246, 0.35)',
              transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
              position: 'relative'
            }}
          >
            <Sparkles size={26} className="ai-spark-icon" />

            {/* Glowing active status badge */}
            <span
              style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                border: '2px solid var(--bg-surface)',
                boxShadow: '0 0 8px #10b981'
              }}
            />
          </button>
        </div>
      )}

      {/* 2. FLOATING CHAT WINDOW */}
      {isOpen && (
        <div
          className="floating-chat-window"
          role="dialog"
          aria-label="Lead-IQ AI Assistant Window"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: isMinimized ? '320px' : '400px',
            height: isMinimized ? 'auto' : '620px',
            maxHeight: isMinimized ? '60px' : 'calc(100vh - 48px)',
            maxWidth: 'calc(100vw - 24px)',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '22px',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4), 0 0 32px rgba(59, 130, 246, 0.18)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 1000,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* HEADER */}
          <div
            style={{
              padding: '0.875rem 1.125rem',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.12) 100%)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0
            }}
          >
            {/* Left: Identity & Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'var(--brand-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 2px 10px rgba(59, 130, 246, 0.4)',
                  flexShrink: 0
                }}
              >
                <Sparkles size={18} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Lead-IQ AI
                  </span>
                  <span
                    style={{
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      padding: '0.1rem 0.35rem',
                      borderRadius: '4px',
                      background: 'var(--brand-primary-light)',
                      color: 'var(--brand-primary)'
                    }}
                  >
                    {role}
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#10b981',
                      display: 'inline-block',
                      boxShadow: '0 0 6px #10b981'
                    }}
                  />
                  <span>Online • Your CRM assistant</span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
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
                backgroundColor: 'var(--bg-surface-elevated)',
                borderBottom: '1px solid var(--border-medium)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                animation: 'fadeIn 0.2s ease-out'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                <AlertCircle size={15} style={{ color: 'var(--brand-secondary)' }} />
                <span>Start a new conversation?</span>
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

          {/* CONVERSATION STREAM & QUICK CHIPS (Hidden when Minimized) */}
          {!isMinimized && (
            <>
              {/* Quick Suggestion Chips */}
              <div
                style={{
                  padding: '0.5rem 0.875rem',
                  backgroundColor: 'var(--bg-app)',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  gap: '0.4rem',
                  overflowX: 'auto',
                  scrollbarWidth: 'none',
                  flexShrink: 0
                }}
              >
                {rolePrompts.map(prompt => (
                  <button
                    key={prompt.id}
                    onClick={() => handleSend(prompt.prompt)}
                    disabled={isTyping}
                    style={{
                      padding: '0.3rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
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
                    <MessageSquare size={11} style={{ color: 'var(--brand-primary)' }} />
                    <span>{prompt.label}</span>
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
                    <span>Lead-IQ AI is analyzing CRM data...</span>
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
                  backgroundColor: 'var(--bg-surface)',
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
                  placeholder="Ask about your CRM..."
                  disabled={isTyping}
                  style={{
                    flex: 1,
                    padding: '0.625rem 0.875rem',
                    fontSize: '0.84rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-app)',
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
                    flexShrink: 0
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

      {/* Embedded CSS for pulse, animations and mobile responsiveness */}
      <style>{`
        @keyframes ai-pulse {
          0% {
            box-shadow: 0 6px 24px rgba(59, 130, 246, 0.45), 0 0 20px rgba(139, 92, 246, 0.35);
          }
          50% {
            box-shadow: 0 8px 30px rgba(59, 130, 246, 0.65), 0 0 28px rgba(139, 92, 246, 0.55);
          }
          100% {
            box-shadow: 0 6px 24px rgba(59, 130, 246, 0.45), 0 0 20px rgba(139, 92, 246, 0.35);
          }
        }

        .floating-ai-btn {
          animation: ai-pulse 3s infinite ease-in-out;
        }

        .floating-ai-btn:hover {
          transform: scale(1.06);
        }

        .quick-chip-btn:hover {
          border-color: var(--brand-primary) !important;
          background-color: var(--brand-primary-light) !important;
          color: var(--brand-primary) !important;
        }

        @media (max-width: 640px) {
          .floating-ai-btn {
            width: 54px !important;
            height: 54px !important;
            bottom: 16px !important;
            right: 16px !important;
          }

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
