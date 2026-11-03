'use client';
import Image from 'next/image';
import Link from 'next/link';
import DofitNavbar from '@/components/dofit/DofitNavbar';
import DofitFooter from '@/components/dofit/DofitFooter';
import { useScrollReveal } from '@/hooks/useScrollEffects';
import styles from './about.module.css';

export default function AboutPage() {
  useScrollReveal();

  return (
    <div className={styles.container}>
      <DofitNavbar />

      <main className={styles.main}>
        {/* Story Hero */}
        <section className={styles.hero}>
          <div className="wrap">
            <span className={`${styles.eyebrow} reveal`}>OUR PHILOSOPHY &amp; GENESIS</span>
            <h1 className={`${styles.heroTitle} display reveal`}>
              WHERE PERFORMANCE MEETS <span className={styles.pinkText}>CULTURE</span>
            </h1>
            <p className={`${styles.heroLead} reveal`}>
              Dofit was founded on a singular conviction: activewear shouldn&apos;t be generic, and heritage shouldn&apos;t stay trapped in the past. We exist at the intersection of modern athletics, street attitude, and African artistry.
            </p>
          </div>
        </section>

        {/* Dual Pillar Visual Split */}
        <section className={`wrap ${styles.splitSection}`}>
          {/* Pillar 1: Dofit Wears */}
          <div className={`${styles.pillarCard} ${styles.pillarDofit} reveal`}>
            <div className={styles.pillarImgWrap}>
              <Image
                src="/images/dofit-wears/2-Piece Biker Short Set.png"
                alt="Dofit Wears activewear"
                fill
                className={styles.pillarImg}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className={styles.pillarOverlayDofit} />
            </div>
            <div className={styles.pillarContent}>
              <span className={styles.pillarTagDofit}>ENGINEERED PERFORMANCE</span>
              <h2 className={`${styles.pillarTitle} display`}>DOFIT WEARS</h2>
              <p className={styles.pillarDesc}>
                Precision activewear crafted for the body that shows up and demands more. Four-way high-density compression fabrics, squat-proof opacity, zero roll-down waistbands, and an unapologetic black &amp; electric pink Gen Z aesthetic.
              </p>
              <Link href="/shop?brand=dofit" className="btn btn-pink">
                Explore Activewear →
              </Link>
            </div>
          </div>

          {/* Pillar 2: Àṣà by Dofit */}
          <div className={`${styles.pillarCard} ${styles.pillarAsa} reveal`}>
            <div className={styles.pillarImgWrap}>
              <Image
                src="/images/asa/image1.png"
                alt="Àṣà cultural capsule"
                fill
                className={styles.pillarImg}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className={styles.pillarOverlayAsa} />
            </div>
            <div className={styles.pillarContent}>
              <span className={styles.pillarTagAsa}>CULTURE AS COUTURE</span>
              <h2 className={`${styles.pillarTitle} asa-display`}>ÀṢÀ BY DOFIT</h2>
              <p className={styles.pillarDesc}>
                Àṣà is our cultural homage. Partnering with multi-generational master dyers in Abeokuta, Ogun State, we translate sacred Adire resist patterns into contemporary streetwear jackets, tactical vests, and dramatic asymmetric silhouettes.
              </p>
              <Link href="/asa" className="btn btn-asa-gold">
                Enter Àṣà Universe →
              </Link>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className={styles.valuesSection}>
          <div className="wrap">
            <h2 className={`${styles.valuesHeadline} display reveal`}>OUR THREE PILLARS</h2>
            <div className={styles.valuesGrid}>
              <div className={`${styles.valueCard} reveal`}>
                <span className={styles.valueNumber}>01</span>
                <h3 className={`${styles.valueName} display`}>UNCOMPROMISING FIT</h3>
                <p className={styles.valueText}>
                  Every garment undergoes rigorous fit-testing across diverse athletic body types to guarantee absolute freedom of motion without slipping, bunching, or sheerness.
                </p>
              </div>

              <div className={`${styles.valueCard} reveal`}>
                <span className={styles.valueNumber}>02</span>
                <h3 className={`${styles.valueName} display`}>AUTHENTIC ADIRE ARTISANRY</h3>
                <p className={styles.valueText}>
                  We reject fast-fashion printed simulations. Every Àṣà piece uses genuine batik resist and indigo vegetable dye processes steeped in centuries-old Yoruba traditions.
                </p>
              </div>

              <div className={`${styles.valueCard} reveal`}>
                <span className={styles.valueNumber}>03</span>
                <h3 className={`${styles.valueName} display`}>LAGOS TO THE GLOBE</h3>
                <p className={styles.valueText}>
                  Conceived, designed, and ethically assembled in Lagos, Nigeria. We take African creative brilliance and elevate it onto the international luxury streetwear stage.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Founder Quote */}
        <section className={`wrap ${styles.quoteSection} reveal`}>
          <div className={styles.quoteBox}>
            <p className={styles.quoteText}>
              &ldquo;We didn&apos;t want Dofit to be just another gym brand. We wanted it to feel like armor. And when you wear Àṣà, you are carrying your ancestry and your audacity in every step.&rdquo;
            </p>
            <div className={styles.authorRow}>
              <div>
                <span className={styles.authorName}>THE DOFIT CREATIVE DIRECTORS</span>
                <span className={styles.authorRole}>Lagos, Nigeria</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <DofitFooter />
    </div>
  );
}
