'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useInstallApp } from '@/context/InstallAppContext';
import styles from './AsaNavbar.module.css';

export default function AsaNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openCart, totalCount } = useCart();
  const { triggerInstall, isInstalled, isAppMode } = useInstallApp();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
      {/* Cultural top banner */}
      <div className={styles.adireTopBar}>
        <div className={styles.barContent}>
          <span className={styles.barText}>✦ ÀṢÀ BY DOFIT — AFROCENTRIC COUTURE & STREETWEAR ✦ LIMITED CAPSULE COLLECTION</span>
          <Link href="/" className={styles.switchLink}>
            ← Back to Dofit Wears
          </Link>
        </div>
      </div>

      <nav className={styles.nav}>
        <div className={`wrap ${styles.navInner}`}>
          {/* Brand Logo */}
          <Link href="/asa" className={styles.brand} aria-label="Àṣà by Dofit">
            <span className={styles.brandTitle}>ÀṢÀ</span>
            <span className={styles.brandSub}>BY DOFIT</span>
          </Link>

          {/* Desktop Links */}
          <ul className={styles.links}>
            <li>
              <Link href="/asa#asa-story" className={styles.link}>
                Heritage
              </Link>
            </li>
            <li>
              <Link href="/asa#asa-products" className={styles.link}>
                Collection
              </Link>
            </li>
            <li>
              <Link href="/asa#asa-gallery" className={styles.link}>
                Lookbook
              </Link>
            </li>
            <li>
              <Link href="/shop" className={styles.link}>
                Shop All
              </Link>
            </li>
            <li>
              <Link href="/" className={styles.linkDofit}>
                <span className={styles.dofitDot} />
                Dofit Activewear
              </Link>
            </li>
          </ul>

          {/* Right Actions */}
          <div className={styles.actions}>
            {!isInstalled && !isAppMode && (
              <button
                type="button"
                className={styles.mobileInstallNavBtn}
                onClick={() => triggerInstall()}
                aria-label="Install App"
                title="Install App"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                  <polyline points="15 10 12 13 9 10" />
                  <line x1="12" y1="5" x2="12" y2="13" />
                </svg>
                <span>Install App</span>
              </button>
            )}

            <button
              type="button"
              onClick={openCart}
              className={styles.cartBtn}
              aria-label={`Open Cart (${totalCount})`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              <span className={styles.cartBadge}>{totalCount}</span>
            </button>

            <Link href="/asa#asa-products" className="btn btn-asa-gold" style={{ padding: '9px 20px', fontSize: '11px' }}>
              Shop Capsule
            </Link>

            {/* Mobile menu trigger */}
            <button
              className={styles.menuBtn}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <span className={`${styles.menuLine} ${mobileOpen ? styles.openTop : ''}`} />
              <span className={`${styles.menuLine} ${mobileOpen ? styles.openMid : ''}`} />
              <span className={`${styles.menuLine} ${mobileOpen ? styles.openBot : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`${styles.mobileDrawer} ${mobileOpen ? styles.mobileDrawerOpen : ''}`}>
        <div className={styles.drawerContent}>
          <Link href="/asa#asa-story" className={styles.drawerLink} onClick={() => setMobileOpen(false)}>
            Heritage & Story
          </Link>
          <Link href="/asa#asa-products" className={styles.drawerLink} onClick={() => setMobileOpen(false)}>
            Couture Collection
          </Link>
          <Link href="/asa#asa-gallery" className={styles.drawerLink} onClick={() => setMobileOpen(false)}>
            Lookbook & Editorial
          </Link>
          <div className={styles.drawerDivider} />
          <button
            type="button"
            className={styles.drawerInstallBtn}
            onClick={() => {
              setMobileOpen(false);
              triggerInstall();
            }}
          >
            <span className={styles.installIconBox}>📲</span>
            <div>
              <strong>Install Àṣà by Dofit App</strong>
              <small>1-Tap Home Screen Access</small>
            </div>
          </button>
          <div className={styles.drawerDivider} />
          <Link href="/" className={styles.drawerLinkDofit} onClick={() => setMobileOpen(false)}>
            ← Switch to Dofit Wears (Activewear)
          </Link>
        </div>
      </div>
    </header>
  );
}
