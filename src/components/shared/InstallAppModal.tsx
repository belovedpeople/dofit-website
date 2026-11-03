'use client';
import React from 'react';
import { useInstallApp } from '@/context/InstallAppContext';
import styles from './InstallAppModal.module.css';

export default function InstallAppModal() {
  const { showModal, setShowModal, isIOS, isAndroid, deferredPrompt } = useInstallApp();

  if (!showModal) return null;

  return (
    <div className={styles.backdrop} onClick={() => setShowModal(false)}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.appBadge}>
            <img src="/images/logo.png" alt="Dofit Wears" width={40} height={40} />
            <div>
              <h3 className={styles.appName}>Dofit Wears</h3>
              <p className={styles.appSub}>Install as App on Mobile</p>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={() => setShowModal(false)}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Content with clear visual pointer instructions */}
        <div className={styles.body}>
          {isIOS ? (
            <div className={styles.instructionCard}>
              <div className={styles.targetStep}>
                <span className={styles.stepBadge}>Step 1</span>
                <p>Tap the <strong>Share</strong> icon in Safari&apos;s bottom bar:</p>
                <div className={styles.visualGuide}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                  <span>Share button (bottom of screen)</span>
                </div>
              </div>

              <div className={styles.targetStep}>
                <span className={styles.stepBadge}>Step 2</span>
                <p>Scroll down the share sheet and tap:</p>
                <div className={styles.visualPill}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                  <strong>Add to Home Screen</strong>
                </div>
              </div>
            </div>
          ) : isAndroid ? (
            <div className={styles.instructionCard}>
              <div className={styles.targetStep}>
                <span className={styles.stepBadge}>Step 1</span>
                <p>Tap Chrome&apos;s <strong>menu (3 dots ⋮)</strong> in the top right corner.</p>
              </div>

              <div className={styles.targetStep}>
                <span className={styles.stepBadge}>Step 2</span>
                <p>Select from the menu:</p>
                <div className={styles.visualPill}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                  <strong>Install app</strong> or <strong>Add to Home screen</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.instructionCard}>
              <div className={styles.targetStep}>
                <span className={styles.stepBadge}>Mobile Tip</span>
                <p>Open this link on your <strong>Android</strong> or <strong>iPhone</strong> browser, then tap <strong>&quot;Install as App&quot;</strong> in the menu to add it right to your phone&apos;s home screen!</p>
              </div>
            </div>
          )}

          <div className={styles.benefits}>
            <div className={styles.benefitRow}>✨ Fast instant loading without browser URL bars</div>
            <div className={styles.benefitRow}>🛍️ Seamless 1-tap checkout &amp; WhatsApp routing</div>
            <div className={styles.benefitRow}>⚡ Zero download size — saves your phone space</div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          {deferredPrompt ? (
            <button
              type="button"
              className={styles.installNowBtn}
              onClick={() => {
                deferredPrompt.prompt();
                setShowModal(false);
              }}
            >
              Install App Now
            </button>
          ) : (
            <button
              type="button"
              className={styles.gotItBtn}
              onClick={() => setShowModal(false)}
            >
              Got it
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
