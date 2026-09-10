import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { chatService } from '../../services/chatService';
import { ChatMessage } from '../../types/chat';
import { Role } from '../../types/auth';
import { AIMessageItem } from './AIMessageItem';
import { MascotAvatar } from './MascotAvatar';
import {
  Send,
  X,
  Minus,
  RotateCcw,
  Sparkles,
  Flame,
  TrendingUp,
  Target,
  FileText,
  ChevronDown
} from 'lucide-react';

export const FloatingAIChatbot: React.FC = () => {
  const { user, role } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const currentRole: Role = role || 'STAFF';

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [delayedPrompt, setDelayedPrompt] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initial welcome message
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-welcome',
        sender: 'ai',
        timestamp: new Date().toISOString(),
        content: "Hi! I'm LeadIQ AI 👋\n\nI can help you find high-intent leads, understand your sales performance, and decide what to do next.",
        roleScope: currentRole
      }
    ];
  });

  // Quick Action Suggestions
  const quickActions = [
    {
      id: 'qa-1',
      label: '🔥 Which leads should I contact today?',
      prompt: 'Which leads should I contact today?',
      icon: Flame
    },
    {
      id: 'qa-2',
      label: '📊 Why did my conversion rate change?',
      prompt: 'Why did my conversion rate change?',
      icon: TrendingUp
    },
    {
      id: 'qa-3',
      label: '🎯 Show high-intent leads',
      prompt: 'Show me high-intent leads.',
      icon: Target
    },
    {
      id: 'qa-4',
      label: '✍ Draft a follow-up',
      prompt: 'Draft a follow-up for Rahul Sharma',
      icon: FileText
    }
  ];

  // Delayed helpful nudge on closed state after 6s
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setDelayedPrompt(true);
      }, 6000);
      return () => clearTimeout(timer);
    } else {
      setDelayedPrompt(false);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen, isMinimized]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timeout);
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
    if (!query || !user || isTyping) return;

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

    try {
      const response = await chatService.sendQuery(query, currentRole, user);
      setMessages(prev => [...prev, response]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        content: `Error generating AI response: ${err?.message || 'Please try again.'}`,
        roleScope: currentRole
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        content: "Hi! I'm LeadIQ AI 👋\n\nI can help you find high-intent leads, understand your sales performance, and decide what to do next.",
        roleScope: currentRole
      }
    ]);
  };

  return (
    <>
      {/* =========================================================================
          1. CLOSED STATE — FLOATING MASCOT TRIGGER BUTTON
          ========================================================================= */}
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
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
              setDelayedPrompt(false);
            }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="mascot-btn-trigger"
            aria-label="Open LeadIQ AI assistant"
            title="Open LeadIQ AI assistant"
          >
            {/* 64px Squircle Animated Mascot */}
            <MascotAvatar size="100%" borderRadius="20px" showGlow={false} showOnlineDot={true} />
          </button>

          {/* Interactive Tooltip on Hover */}
          {(showTooltip || delayedPrompt) && (
            <div className="mascot-tooltip">
              <Sparkles size={14} style={{ color: 'var(--brand-primary)' }} />
              <span>{delayedPrompt && !showTooltip ? 'Need help prioritizing leads?' : 'Ask LeadIQ AI'}</span>
              {delayedPrompt && !showTooltip && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDelayedPrompt(false);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '2px',
                    marginLeft: '4px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Dismiss"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          2. OPEN STATE — FLOATING CHATBOT PANEL
          ========================================================================= */}
      {isOpen && (
        <div
          className="mascot-panel-anim floating-chat-window-responsive"
          role="dialog"
          aria-label="LeadIQ AI Assistant"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: isMinimized ? '340px' : '380px',
            height: isMinimized ? 'auto' : '600px',
            maxHeight: isMinimized ? '68px' : 'calc(100vh - 48px)',
            maxWidth: 'calc(100vw - 32px)',
            backgroundColor: isLight ? 'rgba(255, 255, 255, 0.92)' : 'rgba(6, 17, 15, 0.88)',
            borderRadius: isMinimized ? '20px' : '24px',
            border: isLight ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(255, 255, 255, 0.10)',
            boxShadow: isLight
              ? '0 24px 70px rgba(0, 0, 0, 0.12), 0 0 24px rgba(16, 185, 129, 0.12)'
              : '0 24px 80px rgba(0, 0, 0, 0.55), 0 0 35px rgba(79, 242, 176, 0.18)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 1000,
            backdropFilter: 'blur(28px) saturate(140%)',
            WebkitBackdropFilter: 'blur(28px) saturate(140%)',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* -------------------------------------------------------------------
              CHATBOT HEADER
              ------------------------------------------------------------------- */}
          <div
            style={{
              padding: '0.875rem 1.15rem',
              background: isLight
                ? 'linear-gradient(135deg, rgba(236, 253, 245, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)'
                : 'linear-gradient(135deg, rgba(16, 38, 32, 0.75) 0%, rgba(6, 17, 15, 0.9) 100%)',
              borderBottom: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0
            }}
          >
            {/* Mascot in Header + Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <MascotAvatar size={44} borderRadius="14px" showGlow={false} showOnlineDot={true} />

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                    LeadIQ AI
                  </span>
                  <span
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      padding: '0.1rem 0.4rem',
                      borderRadius: 'var(--radius-full)',
                      background: isLight ? '#D1FAE5' : 'rgba(79, 242, 176, 0.15)',
                      color: isLight ? '#065F46' : 'var(--brand-primary)',
                      border: isLight ? '1px solid #A7F3D0' : '1px solid rgba(79, 242, 176, 0.3)'
                    }}
                  >
                    PRO
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '1px' }}>
                  <span style={{ fontSize: '0.70rem', color: 'var(--text-secondary)' }}>
                    Your sales copilot
                  </span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>•</span>
                  <span style={{ fontSize: '0.68rem', color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    ● Online
                  </span>
                </div>
              </div>
            </div>

            {/* Header Control Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {!isMinimized && (
                <button
                  onClick={handleResetChat}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    padding: '6px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease'
                  }}
                  title="Reset conversation"
                  aria-label="Reset conversation"
                >
                  <RotateCcw size={15} />
                </button>
              )}

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  padding: '6px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease'
                }}
                title={isMinimized ? 'Expand' : 'Minimize'}
                aria-label={isMinimized ? 'Expand AI Chatbot' : 'Minimize AI Chatbot'}
              >
                {isMinimized ? <ChevronDown size={16} /> : <Minus size={16} />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  padding: '6px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease'
                }}
                title="Close LeadIQ AI assistant"
                aria-label="Close LeadIQ AI assistant"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* -------------------------------------------------------------------
              CHAT BODY (When not minimized)
              ------------------------------------------------------------------- */}
          {!isMinimized && (
            <>
              {/* Messages Scroll Area */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                {/* Message stream */}
                {messages.map((msg) => (
                  <AIMessageItem key={msg.id} message={msg} />
                ))}

                {/* AI Thinking / Typing Indicator with Mascot */}
                {isTyping && (
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.625rem',
                      alignItems: 'center',
                      padding: '0.5rem 0.25rem'
                    }}
                  >
                    <MascotAvatar size={28} borderRadius="10px" showGlow={false} />
                    <div
                      style={{
                        padding: '0.6rem 0.95rem',
                        borderRadius: '16px',
                        background: isLight ? '#FFFFFF' : 'rgba(10, 30, 27, 0.75)',
                        border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(79, 242, 176, 0.25)',
                        color: 'var(--text-secondary)',
                        fontSize: '0.78rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <Sparkles size={14} className="animate-spin" style={{ color: 'var(--brand-primary)' }} />
                      <span>Analyzing your CRM leads...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* -----------------------------------------------------------------
                  QUICK ACTION SUGGESTIONS PILLS
                  ----------------------------------------------------------------- */}
              <div
                style={{
                  padding: '0.5rem 0.85rem',
                  borderTop: isLight ? '1px solid #F1F5F9' : '1px solid rgba(255, 255, 255, 0.05)',
                  background: isLight ? '#FAFCFB' : 'rgba(6, 17, 15, 0.5)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.4rem',
                  maxHeight: '100px',
                  overflowY: 'auto'
                }}
              >
                {quickActions.map((qa) => {
                  return (
                    <button
                      key={qa.id}
                      onClick={() => handleSend(qa.prompt)}
                      disabled={isTyping}
                      style={{
                        background: isLight ? '#FFFFFF' : 'rgba(16, 38, 32, 0.65)',
                        border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(79, 242, 176, 0.2)',
                        color: 'var(--text-primary)',
                        padding: '0.35rem 0.65rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        cursor: isTyping ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        transition: 'all 0.15s ease',
                        boxShadow: isLight ? '0 1px 3px rgba(0,0,0,0.03)' : 'none'
                      }}
                    >
                      <span>{qa.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* -----------------------------------------------------------------
                  INPUT AREA
                  ----------------------------------------------------------------- */}
              <div
                style={{
                  padding: '0.75rem 0.85rem 0.85rem',
                  borderTop: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isLight ? '#FFFFFF' : 'rgba(6, 17, 15, 0.95)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <div
                  style={{
                    flex: 1,
                    position: 'relative',
                    borderRadius: '14px',
                    background: isLight ? '#F8FAF9' : 'rgba(16, 38, 32, 0.5)',
                    border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.45rem 0.75rem',
                    transition: 'border-color 0.15s ease'
                  }}
                >
                  <textarea
                    ref={inputRef}
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything about your leads..."
                    rows={1}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      resize: 'none',
                      color: 'var(--text-primary)',
                      fontSize: '0.82rem',
                      lineHeight: '1.4',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <button
                  onClick={() => handleSend()}
                  disabled={!inputQuery.trim() || isTyping}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    background: inputQuery.trim() && !isTyping
                      ? 'var(--brand-gradient)'
                      : (isLight ? '#E2E8F0' : 'rgba(255, 255, 255, 0.1)'),
                    color: inputQuery.trim() && !isTyping
                      ? (isLight ? '#FFFFFF' : '#06110F')
                      : 'var(--text-muted)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: inputQuery.trim() && !isTyping ? 'pointer' : 'not-allowed',
                    flexShrink: 0,
                    boxShadow: inputQuery.trim() && !isTyping
                      ? (isLight ? '0 2px 10px rgba(16, 185, 129, 0.3)' : '0 0 14px rgba(79, 242, 176, 0.35)')
                      : 'none',
                    transition: 'all 0.2s ease'
                  }}
                  title="Send prompt (Enter)"
                  aria-label="Send prompt"
                >
                  <Send size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
