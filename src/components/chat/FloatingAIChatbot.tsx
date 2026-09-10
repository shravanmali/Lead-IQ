import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { chatService } from '../../services/chatService';
import { ChatMessage } from '../../types/chat';
import { Role } from '../../types/auth';
import { AIMessageItem } from './AIMessageItem';
import { MascotPanelVideo } from './MascotPanelVideo';
import {
  Send,
  X,
  RotateCcw,
  Sparkles,
  Flame,
  TrendingUp,
  Target,
  FileText
} from 'lucide-react';

export const FloatingAIChatbot: React.FC = () => {
  const { user, role } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const currentRole: Role = role || 'STAFF';

  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
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
        content: "Hi! 👋 How can I help you today?\n\nI can help you prioritize high-intent leads, understand conversion analytics, or draft fast follow-ups.",
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

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

  const handleGreetingComplete = useCallback(() => {
    setHasGreeted(true);
  }, []);

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
        content: "Hi! 👋 How can I help you today?\n\nI can help you prioritize high-intent leads, understand conversion analytics, or draft fast follow-ups.",
        roleScope: currentRole
      }
    ]);
  };

  return (
    <>
      {/* =========================================================================
          1. FLOATING CIRCULAR PHOTO CHATBOT BUTTON (Bottom-Right)
          Uses the provided PHOTO specifically as the circular clickable launcher.
          ========================================================================= */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 999
        }}
      >
        <button
          onClick={() => setIsOpen(prev => !prev)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="mascot-photo-btn"
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            padding: 0,
            border: isLight
              ? '2px solid rgba(16, 185, 129, 0.4)'
              : '2px solid rgba(79, 242, 176, 0.45)',
            background: isLight ? '#FFFFFF' : '#071813',
            boxShadow: isLight
              ? '0 8px 24px rgba(16, 185, 129, 0.22), 0 2px 8px rgba(0, 0, 0, 0.08)'
              : '0 12px 36px rgba(0, 0, 0, 0.55), 0 0 24px rgba(79, 242, 176, 0.25)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          aria-label={isOpen ? 'Close LeadIQ AI assistant' : 'Open LeadIQ AI assistant'}
          title="LeadIQ AI Assistant"
        >
          {/* Exact PHOTO Provided */}
          <img
            src="/assets/mascot-photo.jpg"
            alt="LeadIQ Mascot"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              borderRadius: '50%',
              display: 'block',
              pointerEvents: 'none'
            }}
          />

          {/* Online Pulsing Indicator Dot */}
          <span
            className="mascot-online-dot"
            style={{
              position: 'absolute',
              top: '3px',
              right: '3px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              border: isLight ? '2px solid #FFFFFF' : '2px solid #06110F',
              boxShadow: '0 0 8px #10B981',
              zIndex: 3
            }}
            title="AI Online"
          />
        </button>

        {/* Hover Tooltip */}
        {showTooltip && !isOpen && (
          <div className="mascot-tooltip">
            <Sparkles size={14} style={{ color: 'var(--brand-primary)' }} />
            <span>Ask LeadIQ AI</span>
          </div>
        )}
      </div>

      {/* =========================================================================
          2. SLIDE-IN CHATBOT PANEL (From Right to Left, ~25vw width on desktop)
          Contains the MASCOT VIDEO at the top, Title, Conversation, and Input.
          ========================================================================= */}
      <div
        className="mascot-slide-panel"
        role="dialog"
        aria-label="LeadIQ AI Assistant Window"
        style={{
          position: 'fixed',
          top: '16px',
          bottom: '16px',
          right: '16px',
          width: 'max(380px, 25vw)',
          maxWidth: 'min(460px, calc(100vw - 32px))',
          height: 'calc(100vh - 32px)',
          backgroundColor: isLight ? 'rgba(255, 255, 255, 0.94)' : 'rgba(6, 17, 15, 0.90)',
          borderRadius: '24px',
          border: isLight ? '1px solid rgba(16, 185, 129, 0.28)' : '1px solid rgba(255, 255, 255, 0.10)',
          boxShadow: isLight
            ? '0 24px 80px rgba(0, 0, 0, 0.15), 0 0 32px rgba(16, 185, 129, 0.12)'
            : '0 24px 90px rgba(0, 0, 0, 0.65), 0 0 40px rgba(79, 242, 176, 0.18)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 1000,
          backdropFilter: 'blur(32px) saturate(140%)',
          WebkitBackdropFilter: 'blur(32px) saturate(140%)',
          transform: isOpen ? 'translateX(0)' : 'translateX(calc(100% + 32px))',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease'
        }}
      >
        {/* ---------------------------------------------------------------------
            PANEL TOP CONTROLS & HEADER
            --------------------------------------------------------------------- */}
        <div
          style={{
            padding: '0.85rem 1.15rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.08)',
            background: isLight
              ? 'linear-gradient(135deg, rgba(236, 253, 245, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)'
              : 'linear-gradient(135deg, rgba(16, 38, 32, 0.8) 0%, rgba(6, 17, 15, 0.95) 100%)',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
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
              title="Close panel"
              aria-label="Close panel"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------------------------
            MASCOT VIDEO BANNER AT TOP OF CHATBOT
            Plays greeting (1.0s -> 2.0s) once on first open, then loops (2.5s -> 6.0s).
            --------------------------------------------------------------------- */}
        <div
          style={{
            padding: '0.85rem 1.15rem 0.5rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flexShrink: 0
          }}
        >
          <MascotPanelVideo
            hasGreeted={hasGreeted}
            onGreetingComplete={handleGreetingComplete}
            width="100%"
            height="135px"
          />

          <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              AI Sales Copilot
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '0.70rem', color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
              ● Online
            </span>
          </div>
        </div>

        {/* ---------------------------------------------------------------------
            CONVERSATION AREA
            --------------------------------------------------------------------- */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0.75rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}
        >
          {/* Message stream */}
          {messages.map((msg) => (
            <AIMessageItem key={msg.id} message={msg} />
          ))}

          {/* AI Thinking indicator */}
          {isTyping && (
            <div
              style={{
                display: 'flex',
                gap: '0.625rem',
                alignItems: 'center',
                padding: '0.25rem 0'
              }}
            >
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

        {/* ---------------------------------------------------------------------
            QUICK ACTION SUGGESTIONS PILLS
            --------------------------------------------------------------------- */}
        <div
          style={{
            padding: '0.5rem 0.85rem',
            borderTop: isLight ? '1px solid #F1F5F9' : '1px solid rgba(255, 255, 255, 0.05)',
            background: isLight ? '#FAFCFB' : 'rgba(6, 17, 15, 0.5)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.35rem',
            maxHeight: '90px',
            overflowY: 'auto',
            flexShrink: 0
          }}
        >
          {quickActions.map((qa) => (
            <button
              key={qa.id}
              onClick={() => handleSend(qa.prompt)}
              disabled={isTyping}
              style={{
                background: isLight ? '#FFFFFF' : 'rgba(16, 38, 32, 0.65)',
                border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(79, 242, 176, 0.2)',
                color: 'var(--text-primary)',
                padding: '0.3rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.70rem',
                fontWeight: 600,
                cursor: isTyping ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.15s ease',
                boxShadow: isLight ? '0 1px 3px rgba(0,0,0,0.03)' : 'none'
              }}
            >
              <span>{qa.label}</span>
            </button>
          ))}
        </div>

        {/* ---------------------------------------------------------------------
            INPUT AREA
            --------------------------------------------------------------------- */}
        <div
          style={{
            padding: '0.75rem 0.85rem 0.85rem',
            borderTop: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.08)',
            background: isLight ? '#FFFFFF' : 'rgba(6, 17, 15, 0.95)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexShrink: 0
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
            title="Send message (Enter)"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </>
  );
};
