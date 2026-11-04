'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SiteSettings, defaultSettings } from '@/data/settings';

export default function StoreSettingsGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isAdmin, setIsAdmin] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    // Check if current user is logged-in admin (by cookie presence or API)
    const hasAdminCookie = typeof document !== 'undefined' && document.cookie.includes('dofit_admin_session');
    setIsAdmin(hasAdminCookie);

    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setSettings(data.settings);
        }
      })
      .catch(() => {});
  }, []);

  const handleVipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.trim(), source: 'Maintenance Vault' }),
      });
      setSubscribed(true);
    } catch {
      setSubscribed(true);
    }
  };

  // Always allow admin routes to render without interruption
  const isAdminRoute = pathname.startsWith('/admin');

  // If maintenance mode is active AND visitor is NOT an admin AND not on /admin
  if (settings.maintenanceMode && !isAdmin && !isAdminRoute) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'radial-gradient(ellipse at top, #18141F 0%, #0A0A0C 70%)',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
          fontFamily: 'var(--font-body, system-ui, sans-serif)',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ maxWidth: '640px', width: '100%' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '999px',
              background: 'rgba(232, 160, 32, 0.12)',
              border: '1px solid rgba(232, 160, 32, 0.3)',
              color: '#E8A020',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '28px',
            }}
          >
            <span>🔒</span> PRIVATE VAULT CURATION
          </div>

          <h1
            style={{
              fontSize: 'clamp(28px, 6vw, 48px)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #FFFFFF 40%, rgba(255,255,255,0.6) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {settings.maintenanceHeadline || 'DOFIT WEARS & ÀṢÀ · PRIVATE VAULT'}
          </h1>

          <p
            style={{
              fontSize: '15px',
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.65)',
              maxWidth: '520px',
              margin: '0 auto 36px',
            }}
          >
            {settings.maintenanceMessage ||
              'We are currently preparing our next exclusive drop. Orders and browsing will reopen shortly.'}
          </p>

          {/* VIP Notification Signup */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '32px',
            }}
          >
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>
              ⚡ Get 15-Minute Priority Drop Access
            </h3>
            <p style={{ fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.5)', margin: '0 0 16px' }}>
              Be the first to know when the vault unlocks and the new capsule goes live.
            </p>

            {subscribed ? (
              <div style={{ color: '#34D399', fontWeight: 600, fontSize: '14px', padding: '10px' }}>
                ✓ You are on the VIP drop list! Check your inbox when the vault opens.
              </div>
            ) : (
              <form onSubmit={handleVipSubmit} style={{ display: 'flex', gap: '8px', maxWidth: '440px', margin: '0 auto' }}>
                <input
                  type="email"
                  required
                  placeholder="Enter your VIP email..."
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '12px 20px',
                    borderRadius: '8px',
                    background: 'var(--pink, #FF1E6A)',
                    border: 'none',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Notify Me
                </button>
              </form>
            )}
          </div>

          {/* Admin Backdoor Link */}
          <div>
            <Link
              href="/admin/login"
              style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.35)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
            >
              Staff &amp; Admin Sign In →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Normal Storefront Rendering with optional banners
  return (
    <>
      {/* 1. Admin Maintenance Bypass Alert Banner */}
      {settings.maintenanceMode && isAdmin && !isAdminRoute && (
        <div
          style={{
            background: 'linear-gradient(90deg, #7C2D12, #991B1B)',
            color: '#FEF2F2',
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: 700,
            textAlign: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
          }}
        >
          <span>🚧 STORE IS IN MAINTENANCE MODE (Public visitors see lockscreen. You have admin bypass).</span>
          <Link
            href="/admin/settings"
            style={{
              background: '#fff',
              color: '#991B1B',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              textDecoration: 'none',
            }}
          >
            Settings
          </Link>
        </div>
      )}

      {/* 2. Global Urgent Announcement Banner */}
      {settings.announcementEnabled && settings.announcementText && !isAdminRoute && (
        <div
          style={{
            background:
              settings.announcementColor === 'gold'
                ? 'linear-gradient(90deg, #E8A020, #D97706)'
                : settings.announcementColor === 'cyan'
                ? 'linear-gradient(90deg, #0284C7, #0369A1)'
                : 'linear-gradient(90deg, #FF1E6A, #E11D48)',
            color: settings.announcementColor === 'gold' ? '#0A0A0C' : '#FFFFFF',
            padding: '7px 16px',
            fontSize: '12px',
            fontWeight: 700,
            textAlign: 'center',
            letterSpacing: '0.04em',
            zIndex: 9999,
          }}
        >
          {settings.announcementText}
        </div>
      )}

      {children}
    </>
  );
}
