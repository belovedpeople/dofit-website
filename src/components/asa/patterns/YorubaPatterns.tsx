'use client';
import React from 'react';

/**
 * Traditional Yoruba Adire Eleko geometric tile pattern (SVG Defs & Overlay)
 */
export function AdireElekoPattern({
  className = '',
  opacity = 0.12,
  color = '#E8A020',
}: {
  className?: string;
  opacity?: number;
  color?: string;
}) {
  return (
    <svg
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity,
      }}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="adire-eleko-tile"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          {/* Outer geometric diamond */}
          <polygon
            points="40,4 76,40 40,76 4,40"
            fill="none"
            stroke={color}
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          {/* Inner diamond */}
          <polygon
            points="40,16 64,40 40,64 16,40"
            fill="none"
            stroke={color}
            strokeWidth="1.2"
          />
          {/* Central Cowrie Shell Symbol (Owo Eyo) */}
          <path
            d="M40 26 C46 26 49 32 49 40 C49 48 46 54 40 54 C34 54 31 48 31 40 C31 32 34 26 40 26 Z"
            fill="none"
            stroke={color}
            strokeWidth="1"
          />
          <line x1="40" y1="28" x2="40" y2="52" stroke={color} strokeWidth="1" />
          <line x1="36" y1="34" x2="44" y2="34" stroke={color} strokeWidth="0.8" />
          <line x1="35" y1="40" x2="45" y2="40" stroke={color} strokeWidth="0.8" />
          <line x1="36" y1="46" x2="44" y2="46" stroke={color} strokeWidth="0.8" />

          {/* Traditional 4-corner stitch-resist dots (Alabere) */}
          <circle cx="4" cy="4" r="2" fill={color} />
          <circle cx="76" cy="4" r="2" fill={color} />
          <circle cx="76" cy="76" r="2" fill={color} />
          <circle cx="4" cy="76" r="2" fill={color} />

          {/* Concentric resist waves on quadrant corners */}
          <path d="M0 20 Q20 20 20 0" fill="none" stroke={color} strokeWidth="0.8" />
          <path d="M60 0 Q60 20 80 20" fill="none" stroke={color} strokeWidth="0.8" />
          <path d="M80 60 Q60 60 60 80" fill="none" stroke={color} strokeWidth="0.8" />
          <path d="M20 80 Q20 60 0 60" fill="none" stroke={color} strokeWidth="0.8" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#adire-eleko-tile)" />
    </svg>
  );
}

/**
 * Traditional Yoruba Eyin Aja (Dog Teeth) zigzag border divider
 */
export function AdireTeethDivider({
  color = '#E8A020',
  className = '',
}: {
  color?: string;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '14px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        opacity: 0.85,
        userSelect: 'none',
      }}
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="14"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="repeat"
      >
        <defs>
          <pattern
            id="eyin-aja-pattern"
            width="24"
            height="14"
            patternUnits="userSpaceOnUse"
          >
            {/* Triangular teeth */}
            <polygon points="0,14 12,0 24,14" fill={color} fillOpacity="0.3" />
            <polygon points="0,14 12,3 24,14" fill="none" stroke={color} strokeWidth="1" />
            <circle cx="12" cy="7" r="1.5" fill={color} />
          </pattern>
        </defs>
        <rect width="100%" height="14" fill="url(#eyin-aja-pattern)" />
      </svg>
    </div>
  );
}

/**
 * Lagos Eyo Opambata (Sacred Carved Staff of Authority) Vector Emblem
 */
export function EyoOpambataMotif({
  size = 48,
  color = '#E8A020',
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size * 1.8}
      viewBox="0 0 40 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Opambata Eyo Staff"
    >
      {/* Staff blade tip with Adamorisha carved curve */}
      <path
        d="M20 2 C28 6 34 16 34 26 C34 32 30 38 24 40 L24 66 C24 68 22 70 20 70 C18 70 16 68 16 66 L16 40 C10 38 6 32 6 26 C6 16 12 6 20 2 Z"
        stroke={color}
        strokeWidth="1.8"
        fill="rgba(232, 160, 32, 0.08)"
      />
      {/* Sacred geometric incisions on Opambata blade */}
      <line x1="20" y1="8" x2="20" y2="36" stroke={color} strokeWidth="1.4" />
      {/* Horizontal blessings crossbars */}
      <line x1="12" y1="18" x2="28" y2="18" stroke={color} strokeWidth="1.2" />
      <line x1="10" y1="24" x2="30" y2="24" stroke={color} strokeWidth="1.2" />
      <line x1="14" y1="30" x2="26" y2="30" stroke={color} strokeWidth="1.2" />
      {/* Cowrie bindings at handle neck */}
      <ellipse cx="20" cy="42" rx="6" ry="2" fill={color} />
      <ellipse cx="20" cy="48" rx="5" ry="1.8" stroke={color} strokeWidth="1" />
      {/* Staff lower grip wraps */}
      <line x1="17" y1="56" x2="23" y2="56" stroke={color} strokeWidth="1" />
      <line x1="17" y1="60" x2="23" y2="60" stroke={color} strokeWidth="1" />
      <line x1="17" y1="64" x2="23" y2="64" stroke={color} strokeWidth="1" />
    </svg>
  );
}

/**
 * Cowrie Shell (Òwó Ẹ̀yọ) Single Talisman Icon
 */
export function CowrieIcon({
  size = 20,
  color = '#E8A020',
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 24 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 2 C18 2 22 8 22 16 C22 24 18 30 12 30 C6 30 2 24 2 16 C2 8 6 2 12 2 Z"
        fill="rgba(232, 160, 32, 0.15)"
        stroke={color}
        strokeWidth="1.6"
      />
      <line x1="12" y1="6" x2="12" y2="26" stroke={color} strokeWidth="1.6" />
      <line x1="8" y1="11" x2="16" y2="11" stroke={color} strokeWidth="1.2" />
      <line x1="7" y1="16" x2="17" y2="16" stroke={color} strokeWidth="1.2" />
      <line x1="8" y1="21" x2="16" y2="21" stroke={color} strokeWidth="1.2" />
    </svg>
  );
}
