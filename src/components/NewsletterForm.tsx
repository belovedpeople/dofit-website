'use client';
import styles from './NewsletterForm.module.css';

interface NewsletterFormProps {
  darkTheme?: boolean;
}

export default function NewsletterForm({ darkTheme }: NewsletterFormProps) {
  return (
    <form
      className={`${styles.form} ${darkTheme ? styles.dark : ''}`}
      onSubmit={(e) => {
        e.preventDefault();
        const input = e.currentTarget.querySelector('input') as HTMLInputElement;
        if (input && input.value) {
          input.value = '';
          alert('You\'re in! 🎉 First to know about new drops.');
        }
      }}
      id="newsletter-form"
    >
      <input
        type="email"
        placeholder="your@email.com"
        className={styles.input}
        id="newsletter-email"
        required
      />
      <button type="submit" className={`${styles.btn} ${darkTheme ? styles.btnDark : ''}`} id="newsletter-submit">
        Join →
      </button>
    </form>
  );
}
