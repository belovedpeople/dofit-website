import Link from 'next/link';
import DofitNavbar from '@/components/dofit/DofitNavbar';
import DofitFooter from '@/components/dofit/DofitFooter';
import styles from '../policies.module.css';

export const metadata = {
  title: 'Cookie Policy | Dofit Wears & Àṣà by Dofit',
  description: 'Learn how Dofit Wears uses cookies, session caches, and local storage to provide a fast, personalized experience.',
};

export default function CookiesPage() {
  return (
    <div className={styles.page}>
      <DofitNavbar />

      <main className={styles.main}>
        <div className="wrap">
          {/* Header */}
          <div className={styles.headerWrap}>
            <span className={styles.eyebrow}>TRANSPARENCY &amp; STORAGE</span>
            <h1 className={`${styles.title} display`}>COOKIE &amp; STORAGE POLICY</h1>
            <p className={styles.lastUpdated}>Effective Date: March 2026 · Global Web Standards</p>
          </div>

          {/* Main Card */}
          <div className={styles.contentCard}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>1. What Are Cookies &amp; Local Storage?</h2>
              <p className={styles.paragraph}>
                Cookies and browser local storage are small text files or key-value entries placed on your device (computer, tablet, or smartphone) when you navigate websites. They allow our website to remember your actions, preferences, shopping bag items, and session states over a period of time, so you do not have to re-enter them whenever you come back or browse between pages.
              </p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>2. Categories of Storage We Use</h2>
              <div className={styles.tableWrap}>
                <table className={styles.policyTable}>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Purpose</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Essential Shopping Bag</strong>
                      </td>
                      <td>
                        Remembers the activewear sets, sizes, and colors added to your cart so you never lose your selected items while browsing drops.
                      </td>
                      <td>Persistent (Local Storage)</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Admin &amp; Security Gate</strong>
                      </td>
                      <td>
                        Maintains encrypted administrative session tokens for authorized store managers handling order dispatch and stock updates.
                      </td>
                      <td>Session / 24 Hours</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Progressive Web App (PWA) Cache</strong>
                      </td>
                      <td>
                        Caches high-resolution product photography and brand assets via our Service Worker so the store loads lightning-fast even on low-bandwidth mobile connections.
                      </td>
                      <td>Until App Update</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>VIP Preferences &amp; Vouchers</strong>
                      </td>
                      <td>
                        Stores applied voucher codes and audio player preferences for the ambient Àṣà soundscape.
                      </td>
                      <td>Persistent</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>3. Third-Party Analytics &amp; Media</h2>
              <p className={styles.paragraph}>
                We host high-definition video lookbooks and editorial imagery on Cloudinary CDN to deliver optimal streaming speeds in Lagos, Abuja, Port Harcourt, and worldwide. Cloudinary may utilize transient edge caches to optimize media delivery for your device&apos;s screen resolution.
              </p>
            </div>

            <div className={styles.highlightBox}>
              <span className={styles.highlightTitle}>🚫 Zero Cross-Site Ad Tracking</span>
              <p className={styles.paragraph} style={{ fontSize: '13.5px', margin: 0 }}>
                We believe in customer privacy. Dofit does not sell your browsing history, run third-party invasive behavioral trackers, or inject ad-broker cookies that follow you across the internet.
              </p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>4. Managing &amp; Clearing Your Storage</h2>
              <p className={styles.paragraph}>
                You can manage, restrict, or clear cookies and local storage at any time through your browser settings (Chrome, Safari, Firefox, or Edge). Note that clearing your storage will empty your current shopping bag and reset applied discount vouchers.
              </p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>5. Contact Us</h2>
              <p className={styles.paragraph}>
                For any questions regarding our storage practices, reach out to our digital team at <strong>tech@dofit.fit</strong> or chat with our WhatsApp support line at <strong>+234 901 694 6854</strong>.
              </p>
            </div>
          </div>

          {/* Quick Concierge Support */}
          <div className={styles.contactStrip}>
            <div>
              <h3 className={`${styles.contactTitle} display`}>QUESTIONS ABOUT SITE PREFERENCES?</h3>
              <p className={styles.contactDesc}>
                Chat with our technical and customer support team on WhatsApp.
              </p>
            </div>
            <a
              href="https://wa.me/2349016946854?text=Hello%20Dofit,%20I%20have%20a%20question%20regarding%20website%20cookies%20and%20preferences."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-pink"
            >
              💬 Chat on WhatsApp →
            </a>
          </div>
        </div>
      </main>

      <DofitFooter />
    </div>
  );
}
