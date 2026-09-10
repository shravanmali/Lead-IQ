import React, { useState, useEffect } from 'react';
import { callService } from '../../services/callService';
import { CallRecord } from '../../types/call';
import { useAuth } from '../../context/AuthContext';
import { CallAudioPlayer } from '../../components/call/CallAudioPlayer';
import { TranscriptViewer } from '../../components/call/TranscriptViewer';
import { AISummaryCard } from '../../components/call/AISummaryCard';
import { LoadingState } from '../../components/common/LoadingState';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { PhoneCall, FileText, Sparkles, ArrowRight, Clock, Mic, ShieldCheck } from 'lucide-react';

export const StaffCallRecordsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);

  useEffect(() => {
    const loadCalls = async () => {
      setIsLoading(true);
      try {
        const data = await callService.getCallHistory(user?.id);
        setCalls(data);
      } catch (err: any) {
        showToast('Error Loading Calls', err.message, 'error');
      } finally {
        setIsLoading(false);
      }
    };
    loadCalls();
  }, [user]);

  if (isLoading) {
    return <LoadingState message="Loading call recordings archive..." count={4} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Panel */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(79, 242, 176, 0.12)', border: '1px solid rgba(79, 242, 176, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)' }}>
              <Mic size={18} />
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              Call Recordings & Whisper Transcripts
            </h2>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, paddingLeft: '2.625rem' }}>
            Multi-modal archive of high-fidelity customer calls, automated diarization, and Indian sentiment vectors
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="glass-card" style={{ padding: '0.4rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Archive Records:</span>
            <span style={{ color: 'var(--brand-primary)', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{calls.length}</span>
          </div>
          <div className="glass-card" style={{ padding: '0.4rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#10b981' }}>
            <ShieldCheck size={14} />
            <span style={{ fontWeight: 600 }}>AWS Mumbai Compliant</span>
          </div>
        </div>
      </div>

      {calls.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3.5rem 2rem', color: 'var(--text-muted)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(79, 242, 176, 0.1)', border: '1px solid rgba(79, 242, 176, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--brand-primary)' }}>
            <Mic size={24} />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>No Recorded Audio Sessions</h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 1.25rem' }}>
            Launch a live call from your Smart Leads queue to automatically synthesize transcripts, sentiment tags, and follow-ups.
          </p>
          <a href="#/staff/leads" className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <PhoneCall size={14} />
            <span>Open Smart Leads Queue</span>
          </a>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
          {calls.map(call => (
            <div
              key={call.id}
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.25rem',
                padding: '1.5rem',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                    {call.leadName}
                  </div>
                  <span className="badge badge-success" style={{ fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Sparkles size={11} />
                    Whisper STT
                  </span>
                </div>

                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: '0 0 1rem' }}>
                  {call.summary.overview}
                </p>

                <div
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem'
                  }}
                >
                  <div style={{ fontSize: '0.7rem', color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                    KEY TAKEAWAYS
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                    • {call.transcript.extractedKeyPoints[0] || 'High buying intent observed'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: '0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  <Clock size={13} style={{ color: 'var(--brand-primary)' }} />
                  <span>{Math.floor(call.durationSeconds / 60)}m {call.durationSeconds % 60}s</span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setSelectedCall(call)}
                    className="btn btn-secondary btn-sm"
                  >
                    <FileText size={13} />
                    <span>Transcript</span>
                  </button>
                  <a
                    href={`#/staff/leads/${call.leadId}`}
                    className="btn btn-primary btn-sm"
                  >
                    <span>Dossier</span>
                    <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Transcript Modal */}
      <Modal
        isOpen={Boolean(selectedCall)}
        onClose={() => setSelectedCall(null)}
        title={selectedCall ? `Call Intelligence: ${selectedCall.leadName}` : ''}
        subtitle="Audio Playback & Whisper STT Transcript"
        maxWidth="680px"
      >
        {selectedCall && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <CallAudioPlayer
              durationSeconds={selectedCall.durationSeconds}
              waveformData={selectedCall.waveformData}
            />
            <AISummaryCard summary={selectedCall.summary} />
            <TranscriptViewer transcript={selectedCall.transcript} />
          </div>
        )}
      </Modal>
    </div>
  );
};
