import Link from 'next/link';
import DofitNavbar from '@/components/dofit/DofitNavbar';
import DofitFooter from '@/components/dofit/DofitFooter';
import styles from '../policies.module.css';

export const metadata = {
  title: 'Privacy Policy | Dofit Wears & Àṣà by Dofit',
  description: 'How Dofit Wears and Àṣà collect, safeguard, and respect your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <DofitNavbar />

      <main className={styles.main}>
        <div className="wrap">
          {/* Header */}
          <div className={styles.headerWrap}>
            <span className={styles.eyebrow}>LEGAL &amp; COMPLIANCE</span>
            <h1 className={`${styles.title} display`}>PRIVACY POLICY</h1>
            <p className={styles.lastUpdated}>Effective Date: March 2026 · Nigeria Data Protection Regulation (NDPR) Compliant</p>
          </div>

          {/* Main Card */}
          <div className={styles.contentCard}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>1. Introduction &amp; Scope</h2>
              <p className={styles.paragraph}>
                At Dofit Wears (&quot;Dofit&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), including our cultural capsule brand Àṣà by Dofit, we are deeply committed to safeguarding the privacy and digital sovereignty of our customers. This Privacy Policy outlines how your personal information is gathered, utilized, stored, and protected across our website (dofit-website.vercel.app), our WhatsApp concierge ordering channels, and any related physical pop-ups or private fittings in Lagos, Nigeria.
              </p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>2. Information We Collect</h2>
              <p className={styles.paragraph}>
                We collect personal information solely to provide a seamless, bespoke activewear shopping experience and fulfillment pipeline:
              </p>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <span className={styles.bullet}>✦</span>
                  <div>
                    <strong>Order &amp; Contact Details:</strong> Full name, WhatsApp phone number, email address, delivery street address, city, and state when placing orders or requesting order tracking.
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span className={styles.bullet}>✦</span>
                  <div>
                    <strong>VIP Newsletter Subscription:</strong> Your email address when subscribing to &quot;Stay Plugged In&quot; or drop alerts.
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span className={styles.bullet}>✦</span>
                  <div>
                    <strong>Fitting &amp; Sizing Data:</strong> Size selections (XS to XL), fit preferences, and garment customization notes submitted via our WhatsApp concierge or size guide inquiries.
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span className={styles.bullet}>✦</span>
                  <div>
                    <strong>Device &amp; Session Data:</strong> Browser type, anonymous analytics, IP address, and items stored in your local shopping bag cache.
                  </div>
                </li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>3. How We Use Your Information</h2>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <span className={styles.bullet}>✦</span>
                  <span>Processing, routing, and dispatching orders via verified motorcycle dispatch (Lagos) and interstate haulage logistics.</span>
                </li>
                <li className={styles.listItem}>
                  <span className={styles.bullet}>✦</span>
                  <span>Sending instantaneous WhatsApp order confirmations, tracking references (e.g. #ORD-XXXX), and dispatch notifications.</span>
                </li>
                <li className={styles.listItem}>
                  <span className={styles.bullet}>✦</span>
                  <span>Delivering VIP drop notifications, secret promo vouchers, and lookbooks (only for opted-in subscribers).</span>
                </li>
                <li className={styles.listItem}>
                  <span className={styles.bullet}>✦</span>
                  <span>Fraud prevention and verification of high-value manual bank transfers.</span>
                </li>
              </ul>
            </div>

            <div className={styles.highlightBox}>
              <span className={styles.highlightTitle}>🔒 Financial Security &amp; Card Data Protection</span>
              <p className={styles.paragraph} style={{ fontSize: '13.5px', margin: 0 }}>
                We do NOT store or log your credit/debit card numbers or bank account PINs on our servers. All transactions are securely routed directly through certified payment gateways or confirmed via official corporate bank transfer receipts with human verification.
              </p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>4. WhatsApp Communications</h2>
              <p className={styles.paragraph}>
                When you initiate checkout or chat with our team, your conversation is encrypted end-to-end according to WhatsApp&apos;s protocols. We never share your phone number with external telemarketers, third-party advertisers, or unsolicited spam networks.
              </p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>5. Your Rights Under NDPR</h2>
              <p className={styles.paragraph}>
                In accordance with the Nigeria Data Protection Act and international privacy principles, you have the right to:
              </p>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <span className={styles.bullet}>✦</span>
                  <span>Request a copy of the personal information we hold on file for your customer profile.</span>
                </li>
                <li className={styles.listItem}>
                  <span className={styles.bullet}>✦</span>
                  <span>Request prompt rectification of outdated phone numbers or delivery addresses.</span>
                </li>
                <li className={styles.listItem}>
                  <span className={styles.bullet}>✦</span>
                  <span>Unsubscribe from marketing emails or drop notifications at any time with a single click or reply.</span>
                </li>
                <li className={styles.listItem}>
                  <span className={styles.bullet}>✦</span>
                  <span>Request the deletion of your customer record once outstanding deliveries are successfully fulfilled.</span>
                </li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>6. Contact Data Protection Officer</h2>
              <p className={styles.paragraph}>
                If you have questions regarding this Privacy Policy or wish to exercise any of your data rights, please contact our team via WhatsApp at <strong>+234 901 694 6854</strong> or email <strong>privacy@dofit.fit</strong>.
              </p>
            </div>
          </div>

          {/* Quick Concierge Support */}
          <div className={styles.contactStrip}>
            <div>
              <h3 className={`${styles.contactTitle} display`}>HAVE QUESTIONS ABOUT YOUR DATA?</h3>
              <p className={styles.contactDesc}>
                Speak directly with the Dofit Executive Concierge on WhatsApp.
              </p>
            </div>
            <a
              href="https://wa.me/2349016946854?text=Hello%20Dofit,%20I%20have%20an%20inquiry%20regarding%20my%20privacy%20and%20data."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-pink"
            >
              💬 WhatsApp Concierge →
            </a>
          </div>
        </div>
      </main>

      <DofitFooter />
    </div>
  );
}
