'use client';
import Image from 'next/image';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero} id="hero">
      {/* Vertical rail */}
      <div className={styles.rail}>
        <span className={`${styles.railText} serif italic`}>
          Made for the way you move
        </span>
        <div className={styles.railLine} />
        <span className={styles.railNumber}>01</span>
      </div>

      {/* Main content */}
      <div className={styles.main}>
        {/* Copy */}
        <div className={styles.copy}>
          <p className={`${styles.eyebrow} animate-fade-up`}>
            New Season Drop — 2026
          </p>
          <h1 className={`${styles.headline} serif animate-fade-up delay-1`}>
            <span className={styles.headlineTop}>Wear What</span>
            <span className={styles.headlineMid}>You&rsquo;re</span>
            <span className={styles.headlineBottom}>Made Of.</span>
          </h1>
          <p className={`${styles.lede} animate-fade-up delay-2`}>
            Premium activewear and Afrocentric fashion designed for those
            who refuse to compromise between form and function.
          </p>
          <div className={`${styles.cta} animate-fade-up delay-3`}>
            <a href="#activewear" className="btn btn-solid" id="hero-shop-now">
              Shop the Collection
            </a>
            <a href="#asa" className="btn btn-ghost" id="hero-asa-link">
              <span className="serif italic">Discover Àṣà</span>
            </a>
          </div>

          {/* Stats row */}
          <div className={`${styles.stats} animate-fade-up delay-4`}>
            <div className={styles.stat}>
              <span className={`${styles.statNum} serif`}>7+</span>
              <span className={styles.statLabel}>Collections</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={`${styles.statNum} serif`}>2</span>
              <span className={styles.statLabel}>Brands</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={`${styles.statNum} serif`}>100%</span>
              <span className={styles.statLabel}>Premium</span>
            </div>
          </div>
        </div>

        {/* Hero image */}
        <div className={`${styles.imageWrap} animate-scale-in delay-1`}>
          <div className={styles.imageInner}>
            <Image
              src="/images/dofit-wears/2-Piece Biker Short Set.png"
              alt="Dofit Wears 2-Piece Biker Short Set"
              fill
              className={styles.img}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Floating price tag */}
            <div className={styles.priceTag}>
              <span className={styles.priceTagItem}>2-Piece Biker Short Set</span>
              <span className={`${styles.priceTagPrice} serif`}>₦45,000</span>
              <a href="#" className={styles.priceTagCta} id="hero-product-cta">Shop Now →</a>
            </div>
            {/* Floating badge */}
            <div className={styles.newBadge}>
              <span className="serif italic">New</span>
              <span>Drop</span>
            </div>
          </div>

          {/* Secondary image */}
          <div className={styles.secondImage}>
            <Image
              src="/images/dofit-wears/Trim Tank Top.png"
              alt="Trim Tank Top"
              fill
              className={styles.img}
              sizes="180px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
