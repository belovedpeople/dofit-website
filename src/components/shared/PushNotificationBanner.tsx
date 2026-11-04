'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BroadcastNotification } from '@/data/broadcasts';
import styles from './PushNotificationBanner.module.css';

export default function PushNotificationBanner() {
  const [broadcast, setBroadcast] = useState<BroadcastNotification | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 1. Fetch latest broadcast
    const checkBroadcast = async () => {
      try {
        const res = await fetch('/api/broadcasts');
        const data = await res.json();
        if (data.latest) {
          const latest: BroadcastNotification = data.latest;
          const dismissedId = localStorage.getItem('dofit_dismissed_broadcast');

          // Check if not dismissed and sent within last 72 hours
          const ageHours = (Date.now() - new Date(latest.createdAt).getTime()) / (1000 * 60 * 60);
          if (dismissedId !== latest.id && ageHours < 72) {
            setBroadcast(latest);
            setVisible(true);

            // 2. Trigger native OS Push notification if permission is already granted
            if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
              const shownId = sessionStorage.getItem('dofit_shown_push_id');
              if (shownId !== latest.id) {
                sessionStorage.setItem('dofit_shown_push_id', latest.id);
                if (navigator.serviceWorker && navigator.serviceWorker.ready) {
                  navigator.serviceWorker.ready.then((reg) => {
                    reg.showNotification(latest.title, {
                      body: latest.body,
                      icon: '/images/logo.png',
                      badge: '/images/logo.png',
                      tag: latest.tag || 'dofit-broadcast',
                      data: { url: latest.url || '/shop' },
                    });
                  });
                }
              }
            }
          }
        }
      } catch (err) {
        console.warn('Broadcast check error:', err);
      }
    };

    checkBroadcast();
    // Poll for new live drops every 30 seconds
    const interval = setInterval(checkBroadcast, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    if (broadcast) {
      localStorage.setItem('dofit_dismissed_broadcast', broadcast.id);
    }
    setVisible(false);
  };

  const handleRequestPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      try {
        const perm = await Notification.requestPermission();
        if (perm === 'granted' && broadcast && navigator.serviceWorker) {
          const reg = await navigator.serviceWorker.ready;
          reg.showNotification(broadcast.title, {
            body: broadcast.body,
            icon: '/images/logo.png',
            badge: '/images/logo.png',
            data: { url: broadcast.url || '/shop' },
          });
        }
      } catch (err) {
        console.warn('Notification permission error:', err);
      }
    }
  };

  if (!visible || !broadcast) return null;

  return (
    <aside className={styles.container} aria-label="Drop Announcement">
      <div className={styles.banner} onClick={handleRequestPermission}>
        <div className={styles.iconWrap}>
          <span>
            {broadcast.category === 'Flash Sale'
              ? '⚡'
              : broadcast.category === 'Restock'
              ? '📦'
              : broadcast.category === 'Exclusive'
              ? '🎟️'
              : '🔥'}
          </span>
        </div>

        <div className={styles.content}>
          <div className={styles.badgeRow}>
            <span className={styles.tagBadge}>{broadcast.category}</span>
            <span className={styles.time}>Just Now</span>
          </div>
          <h4 className={styles.title}>{broadcast.title}</h4>
          <p className={styles.body}>{broadcast.body}</p>
        </div>

        <Link
          href={broadcast.url}
          className={styles.actionBtn}
          onClick={handleDismiss}
        >
          View Drop →
        </Link>

        <button
          type="button"
          className={styles.closeBtn}
          onClick={(e) => {
            e.stopPropagation();
            handleDismiss();
          }}
          aria-label="Dismiss alert"
        >
          ✕
        </button>
      </div>
    </aside>
  );
}
