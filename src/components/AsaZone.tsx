import Image from 'next/image';
import styles from './AsaZone.module.css';

const asaProducts = [
  {
    id: 'asa-prod-1',
    name: 'Àṣà Tie-Dye Cargo Set',
    price: '₦85,000',
    image: '/images/asa/image1.png',
    tag: 'New Drop',
  },
  {
    id: 'asa-prod-2',
    name: 'Indigo Shibori Co-ord',
    price: '₦72,000',
    image: '/images/asa/image2.png',
    tag: null,
  },
  {
    id: 'asa-prod-3',
    name: 'Àṣà Unisex Statement Set',
    price: '₦95,000',
    image: '/images/asa/image3.png',
    tag: 'Best Seller',
  },
];

export default function AsaZone() {
  return (
    <section className={styles.zone} id="asa">
      {/* Decorative top bar */}
      <div className={styles.topBar} />

      {/* Intro */}
      <div className={`${styles.intro} wrap`}>
        <div className={styles.introCopy}>
          <p className={`${styles.eyebrow} serif italic`}>A sub-brand of Dofit Wears</p>
          <h2 className={`${styles.headline} serif`}>
            Àṣà
            <br />
            <span className={`${styles.headlineSub} italic`}>by Dofit</span>
          </h2>
          <p className={styles.lede}>
            Where African artistry meets modern streetwear. Àṣà (meaning &ldquo;culture&rdquo; in Yoruba) is a bold
            statement — hand-crafted tie-dye patterns, premium fabrications, and silhouettes
            that demand attention on every street they walk.
          </p>
          <div className={styles.introDivider}>
            <div className={styles.dividerRule} />
            <span className={`${styles.dividerText} serif italic`}>Made with pride</span>
            <div className={styles.dividerRule} />
          </div>
          <a href="#" className="btn btn-bronze" id="asa-shop-btn">
            Shop Àṣà Collection
          </a>
        </div>

        <div className={styles.introImage}>
          <div className={styles.introFrame}>
            <Image
              src="/images/asa/image4.png"
              alt="Àṣà by Dofit editorial"
              fill
              className={styles.introImg}
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          </div>
          {/* Floating quote */}
          <div className={styles.floatQuote}>
            <span className={`${styles.floatQuoteText} serif italic`}>
              &ldquo;Culture is the
              <br />fashion of the soul.&rdquo;
            </span>
          </div>
        </div>
      </div>

      {/* Products grid */}
      <div className={`${styles.products} wrap`}>
        <p className={`${styles.prodLabel} serif italic`}>— Latest Drops</p>
        <div className={styles.grid}>
          {asaProducts.map((p) => (
            <a key={p.id} href="#" className={styles.card} id={p.id}>
              <div className={styles.cardFrame}>
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className={styles.cardImg}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {p.tag && <span className={styles.cardTag}>{p.tag}</span>}
                <div className={styles.cardHover}>
                  <span>View Product</span>
                </div>
              </div>
              <div className={styles.cardMeta}>
                <span className={`${styles.cardName} serif`}>{p.name}</span>
                <span className={styles.cardPrice}>{p.price}</span>
              </div>
            </a>
          ))}
        </div>

        {/* View more row */}
        <div className={styles.viewMore}>
          <a href="#" className="btn btn-outline-gilt" id="asa-view-all">
            View Full Àṣà Collection
          </a>
          <div className={styles.viewMoreImages}>
            {[5, 6, 7].map((n) => (
              <div key={n} className={styles.thumbCircle}>
                <Image
                  src={`/images/asa/image${n}.png`}
                  alt={`Àṣà look ${n}`}
                  fill
                  className={styles.thumbImg}
                  sizes="56px"
                />
              </div>
            ))}
            <span className={styles.viewMoreCount}>+6 more</span>
          </div>
        </div>
      </div>
    </section>
  );
}
