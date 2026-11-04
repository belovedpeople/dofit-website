'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BroadcastNotification } from '@/data/broadcasts';
import styles from './PushNotificationBanner.module.css';

export default function PushNotificationBanner() {
  const [broadcast, setBroadcast] = useState<BroadcastNotification | null>(null);
  const [visible, setVisible] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const lastBroadcastIdRef = useRef<string | null>(null);

  // Sync notification permission state
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  useEffect(() => {
    // 1. Fetch latest broadcast from server
    const checkBroadcast = async () => {
      try {
        const res = await fetch('/api/broadcasts');
        const data = await res.json();

        // If no broadcast exists (or admin deleted it)
        if (!data.latest) {
          setVisible(false);
          setBroadcast(null);
          lastBroadcastIdRef.current = null;

          // Close any active OS notifications for deleted broadcast
          if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            navigator.serviceWorker.ready
              .then((reg) => reg.getNotifications())
              .then((notifications) => {
                notifications.forEach((n) => n.close());
              })
              .catch(() => {});
          }
          return;
        }

        const latest: BroadcastNotification = data.latest;

        // Skip legacy mock broadcasts if any remain
        if (latest.id === 'broadcast-1' || latest.id === 'broadcast-2') {
          setVisible(false);
          setBroadcast(null);
          return;
        }

        const dismissedId = localStorage.getItem('dofit_dismissed_broadcast');

        // Check if not dismissed and sent within last 72 hours
        const ageHours = (Date.now() - new Date(latest.createdAt).getTime()) / (1000 * 60 * 60);

        if (dismissedId !== latest.id && ageHours < 72) {
          setBroadcast(latest);
          setVisible(true);

          // If this is a fresh broadcast we haven't seen in this session yet
          if (lastBroadcastIdRef.current !== latest.id) {
            lastBroadcastIdRef.current = latest.id;

            // 1. Phone physical vibration feedback
            if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
              try {
                navigator.vibrate([160, 80, 160]);
              } catch {
                // Ignore vibration restrictions
              }
            }

            // 2. Trigger native OS Push notification in phone notification bar if permitted
            triggerNativePush(latest);
          }
        } else if (dismissedId === latest.id) {
          setVisible(false);
        }
      } catch (err) {
        console.warn('Broadcast check error:', err);
      }
    };

    checkBroadcast();
    // Poll for live drop broadcasts every 20 seconds
    const interval = setInterval(checkBroadcast, 20000);
    return () => clearInterval(interval);
  }, []);

  const triggerNativePush = (item: BroadcastNotification) => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      const shownKey = `dofit_push_shown_${item.id}`;
      if (sessionStorage.getItem(shownKey)) return;
      sessionStorage.setItem(shownKey, '1');

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((reg) => {
          (reg as any).showNotification(item.title, {
            body: item.body,
            icon: '/images/logo.png',
            badge: '/images/logo.png',
            tag: item.id,
            renotify: true,
            requireInteraction: true,
            vibrate: [200, 100, 200],
            data: { url: item.url || '/shop' },
          });
        });
      } else {
        try {
          new Notification(item.title, {
            body: item.body,
            icon: '/images/logo.png',
            badge: '/images/logo.png',
            tag: item.id,
          });
        } catch {
          // Ignore
        }
      }
    }
  };

  const handleDismiss = () => {
    if (broadcast) {
      localStorage.setItem('dofit_dismissed_broadcast', broadcast.id);
    }
    setVisible(false);
  };

  const handleEnablePush = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setPermissionStatus(perm);
        if (perm === 'granted' && broadcast) {
          triggerNativePush(broadcast);
        }
      } catch (err) {
        console.warn('Push permission request error:', err);
      }
    }
  };

  if (!visible || !broadcast) return null;

  return (
    <aside className={styles.container} aria-label="Drop Push Notification">
      <div className={styles.phoneNotificationCard}>
        {/* Native Phone Push Header */}
        <div className={styles.cardHeader}>
          <div className={styles.appIdentity}>
            <div className={styles.appIconWrap}>
              <Image
                src="/images/logo.png"
                alt="Dofit Logo"
                width={18}
                height={18}
                style={{ objectFit: 'contain' }}
              />
            </div>
            <span className={styles.appName}>DOFIT WEARS</span>
            <span className={styles.timeDot}>•</span>
            <span className={styles.timeLabel}>now</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className={styles.categoryPill}>{broadcast.category}</span>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={handleDismiss}
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Notification Main Content */}
        <div className={styles.cardBody}>
          <h4 className={styles.notifTitle}>{broadcast.title}</h4>
          <p className={styles.notifMessage}>{broadcast.body}</p>
        </div>

        {/* Action Controls */}
        <div className={styles.cardFooter}>
          {permissionStatus === 'default' && (
            <button
              type="button"
              className={styles.enablePushPill}
              onClick={handleEnablePush}
              title="Activate push notifications on your phone status bar"
            >
              <span>🔔</span>
              <span>Enable Phone Bar Push</span>
            </button>
          )}

          <Link
            href={broadcast.url || '/shop'}
            className={styles.viewDropBtn}
            onClick={handleDismiss}
          >
            <span>View Drop</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
