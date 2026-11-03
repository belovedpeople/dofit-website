'use client';
import Image from 'next/image';
import { useShowcaseContent } from '@/hooks/useShowcaseContent';
import styles from './DofitInstaGrid.module.css';

export default function DofitInstaGrid() {
  const { showcase } = useShowcaseContent();
  const imgs = showcase.dofitInsta && showcase.dofitInsta.length > 0 ? showcase.dofitInsta : [];

  return (
    <section className={styles.section}>
      <div className={`${styles.header} wrap reveal`}>
        <h2 className={`${styles.title} display`}>
          @<span className={styles.pink}>dofitofficial</span>
        </h2>
        <p className={styles.sub}>Follow the movement. Tag us to be featured.</p>
      </div>

      <div className={styles.grid}>
        {imgs.map((img, i) => (
          <a
            key={img.id || i}
            href={img.link || 'https://instagram.com'}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.cell} ${i === 0 ? styles.cellFeat : ''}`}
            id={img.id || `ig-${i}`}
            aria-label={img.alt || 'Dofit Showcase'}
          >
            <Image
              src={img.src}
              alt={img.alt || 'Dofit Showcase'}
              fill
              className={styles.cellImg}
              sizes="(max-width: 768px) 50vw, 17vw"
            />
            <div className={styles.cellOverlay}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              <span>View Post</span>
            </div>
          </a>
        ))}
      </div>

      <div className={`${styles.ctaWrap} wrap`}>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline-pink" id="insta-follow">
          Follow on Instagram
        </a>
      </div>
    </section>
  );
}
