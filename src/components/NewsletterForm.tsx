'use client';
import { useState } from 'react';
import styles from './NewsletterForm.module.css';

interface NewsletterFormProps {
  darkTheme?: boolean;
  source?: string;
  placeholder?: string;
}

export default function NewsletterForm({
  darkTheme,
  source = 'Stay Plugged In',
  placeholder = 'your@email.com',
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setMessage(data.message || "You're in! 🎉 First to know about new drops.");
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <div>
      <form
        className={`${styles.form} ${darkTheme ? styles.dark : ''}`}
        onSubmit={handleSubmit}
        id="newsletter-form"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className={styles.input}
          id="newsletter-email"
          required
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          className={`${styles.btn} ${darkTheme ? styles.btnDark : ''}`}
          id="newsletter-submit"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Joining...' : 'Join →'}
        </button>
      </form>

      {status !== 'idle' && message && (
        <div
          className={`${styles.feedback} ${
            status === 'success' ? styles.successMsg : styles.errorMsg
          }`}
          role="status"
        >
          {message}
        </div>
      )}
    </div>
  );
}
