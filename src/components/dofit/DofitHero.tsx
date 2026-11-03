'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useShowcaseContent } from '@/hooks/useShowcaseContent';
import styles from './DofitHero.module.css';

const HEADLINE_WORDS = [
  { text: 'MADE OF.', highlight: false },
  { text: 'BUILT FOR.', highlight: true },
  { text: 'DRIVEN BY.', highlight: false },
  { text: 'DEFYING.', highlight: true },
  { text: 'RELENTLESS.', highlight: false },
  { text: 'UNSTOPPABLE.', highlight: true },
];

const EYEBROW_ITEMS = [
  'New Season Drop — 2026',
  'Lagos × Global Streetwear',
  'Engineered Activewear & Haute Couture',
  'Unapologetic Movement & Power',
];

export default function DofitHero() {
  const { showcase } = useShowcaseContent();
  const heroRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const floatCardRef = useRef<HTMLAnchorElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const [wordIdx, setWordIdx] = useState(0);
  const [eyebrowIdx, setEyebrowIdx] = useState(0);

  // Rotating headline word timer
  useEffect(() => {
    const timer = setInterval(() => {
      setWordIdx((prev) => (prev + 1) % HEADLINE_WORDS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  // Rotating eyebrow ticker timer
  useEffect(() => {
    const timer = setInterval(() => {
      setEyebrowIdx((prev) => (prev + 1) % EYEBROW_ITEMS.length);
    }, 3600);
    return () => clearInterval(timer);
  }, []);

  // Interactive mouse + scroll parallax with RAF lerp
  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let scrollY = window.scrollY;
    let animFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      mouseY = (e.clientY / innerHeight - 0.5) * 2;
    };

    const onScroll = () => {
      scrollY = window.scrollY;
    };

    const animate = () => {
      // Lerp smooth follow
      currentX += (mouseX - currentX) * 0.06;
      currentY += (mouseY - currentY) * 0.06;

      if (imgRef.current) {
        imgRef.current.style.transform = `translate3d(${currentX * -28}px, ${scrollY * 0.44 + currentY * -22}px, 0) scale(1.08)`;
      }

      if (textRef.current) {
        textRef.current.style.transform = `translate3d(${currentX * 14}px, ${scrollY * 0.14 + currentY * 10}px, 0)`;
        textRef.current.style.opacity = `${Math.max(0, 1 - scrollY * 0.002)}`;
      }

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${currentX * 65}px, ${scrollY * 0.2 + currentY * 50}px, 0)`;
      }

      if (floatCardRef.current) {
        floatCardRef.current.style.transform = `translateY(-50%) translate3d(${currentX * -24}px, ${scrollY * -0.15 + currentY * -18}px, 0) rotateY(${currentX * 14}deg) rotateX(${currentY * -14}deg)`;
      }

      animFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    animFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  const currentWord = HEADLINE_WORDS[wordIdx];

  return (
    <section className={styles.hero} ref={heroRef} id="hero">
      {/* Parallax image layer */}
      <div className={styles.imgWrap} ref={imgRef}>
        <Image
          src={showcase.dofitHero?.mainImage || "/images/dofit-wears/2-Piece Biker Short Set.png"}
          alt="Dofit Wears — Showcase"
          fill
          className={styles.img}
          priority
          sizes="100vw"
        />
        {/* Pink gradient overlay */}
        <div className={styles.overlay} />
      </div>

      {/* Interactive dynamic ambient glow */}
      <div className={styles.glowOrb} ref={glowRef} aria-hidden="true" />

      {/* Noise grain texture */}
      <div className={styles.grain} />

      {/* Content */}
      <div className={styles.content} ref={textRef}>
        <div className="wrap">
          {/* Eyebrow with kinetic sliding ticker */}
          <div className={`${styles.eyebrowContainer} anim-fade-up`}>
            <span className={styles.eyebrowDot} />
            <div className={styles.eyebrowTicker}>
              <span key={eyebrowIdx} className={styles.eyebrowText}>
                {EYEBROW_ITEMS[eyebrowIdx]}
              </span>
            </div>
          </div>

          {/* Main headline with kinetic cycling word */}
          <h1 className={styles.headline}>
            <span className={`${styles.line1} display anim-fade-up delay-1`}>WEAR</span>
            <span className={`${styles.line2} display anim-fade-up delay-2`}>
              WHAT{' '}
              <span className={styles.pinkWord}>YOU&apos;RE</span>
            </span>
            <span className={`${styles.line3} display anim-fade-up delay-3`}>
              <span className={styles.line3Cycler}>
                <span
                  key={currentWord.text}
                  className={`${styles.cyclerWord} ${currentWord.highlight ? styles.cyclerHighlight : ''}`}
                >
                  {currentWord.text}
                </span>
              </span>
            </span>
          </h1>

          {/* Sub + CTA */}
          <div className={`${styles.bottom} anim-fade-up delay-4`}>
            <p className={styles.lede}>
              Premium activewear and Afrocentric fashion
              <br />engineered for those who refuse to be ordinary.
            </p>
            <div className={styles.ctas}>
              <Link href="/shop" className="btn btn-pink" id="hero-shop">
                Shop Collection
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link href="/asa" className="btn btn-outline" id="hero-asa">
                <span className="asa-display" style={{fontStyle:'italic', fontSize:'16px'}}>Àṣà by Dofit</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Floating 3D interactive product card */}
      <Link
        href="/products/trim-tank-top"
        className={`${styles.floatCard} anim-scale-in delay-5`}
        ref={floatCardRef}
      >
        <div className={styles.floatImg}>
          <Image
            src={showcase.dofitHero?.floatingImage || "/images/dofit-wears/Trim Tank Top.png"}
            alt={showcase.dofitHero?.floatingTitle || "Trim Tank Top"}
            fill
            className={styles.floatImgInner}
            sizes="140px"
          />
        </div>
        <div className={styles.floatInfo}>
          <span className={styles.floatBadge}>Featured Drop</span>
          <span className={styles.floatName}>{showcase.dofitHero?.floatingTitle || "Trim Tank Top"}</span>
          <span className={styles.floatPrice}>{showcase.dofitHero?.floatingPrice || "₦18,000"}</span>
        </div>
        <div className={styles.floatPink} />
      </Link>

      {/* Scroll indicator */}
      <div className={`${styles.scroll} anim-fade-in delay-6`}>
        <div className={styles.scrollLine} />
        <span className={styles.scrollText}>Scroll</span>
      </div>

      {/* Stat pills */}
      <div className={`${styles.stats} anim-fade-up delay-5`}>
        {[
          { num: '7+', label: 'Styles' },
          { num: '2', label: 'Brands' },
          { num: '100%', label: 'Premium' },
        ].map((s) => (
          <div key={s.label} className={styles.stat}>
            <span className={`${styles.statNum} display`}>{s.num}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
