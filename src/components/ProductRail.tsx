'use client';
import Image from 'next/image';
import styles from './ProductRail.module.css';

const products = [
  {
    id: 'prod-biker-short',
    name: '2-Piece Biker Short Set',
    price: '₦45,000',
    image: '/images/dofit-wears/2-Piece Biker Short Set.png',
    tag: 'Best Seller',
    tagClass: 'tagBest',
  },
  {
    id: 'prod-leggings-set',
    name: '2-Piece Long-Sleeve Leggings Set',
    price: '₦52,000',
    image: '/images/dofit-wears/2-Piece Long-Sleeve Leggings Set.png',
    tag: 'New',
    tagClass: 'tagNew',
  },
  {
    id: 'prod-tracksuit',
    name: '3-Piece Tracksuit Activewear Set',
    price: '₦68,000',
    image: '/images/dofit-wears/3-Piece Tracksuit  Activewear Set.png',
    tag: 'New',
    tagClass: 'tagNew',
  },
  {
    id: 'prod-tennis-skirt',
    name: 'Long-Sleeve Tennis Skirt Set',
    price: '₦49,000',
    image: '/images/dofit-wears/Long-Sleeve Tennis Skirt Set.png',
    tag: null,
    tagClass: '',
  },
  {
    id: 'prod-baby-tee',
    name: 'Ribbed Baby Tee',
    price: '₦22,000',
    image: '/images/dofit-wears/Ribbed Baby Tee.png',
    tag: null,
    tagClass: '',
  },
  {
    id: 'prod-romper',
    name: 'Short-Sleeve Biker Romper',
    price: '₦38,000',
    image: '/images/dofit-wears/Short-Sleeve Biker Romper (Unitard).png',
    tag: 'Limited',
    tagClass: 'tagLimit',
  },
  {
    id: 'prod-tank',
    name: 'Trim Tank Top',
    price: '₦18,000',
    image: '/images/dofit-wears/Trim Tank Top.png',
    tag: null,
    tagClass: '',
  },
];

export default function ProductRail() {
  return (
    <section className={styles.section} id="activewear">
      <div className="wrap">
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>Dofit Wears</p>
            <h2 className={`${styles.title} serif`}>
              Activewear
              <br />
              <span className={`${styles.titleAlt} italic`}>Collection</span>
            </h2>
          </div>
          <div className={styles.headRight}>
            <p className={styles.desc}>
              Engineered for performance, designed for life. Every piece wraps
              your body in premium stretch fabric that moves exactly how you do.
            </p>
            <a href="#" className="btn btn-ghost" id="activewear-view-all">
              View All Styles
            </a>
          </div>
        </div>
      </div>

      {/* Full-width scrollable rail */}
      <div className={styles.railOuter}>
        <div className={styles.rail}>
          {products.map((p) => (
            <a key={p.id} href="#" className={styles.card} id={p.id}>
              <div className={styles.cardFrame}>
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className={styles.cardImg}
                  sizes="280px"
                />
                {/* Tag */}
                {p.tag && (
                  <span className={`${styles.tag} ${styles[p.tagClass as keyof typeof styles]}`}>
                    {p.tag}
                  </span>
                )}
                {/* Quick add */}
                <div className={styles.quickAdd}>
                  <span>Quick Add</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                </div>
              </div>
              <div className={styles.cardMeta}>
                <span className={styles.cardName}>{p.name}</span>
                <span className={styles.cardPrice}>{p.price}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
