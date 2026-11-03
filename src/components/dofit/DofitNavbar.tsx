'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useInstallApp } from '@/context/InstallAppContext';
import styles from './DofitNavbar.module.css';

export default function DofitNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { openCart, totalCount } = useCart();
  const { triggerInstall, isInstalled, isAppMode } = useInstallApp();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      {/* Scroll progress line */}
      <div className={styles.progress} id="nav-progress" />

      <nav className={`${styles.nav} wrap`}>
        {/* Logo */}
        <Link href="/" className={styles.logo} id="nav-logo">
          <div className={styles.logoIcon}>
            <Image src="/images/logo.png" alt="DW" width={34} height={34} className={styles.logoImg} priority />
          </div>
          <span className={`${styles.logoText} display`}>Dofit</span>
        </Link>

        {/* Desktop links */}
        <ul className={styles.links}>
          <li>
            <Link href="/shop" id="nav-shop" className={styles.link}>
              Shop All
            </Link>
          </li>
          <li>
            <Link href="/shop?brand=dofit" id="nav-activewear" className={styles.link}>
              Activewear
            </Link>
          </li>
          <li>
            <Link href="/about" id="nav-story" className={styles.link}>
              Story
            </Link>
          </li>
          <li>
            <Link href="/asa" id="nav-asa" className={`${styles.link} ${styles.asaLink}`}>
              <span className="asa-display" style={{ fontStyle: 'italic' }}>Àṣà by Dofit</span>
            </Link>
          </li>
        </ul>

        {/* Right */}
        <div className={styles.right}>
          <Link href="/shop" className={styles.iconBtn} id="nav-search" aria-label="Search Catalog">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </Link>
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
            id="nav-cart"
            aria-label={`Open Cart with ${totalCount} items`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span className={styles.badge}>{totalCount}</span>
          </button>
          <button className={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)} id="nav-menu" aria-label="Menu">
            <span className={`${styles.bar} ${menuOpen ? styles.bar1Open : ''}`} />
            <span className={`${styles.bar} ${menuOpen ? styles.bar2Open : ''}`} />
            <span className={`${styles.bar} ${menuOpen ? styles.bar3Open : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`${styles.mobile} ${menuOpen ? styles.mobileOpen : ''}`}>
        <ul className={styles.mobileLinks}>
          <li><Link href="/shop" className={styles.mobileLink} onClick={() => setMenuOpen(false)}><span className="display">Shop All</span></Link></li>
          <li><Link href="/shop?brand=dofit" className={styles.mobileLink} onClick={() => setMenuOpen(false)}><span className="display">Activewear</span></Link></li>
          <li><Link href="/about" className={styles.mobileLink} onClick={() => setMenuOpen(false)}><span className="display">Our Story</span></Link></li>
          <li><Link href="/asa" className={`${styles.mobileLink} ${styles.mobileLinkAsa}`} onClick={() => setMenuOpen(false)}><span className="asa-display" style={{fontStyle:'italic'}}>Àṣà by Dofit</span></Link></li>
          <li className={styles.mobileInstallItem}>
            <button
              type="button"
              className={styles.mobileDrawerInstallBtn}
              onClick={() => {
                setMenuOpen(false);
                triggerInstall();
              }}
            >
              <span className={styles.installIconBox}>📲</span>
              <div>
                <strong>Install Dofit as App</strong>
                <small>1-Tap Home Screen Access</small>
              </div>
            </button>
          </li>
        </ul>
        <div className={styles.mobileCta}>
          <Link href="/shop" className="btn btn-pink" id="mobile-shop" onClick={() => setMenuOpen(false)}>Shop Now</Link>
        </div>
      </div>
    </header>
  );
}
