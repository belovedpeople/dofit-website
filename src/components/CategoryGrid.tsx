import Image from 'next/image';
import styles from './CategoryGrid.module.css';

const categories = [
  {
    id: 'cat-activewear',
    label: 'Activewear',
    sub: '7 styles',
    image: '/images/dofit-wears/2-Piece Long-Sleeve Leggings Set.png',
    alt: '2-Piece Long-Sleeve Leggings Set',
    tall: true,
    href: '#activewear',
  },
  {
    id: 'cat-asa',
    label: 'Àṣà by Dofit',
    sub: 'New collection',
    image: '/images/asa/image3.png',
    alt: 'Àṣà by Dofit editorial',
    tall: false,
    href: '#asa',
    isAsa: true,
  },
  {
    id: 'cat-sets',
    label: 'Sets & Co-ords',
    sub: 'Mix & match',
    image: '/images/dofit-wears/3-Piece Tracksuit  Activewear Set.png',
    alt: '3-Piece Tracksuit Activewear Set',
    tall: false,
    href: '#activewear',
  },
];

export default function CategoryGrid() {
  return (
    <section className={styles.section} id="categories">
      <div className="wrap">
        <div className={styles.head}>
          <div>
            <p className={`${styles.eyebrow}`}>Browse by Category</p>
            <h2 className={`${styles.title} serif`}>Shop the Edit</h2>
          </div>
          <p className={styles.desc}>
            Two worlds. One brand. Premium activewear meets bold Afrocentric streetwear
            — find your perfect fit in every collection.
          </p>
        </div>

        <div className={styles.grid}>
          {/* Large left tile */}
          <a href={categories[0].href} className={`${styles.tile} ${styles.tileLarge}`} id={categories[0].id}>
            <Image
              src={categories[0].image}
              alt={categories[0].alt}
              fill
              className={styles.tileImg}
              sizes="(max-width: 768px) 100vw, 55vw"
            />
            <div className={styles.tileOverlay} />
            <div className={styles.tileLabel}>
              <span className={`${styles.tileName} serif`}>{categories[0].label}</span>
              <span className={styles.tileSub}>{categories[0].sub}</span>
            </div>
          </a>

          {/* Right column */}
          <div className={styles.col}>
            {categories.slice(1).map((cat) => (
              <a key={cat.id} href={cat.href} className={`${styles.tile} ${cat.isAsa ? styles.tileAsa : ''}`} id={cat.id}>
                <Image
                  src={cat.image}
                  alt={cat.alt}
                  fill
                  className={styles.tileImg}
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <div className={styles.tileOverlay} />
                <div className={styles.tileLabel}>
                  <span className={`${styles.tileName} serif ${cat.isAsa ? 'italic' : ''}`}>{cat.label}</span>
                  <span className={styles.tileSub}>{cat.sub}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
