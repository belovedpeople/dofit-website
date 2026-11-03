'use client';
import { useState } from 'react';
import Image from 'next/image';
import { AdireElekoPattern, AdireTeethDivider } from './patterns/YorubaPatterns';
import styles from './AsaGallery.module.css';

const galleryItems = [
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
  const [activeCategory, setActiveCategory] = useState('All Looks');

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

      {/* Background ambient gold & indigo glows */}
      <div className={styles.glowAura} />

      <div className="wrap">
        {/* Header */}
        <div className={`${styles.header} reveal`}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            <span>SEASON 01 — LOOKBOOK</span>
          </div>
          <h2 className={`${styles.title} asa-display`}>
            The Modern <span className={styles.italicGold}>Adire</span> Chronicle
          </h2>
          <p className={`${styles.subtitle} asa-body`}>
            Captured through the lens of young Lagos creatives. Traditional Adire resist-dye techniques reimagined for high-fashion activewear and luxury streetwear.
          </p>

          {/* Filter Pills */}
          <div className={styles.filters}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className={styles.grid}>
          {filtered.map((item, idx) => (
            <div key={item.id} className={`${styles.card} reveal`} style={{ animationDelay: `${idx * 0.15}s` }}>
              <div className={styles.imageContainer}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className={styles.image}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className={styles.overlay}>
                  <p className={styles.cardQuote}>“{item.quote}”</p>
                </div>
                <div className={styles.cardCategory}>{item.category}</div>
              </div>

              <div className={styles.cardDetails}>
                <h3 className={`${styles.cardTitle} asa-display`}>{item.title}</h3>
                <p className={`${styles.cardTagline} asa-body`}>{item.tagline}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Heritage Quote Banner */}
        <div className={`${styles.quoteBanner} reveal`}>
          <div className={styles.bannerAdireStrip} />
          <p className={`${styles.bannerYoruba} asa-display`}>
            &ldquo;Àṣà kò gbọ́dọ̀ parun — Àṣà ti di aṣọ tí a ń wọ̀.&rdquo;
          </p>
          <p className={`${styles.bannerTranslation} asa-body`}>
            Culture must never perish — Culture has become the garment we wear with pride.
          </p>
        </div>
      </div>

      {/* Bottom Eyin Aja zigzag divider */}
      <AdireTeethDivider color="#E8A020" />
    </section>
  );
}
