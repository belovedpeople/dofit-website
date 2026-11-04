import styles from './DofitMarquee.module.css';

const items1 = ['Premium Activewear', '✦', 'Dofit Wears', '✦', 'New Drop 2026', '✦', 'Built to Perform', '✦', 'Made to Be Seen', '✦', 'Shop Now', '✦', 'Premium Activewear', '✦', 'Dofit Wears', '✦', 'New Drop 2026', '✦', 'Built to Perform', '✦', 'Made to Be Seen', '✦', 'Shop Now', '✦'];
const items2 = ['Fast Nationwide Dispatch', '★', 'Body Inclusive', '★', 'Made in Lagos', '★', 'Performance Fabric', '★', 'Àṣà by Dofit', '★', 'New Collection', '★', 'Fast Nationwide Dispatch', '★', 'Body Inclusive', '★', 'Made in Lagos', '★', 'Performance Fabric', '★', 'Àṣà by Dofit', '★', 'New Collection', '★'];

export default function DofitMarquee() {
  return (
    <div className={styles.wrapper}>
      {/* Strip 1 — Left to right */}
      <div className={styles.strip}>
        <div className={styles.track1}>
          {items1.map((item, i) => (
            <span key={i} className={`${styles.item} ${item === '✦' ? styles.divider : ''}`}>{item}</span>
          ))}
        </div>
      </div>

      {/* Strip 2 — Right to left (reverse) */}
      <div className={`${styles.strip} ${styles.stripDark}`}>
        <div className={styles.track2}>
          {items2.map((item, i) => (
            <span key={i} className={`${styles.item} ${item === '★' ? styles.dividerPink : ''}`}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
