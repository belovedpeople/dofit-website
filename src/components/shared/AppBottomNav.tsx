'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useInstallApp } from '@/context/InstallAppContext';
import styles from './AppBottomNav.module.css';

export default function AppBottomNav() {
  const pathname = usePathname();
  const { openCart, totalCount } = useCart();
  const { isAppMode, openChatModal } = useInstallApp();

  // Hide in admin panel
  if (pathname.startsWith('/admin')) {
    return null;
  }

  // ONLY show if the PWA app is really installed & opened as standalone app
  if (!isAppMode) {
    return null;
  }

  const isHome = pathname === '/';
  const isAsa = pathname.startsWith('/asa');
  const isShop = pathname.startsWith('/shop');

  return (
    <nav className={styles.bottomBar} aria-label="App Navigation">
      {/* 1. Home Tab */}
      <Link href="/" className={`${styles.tabItem} ${isHome ? styles.tabActive : ''}`} id="tab-home">
        <div className={styles.iconWrap}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
        <span className={styles.tabLabel}>Dofit</span>
        {isHome && <span className={styles.activeDot} />}
      </Link>

      {/* 2. Àṣà Culture Tab */}
      <Link href="/asa" className={`${styles.tabItem} ${styles.asaTab} ${isAsa ? styles.tabActiveAsa : ''}`} id="tab-asa">
        <div className={styles.iconWrap}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </div>
        <span className={styles.tabLabel}>Àṣà</span>
        {isAsa && <span className={styles.activeDotAsa} />}
      </Link>

      {/* 3. Shop All Tab */}
      <Link href="/shop" className={`${styles.tabItem} ${isShop ? styles.tabActive : ''}`} id="tab-shop">
        <div className={styles.iconWrap}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
        </div>
        <span className={styles.tabLabel}>Catalog</span>
        {isShop && <span className={styles.activeDot} />}
      </Link>

      {/* 4. Cart Bag Tab */}
      <button type="button" className={styles.tabItem} onClick={openCart} id="tab-bag" aria-label={`Bag with ${totalCount} items`}>
        <div className={styles.iconWrap}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          {totalCount > 0 && <span className={styles.bagBadge}>{totalCount}</span>}
        </div>
        <span className={styles.tabLabel}>Bag</span>
      </button>

      {/* 5. WhatsApp Live Chat Tab */}
      <button type="button" className={`${styles.tabItem} ${styles.chatTab}`} onClick={openChatModal} id="tab-chat" aria-label="Chat on WhatsApp">
        <div className={styles.chatIconCircle}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
        </div>
        <span className={styles.tabLabel}>Chat</span>
      </button>
    </nav>
  );
}
