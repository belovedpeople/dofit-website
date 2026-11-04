'use client';
import { useState, useEffect } from 'react';
import { SiteSettings, defaultSettings } from '@/data/settings';
import styles from '../admin.module.css';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (updatedSubset?: Partial<SiteSettings>) => {
    setSaving(true);
    setSaveSuccess('');
    setSaveError('');

    const payload = updatedSubset ? { ...settings, ...updatedSubset } : settings;

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSettings(data.settings);
        setSaveSuccess('Settings successfully saved & synced across your store!');
        setTimeout(() => setSaveSuccess(''), 3500);
      } else {
        setSaveError(data.error || 'Failed to save settings');
      }
    } catch (err) {
      setSaveError('Network error while saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
        Loading store settings...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '980px' }}>
      <div className={styles.tableHeaderRow} style={{ marginBottom: '24px' }}>
        <div>
          <h2 className={styles.tableTitle}>Store Override &amp; System Settings</h2>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>
            Control site-wide maintenance mode, urgent announcement bars, order intake, and routing numbers.
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleSave()}
          disabled={saving}
          className={styles.actionBtn}
          style={{
            background: 'var(--pink)',
            color: '#fff',
            borderColor: 'var(--pink)',
            fontWeight: 700,
            padding: '10px 24px',
          }}
        >
          {saving ? 'Saving...' : '💾 Save All Changes'}
        </button>
      </div>

      {saveSuccess && (
        <div
          style={{
            background: 'rgba(52, 211, 153, 0.15)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            color: '#34D399',
            padding: '12px 18px',
            borderRadius: '10px',
            fontSize: '13.5px',
            marginBottom: '20px',
            fontWeight: 600,
          }}
        >
          ✓ {saveSuccess}
        </div>
      )}

      {saveError && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#EF4444',
            padding: '12px 18px',
            borderRadius: '10px',
            fontSize: '13.5px',
            marginBottom: '20px',
          }}
        >
          ✕ {saveError}
        </div>
      )}

      {/* Grid of Settings Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '22px' }}>
        {/* 1. Maintenance Mode Card */}
        <div
          className={styles.tableCard}
          style={{
            border: settings.maintenanceMode ? '1px solid rgba(239, 68, 68, 0.5)' : undefined,
            background: settings.maintenanceMode ? 'rgba(239, 68, 68, 0.04)' : undefined,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🚧</span>
                <h3 style={{ fontSize: '16px', color: '#fff', margin: 0 }}>Maintenance Mode (Store Lockscreen)</h3>
                {settings.maintenanceMode && (
                  <span style={{ background: '#EF4444', color: '#fff', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '999px', textTransform: 'uppercase' }}>
                    Active
                  </span>
                )}
              </div>
              <p style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                When enabled, public visitors see a luxury lockscreen announcing an upcoming drop. Authenticated admins can still view and test the storefront freely.
              </p>
            </div>

            {/* Toggle Button */}
            <button
              type="button"
              onClick={() => {
                const nextVal = !settings.maintenanceMode;
                setSettings({ ...settings, maintenanceMode: nextVal });
                handleSave({ maintenanceMode: nextVal });
              }}
              style={{
                background: settings.maintenanceMode ? '#EF4444' : 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#fff',
                padding: '8px 18px',
                borderRadius: '999px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {settings.maintenanceMode ? '● Maintenance ON' : '○ Maintenance OFF'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>
                Lockscreen Headline
              </label>
              <input
                type="text"
                value={settings.maintenanceHeadline}
                onChange={(e) => setSettings({ ...settings, maintenanceHeadline: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '13px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>
                Lockscreen Message to Shoppers
              </label>
              <textarea
                rows={2}
                value={settings.maintenanceMessage}
                onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '13px',
                }}
              />
            </div>
          </div>
        </div>

        {/* 2. Order Taking Pause / Resume Card */}
        <div className={styles.tableCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🛍️</span>
                <h3 style={{ fontSize: '16px', color: '#fff', margin: 0 }}>Storefront Checkout &amp; Order Intake</h3>
                {!settings.allowOrders && (
                  <span style={{ background: '#EAB308', color: '#000', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '999px', textTransform: 'uppercase' }}>
                    Paused
                  </span>
                )}
              </div>
              <p style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                Pause order intake during stock counts, fabric restocking, or extreme order volume without taking down the website.
              </p>
            </div>

            {/* Toggle Button */}
            <button
              type="button"
              onClick={() => {
                const nextVal = !settings.allowOrders;
                setSettings({ ...settings, allowOrders: nextVal });
                handleSave({ allowOrders: nextVal });
              }}
              style={{
                background: settings.allowOrders ? 'rgba(52, 211, 153, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                border: settings.allowOrders ? '1px solid #34D399' : '1px solid #EAB308',
                color: settings.allowOrders ? '#34D399' : '#EAB308',
                padding: '8px 18px',
                borderRadius: '999px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {settings.allowOrders ? '✓ Orders Open' : '⏸ Orders Paused'}
            </button>
          </div>

          {!settings.allowOrders && (
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>
                Message Shown in Cart Drawer
              </label>
              <input
                type="text"
                value={settings.ordersPausedMessage}
                onChange={(e) => setSettings({ ...settings, ordersPausedMessage: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '13px',
                }}
              />
            </div>
          )}
        </div>

        {/* 3. Primary WhatsApp Router Override */}
        <div className={styles.tableCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '20px' }}>🟢</span>
            <h3 style={{ fontSize: '16px', color: '#fff', margin: 0 }}>Primary WhatsApp Routing Phone Number</h3>
          </div>
          <p style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.5)', margin: '0 0 14px' }}>
            All website checkout receipts and floating chat buttons route orders directly to this number (international format without +).
          </p>

          <div style={{ maxWidth: '380px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>+</span>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value.replace(/[^0-9]/g, '') })}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                }}
              />
            </div>
          </div>
        </div>

        {/* 4. Global Announcement Banner Card */}
        <div className={styles.tableCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>📢</span>
                <h3 style={{ fontSize: '16px', color: '#fff', margin: 0 }}>Site-Wide Urgent Announcement Banner</h3>
              </div>
              <p style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                Displays a prominent ribbon at the very top of all pages (Home, Shop, Àṣà, and Product Pages).
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const nextVal = !settings.announcementEnabled;
                setSettings({ ...settings, announcementEnabled: nextVal });
                handleSave({ announcementEnabled: nextVal });
              }}
              style={{
                background: settings.announcementEnabled ? 'rgba(255, 30, 106, 0.2)' : 'rgba(255,255,255,0.1)',
                border: settings.announcementEnabled ? '1px solid var(--pink)' : '1px solid rgba(255,255,255,0.2)',
                color: settings.announcementEnabled ? 'var(--pink)' : '#fff',
                padding: '8px 18px',
                borderRadius: '999px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {settings.announcementEnabled ? '● Banner Visible' : '○ Banner Hidden'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>
                Banner Announcement Text
              </label>
              <input
                type="text"
                placeholder="e.g. ⚡ Flash Weekend Drop: 20% off all matching sets with code DOFIT20"
                value={settings.announcementText}
                onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '13px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>
                Banner Theme Color
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {(['pink', 'gold', 'cyan'] as const).map((clr) => (
                  <button
                    key={clr}
                    type="button"
                    onClick={() => setSettings({ ...settings, announcementColor: clr })}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: settings.announcementColor === clr ? '2px solid #fff' : '1px solid rgba(255,255,255,0.1)',
                      background:
                        clr === 'pink'
                          ? 'rgba(255, 30, 106, 0.25)'
                          : clr === 'gold'
                          ? 'rgba(232, 160, 32, 0.25)'
                          : 'rgba(56, 189, 248, 0.25)',
                      color:
                        clr === 'pink' ? '#FF1E6A' : clr === 'gold' ? '#E8A020' : '#38BDF8',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                  >
                    {clr === 'pink' ? 'Cyber Pink' : clr === 'gold' ? 'Àṣà Gold' : 'Electric Cyan'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
