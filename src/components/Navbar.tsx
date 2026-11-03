'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount] = useState(2);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <nav className={`${styles.nav} wrap`}>
        {/* Logo */}
        <a href="#" className={styles.logo} id="nav-logo">
          <Image
            src="/images/logo.png"
            alt="Dofit Wears"
            width={46}
            height={46}
            className={styles.logoImg}
            priority
          />
          <div className={styles.logoText}>
            <span className={`${styles.logoName} serif`}>Dofit Wears</span>
            <span className={styles.logoDomain}>dofit.fit</span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <ul className={styles.links}>
          <li><a href="#activewear" id="nav-activewear">Activewear</a></li>
          <li>
            <a href="#asa" className={styles.asaLink} id="nav-asa">
              <span className="serif italic">Àṣà by Dofit</span>
            </a>
          </li>
          <li><a href="#story" id="nav-story">Our Story</a></li>
          <li><a href="#" id="nav-collections">Collections</a></li>
        </ul>

        {/* Right actions */}
        <div className={styles.right}>
          <a href="#" className={styles.searchBtn} id="nav-search" aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </a>
          <a href="#" className={styles.cartBtn} id="nav-cart" aria-label="Cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span className={styles.badge}>{cartCount}</span>
            )}
          </a>
          <button
            className={styles.menuBtn}
            onClick={() => setMenuOpen(!menuOpen)}
            id="nav-menu-toggle"
            aria-label="Toggle menu"
          >
            <span className={`${styles.menuBar} ${menuOpen ? styles.open1 : ''}`} />
            <span className={`${styles.menuBar} ${menuOpen ? styles.open2 : ''}`} />
            <span className={`${styles.menuBar} ${menuOpen ? styles.open3 : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileOpen : ''}`}>
        <ul className={styles.mobileLinks}>
          <li><a href="#activewear" onClick={() => setMenuOpen(false)}>Activewear</a></li>
          <li><a href="#asa" className={styles.asaLink} onClick={() => setMenuOpen(false)}><span className="serif italic">Àṣà by Dofit</span></a></li>
          <li><a href="#story" onClick={() => setMenuOpen(false)}>Our Story</a></li>
          <li><a href="#" onClick={() => setMenuOpen(false)}>Collections</a></li>
          <li><a href="#" onClick={() => setMenuOpen(false)}>Contact</a></li>
        </ul>
      </div>
    </header>
  );
}
