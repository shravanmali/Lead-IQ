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
import { PhoneCall, FileText, Sparkles, ArrowRight, Clock, UserCheck } from 'lucide-react';

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
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          Call Recordings & Whisper Transcripts
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
          Complete archive of recorded conversations, sentiment analytics, and AI key points
        </p>
      </div>

      {calls.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No recorded calls yet. Start calling your leads from the Smart Leads dashboard to generate audio transcripts.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
          {calls.map(call => (
            <div
              key={call.id}
              className="card card-hover"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.25rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                    {call.leadName}
                  </div>
                  <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                    Whisper Transcribed
                  </span>
                </div>

                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 1rem' }}>
                  {call.summary.overview}
                </p>

                <div
                  style={{
                    padding: '0.75rem',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem'
                  }}
                >
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    KEY TAKEAWAYS
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                    • {call.transcript.extractedKeyPoints[0] || 'High buying intent observed'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <Clock size={14} />
                  <span>Duration: {Math.floor(call.durationSeconds / 60)}m {call.durationSeconds % 60}s</span>
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
                    <span>Lead Profile</span>
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
