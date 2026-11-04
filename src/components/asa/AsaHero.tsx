'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useShowcaseContent } from '@/hooks/useShowcaseContent';
import { AdireElekoPattern, AdireTeethDivider } from './patterns/YorubaPatterns';
import styles from './AsaHero.module.css';

const ASA_CULTURAL_TAGLINES = [
  { prefix: 'Àṣà', meaning: 'Yoruba for "culture" & "heritage"' },
  { prefix: 'Adire', meaning: 'Sacred indigo hand-dye reborn in modern couture' },
  { prefix: 'Ìtàn', meaning: 'Yoruba for "our living story" woven into every thread' },
  { prefix: 'Ìbílẹ̀', meaning: 'Rooted in ancestral soils, engineered for global fashion' },
  { prefix: 'Ọlá', meaning: 'Honour and royalty worn as daily armor' },
];

export default function AsaHero() {
  const { showcase } = useShowcaseContent();
  const imgRef = useRef<HTMLDivElement>(null);
  const patternRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);

  const [taglineIdx, setTaglineIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTaglineIdx((prev) => (prev + 1) % ASA_CULTURAL_TAGLINES.length);
    }, 3400);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let scrollY = window.scrollY;
    let animFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX = (e.clientX / innerWidth - 0.5) * 2;
      mouseY = (e.clientY / innerHeight - 0.5) * 2;
    };

    const onScroll = () => {
      scrollY = window.scrollY;
    };

    const animate = () => {
      currentX += (mouseX - currentX) * 0.06;
      currentY += (mouseY - currentY) * 0.06;

      if (imgRef.current) {
        imgRef.current.style.transform = `translate3d(${currentX * -26}px, ${scrollY * 0.42 + currentY * -18}px, 0) scale(1.08)`;
      }

      if (patternRef.current) {
        patternRef.current.style.transform = `translate3d(${currentX * 16}px, ${scrollY * -0.16 + currentY * 12}px, 0)`;
      }

      if (copyRef.current) {
        copyRef.current.style.transform = `translate3d(${currentX * 10}px, ${scrollY * 0.12 + currentY * 8}px, 0)`;
        copyRef.current.style.opacity = `${Math.max(0, 1 - scrollY * 0.0018)}`;
      }

      if (sealRef.current) {
        sealRef.current.style.transform = `translateY(-50%) translate3d(${currentX * -22}px, ${scrollY * -0.14 + currentY * -16}px, 0) rotateY(${currentX * 16}deg) rotateX(${currentY * -14}deg)`;
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

  const activeTagline = ASA_CULTURAL_TAGLINES[taglineIdx];

  return (
    <section className={styles.hero}>
      {/* Parallax image — restored original */}
      <div className={styles.imgWrap} ref={imgRef}>
        <Image
          src={showcase.asaHero?.mainImage || "/images/asa/image3.png"}
          alt="Àṣà by Dofit"
          fill
          className={styles.img}
          priority
          sizes="100vw"
          unoptimized={Boolean(showcase.asaHero?.mainImage?.startsWith('http'))}
        />
        <div className={styles.overlay} />
      </div>

      {/* Floating Adire Eleko pattern layer that user loves */}
      <div className={styles.adire} ref={patternRef} aria-hidden="true">
        <AdireElekoPattern opacity={0.14} color="#E8A020" />
      </div>

      {/* Ambient gold glow */}
      <div className={styles.goldGlow} aria-hidden="true" />

      {/* Content */}
      <div className={styles.content} ref={copyRef}>
        <div className="wrap">
          <p className={`${styles.breadcrumb} asa-body anim-fade-in`}>
            <Link href="/" className={styles.home}>Dofit Wears</Link>
            <span> / </span>
            <span>Àṣà</span>
          </p>

          {/* Main headline with liquid gold shimmer */}
          <div className={`${styles.headBlock} anim-fade-up delay-1`}>
            <h1 className={`${styles.headline} asa-display`}>
              Àṣà
            </h1>
            <div className={styles.headlineSub}>
              <span className={`${styles.by} asa-display`}>by Dofit</span>

              {/* Dynamic rotating cultural tagline transition */}
              <div className={styles.meaningWrap}>
                <div key={activeTagline.meaning} className={styles.meaningItem}>
                  <span className={styles.meaningPrefix}>{activeTagline.prefix}</span>
                  <span className={styles.meaningDivider}>—</span>
                  <p className={`${styles.meaning} asa-body`}>
                    {activeTagline.meaning}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className={`${styles.lede} asa-body anim-fade-up delay-2`}>
            Bold Afrocentric streetwear born from the crossroads of
            <br />Nigerian Adire textile heritage and contemporary fashion.
          </p>

          <div className={`${styles.ctas} anim-fade-up delay-3`}>
            <a href="#asa-products" className="btn btn-asa-gold" id="asa-hero-shop">
              Shop Collection
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a href="#asa-story" className="btn btn-asa-outline" id="asa-hero-story">
              Our Story
            </a>
          </div>
        </div>
      </div>

      {/* Floating 3D Cultural Seal / Emblem */}
      <div className={styles.culturalSeal} ref={sealRef}>
        <div className={styles.sealRing}>
          <svg viewBox="0 0 100 100" className={styles.sealSvg}>
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(232, 160, 32, 0.4)" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(232, 160, 32, 0.8)" strokeWidth="1.2" />
          </svg>
          <div className={styles.sealContent}>
            <span className={styles.sealTop}>ÀṢÀ</span>
            <span className={styles.sealYear}>2026</span>
            <span className={styles.sealBottom}>CULTURE</span>
          </div>
        </div>
        <div className={styles.sealCaption}>
          <span>Authentic Adire</span>
          <strong>Lagos Archive</strong>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scroll}>
        <div className={styles.scrollLine} />
        <span className={`${styles.scrollText} asa-body`}>Scroll</span>
      </div>

      {/* Adire teeth divider at bottom of hero */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 4 }}>
        <AdireTeethDivider color="#E8A020" />
      </div>
    </section>
  );
}
