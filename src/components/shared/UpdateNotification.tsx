'use client';
import React from 'react';
import { useInstallApp } from '@/context/InstallAppContext';
import styles from './UpdateNotification.module.css';

export default function UpdateNotification() {
  const { updateAvailable, applyUpdate } = useInstallApp();

  if (!updateAvailable) return null;

  return (
    <div className={styles.updateBar} role="alert">
      <div className={styles.updateText}>
        <span className={styles.sparkle}>⚡</span>
        <span>A new version of <strong>Dofit Wears</strong> is ready!</span>
      </div>
      <button type="button" className={styles.refreshBtn} onClick={applyUpdate}>
        Tap to Refresh
      </button>
    </div>
  );
}
