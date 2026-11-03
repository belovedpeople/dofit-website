'use client';
import Image from 'next/image';
import Link from 'next/link';
import { products as allProducts } from '@/data/products';
import { useCart } from '@/context/CartContext';
import {
  AdireElekoPattern,
  AdireTeethDivider,
} from './patterns/YorubaPatterns';
import styles from './AsaProducts.module.css';

const asaProducts = allProducts.filter((p) => p.brand === 'asa');

export default function AsaProducts() {
  const { addToCart } = useCart();

  return (
    <section className={styles.section} id="asa-products">
      {/* Background Adire Eleko texture */}
      <AdireElekoPattern opacity={0.06} color="#E8A020" />

      {/* Top Eyin Aja zigzag divider */}
      <AdireTeethDivider color="#E8A020" />

      <div className="wrap">
        <div className={styles.header}>
          <h2 className={`${styles.title} asa-display`}>
            Shop
            <br />
            <span className={styles.titleGold}>Àṣà</span>
          </h2>
          <p className={`${styles.desc} asa-body`}>
            Every drop is a numbered cultural statement. Infused with authentic Adire resist-dyeing,
            adorned with engraved brass accents, and tailored for those bold enough to carry their heritage forward.
          </p>
        </div>

        <div className={styles.grid}>
          {asaProducts.map((p, i) => (
            <div
              key={p.id}
              className={`${styles.card} ${i === 0 ? styles.cardFeat : ''} reveal-scale`}
              id={p.id}
              style={{ transitionDelay: `${(i % 3) * 0.1}s` }}
            >
              <Link href={`/products/${p.slug}`} className={styles.cardImgLink}>
                <div className={styles.cardImg}>
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    className={styles.img}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className={styles.cardOverlay} />
                </div>
              </Link>

              <div className={styles.cardInfo}>
                <Link href={`/products/${p.slug}`}>
                  <span className={`${styles.cardName} asa-display`}>{p.name}</span>
                </Link>
                <div className={styles.cardPriceRow}>
                  <span className={`${styles.cardPrice} asa-body`}>{p.formattedPrice}</span>
                  <button
                    type="button"
                    className={styles.asaQuickAdd}
                    onClick={() => addToCart(p, 'M')}
                    aria-label={`Quick Add ${p.name}`}
                  >
                    + Add to Bag
                  </button>
                </div>
              </div>
              <div className={styles.hoverLine} />
            </div>
          ))}
        </div>

        <div className={styles.cta}>
          <Link href="/shop?brand=asa" className="btn btn-asa-gold" id="asa-shop-all">
            View All Capsule Pieces
          </Link>
          <p className={`${styles.ctaNote} asa-body`}>Limited artisan drops. Once exhausted, they are permanently archived.</p>
        </div>
      </div>

      {/* Bottom Eyin Aja zigzag divider */}
      <AdireTeethDivider color="#E8A020" />
    </section>
  );
}
