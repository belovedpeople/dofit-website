'use client';
import Image from 'next/image';
import { useShowcaseContent } from '@/hooks/useShowcaseContent';
import { AdireElekoPattern, AdireTeethDivider } from './patterns/YorubaPatterns';
import styles from './AsaStory.module.css';

export default function AsaStory() {
  const { showcase } = useShowcaseContent();
  const story = showcase.asaStory || {
    mainImage: '/images/asa/image8.png',
    yearBadge: '2026',
    seasonBadge: 'Season Two',
  };

  return (
    <section className={styles.section} id="asa-story">
      {/* Subtle Adire Eleko vector backdrop */}
      <AdireElekoPattern opacity={0.05} color="#E8A020" />

      {/* Eyin Aja zigzag divider */}
      <AdireTeethDivider color="#E8A020" />

      <div className="wrap">
        <div className={styles.grid}>
          {/* Image side */}
          <div className={`${styles.imgSide} reveal-left`}>
            <div className={styles.mainImg}>
              <Image
                src={story.mainImage || '/images/asa/image8.png'}
                alt="Àṣà story"
                fill
                className={styles.img}
                sizes="(max-width: 768px) 100vw, 44vw"
                unoptimized={Boolean(story.mainImage?.startsWith('http'))}
              />
              <div className={styles.imgBorder} />
            </div>

            {/* Floating badge */}
            <div className={styles.floatBadge}>
              <span className={`${styles.badgeText} asa-display`}>{story.yearBadge || '2026'}</span>
              <span className={`${styles.badgeSub} asa-body`}>{story.seasonBadge || 'Season Two'}</span>
            </div>
          </div>

          {/* Copy side */}
          <div className={`${styles.copySide} reveal-right`}>
            <p className={`${styles.eyebrow} asa-body`}>The Story Behind the Name</p>

            <blockquote className={`${styles.quote} asa-display`}>
              &ldquo;Culture is not something
              you wear — it is something
              you are.&rdquo;
            </blockquote>
            <p className={`${styles.quoteAttr} asa-body`}>— Founder, Àṣà by Dofit</p>

            <p className={`${styles.body} asa-body`}>
              Àṣà (pronounced <em>Ah-shah</em>) is a Yoruba word meaning &ldquo;culture&rdquo; or &ldquo;tradition.&rdquo;
              It is the soul behind our second brand — a line that does not merely reference African heritage
              but dresses in it boldly, proudly, and with contemporary flair.
            </p>

            <p className={`${styles.body} asa-body`}>
              Each piece is created in collaboration with master Adire artisans in Abeokuta and Osogbo,
              preserving a resist-dye heritage that spans over three centuries, reframed for tomorrow.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
