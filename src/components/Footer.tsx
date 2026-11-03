import Image from 'next/image';
import styles from './Footer.module.css';
import NewsletterForm from './NewsletterForm';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.top} wrap`}>
        {/* Brand column */}
        <div className={styles.brand}>
          <div className={styles.logoMark}>
            <Image src="/images/logo.png" alt="Dofit Wears" width={40} height={40} className={styles.logoImg} />
            <div>
              <span className={`${styles.logoName} serif`}>Dofit Wears</span>
              <span className={styles.logoDomain}>dofit.fit</span>
            </div>
          </div>
          <p className={styles.tagline}>
            Premium activewear and Afrocentric fashion for those who
            refuse to be ordinary.
          </p>
          {/* Social icons */}
          <div className={styles.socials}>
            {[
              { label: 'Instagram', href: '#', icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              )},
              { label: 'TikTok', href: '#', icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.29 8.29 0 0 0 4.83 1.52V6.77a4.84 4.84 0 0 1-1.06-.08z"/></svg>
              )},
              { label: 'Twitter', href: '#', icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              )},
            ].map((s) => (
              <a key={s.label} href={s.href} className={styles.socialIcon} aria-label={s.label} id={`footer-${s.label.toLowerCase()}`}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Shop links */}
        <div className={styles.col}>
          <h4 className={`${styles.colHead} serif`}>Shop</h4>
          <a href="#" id="footer-activewear">Activewear</a>
          <a href="#asa" id="footer-asa" className={styles.asaLink}><span className="serif italic">Àṣà by Dofit</span></a>
          <a href="#" id="footer-sets">Sets & Co-ords</a>
          <a href="#" id="footer-tanks">Tanks & Tops</a>
          <a href="#" id="footer-new">New Arrivals</a>
          <a href="#" id="footer-sale">Sale</a>
        </div>

        {/* Info links */}
        <div className={styles.col}>
          <h4 className={`${styles.colHead} serif`}>Company</h4>
          <a href="#story" id="footer-story">Our Story</a>
          <a href="#" id="footer-contact">Contact Us</a>
          <a href="#" id="footer-careers">Careers</a>
          <a href="#" id="footer-faq">FAQ</a>
          <a href="#" id="footer-returns">Returns Policy</a>
          <a href="#" id="footer-shipping">Shipping Info</a>
        </div>

        {/* Newsletter */}
        <div className={styles.newsletter}>
          <h4 className={`${styles.colHead} serif`}>Stay in the Loop</h4>
          <p className={styles.newsletterText}>
            Be the first to know about new drops, exclusive offers, and
            behind-the-scenes moments.
          </p>
          <NewsletterForm />
          <p className={styles.newsletterConsent}>No spam, ever. Unsubscribe anytime.</p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={`${styles.bottom} wrap`}>
        <p>© 2026 Dofit Wears. All rights reserved.</p>
        <div className={styles.bottomLinks}>
          <a href="#" id="footer-privacy">Privacy Policy</a>
          <a href="#" id="footer-terms">Terms of Use</a>
          <a href="#" id="footer-cookies">Cookies</a>
        </div>
        <p className={styles.credit}>Made with ♥ in Lagos</p>
      </div>
    </footer>
  );
}
