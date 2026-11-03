import Image from 'next/image';
import Link from 'next/link';
import styles from './DofitFooter.module.css';
import NewsletterForm from '../NewsletterForm';

export default function DofitFooter() {
  return (
    <footer className={styles.footer} id="footer">
      {/* Top pink line */}
      <div className={styles.topLine} />

      <div className={`${styles.inner} wrap`}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.logoRow}>
            <Image src="/images/logo.png" alt="DW" width={44} height={44} className={styles.logo} />
            <span className={`${styles.brandName} display`}>DOFIT</span>
          </div>
          <p className={styles.brandTag}>Built to perform. Made to be seen.</p>
          <div className={styles.socials}>
            {['Instagram','TikTok','Twitter'].map(s => (
              <a key={s} href="#" className={styles.social} aria-label={s} id={`footer-${s.toLowerCase()}`}>
                <span className={styles.socialLabel}>{s[0]}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className={styles.col}>
          <h4 className={`${styles.colH} display`}>Shop</h4>
          <Link href="/shop?brand=dofit" className={styles.colLink} id="footer-activewear">Activewear Sets</Link>
          <Link href="/shop" className={styles.colLink} id="footer-all-drops">All Collections</Link>
          <Link href="/shop?brand=dofit" className={styles.colLink} id="footer-new-drops">New Arrivals</Link>
          <Link href="/asa" className={`${styles.colLink} ${styles.asaLink}`} id="footer-asa">
            <span className="asa-display" style={{fontStyle:'italic'}}>Àṣà by Dofit</span>
          </Link>
        </div>

        <div className={styles.col}>
          <h4 className={`${styles.colH} display`}>Company</h4>
          <Link href="/about" className={styles.colLink} id="footer-story">Our Story & Heritage</Link>
          <Link href="/shop" className={styles.colLink} id="footer-shipping">Shipping & Returns</Link>
          <Link href="/about" className={styles.colLink} id="footer-contact">Craftsmanship & FAQ</Link>
        </div>

        {/* Newsletter */}
        <div className={styles.newsletter}>
          <h4 className={`${styles.colH} display`}>Stay Plugged In</h4>
          <p className={styles.nlDesc}>First look at drops. Exclusive offers. No spam.</p>
          <NewsletterForm darkTheme />
        </div>
      </div>

      {/* Bottom bar */}
      <div className={`${styles.bottom} wrap`}>
        <p className={styles.copy}>© 2026 Dofit Wears. All rights reserved.</p>
        <div className={styles.bottomLinks}>
          <a href="#" id="footer-privacy">Privacy</a>
          <a href="#" id="footer-terms">Terms</a>
          <a href="#" id="footer-cookies">Cookies</a>
        </div>
        <p className={styles.madeIn}>Made with ♥ in Lagos</p>
      </div>
    </footer>
  );
}
