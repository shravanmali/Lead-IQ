import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, Sparkles } from 'lucide-react';

interface CallAudioPlayerProps {
  durationSeconds: number;
  waveformData?: number[];
}

export const CallAudioPlayer: React.FC<CallAudioPlayerProps> = ({
  durationSeconds,
  waveformData = [25, 45, 70, 90, 40, 65, 80, 50, 75, 95, 60, 30, 45, 85, 90, 70, 40, 60, 85, 95, 80, 55, 35, 20]
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= durationSeconds) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, durationSeconds]);

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = durationSeconds > 0 ? (currentTime / durationSeconds) * 100 : 0;

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="btn btn-primary"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              padding: 0,
              boxShadow: '0 4px 16px rgba(79, 242, 176, 0.4)'
            }}
            title={isPlaying ? 'Pause Audio' : 'Play Recorded Call'}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
          </button>

          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Call Audio Recording
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Whisper Enhanced • 48kHz Stereo FLAC
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>
            <span style={{ color: 'var(--brand-primary)' }}>{formatTime(currentTime)}</span> / {formatTime(durationSeconds)}
          </span>
          <button
            onClick={() => setCurrentTime(0)}
            className="btn btn-secondary"
            style={{ padding: '0.35rem 0.5rem', borderRadius: 'var(--radius-sm)' }}
            title="Restart playback"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Waveform Scrubber */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          height: '42px',
          cursor: 'pointer',
          padding: '0 0.75rem',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}
        onClick={e => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const ratio = clickX / rect.width;
          setCurrentTime(Math.floor(ratio * durationSeconds));
        }}
      >
        {waveformData.map((height, i) => {
          const barRatio = i / waveformData.length;
          const isPassed = barRatio <= progressPercent / 100;

          return (
            <span
              key={i}
              style={{
                flex: 1,
                height: `${Math.max(6, height * 0.38)}px`,
                backgroundColor: isPassed ? 'var(--brand-primary)' : 'rgba(255, 255, 255, 0.1)',
                background: isPassed ? 'var(--brand-gradient)' : undefined,
                boxShadow: isPassed ? '0 0 6px rgba(79, 242, 176, 0.3)' : 'none',
                borderRadius: '2px',
                transition: 'all 0.1s ease'
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
