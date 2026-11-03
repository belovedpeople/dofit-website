import styles from './AnnouncementStrip.module.css';

const messages = [
  'Free shipping on orders over ₦50,000',
  '✦',
  'New Àṣà Drop — Now Live',
  '✦',
  'Premium activewear — built to perform, made to be seen',
  '✦',
  'Shop the 2-Piece Biker Short Set',
  '✦',
  'Free returns within 14 days',
  '✦',
  'Follow us @dofitofficial',
  '✦',
  'New Àṣà Drop — Now Live',
  '✦',
  'Free shipping on orders over ₦50,000',
  '✦',
  'Premium activewear — built to perform, made to be seen',
  '✦',
  'Shop the 2-Piece Biker Short Set',
  '✦',
  'Free returns within 14 days',
  '✦',
  'Follow us @dofitofficial',
  '✦',
];

export default function AnnouncementStrip() {
  return (
    <div className={styles.strip} id="announcement-strip">
      <div className={styles.track}>
        {messages.map((msg, i) => (
          <span key={i} className={styles.item}>{msg}</span>
        ))}
      </div>
    </div>
  );
}
