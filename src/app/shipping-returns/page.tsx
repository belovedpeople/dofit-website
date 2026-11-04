import Link from 'next/link';
import DofitNavbar from '@/components/dofit/DofitNavbar';
import DofitFooter from '@/components/dofit/DofitFooter';
import styles from '../policies.module.css';

export const metadata = {
  title: 'Shipping & Returns Policy | Dofit Wears & Àṣà by Dofit',
  description: 'Fast Lagos same-day dispatch, nationwide Nigerian delivery, DHL international express, and our hassle-free 7-day size exchange guarantee.',
};

export default function ShippingReturnsPage() {
  return (
    <div className={styles.page}>
      <DofitNavbar />

      <main className={styles.main}>
        <div className="wrap">
          {/* Header */}
          <div className={styles.headerWrap}>
            <span className={styles.eyebrow}>LOGISTICS &amp; GUARANTEE</span>
            <h1 className={`${styles.title} display`}>SHIPPING &amp; RETURNS</h1>
            <p className={styles.lastUpdated}>Fast Dispatch Across Nigeria &amp; Worldwide · 7-Day Size Exchange Guarantee</p>
          </div>

          {/* Main Card */}
          <div className={styles.contentCard}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>⚡ 1. Delivery Rates &amp; Timelines</h2>
              <p className={styles.paragraph}>
                We maintain active fulfillment hubs in Lagos to ensure rapid, dependable door-to-door dispatch. Every package is carefully inspected, packed in branded matte presentation boxes, and tracked until it safely reaches your hands.
              </p>

              <div className={styles.tableWrap}>
                <table className={styles.policyTable}>
                  <thead>
                    <tr>
                      <th>Zone</th>
                      <th>Delivery Fee</th>
                      <th>Estimated Time</th>
                      <th>Courier Network</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Lagos (Island &amp; Mainland)</strong>
                      </td>
                      <td>
                        <strong>₦2,500</strong> flat rate
                        <div style={{ fontSize: '11.5px', color: '#34d399', marginTop: '3px' }}>
                          ✓ FREE for orders above ₦50,000
                        </div>
                      </td>
                      <td>Same Day / Within 24 Hours</td>
                      <td>Direct Motorcycle Dispatch</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Interstate (Major Hubs)</strong>
                        <div style={{ fontSize: '11px', opacity: 0.6 }}>Abuja, Port Harcourt, Ibadan, Asaba, Benin, etc.</div>
                      </td>
                      <td>
                        <strong>₦5,000</strong> flat rate
                      </td>
                      <td>2 – 3 Business Days</td>
                      <td>Verified Freight Logistics (GIGL / Speedaf)</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Interstate (Outlying Areas)</strong>
                      </td>
                      <td>
                        <strong>₦6,500</strong> flat rate
                      </td>
                      <td>3 – 5 Business Days</td>
                      <td>Tracked Interstate Express</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>International (UK, US, Canada, EU, Ghana)</strong>
                      </td>
                      <td>Quoted on inquiry based on weight</td>
                      <td>3 – 7 Business Days</td>
                      <td>DHL Express / FedEx Priority</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>📦 2. Order Tracking &amp; Live Status</h2>
              <p className={styles.paragraph}>
                As soon as your order is confirmed, you receive an automated Order Reference code (e.g. <strong>#ORD-9842</strong>) via WhatsApp. You can check the real-time fulfillment status of your package at any time on our dedicated tracking page:
              </p>
              <div style={{ marginTop: '8px' }}>
                <Link href="/track" className="btn btn-pink" style={{ width: 'fit-content', padding: '10px 22px' }}>
                  🔍 Track Your Order Now →
                </Link>
              </div>
            </div>

            <div className={styles.highlightBox}>
              <span className={styles.highlightTitle}>🔄 3. Free 7-Day Size Exchange Guarantee</span>
              <p className={styles.paragraph} style={{ fontSize: '13.5px', margin: 0 }}>
                We want you to look and feel extraordinary in your Dofit sets and Àṣà pieces. If the fit isn&apos;t 100% perfect, we offer <strong>free size exchanges within 7 calendar days</strong> of receiving your delivery in Lagos and across Nigeria.
              </p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>4. Exchange &amp; Return Conditions</h2>
              <p className={styles.paragraph}>
                Because activewear and cultural bodysuits are intimate performance garments, items eligible for exchange must meet the following standard luxury hygiene criteria:
              </p>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <span className={styles.bullet}>✦</span>
                  <span><strong>Pristine Condition:</strong> Garments must be unworn, unwashed, unaltered, and completely free of perfume, makeup, deodorant, or tan marks.</span>
                </li>
                <li className={styles.listItem}>
                  <span className={styles.bullet}>✦</span>
                  <span><strong>Original Packaging:</strong> Original branded DW tags and transparent hygiene liners must remain securely attached.</span>
                </li>
                <li className={styles.listItem}>
                  <span className={styles.bullet}>✦</span>
                  <span><strong>Notification Window:</strong> The exchange request must be initiated within 7 days of verified parcel delivery.</span>
                </li>
                <li className={styles.listItem}>
                  <span className={styles.bullet}>✦</span>
                  <span><strong>Custom &amp; Sample Sale Items:</strong> One-off bespoke artisanal Àṣà pieces custom-tailored to specific body measurements and final clearance sample items are final sale.</span>
                </li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>5. How to Initiate an Exchange</h2>
              <p className={styles.paragraph}>
                Initiating an exchange is effortless via our direct WhatsApp customer care:
              </p>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <span className={styles.bullet}>1.</span>
                  <span>Send a message to our WhatsApp Concierge at <strong>+234 901 694 6854</strong> with your order number (e.g. #ORD-XXXX).</span>
                </li>
                <li className={styles.listItem}>
                  <span className={styles.bullet}>2.</span>
                  <span>State the current size and the replacement size or color you would like to swap for.</span>
                </li>
                <li className={styles.listItem}>
                  <span className={styles.bullet}>3.</span>
                  <span>Our dispatch coordinator will assign a courier pickup for Lagos orders or provide the return logistics drop-off address for interstate orders.</span>
                </li>
                <li className={styles.listItem}>
                  <span className={styles.bullet}>4.</span>
                  <span>Upon quick inspection at our Lagos warehouse, your replacement size is dispatched within 24 hours.</span>
                </li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>6. Damaged or Defective Items</h2>
              <p className={styles.paragraph}>
                Every piece undergoes a multi-point quality check before dispatch. In the rare event that an item arrives with a manufacturing defect or stitching irregularity, please notify us within 48 hours of delivery with photographic evidence. We will immediately dispatch a fresh replacement free of charge or issue a full refund to your original payment method.
              </p>
            </div>
          </div>

          {/* Quick Concierge Support */}
          <div className={styles.contactStrip}>
            <div>
              <h3 className={`${styles.contactTitle} display`}>NEED AN IMMEDIATE SIZE EXCHANGE?</h3>
              <p className={styles.contactDesc}>
                Chat with our Lagos dispatch and exchange coordinator on WhatsApp.
              </p>
            </div>
            <a
              href="https://wa.me/2349016946854?text=Hello%20Dofit,%20I%20would%20like%20to%20request%20a%20size%20exchange%20for%20my%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-pink"
            >
              💬 WhatsApp Exchange Desk →
            </a>
          </div>
        </div>
      </main>

      <DofitFooter />
    </div>
  );
}
