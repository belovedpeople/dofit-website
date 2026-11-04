'use client';
import Image from 'next/image';
import Link from 'next/link';
import styles from './DofitFooter.module.css';
import NewsletterForm from '../NewsletterForm';
import { useShowcaseContent } from '@/hooks/useShowcaseContent';
import { getSocialIcon } from '@/components/shared/SocialIcons';

export default function DofitFooter() {
  const { showcase } = useShowcaseContent();
  const socials = showcase.socialLinks || {};

  const socialList = [
    { name: 'Instagram', icon: getSocialIcon('instagram', 17), url: socials.instagram || 'https://instagram.com/dofitwears' },
    { name: 'TikTok', icon: getSocialIcon('tiktok', 17), url: socials.tiktok || 'https://tiktok.com/@dofitwears' },
    { name: 'Twitter', icon: getSocialIcon('twitter', 16), url: socials.twitter || 'https://x.com/dofitwears' },
    ...(socials.whatsapp ? [{ name: 'WhatsApp', icon: getSocialIcon('whatsapp', 17), url: socials.whatsapp.startsWith('http') ? socials.whatsapp : `https://wa.me/${socials.whatsapp.replace(/[^0-9]/g, '')}` }] : []),
  ];

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
            {socialList.map(s => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.social}
                aria-label={s.name}
                title={s.name}
                id={`footer-${s.name.toLowerCase()}`}
              >
                {s.icon}
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
            <span className="asa-display" style={{ fontStyle: 'italic' }}>Àṣà by Dofit</span>
          </Link>
        </div>

        <div className={styles.col}>
          <h4 className={`${styles.colH} display`}>Company</h4>
          <Link href="/about" className={styles.colLink} id="footer-story">Our Story & Heritage</Link>
          <Link href="/shipping-returns" className={styles.colLink} id="footer-shipping">Shipping & Returns</Link>
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
          <Link href="/privacy" id="footer-privacy">Privacy</Link>
          <Link href="/terms" id="footer-terms">Terms</Link>
          <Link href="/cookies" id="footer-cookies">Cookies</Link>
        </div>
        <p className={styles.madeIn}>Made with ♥ in Lagos</p>
      </div>
    </footer>
  );
}
