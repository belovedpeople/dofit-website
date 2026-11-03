'use client';
import Image from 'next/image';
import Link from 'next/link';
import { AdireElekoPattern, AdireTeethDivider } from './patterns/YorubaPatterns';
import styles from './AsaFooter.module.css';
import NewsletterForm from '../NewsletterForm';
import { useShowcaseContent } from '@/hooks/useShowcaseContent';

export default function AsaFooter() {
  const { showcase } = useShowcaseContent();
  const socials = showcase.socialLinks || {};

  const socialList = [
    { char: 'I', label: 'Instagram', url: socials.instagram || 'https://instagram.com/dofitwears' },
    { char: 'T', label: 'TikTok', url: socials.tiktok || 'https://tiktok.com/@dofitwears' },
    { char: 'X', label: 'Twitter', url: socials.twitter || 'https://x.com/dofitwears' },
    ...(socials.whatsapp ? [{ char: 'W', label: 'WhatsApp', url: socials.whatsapp.startsWith('http') ? socials.whatsapp : `https://wa.me/${socials.whatsapp.replace(/[^0-9]/g, '')}` }] : []),
  ];

  return (
    <footer className={styles.footer}>
      {/* Eyin Aja zigzag divider top border */}
      <AdireTeethDivider color="#E8A020" />

      {/* Subtle Adire Eleko vector backdrop */}
      <AdireElekoPattern opacity={0.05} color="#E8A020" />

      <div className={`${styles.inner} wrap`}>
        <div className={styles.brand}>
          <div className={styles.logoRow}>
            <Image src="/images/logo.png" alt="DW" width={44} height={44} className={styles.logo} />
            <div>
              <span className={`${styles.name} asa-display`}>Àṣà</span>
              <span className={`${styles.sub} asa-body`}>by Dofit</span>
            </div>
          </div>
          <p className={`${styles.tagline} asa-body`}>Culture as couture. Heritage as fashion.</p>
          <div className={styles.socials}>
            {socialList.map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.social}
                aria-label={s.label}
                id={`asa-footer-social-${i}`}
              >
                <span className={`${styles.socialChar} asa-body`}>{s.char}</span>
              </a>
            ))}
          </div>
        </div>

        <div className={styles.col}>
          <h4 className={`${styles.colH} asa-display`}>Àṣà Capsule</h4>
          <Link href="/shop?brand=asa" className={`${styles.colLink} asa-body`}>All Cultural Pieces</Link>
          <Link href="/asa#asa-products" className={`${styles.colLink} asa-body`}>New Drops</Link>
          <Link href="/asa#asa-gallery" className={`${styles.colLink} asa-body`}>Lookbook &amp; Editorial</Link>
        </div>

        <div className={styles.col}>
          <h4 className={`${styles.colH} asa-display`}>Dofit Universe</h4>
          <Link href="/" className={`${styles.colLink} asa-body`}>Dofit Wears Activewear →</Link>
          <Link href="/about" className={`${styles.colLink} asa-body`}>Brand Story &amp; Heritage</Link>
          <Link href="/shop" className={`${styles.colLink} asa-body`}>Complete Archive</Link>
        </div>

        <div className={styles.newsletter}>
          <h4 className={`${styles.colH} asa-display`}>First to Know</h4>
          <p className={`${styles.nlDesc} asa-body`}>Limited drops sell fast. Get notified before anyone else.</p>
          <NewsletterForm darkTheme />
        </div>
      </div>

      <div className={`${styles.bottom} wrap`}>
        <p className={`${styles.copy} asa-body`}>© 2026 Àṣà by Dofit. A Dofit Wears Brand.</p>
        <p className={`${styles.madeIn} asa-body`}>Crafted with pride in Lagos ♥</p>
      </div>
    </footer>
  );
}
