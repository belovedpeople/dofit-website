import Image from 'next/image';
import { AdireElekoPattern, AdireTeethDivider } from './patterns/YorubaPatterns';
import styles from './AsaStory.module.css';

export default function AsaStory() {
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
                src="/images/asa/image8.png"
                alt="Àṣà story"
                fill
                className={styles.img}
                sizes="(max-width: 768px) 100vw, 44vw"
              />
              <div className={styles.imgBorder} />
            </div>

            {/* Floating badge */}
            <div className={styles.floatBadge}>
              <span className={`${styles.badgeText} asa-display`}>2026</span>
              <span className={`${styles.badgeSub} asa-body`}>Season Two</span>
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
              Inspired by the ancient Adire textile art of the Yoruba people — intricate tie-dye patterns
              hand-crafted with indigo and wax-resist techniques — Àṣà fuses this centuries-old craft
              with the silhouettes and energy of Gen Z street culture.
            </p>

            {/* Cultural tags */}
            <div className={styles.tags}>
              {['Adire', 'Yoruba Heritage', 'Tie-Dye', 'Gen Z Streetwear', 'Unisex', 'Limited Drops'].map((t) => (
                <span key={t} className={`${styles.tag} asa-body`}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Eyin Aja zigzag divider */}
      <AdireTeethDivider color="#E8A020" />
    </section>
  );
}
