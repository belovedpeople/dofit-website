import Image from 'next/image';
import styles from './BrandStory.module.css';

export default function BrandStory() {
  return (
    <section className={styles.section} id="story">
      <div className={`${styles.inner} wrap`}>
        {/* Image */}
        <div className={styles.imageCol}>
          <div className={styles.frame}>
            <Image
              src="/images/asa/image8.png"
              alt="Dofit brand story"
              fill
              className={styles.img}
              sizes="(max-width: 768px) 100vw, 42vw"
            />
          </div>
          {/* Floating stat card */}
          <div className={styles.statCard}>
            <span className={`${styles.statYear} serif`}>2022</span>
            <span className={styles.statText}>Founded in Lagos, Nigeria</span>
            <div className={styles.statLine} />
            <span className={styles.statSub}>Worn across 6 cities</span>
          </div>
        </div>

        {/* Copy */}
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Our Story</p>
          <blockquote className={`${styles.quote} serif italic`}>
            &ldquo;We dress the ones who
            show up fully — in life,
            in sport, in culture.&rdquo;
          </blockquote>
          <p className={styles.who}>— Founder, Dofit Wears</p>

          <p className={styles.body}>
            Dofit Wears was born from a simple truth: Nigerian women and men deserve
            activewear and fashion that honours both their ambition and their heritage.
            We craft every piece with intention — from the stretch of our performance
            fabrics to the geometry of our Àṣà tie-dye patterns.
          </p>
          <p className={styles.body}>
            Today, Dofit is two brands in one — a performance activewear line built for
            the gym and the street, and Àṣà by Dofit, a fashion-forward collection that
            wears our culture as its greatest statement.
          </p>

          <div className={styles.values}>
            {['Premium Fabrics', 'Body Inclusive', 'Culture First', 'Made with Pride'].map((v) => (
              <span key={v} className={styles.value}>
                <span className={styles.valueDot} />
                {v}
              </span>
            ))}
          </div>

          <a href="#" className="btn btn-solid" id="story-learn-more">
            Learn More About Us
          </a>
        </div>
      </div>
    </section>
  );
}
