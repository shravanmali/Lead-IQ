import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, QuickPrompt } from '../../types/chat';
import { Role, User } from '../../types/auth';
import { AIMessageItem } from './AIMessageItem';
import { chatService, QUICK_PROMPTS } from '../../services/chatService';
import { Send, Sparkles, Trash2, Bot, MessageSquare, Shield, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AIChatBotProps {
  role: Role;
}

export const AIChatBot: React.FC<AIChatBotProps> = ({ role }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const welcome =
      role === 'MANAGER'
        ? `👋 Hello Elena! I am your **Lead-IQ Manager AI Assistant**. 

I have full access to your CRM analytics, revenue intelligence, predictive 90-day forecasts, lead status matrices, and staff performance metrics.

How can I assist your sales operations today?`
        : `👋 Hello Marcus! I am your **Lead-IQ Staff Assistant**. 

I can help you prioritize your assigned leads, review Whisper call transcripts, check predictive conversion scores, and prepare automated follow-up proposals.`;

    return [
      {
        id: 'msg-welcome',
        sender: 'ai',
        timestamp: new Date().toISOString(),
        content: welcome,
        roleScope: role
      }
    ];
  });

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const availablePrompts = QUICK_PROMPTS.filter(p => p.allowedRoles.includes(role));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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

  const handleClear = () => {
    setMessages([
      {
        id: `msg-welcome-${Date.now()}`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        content: `Chat history cleared. How can I assist you?`,
        roleScope: role
      }
    ]);
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: '1.5rem',
        height: 'calc(100vh - 150px)',
        minHeight: '600px'
      }}
    >
      {/* Left Sidebar: Quick Prompts & Role Capabilities */}
      <div
        className="card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.25rem',
          height: '100%',
          overflowY: 'auto'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <Sparkles size={18} style={{ color: 'var(--brand-primary)' }} />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              {role === 'MANAGER' ? 'Manager CRM AI' : 'Staff CRM AI'}
            </h4>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.875rem' }}>
            SUGGESTED CRM PROMPTS
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {availablePrompts.map(prompt => (
              <button
                key={prompt.id}
                onClick={() => handleSend(prompt.prompt)}
                disabled={isTyping}
                className="btn-secondary"
                style={{
                  textAlign: 'left',
                  fontSize: '0.8125rem',
                  padding: '0.625rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  justifyContent: 'flex-start',
                  whiteSpace: 'normal',
                  lineHeight: 1.3
                }}
              >
                <MessageSquare size={13} style={{ flexShrink: 0, color: 'var(--brand-primary)' }} />
                <span>{prompt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Security / Scope Reminder */}
        <div
          style={{
            padding: '0.875rem',
            backgroundColor: 'var(--bg-surface-elevated)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            lineHeight: 1.4
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
            <Shield size={13} />
            <span>Role-Scoped Security</span>
          </div>
          {role === 'MANAGER'
            ? 'Access to full CRM financials, team conversion rates, and predictive models.'
            : 'Access scoped to assigned prospects, transcripts, and AI lead actions.'}
        </div>
      </div>

      {/* Main Chat Workspace */}
      <div
        className="card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          height: '100%'
        }}
      >
        {/* Chat Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '0.875rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--brand-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 2px 10px rgba(59, 130, 246, 0.4)'
              }}
            >
              <Bot size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Lead-IQ Neural Assistant
              </div>
              <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                Online • Active CRM Session
              </div>
            </div>
          </div>

          <button
            onClick={handleClear}
            className="btn-ghost btn-sm"
            style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            title="Clear Chat History"
          >
            <Trash2 size={14} />
            <span>Clear</span>
          </button>
        </div>

        {/* Message Stream */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.25rem 0',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {messages.map(msg => (
            <AIMessageItem key={msg.id} message={msg} />
          ))}

          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand-primary)', fontSize: '0.8125rem', padding: '0.5rem 0' }}>
              <Sparkles size={16} className="animate-spin" />
              <span>Lead-IQ is formulating CRM intelligence response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          style={{
            display: 'flex',
            gap: '0.75rem',
            paddingTop: '0.875rem',
            borderTop: '1px solid var(--border-subtle)'
          }}
        >
          <input
            type="text"
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            placeholder={
              role === 'MANAGER'
                ? 'Ask about monthly revenue, lead rankings, staff conversion rates...'
                : 'Ask which lead to contact first, view approved leads, search prospect...'
            }
            style={{ flex: 1 }}
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={isTyping || !inputQuery.trim()}
            className="btn btn-primary"
            style={{ padding: '0 1.25rem' }}
          >
            <Send size={16} />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
