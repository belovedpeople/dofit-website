'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './AsaAudioPlayer.module.css';

/**
 * Main Export: Guarded strictly to ONLY render when user is on Àṣà pages (/asa...).
 * On the main Dofit Wears page or any non-Asa route, it returns null immediately,
 * ensuring no audio element exists and NO music can ever play on Dofit Wears.
 */
export default function AsaAudioPlayer() {
  const pathname = usePathname();
  const isAsa = pathname.startsWith('/asa');

  if (!isAsa) {
    return null;
  }

  return <AsaActivePlayer />;
}

function AsaActivePlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const userPausedRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.75;

    // Automatic playback for Àṣà experience
    const startAudio = () => {
      if (userPausedRef.current) return;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // If browser autoplay policy blocks unprompted audio, play on first user touch/click/scroll
          const onFirstInteraction = () => {
            if (!userPausedRef.current && audioRef.current) {
              audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
            }
            cleanup();
          };

          const cleanup = () => {
            window.removeEventListener('click', onFirstInteraction);
            window.removeEventListener('touchstart', onFirstInteraction);
            window.removeEventListener('scroll', onFirstInteraction);
          };

          window.addEventListener('click', onFirstInteraction, { once: true });
          window.addEventListener('touchstart', onFirstInteraction, { once: true });
          window.addEventListener('scroll', onFirstInteraction, { once: true });
        });
    };

    startAudio();

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      // Clean teardown when user leaves Àṣà pages
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      userPausedRef.current = true;
    } else {
      userPausedRef.current = false;
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className={styles.audioWrap}>
      {/* Native HTML5 Audio */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        playsInline
      >
        <source src="/audio/asa.mp4" type="audio/mp4" />
        <source src="/audio/asa.m4a" type="audio/mp4" />
        <source src="/audio/asa.mp3" type="audio/mpeg" />
      </audio>

      {/* Floating Glassmorphism Player Pill */}
      <div
        className={`${styles.playerCard} ${isPlaying && !isMuted ? styles.playing : ''}`}
        onClick={togglePlayPause}
        role="button"
        tabIndex={0}
        aria-label={isPlaying ? 'Pause Àṣà Soundtrack' : 'Play Àṣà Soundtrack'}
        title={isPlaying ? 'Click to Pause' : 'Click to Play'}
      >
        {/* Animated Equalizer Waves */}
        <div className={styles.equalizer} aria-hidden="true">
          <span className={`${styles.eqBar} ${styles.eq1}`} />
          <span className={`${styles.eqBar} ${styles.eq2}`} />
          <span className={`${styles.eqBar} ${styles.eq3}`} />
          <span className={`${styles.eqBar} ${styles.eq4}`} />
        </div>

        {/* Info label */}
        <div className={styles.infoCol}>
          <span className={styles.trackTitle}>ÀṢÀ SOUNDTRACK</span>
          <span className={styles.trackSub}>
            {!isPlaying ? 'Paused • Tap to Play' : isMuted ? 'Muted' : 'Playing Official Beat'}
          </span>
        </div>

        {/* Dedicated Mute / Unmute Button */}
        <button
          type="button"
          className={styles.muteBtn}
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
              <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0a7 7 0 0 1-.68 3.03" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          ) : (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
