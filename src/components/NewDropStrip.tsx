import styles from './NewDropStrip.module.css';

export default function NewDropStrip() {
  return (
    <div className={styles.strip} id="new-drop-strip">
      <div className={`${styles.inner} wrap`}>
        <div className={styles.left}>
          <span className={styles.dot}>●</span>
          <span className={styles.label}>New Drop</span>
          <span className={styles.divider}>|</span>
          <span className={`${styles.title} serif italic`}>Àṣà by Dofit — Season 2</span>
        </div>
        <a href="#asa" className={styles.cta} id="new-drop-cta">
          Explore the Collection
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
