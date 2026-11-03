import Image from 'next/image';
import styles from './SocialGrid.module.css';

const gridImages = [
  { id: 'social-1', src: '/images/dofit-wears/2-Piece Biker Short Set.png', alt: 'Biker Short Set' },
  { id: 'social-2', src: '/images/asa/image1.png', alt: 'Àṣà look 1' },
  { id: 'social-3', src: '/images/dofit-wears/Long-Sleeve Tennis Skirt Set.png', alt: 'Tennis Skirt Set' },
  { id: 'social-4', src: '/images/asa/image3.png', alt: 'Àṣà look 3' },
  { id: 'social-5', src: '/images/dofit-wears/3-Piece Tracksuit  Activewear Set.png', alt: 'Tracksuit Set' },
  { id: 'social-6', src: '/images/asa/image5.png', alt: 'Àṣà look 5' },
];

export default function SocialGrid() {
  return (
    <section className={styles.section} id="social">
      <div className={styles.head}>
        <p className={styles.eyebrow}>Follow the Movement</p>
        <h2 className={`${styles.title} serif`}>
          @dofitofficial
        </h2>
        <p className={styles.sub}>
          Share your look. Tag us for a chance to be featured.
        </p>
      </div>

      <div className={styles.grid}>
        {gridImages.map((img) => (
          <a key={img.id} href="#" className={styles.sq} id={img.id} aria-label={`Instagram: ${img.alt}`}>
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className={styles.sqImg}
              sizes="(max-width: 768px) 50vw, 17vw"
            />
            <div className={styles.sqOverlay}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </div>
          </a>
        ))}
      </div>

      <div className={styles.cta}>
        <a href="https://instagram.com/dofitofficial" target="_blank" rel="noopener noreferrer" className="btn btn-ghost" id="social-instagram-btn">
          Follow on Instagram
        </a>
      </div>
    </section>
  );
}
