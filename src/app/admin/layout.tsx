'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminAuthGate from '@/components/admin/AdminAuthGate';
import styles from './admin.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [pathname]);

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/orders', label: 'WhatsApp Orders', icon: '📦' },
    { href: '/admin/products', label: 'Products & Stock', icon: '👗' },
    { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
    { href: '/admin/vouchers', label: 'Vouchers & Promos', icon: '🎟️' },
    { href: '/admin/subscribers', label: 'Subscribers (VIP)', icon: '📬' },
    { href: '/admin/notifications', label: 'Push Notifications', icon: '🔔' },
    { href: '/admin/team', label: 'Team & Staff', icon: '👥' },
    { href: '/admin/content-cms', label: 'Content CMS', icon: '🖊' },
    { href: '/admin/settings', label: 'Store Override & Settings', icon: '⚙️' },
  ];

  const currentNav = navItems.find((i) => i.href === pathname);

  return (
    <AdminAuthGate>
      <div className={styles.adminContainer}>
        {/* Mobile Topbar */}
        <header className={styles.mobileHeader}>
          <Link href="/admin" className={styles.mobileHeaderBrand}>
            <span className={styles.logoDot} />
            <span>DOFIT ADMIN</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentNav?.label || 'Console'}
            </span>
            <button
              type="button"
              className={styles.mobileMenuBtn}
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              aria-label="Toggle admin navigation menu"
            >
              {mobileDrawerOpen ? '✕' : '☰'}
            </button>
          </div>
        </header>

        {/* Mobile Slide-Out Navigation Drawer */}
        {mobileDrawerOpen && (
          <div
            className={styles.mobileDrawerOverlay}
            onClick={() => setMobileDrawerOpen(false)}
          />
        )}
        <div
          className={styles.mobileDrawer}
          style={{
            transform: mobileDrawerOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div className={styles.mobileDrawerHeader}>
            <div className={styles.brandLogo} style={{ fontSize: '20px' }}>
              <span className={styles.logoDot} />
              DOFIT WEARS
            </div>
            <button
              type="button"
              className={styles.mobileDrawerClose}
              onClick={() => setMobileDrawerOpen(false)}
            >
              ✕
            </button>
          </div>

          <nav className={styles.nav}>
            <span className={styles.navSectionLabel}>Core Operations</span>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                  onClick={() => setMobileDrawerOpen(false)}
                >
                  <span style={{ fontSize: '18px' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className={styles.sidebarFooter} style={{ marginTop: 'auto', paddingTop: '16px' }}>
            <Link href="/" className={styles.storeLink} target="_blank">
              <span>🌐</span>
              <span>View Public Storefront</span>
            </Link>
            <Link href="/asa" className={styles.storeLink} target="_blank">
              <span>🎨</span>
              <span>View Àṣà Couture</span>
            </Link>
          </div>
        </div>

        {/* Desktop Sidebar (hidden on mobile via CSS) */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <div className={styles.brandLogo}>
              <span className={styles.logoDot} />
              DOFIT WEARS
            </div>
            <span className={styles.brandBadgeAdmin}>ADMIN CONTROL</span>
          </div>

          <nav className={styles.nav}>
            <span className={styles.navSectionLabel}>Core Operations</span>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className={styles.sidebarFooter}>
            <Link href="/" className={styles.storeLink} target="_blank">
              <span>🌐</span>
              <span>View Public Storefront</span>
            </Link>
            <Link href="/asa" className={styles.storeLink} target="_blank">
              <span>🎨</span>
              <span>View Àṣà Couture</span>
            </Link>
          </div>
        </aside>

        {/* Main content wrapper */}
        <div className={styles.main}>
          {/* Desktop Topbar */}
          <header className={styles.topbar}>
            <h1 className={styles.pageHeaderTitle}>
              {currentNav?.label || 'Management Console'}
            </h1>
            <div className={styles.topbarActions}>
              <div className={styles.statusPill}>
                <span className={styles.statusPulse} />
                <span>WhatsApp Router: +2349016946854</span>
              </div>
            </div>
          </header>

          {/* View content */}
          <main className={styles.contentView}>{children}</main>
        </div>

        {/* Mobile Bottom Dock Navigation (Quick Thumb Switching) */}
        <nav className={styles.mobileBottomNav} aria-label="Mobile Admin Navigation">
          <Link
            href="/admin"
            className={`${styles.mobileBottomTab} ${pathname === '/admin' ? styles.mobileBottomTabActive : ''}`}
          >
            <span className={styles.mobileBottomTabIcon}>📊</span>
            <span>Dashboard</span>
          </Link>

          <Link
            href="/admin/products"
            className={`${styles.mobileBottomTab} ${pathname === '/admin/products' ? styles.mobileBottomTabActive : ''}`}
          >
            <span className={styles.mobileBottomTabIcon}>👗</span>
            <span>Products</span>
          </Link>

          <Link
            href="/admin/orders"
            className={`${styles.mobileBottomTab} ${pathname === '/admin/orders' ? styles.mobileBottomTabActive : ''}`}
          >
            <span className={styles.mobileBottomTabIcon}>📦</span>
            <span>Orders</span>
          </Link>

          <Link
            href="/admin/settings"
            className={`${styles.mobileBottomTab} ${pathname === '/admin/settings' ? styles.mobileBottomTabActive : ''}`}
          >
            <span className={styles.mobileBottomTabIcon}>⚙️</span>
            <span>Settings</span>
          </Link>

          <button
            type="button"
            className={styles.mobileBottomTab}
            onClick={() => setMobileDrawerOpen(true)}
            aria-label="Open full admin menu"
          >
            <span className={styles.mobileBottomTabIcon}>☰</span>
            <span>Menu</span>
          </button>
        </nav>
      </div>
    </AdminAuthGate>
  );
}
