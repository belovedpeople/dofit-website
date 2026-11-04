'use client';
import { useState, useEffect } from 'react';
import { BroadcastNotification } from '@/data/broadcasts';
import styles from '../admin.module.css';

export default function AdminNotificationsPage() {
  const [history, setHistory] = useState<BroadcastNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('🔥 Secret Flash Drop Alert!');
  const [body, setBody] = useState('New 2-Piece Biker Rompers restocked in all sizes. Order now for same-day Lagos dispatch.');
  const [url, setUrl] = useState('/shop');
  const [category, setCategory] = useState<'Drop Alert' | 'Flash Sale' | 'Restock' | 'Exclusive'>('Drop Alert');
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/broadcasts');
      const data = await res.json();
      if (data.broadcasts) {
        setHistory(data.broadcasts);
      }
    } catch (err) {
      console.error('Failed to load broadcasts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDeleteBroadcast = async (id: string, broadcastTitle: string) => {
    if (!window.confirm(`Delete broadcast: "${broadcastTitle}"?\nThis cannot be undone.`)) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/broadcasts?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete broadcast');
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error deleting broadcast');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setErrorMsg('Please enter both title and message.');
      return;
    }

    setSending(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/broadcasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          url: url.trim() || '/shop',
          category,
          senderName: 'Lead Admin',
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg(data.message || 'Notification broadcasted successfully!');
        fetchHistory();
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(data.error || 'Failed to send notification.');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleTestOnThisDevice = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('This browser does not support Web Notifications.');
      return;
    }

    try {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') {
        alert('Notification permission was denied. Please allow notifications in your browser/phone settings.');
        return;
      }

      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready;
        (reg as any).showNotification(title || '🔥 Dofit Drop Alert', {
          body: body || 'This is how your drop alerts appear in your phone notification bar.',
          icon: '/images/logo.png',
          badge: '/images/logo.png',
          vibrate: [200, 100, 200],
          data: { url: url || '/shop' },
        });
      } else {
        new Notification(title || '🔥 Dofit Drop Alert', {
          body: body || 'This is how your drop alerts appear in your phone notification bar.',
          icon: '/images/logo.png',
        });
      }
    } catch (err) {
      console.error(err);
      alert('Error triggering test notification.');
    }
  };

  const setTemplate = (t: string, b: string, u: string, c: 'Drop Alert' | 'Flash Sale' | 'Restock' | 'Exclusive') => {
    setTitle(t);
    setBody(b);
    setUrl(u);
    setCategory(c);
  };

  return (
    <div>
      {/* Header */}
      <div className={styles.tableHeaderRow} style={{ marginBottom: '24px' }}>
        <div>
          <h2 className={styles.tableTitle}>PWA Push Notifications &amp; Drop Broadcaster</h2>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>
            Send instant push notifications and live drop banners directly to phones that installed the Dofit PWA app
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className={styles.kpiGrid} style={{ marginBottom: '28px' }}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Installed PWA Reach</span>
          <div className={styles.kpiValue} style={{ color: 'var(--pink)' }}>
            Active
          </div>
          <span className={styles.kpiSub}>Android, iOS 16.4+ &amp; Chrome PWA</span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total Broadcasts Sent</span>
          <div className={styles.kpiValue} style={{ color: '#38BDF8' }}>
            {history.length}
          </div>
          <span className={styles.kpiSub}>Past campaign alerts</span>
        </div>

        <div className={`${styles.kpiCard} ${styles.kpiCardAsa}`}>
          <span className={styles.kpiLabel}>Broadcast Speed</span>
          <div className={styles.kpiValue} style={{ color: 'var(--asa-gold)', fontSize: '22px' }}>
            Instantaneous
          </div>
          <span className={styles.kpiSub}>Service Worker Push Sync</span>
        </div>
      </div>

      {/* Composer & Phone Mockup Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)',
          gap: '28px',
          alignItems: 'start',
          marginBottom: '36px',
        }}
      >
        {/* Left: Broadcast Form */}
        <div className={styles.tableCard} style={{ margin: 0 }}>
          <h3 style={{ fontSize: '16px', color: '#fff', marginBottom: '14px' }}>
            📢 Compose Notification
          </h3>

          {/* Quick Preset Templates */}
          <div style={{ marginBottom: '18px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '8px' }}>
              Quick Drop Templates:
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={styles.actionBtn}
                style={{ fontSize: '11.5px', padding: '4px 10px' }}
                onClick={() =>
                  setTemplate(
                    '🔥 Limited Restock Alert!',
                    '2-Piece Biker Short Set restocked in Midnight Charcoal. Limited units available.',
                    '/products/biker-short-set',
                    'Restock'
                  )
                }
              >
                📦 Restock Alert
              </button>
              <button
                type="button"
                className={styles.actionBtn}
                style={{ fontSize: '11.5px', padding: '4px 10px' }}
                onClick={() =>
                  setTemplate(
                    '⚡ Secret 20% Voucher for App Users',
                    'Use code DOFIT20 at checkout today only for exclusive discounts on all activewear.',
                    '/shop',
                    'Exclusive'
                  )
                }
              >
                🎟️ Promo Voucher
              </button>
              <button
                type="button"
                className={styles.actionBtn}
                style={{ fontSize: '11.5px', padding: '4px 10px' }}
                onClick={() =>
                  setTemplate(
                    '🎨 Àṣà Cultural Capsule Live!',
                    'Explore handcrafted Adire jackets and couture pieces created with master artisans.',
                    '/asa',
                    'Drop Alert'
                  )
                }
              >
                👑 Àṣà Capsule
              </button>
            </div>
          </div>

          <form onSubmit={handleSendBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>
                Notification Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: '#161622',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '13.5px',
                  outline: 'none',
                }}
              >
                <option value="Drop Alert">🔥 Drop Alert (New Releases)</option>
                <option value="Restock">📦 Restock (Inventory Back in Stock)</option>
                <option value="Flash Sale">⚡ Flash Sale (Limited Time)</option>
                <option value="Exclusive">🎟️ Exclusive (Secret Vouchers &amp; Perks)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>
                Notification Title
              </label>
              <input
                type="text"
                placeholder="e.g. 🔥 New Drop Live: Biker Romper"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={60}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>
                Notification Message Body
              </label>
              <textarea
                placeholder="Enter message details that will appear on customer lock screens..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
                maxLength={180}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '13.5px',
                  outline: 'none',
                  resize: 'vertical',
                }}
                required
              />
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', textAlign: 'right', display: 'block', marginTop: '3px' }}>
                {body.length} / 180 characters
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>
                Target Link (Where user lands when tapped)
              </label>
              <input
                type="text"
                placeholder="/shop or /products/biker-romper-unitard"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '13.5px',
                  outline: 'none',
                }}
              />
            </div>

            {errorMsg && <p style={{ color: '#EF4444', fontSize: '12.5px', margin: 0 }}>{errorMsg}</p>}
            {successMsg && <p style={{ color: '#34D399', fontSize: '12.5px', margin: 0 }}>✓ {successMsg}</p>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
              <button
                type="submit"
                disabled={sending}
                style={{
                  background: 'linear-gradient(135deg, #FF1E6A, #FF4586)',
                  border: 'none',
                  color: '#fff',
                  padding: '14px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(255, 30, 106, 0.4)',
                }}
              >
                {sending ? 'Broadcasting Push Notification...' : '🚀 Broadcast to All PWA Users →'}
              </button>

              <button
                type="button"
                onClick={handleTestOnThisDevice}
                className={styles.actionBtn}
                style={{
                  background: 'rgba(56, 189, 248, 0.12)',
                  borderColor: 'rgba(56, 189, 248, 0.35)',
                  color: '#38BDF8',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <span>🔔</span>
                <span>Test Phone Status Bar Notification (On This Device)</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Phone Lockscreen Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '14px' }}>
            📱 Real-Time Phone Preview
          </span>

          <div
            style={{
              width: '290px',
              height: '480px',
              background: 'radial-gradient(circle at center, #1b1b28 0%, #09090F 100%)',
              border: '10px solid #222230',
              borderRadius: '36px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)',
              padding: '16px 14px',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Phone Speaker Notch */}
            <div
              style={{
                width: '60px',
                height: '4px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '999px',
                margin: '0 auto 16px',
              }}
            />

            {/* Time / Lockscreen Status */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ fontSize: '38px', fontWeight: 300, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>
                09:41
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                Wednesday, November 4
              </div>
            </div>

            {/* Lockscreen Notification Bubble */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '12px 14px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                animation: 'pulse 2s infinite ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/logo.png"
                    alt="DW"
                    style={{ width: '16px', height: '16px', borderRadius: '4px' }}
                  />
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#fff', letterSpacing: '0.04em' }}>
                    DOFIT WEARS
                  </span>
                </div>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>now</span>
              </div>

              <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>
                {title || 'Notification Title'}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.35 }}>
                {body || 'Notification message will appear here.'}
              </div>
            </div>

            {/* Bottom Swipe Bar */}
            <div
              style={{
                marginTop: 'auto',
                width: '100px',
                height: '4px',
                background: 'rgba(255,255,255,0.3)',
                borderRadius: '999px',
                margin: 'auto auto 4px',
              }}
            />
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeaderRow}>
          <div>
            <h3 className={styles.tableTitle}>Broadcast History</h3>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>
              Log of sent drop announcements and PWA push notifications
            </p>
          </div>
          <button type="button" onClick={fetchHistory} className={styles.actionBtn}>
            🔄 Refresh History
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Category</th>
                <th>Notification Title &amp; Body</th>
                <th>Destination Link</th>
                <th>Sent At</th>
                <th>Sender</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '24px' }}>
                    Loading past broadcasts...
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'rgba(255,255,255,0.4)' }}>
                    No broadcasts sent yet.
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span
                        style={{
                          background:
                            item.category === 'Flash Sale'
                              ? 'rgba(234, 179, 8, 0.15)'
                              : item.category === 'Restock'
                              ? 'rgba(56, 189, 248, 0.15)'
                              : 'rgba(255, 30, 106, 0.15)',
                          color:
                            item.category === 'Flash Sale'
                              ? '#EAB308'
                              : item.category === 'Restock'
                              ? '#38BDF8'
                              : 'var(--pink)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 700,
                        }}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: '#fff', fontSize: '13px' }}>{item.title}</strong>
                      <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.6)', marginTop: '2px', maxWidth: '320px' }}>
                        {item.body}
                      </div>
                    </td>
                    <td>
                      <code style={{ fontSize: '11.5px', color: '#38BDF8' }}>{item.url}</code>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px' }}>
                        {new Date(item.createdAt).toLocaleDateString()} at{' '}
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', opacity: 0.7 }}>{item.senderName || 'Admin'}</span>
                    </td>
                    <td>
                      <span className={`${styles.statusTag} ${styles.statusDispatched}`}>
                        ● Delivered
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        disabled={deletingId === item.id}
                        onClick={() => handleDeleteBroadcast(item.id, item.title)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.12)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#EF4444',
                          padding: '5px 12px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          cursor: deletingId === item.id ? 'not-allowed' : 'pointer',
                          transition: 'all 0.15s ease',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                        title="Delete broadcast notification"
                      >
                        {deletingId === item.id ? 'Deleting...' : '🗑️ Delete'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

