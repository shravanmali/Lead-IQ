import React, { useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface MascotAvatarProps {
  size?: number | string;
  borderRadius?: string | number;
  showGlow?: boolean;
  showOnlineDot?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const MascotAvatar: React.FC<MascotAvatarProps> = ({
  size = 64,
  borderRadius = '20px',
  showGlow = true,
  showOnlineDot = false,
  className = '',
  style = {}
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const videoRef = useRef<HTMLVideoElement>(null);

  const dim = typeof size === 'number' ? `${size}px` : size;
  const radius = typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;

  useEffect(() => {
    // Ensure video plays continuously on mount
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback: video is muted so play should succeed
      });
    }
  }, []);

  return (
    <div
      className={`mascot-avatar-wrapper ${className}`}
      style={{
        position: 'relative',
        width: dim,
        height: dim,
        minWidth: dim,
        minHeight: dim,
        borderRadius: radius,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isLight
          ? 'linear-gradient(135deg, rgba(236, 253, 245, 0.9) 0%, rgba(209, 250, 229, 0.6) 100%)'
          : 'linear-gradient(135deg, rgba(7, 24, 19, 0.85) 0%, rgba(16, 38, 32, 0.9) 100%)',
        border: isLight
          ? '1.5px solid rgba(16, 185, 129, 0.35)'
          : '1.5px solid rgba(79, 242, 176, 0.30)',
        boxShadow: showGlow
          ? isLight
            ? '0 8px 24px rgba(16, 185, 129, 0.18), 0 2px 6px rgba(0,0,0,0.04)'
            : '0 12px 32px rgba(0, 0, 0, 0.45), 0 0 20px rgba(79, 242, 176, 0.20)'
          : 'none',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        flexShrink: 0,
        ...style
      }}
    >
      {/* Animated Robot Video */}
      <video
        ref={videoRef}
        src="/assets/ai-mascot.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          pointerEvents: 'none',
          display: 'block'
        }}
      />

      {/* Subtle Inner Glass Highlight */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: radius,
          boxShadow: isLight
            ? 'inset 0 1px 1px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(16, 185, 129, 0.15)'
            : 'inset 0 1px 1px rgba(255, 255, 255, 0.15), inset 0 -1px 2px rgba(0, 0, 0, 0.4)',
          pointerEvents: 'none'
        }}
      />

      {/* Online Status Dot */}
      {showOnlineDot && (
        <span
          className="mascot-online-dot"
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: '#10B981',
            border: isLight ? '2px solid #FFFFFF' : '2px solid #06110F',
            boxShadow: '0 0 8px #10B981',
            zIndex: 2
          }}
          title="AI Online"
        />
      )}
    </div>
  );
};
