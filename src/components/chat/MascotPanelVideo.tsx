import React, { useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface MascotPanelVideoProps {
  hasGreeted: boolean;
  onGreetingComplete: () => void;
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const MascotPanelVideo: React.FC<MascotPanelVideoProps> = ({
  hasGreeted,
  onGreetingComplete,
  width = '100%',
  height = '140px',
  className = ''
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const videoRef = useRef<HTMLVideoElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const greetingRef = useRef(hasGreeted);

  useEffect(() => {
    greetingRef.current = hasGreeted;
  }, [hasGreeted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isDestroyed = false;

    const setupPlayback = () => {
      if (isDestroyed) return;

      if (!greetingRef.current) {
        // STATE 1: First Open Greeting Segment (1.0s -> 2.0s)
        video.currentTime = 1.0;
      } else {
        // STATE 2: Normal Loop Segment (2.5s -> 6.0s)
        if (video.currentTime < 2.5 || video.currentTime >= 6.0) {
          video.currentTime = 2.5;
        }
      }

      video.play().catch(() => {
        // Autoplay policy fallback (video is muted)
      });
    };

    if (video.readyState >= 1) {
      setupPlayback();
    } else {
      video.addEventListener('loadedmetadata', setupPlayback, { once: true });
    }

    // Precise continuous timing loop via requestAnimationFrame
    const monitorPlayback = () => {
      if (isDestroyed) return;

      if (video && !video.paused) {
        const ct = video.currentTime;

        if (!greetingRef.current) {
          // Greeting stage: 1.0s to 2.0s
          if (ct >= 2.0) {
            // Greeting finished! Transition to normal loop at 2.5s
            video.currentTime = 2.5;
            greetingRef.current = true;
            onGreetingComplete();
          } else if (ct < 0.9) {
            video.currentTime = 1.0;
          }
        } else {
          // Normal loop stage: 2.5s to 6.0s
          if (ct >= 6.0 || ct < 2.45) {
            video.currentTime = 2.5;
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(monitorPlayback);
    };

    animFrameRef.current = requestAnimationFrame(monitorPlayback);

    return () => {
      isDestroyed = true;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [onGreetingComplete]);

  return (
    <div
      className={`mascot-video-container ${className}`}
      style={{
        width,
        height,
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        background: isLight
          ? 'linear-gradient(135deg, rgba(236, 253, 245, 0.85) 0%, rgba(209, 250, 229, 0.5) 100%)'
          : 'linear-gradient(135deg, rgba(7, 24, 19, 0.9) 0%, rgba(16, 38, 32, 0.85) 100%)',
        border: isLight
          ? '1px solid rgba(16, 185, 129, 0.25)'
          : '1px solid rgba(79, 242, 176, 0.22)',
        boxShadow: isLight
          ? '0 6px 20px rgba(16, 185, 129, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.8)'
          : '0 8px 24px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
        flexShrink: 0
      }}
    >
      <video
        ref={videoRef}
        src="/assets/mascot-video.mp4"
        muted
        playsInline
        preload="auto"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'center',
          pointerEvents: 'none',
          display: 'block'
        }}
      />

      {/* Subtle Specular Glow Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '16px',
          boxShadow: isLight
            ? 'inset 0 0 12px rgba(16, 185, 129, 0.1)'
            : 'inset 0 0 16px rgba(79, 242, 176, 0.12)',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};
