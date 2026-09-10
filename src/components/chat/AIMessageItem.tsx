import React from 'react';
import { ChatMessage } from '../../types/chat';
import { Bot, User as UserIcon, Lock, Sparkles, ExternalLink, ArrowRight, Flame } from 'lucide-react';
import { LeadScoreBadge } from '../common/LeadScoreBadge';
import { LeadStatusBadge } from '../common/LeadStatusBadge';
import { formatINR } from '../../utils/formatters';

export const AIMessageItem: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isAI = message.sender === 'ai';

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.625rem',
        alignItems: 'flex-start',
        marginBottom: '1rem',
        maxWidth: isAI ? '95%' : '85%',
        alignSelf: isAI ? 'flex-start' : 'flex-end',
        flexDirection: isAI ? 'row' : 'row-reverse'
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: isAI ? 'var(--brand-primary-light)' : 'var(--bg-surface-elevated)',
          color: isAI ? 'var(--brand-primary)' : 'var(--text-secondary)',
          background: isAI ? 'var(--brand-gradient)' : undefined,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: isAI ? '0 4px 12px rgba(59, 130, 246, 0.35)' : 'none'
        }}
      >
        {isAI ? <Sparkles size={16} color="#ffffff" /> : <UserIcon size={16} />}
      </div>

      {/* Message Bubble & Data Payload */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            padding: '0.75rem 0.95rem',
            borderRadius: '16px',
            backgroundColor: isAI ? 'var(--bg-surface-elevated)' : 'var(--brand-primary)',
            color: isAI ? 'var(--text-primary)' : '#ffffff',
            border: isAI ? '1px solid var(--border-subtle)' : 'none',
            boxShadow: 'var(--shadow-sm)',
            fontSize: '0.84rem',
            lineHeight: 1.5,
            whiteSpace: 'pre-wrap',
            borderTopLeftRadius: isAI ? '4px' : '16px',
            borderTopRightRadius: isAI ? '16px' : '4px'
          }}
        >
          {message.content}

          {/* DYNAMIC EMBEDDED DATA PAYLOADS */}
          {message.dataPayload && (
            <div style={{ marginTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.625rem' }}>
              {/* KPI Cards Payload */}
              {message.dataPayload.type === 'kpi_cards' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.5rem' }}>
                  {message.dataPayload.data.map((kpi: any, idx: number) => (
                    <div
                      key={idx}
                      style={{
                        padding: '0.5rem 0.625rem',
                        backgroundColor: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-medium)'
                      }}
                    >
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        {kpi.label}
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                        {kpi.value}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 600, marginTop: '2px' }}>
                        {kpi.change}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Data Table Payload */}
              {message.dataPayload.type === 'data_table' && (
                <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
                        {message.dataPayload.data.columns.map((col: string, i: number) => (
                          <th key={i} style={{ padding: '0.4rem 0.6rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {message.dataPayload.data.rows.map((row: any[], rowIdx: number) => (
                        <tr key={rowIdx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          {row.map((cell: any, cellIdx: number) => (
                            <td key={cellIdx} style={{ padding: '0.4rem 0.6rem', color: 'var(--text-primary)' }}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Lead Cards Payload */}
              {message.dataPayload.type === 'lead_cards' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {message.dataPayload.data.map((lead: any, idx: number) => {
                    const isHot = lead.score ? lead.score.score >= 80 : false;
                    return (
                      <div
                        key={lead.id || idx}
                        style={{
                          padding: '0.625rem 0.75rem',
                          backgroundColor: 'var(--bg-surface)',
                          borderRadius: 'var(--radius-md)',
                          border: isHot ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid var(--border-subtle)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.35rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--brand-primary)', width: '16px' }}>
                              #{idx + 1}
                            </span>
                            <span style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                              {lead.name}
                            </span>
                          </div>
                          {lead.score && <LeadScoreBadge score={lead.score} size="sm" />}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>{lead.company}</span>
                          <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                            {formatINR(lead.dealValue)}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            {isHot && (
                              <span
                                style={{
                                  fontSize: '0.65rem',
                                  fontWeight: 700,
                                  color: '#ef4444',
                                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                  padding: '0.1rem 0.4rem',
                                  borderRadius: 'var(--radius-full)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '2px'
                                }}
                              >
                                <Flame size={10} />
                                Hot Lead
                              </span>
                            )}
                            <LeadStatusBadge status={lead.status} size="sm" />
                          </div>

                          <a
                            href={`#/staff/leads/${lead.id}`}
                            style={{
                              fontSize: '0.72rem',
                              color: 'var(--brand-primary)',
                              fontWeight: 600,
                              textDecoration: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '2px'
                            }}
                          >
                            <span>Open</span>
                            <ArrowRight size={10} />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Lead Detail Card Payload */}
              {message.dataPayload.type === 'lead_detail' && (
                <div
                  style={{
                    padding: '0.75rem',
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      {message.dataPayload.data.name}
                    </span>
                    <LeadScoreBadge score={message.dataPayload.data.score} size="sm" />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {message.dataPayload.data.title} at {message.dataPayload.data.company} • {formatINR(message.dataPayload.data.dealValue)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <a
                      href={`#/staff/leads/${message.dataPayload.data.id}`}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
                    >
                      <span>Call & Profile Studio</span>
                      <ArrowRight size={11} />
                    </a>
                  </div>
                </div>
              )}

              {/* Restriction Alert Payload */}
              {message.dataPayload.type === 'restriction' && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.625rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#ef4444',
                    fontSize: '0.75rem'
                  }}
                >
                  <Lock size={14} style={{ flexShrink: 0 }} />
                  <span>{message.dataPayload.data.reason}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div
          style={{
            fontSize: '0.68rem',
            color: 'var(--text-muted)',
            marginTop: '3px',
            textAlign: isAI ? 'left' : 'right',
            padding: '0 4px'
          }}
        >
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};
