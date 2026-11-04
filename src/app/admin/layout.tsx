'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminAuthGate from '@/components/admin/AdminAuthGate';
import styles from './admin.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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

  return (
    <AdminAuthGate>
      <div className={styles.adminContainer}>
        {/* Sidebar */}
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
          {/* Topbar */}
          <header className={styles.topbar}>
            <h1 className={styles.pageHeaderTitle}>Management Console</h1>
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
      </div>
    </AdminAuthGate>
  );
}
