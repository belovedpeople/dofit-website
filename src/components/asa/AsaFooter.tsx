'use client';
import Image from 'next/image';
import Link from 'next/link';
import { AdireElekoPattern, AdireTeethDivider } from './patterns/YorubaPatterns';
import styles from './AsaFooter.module.css';
import NewsletterForm from '../NewsletterForm';
import { useShowcaseContent } from '@/hooks/useShowcaseContent';
import { getSocialIcon } from '@/components/shared/SocialIcons';

export default function AsaFooter() {
  const { showcase } = useShowcaseContent();
  const socials = showcase.socialLinks || {};

  const socialList = [
    { name: 'Instagram', icon: getSocialIcon('instagram', 17), url: socials.instagram || 'https://instagram.com/dofitwears' },
    { name: 'TikTok', icon: getSocialIcon('tiktok', 17), url: socials.tiktok || 'https://tiktok.com/@dofitwears' },
    { name: 'Twitter', icon: getSocialIcon('twitter', 16), url: socials.twitter || 'https://x.com/dofitwears' },
    ...(socials.whatsapp ? [{ name: 'WhatsApp', icon: getSocialIcon('whatsapp', 17), url: socials.whatsapp.startsWith('http') ? socials.whatsapp : `https://wa.me/${socials.whatsapp.replace(/[^0-9]/g, '')}` }] : []),
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
                aria-label={s.name}
                title={s.name}
                id={`asa-footer-social-${i}`}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div className={styles.col}>
          <h4 className={`${styles.colH} asa-display`}>Àṣà Capsule</h4>
          <Link href="/shop?brand=asa" className={`${styles.colLink} asa-body`}>All Cultural Pieces</Link>
          <Link href="/asa#asa-products" className={`${styles.colLink} asa-body`}>New Drops</Link>
          <Link href="/asa#asa-gallery" className={`${styles.colLink} asa-body`}>Lookbook &amp; Editorial</Link>
          <Link href="/shipping-returns" className={`${styles.colLink} asa-body`}>Shipping &amp; Returns</Link>
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
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link href="/privacy" className="asa-body" style={{ fontSize: '12px', color: 'rgba(232, 160, 32, 0.5)' }}>Privacy</Link>
          <Link href="/terms" className="asa-body" style={{ fontSize: '12px', color: 'rgba(232, 160, 32, 0.5)' }}>Terms</Link>
          <Link href="/cookies" className="asa-body" style={{ fontSize: '12px', color: 'rgba(232, 160, 32, 0.5)' }}>Cookies</Link>
          <Link href="/shipping-returns" className="asa-body" style={{ fontSize: '12px', color: 'rgba(232, 160, 32, 0.5)' }}>Shipping</Link>
        </div>
        <p className={`${styles.madeIn} asa-body`}>Crafted with pride in Lagos ♥</p>
      </div>
    </footer>
  );
}
