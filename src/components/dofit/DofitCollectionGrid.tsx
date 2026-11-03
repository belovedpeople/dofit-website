'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLiveProducts } from '@/hooks/useLiveProducts';
import styles from './DofitCollectionGrid.module.css';

export default function DofitCollectionGrid() {
  const { addToCart } = useCart();
  const { products: allProducts } = useLiveProducts();
  const dofitProducts = allProducts.filter((p) => p.brand === 'dofit');

  return (
    <section className={styles.section} id="activewear">
      <div className="wrap">
        {/* Section header */}
        <div className={`${styles.header} reveal`}>
          <div className={styles.headerLeft}>
            <span className={styles.label}>Dofit Wears</span>
            <h2 className={`${styles.title} display`}>
              THE<br />
              <span className={styles.titlePink}>COLLECTION</span>
            </h2>
          </div>
          <div className={styles.headerRight}>
            <p className={styles.desc}>
              Seven premium pieces. One brand. Built for the body that shows up, works hard, and still looks incredible doing it.
            </p>
            <Link href="/shop?brand=dofit" className="btn btn-outline" id="collection-view-all">
              View All Pieces
            </Link>
          </div>
        </div>

        {/* Grid */}
        <div className={styles.grid} id="collections">
          {/* Large card */}
          {dofitProducts[0] && (
            <div className={`${styles.card} ${styles.cardLarge} reveal-scale`} id={dofitProducts[0].id}>
              <Link href={`/products/${dofitProducts[0].slug}`} className={styles.cardImg}>
                <Image
                  src={dofitProducts[0].images[0]}
                  alt={dofitProducts[0].name}
                  fill
                  className={styles.img}
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
              </Link>
              <div className={styles.cardOverlay} />
              {dofitProducts[0].tag && (
                <span className={`${styles.tag} ${styles.tagBest}`}>{dofitProducts[0].tag}</span>
              )}
              <div className={styles.cardInfo}>
                <Link href={`/products/${dofitProducts[0].slug}`}>
                  <span className={`${styles.cardName} display`}>{dofitProducts[0].name}</span>
                </Link>
                <span className={styles.cardPrice}>{dofitProducts[0].formattedPrice}</span>
              </div>
              <button
                type="button"
                className={styles.hoverCta}
                onClick={() => addToCart(dofitProducts[0], 'M')}
                aria-label={`Quick add ${dofitProducts[0].name}`}
              >
                <span>Quick Add</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* Right column */}
          <div className={styles.colRight}>
            {dofitProducts.slice(1, 5).map((p, i) => (
              <div
                key={p.id}
                className={`${styles.card} ${styles.cardSmall} reveal`}
                id={p.id}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <Link href={`/products/${p.slug}`} className={styles.cardImg}>
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    className={styles.img}
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </Link>
                <div className={styles.cardOverlay} />
                {p.tag && (
                  <span
                    className={`${styles.tag} ${
                      p.tag === 'New Drop' || p.tag === 'New' ? styles.tagNew : styles.tagLimit
                    }`}
                  >
                    {p.tag}
                  </span>
                )}
                <div className={styles.cardInfo}>
                  <Link href={`/products/${p.slug}`}>
                    <span className={`${styles.cardName} ${styles.cardNameSm} display`}>
                      {p.name}
                    </span>
                  </Link>
                  <span className={styles.cardPrice}>{p.formattedPrice}</span>
                </div>
                <button
                  type="button"
                  className={styles.hoverCtaSmall}
                  onClick={() => addToCart(p, 'M')}
                  aria-label={`Quick add ${p.name}`}
                >
                  + Add
                </button>
              </div>
            ))}
          </div>

          {/* Bottom row — remaining 2 */}
          {dofitProducts.slice(5).map((p) => (
            <div key={p.id} className={`${styles.card} ${styles.cardBottom} reveal`} id={p.id}>
              <Link href={`/products/${p.slug}`} className={styles.cardImg}>
                <Image
                  src={p.images[0]}
                  alt={p.name}
                  fill
                  className={styles.img}
                  sizes="(max-width: 768px) 50vw, 30vw"
                />
              </Link>
              <div className={styles.cardOverlay} />
              <div className={styles.cardInfo}>
                <Link href={`/products/${p.slug}`}>
                  <span className={`${styles.cardName} display`}>{p.name}</span>
                </Link>
                <span className={styles.cardPrice}>{p.formattedPrice}</span>
              </div>
              <button
                type="button"
                className={styles.hoverCtaSmall}
                onClick={() => addToCart(p, 'M')}
                aria-label={`Quick add ${p.name}`}
              >
                + Add
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
