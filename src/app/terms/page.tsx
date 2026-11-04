import Link from 'next/link';
import DofitNavbar from '@/components/dofit/DofitNavbar';
import DofitFooter from '@/components/dofit/DofitFooter';
import styles from '../policies.module.css';

export const metadata = {
  title: 'Terms of Service | Dofit Wears & Àṣà by Dofit',
  description: 'Terms and conditions governing purchases, drop orders, and use of Dofit Wears and Àṣà.',
};

export default function TermsPage() {
  return (
    <div className={styles.page}>
      <DofitNavbar />

      <main className={styles.main}>
        <div className="wrap">
          {/* Header */}
          <div className={styles.headerWrap}>
            <span className={styles.eyebrow}>LEGAL &amp; AGREEMENT</span>
            <h1 className={`${styles.title} display`}>TERMS OF SERVICE</h1>
            <p className={styles.lastUpdated}>Last Revised: March 2026 · Governed by the Laws of the Federal Republic of Nigeria</p>
          </div>

          {/* Main Card */}
          <div className={styles.contentCard}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>1. Agreement to Terms</h2>
              <p className={styles.paragraph}>
                These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity (&quot;you&quot;) and Dofit Wears (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), regarding your access to and purchase through the Dofit Wears platform and our cultural capsule Àṣà by Dofit. By placing an order, browsing our catalog, or interacting with our WhatsApp checkout router, you acknowledge that you have read, understood, and agreed to be bound by all of these terms.
              </p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>2. Product Authenticity &amp; Drops</h2>
              <p className={styles.paragraph}>
                All activewear sets, rompers, leggings, jackets, and cultural garments showcased on our site are authentic Dofit Wears or Àṣà creations:
              </p>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <span className={styles.bullet}>✦</span>
                  <div>
                    <strong>Dofit Wears Performance:</strong> Engineered four-way compression activewear, squat-proof knits, and moisture-wicking silhouettes manufactured to strict high-density luxury standards.
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span className={styles.bullet}>✦</span>
                  <div>
                    <strong>Àṣà by Dofit:</strong> Handcrafted cultural couture integrating authentic Adire resist-dye textiles created by master artisans in Ogun and Lagos State. Because of the artisanal resist-dye process, slight nuances in dye marbling are marks of authentic craftsmanship.
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span className={styles.bullet}>✦</span>
                  <div>
                    <strong>Limited Capsule Drops:</strong> Many of our releases are manufactured in small, numbered batches. Items in your cart are not reserved until your order is submitted and confirmed.
                  </div>
                </li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>3. Pricing &amp; Payment Currency</h2>
              <p className={styles.paragraph}>
                All prices displayed across our platform are denominated in Nigerian Naira (₦ / NGN), inclusive of standard packaging. International clients may request converted USD, GBP, or EUR invoices through our concierge service. Prices are subject to adjustment for new drops without prior notice, but orders already confirmed are guaranteed at the invoiced price.
              </p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>4. WhatsApp Direct-Order Protocol</h2>
              <p className={styles.paragraph}>
                To provide high-touch personal service, our checkout routes your bag directly to our WhatsApp operations team (+234 901 694 6854):
              </p>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <span className={styles.bullet}>✦</span>
                  <span>An automated pre-formatted order summary is generated with your exact sizes, colors, and order reference.</span>
                </li>
                <li className={styles.listItem}>
                  <span className={styles.bullet}>✦</span>
                  <span>Our dispatch coordinator confirms stock availability in real-time and provides official corporate account payment instructions.</span>
                </li>
                <li className={styles.listItem}>
                  <span className={styles.bullet}>✦</span>
                  <span>Orders are booked for dispatch immediately upon receipt of proof of payment. Unpaid holds lapse after 4 hours for high-demand drops.</span>
                </li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>5. Vouchers, Promos &amp; Discount Codes</h2>
              <p className={styles.paragraph}>
                Promotional vouchers, influencer codes, and VIP drop discounts are managed directly by Dofit administration. Vouchers are subject to validity limits, minimum spend requirements, and expiration dates. Vouchers cannot be exchanged for cash and are non-transferable unless explicitly stated.
              </p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>6. Intellectual Property &amp; Trademarks</h2>
              <p className={styles.paragraph}>
                The logos, custom typography, brand motifs, photographic editorials, product designs, video lookbooks, and proprietary Adire patterns are the exclusive intellectual property of Dofit Wears and beloved creative partners. Unauthorized reproduction, counterfeiting, or commercial repurposing is strictly prohibited and subject to legal enforcement under Nigerian copyright and trademark legislation.
              </p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>7. Governing Law &amp; Jurisdiction</h2>
              <p className={styles.paragraph}>
                These Terms and your use of our storefront are governed by and construed in accordance with the substantive laws of Lagos State and the Federal Republic of Nigeria. Any dispute arising out of or related to these Terms will be settled amicably via our customer resolution team or within the courts of competent jurisdiction in Lagos, Nigeria.
              </p>
            </div>
          </div>

          {/* Quick Concierge Support */}
          <div className={styles.contactStrip}>
            <div>
              <h3 className={`${styles.contactTitle} display`}>NEED CLARIFICATION ON OUR TERMS?</h3>
              <p className={styles.contactDesc}>
                Our customer operations desk is available 24/7 on WhatsApp.
              </p>
            </div>
            <a
              href="https://wa.me/2349016946854?text=Hello%20Dofit,%20I%20have%20an%20inquiry%20regarding%20your%20terms%20of%20service."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-pink"
            >
              💬 Inquire on WhatsApp →
            </a>
          </div>
        </div>
      </main>

      <DofitFooter />
    </div>
  );
}
