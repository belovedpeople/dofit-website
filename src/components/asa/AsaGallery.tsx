'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useShowcaseContent } from '@/hooks/useShowcaseContent';
import { AdireElekoPattern, AdireTeethDivider } from './patterns/YorubaPatterns';
import styles from './AsaGallery.module.css';

const defaultGallery = [
  {
    id: 'look-1',
    category: 'Editorial',
    title: 'The Indigo Royalty',
    tagline: 'Hand-batik Adire meets oversized urban silhouette',
    image: '/images/asa/image7.png',
    quote: 'Every line dyed is an ancestor honored.',
  },
  {
    id: 'look-2',
    category: 'Runway',
    title: 'Lagos Midnight Cut',
    tagline: 'Raw-edge tailoring steeped in deep Yoruba dye-pits',
    image: '/images/asa/image8.png',
    quote: 'Tradition does not stop. It evolves.',
  },
  {
    id: 'look-3',
    category: 'Capsule',
    title: 'Afro-Futurism Vibe',
    tagline: 'Gen Z streetwear energy fused with ancient textile patterns',
    image: '/images/asa/image9.png',
    quote: 'Wear your roots like armor.',
  },
];

const categories = ['All Looks', 'Editorial', 'Runway', 'Capsule'];

export default function AsaGallery() {
  const { showcase } = useShowcaseContent();
  const [activeCategory, setActiveCategory] = useState('All Looks');

  const galleryItems =
    showcase.asaGallery && showcase.asaGallery.length > 0
      ? showcase.asaGallery
      : defaultGallery;

  const filtered =
    activeCategory === 'All Looks'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <section className={styles.section} id="asa-gallery">
      {/* Background Adire Eleko texture */}
      <AdireElekoPattern opacity={0.06} color="#E8A020" />

      {/* Top Eyin Aja zigzag divider */}
      <AdireTeethDivider color="#E8A020" />

      <div className="wrap">
        {/* Header */}
        <div className={`${styles.header} reveal`}>
          <div className={styles.headerLeft}>
            <p className={`${styles.label} asa-body`}>Couture Lookbook</p>
            <h2 className={`${styles.title} asa-display`}>
              THE ADIRE<br />
              <span className={styles.goldText}>GALLERY</span>
            </h2>
          </div>
          <p className={`${styles.headerDesc} asa-body`}>
            Hand-dyed in Abeokuta. Styled in Lagos. Seen worldwide.
            Each silhouette is a canvas where centuries-old indigo resist-dyeing
            meets contemporary urban streetwear tailoring.
          </p>
        </div>

        {/* Category filter pills */}
        <div className={styles.filters}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterBtnActive : ''} asa-body`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery grid */}
        <div className={styles.grid}>
          {filtered.map((item, idx) => (
            <div key={item.id || idx} className={`${styles.card} reveal-scale`}>
              <div className={styles.imgWrap}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className={styles.img}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className={styles.imgOverlay} />
                <span className={`${styles.badge} asa-body`}>{item.category}</span>
              </div>
              <div className={styles.cardInfo}>
                <h3 className={`${styles.cardTitle} asa-display`}>{item.title}</h3>
                <p className={`${styles.cardTagline} asa-body`}>{item.tagline}</p>
                <blockquote className={`${styles.cardQuote} asa-display`}>
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
