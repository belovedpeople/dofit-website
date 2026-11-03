'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useInstallApp } from '@/context/InstallAppContext';
import styles from './AppSplashScreen.module.css';

export default function AppSplashScreen() {
  const { isAppMode } = useInstallApp();
  const [showSplash, setShowSplash] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Only show splash screen in app mode, and once per session
    if (!isAppMode) return;

    const splashAlreadyShown = sessionStorage.getItem('dofit_app_splash_shown');
    if (!splashAlreadyShown) {
      setShowSplash(true);

      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 1600);

      const hideTimer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('dofit_app_splash_shown', 'true');
      }, 2100);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [isAppMode]);

  if (!showSplash) return null;

  return (
    <div className={`${styles.splashContainer} ${isFadingOut ? styles.splashFadeOut : ''}`}>
      <div className={styles.ambientGlow} />

      <div className={styles.content}>
        {/* Animated Brand Emblem */}
        <div className={styles.emblemWrap}>
          <div className={styles.ringPulse} />
          <div className={styles.logoCircle}>
            <Image
              src="/images/logo.png"
              alt="Dofit Wears"
              width={72}
              height={72}
              priority
              className={styles.logoImg}
            />
          </div>
        </div>

        {/* Brand Titles */}
        <h1 className={styles.brandTitle}>
          DOFIT <span className={styles.brandAmp}>×</span> ÀṢÀ
        </h1>
        <p className={styles.brandTagline}>
          Activewear &amp; Afrocentric Cultural Couture
        </p>

        {/* Loading track indicator */}
        <div className={styles.loadingTrack}>
          <div className={styles.loadingBar} />
        </div>
      </div>

      <div className={styles.footerBrand}>
        <span>LAGOS · NIGERIA</span>
      </div>
    </div>
  );
}
