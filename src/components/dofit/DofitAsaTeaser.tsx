'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useShowcaseContent } from '@/hooks/useShowcaseContent';
import styles from './DofitAsaTeaser.module.css';

const TEASER_STATEMENTS = [
  'Where African artistry meets modern streetwear.',
  'Sacred Adire indigo reborn into Gen Z couture.',
  'Culture as couture. Heritage as fashion.',
  'Ancient Yoruba motifs tailored for the world stage.',
];

const DEFAULT_LOOKS = [
  { id: 'teaser-1', title: 'Look 01', image: '/images/asa/image1.png' },
  { id: 'teaser-2', title: 'Look 02', image: '/images/asa/image2.png' },
  { id: 'teaser-3', title: 'Look 04', image: '/images/asa/image4.png' },
];

export default function DofitAsaTeaser() {
  const { showcase } = useShowcaseContent();
  const [statementIdx, setStatementIdx] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setStatementIdx((prev) => (prev + 1) % TEASER_STATEMENTS.length);
    }, 3400);
    return () => clearInterval(timer);
  }, []);

  // Multi-tier scroll parallax on preview cards
  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const offset = rect.top; // Relative to viewport

      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${offset * 0.18}px)`;
      }
      if (card1Ref.current) {
        card1Ref.current.style.transform = `translateY(${offset * 0.08}px)`;
      }
      if (card2Ref.current) {
        card2Ref.current.style.transform = `translateY(${offset * -0.06}px)`;
      }
      if (card3Ref.current) {
        card3Ref.current.style.transform = `translateY(${offset * -0.16}px)`;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const cardRefs = [card1Ref, card2Ref, card3Ref];

  // Dynamic background image: custom teaser background > Àṣà hero image > fallback
  const bgImage =
    showcase.asaTeaser?.backgroundImage ||
    showcase.asaHero?.mainImage ||
    '/images/asa/image3.png';

  // Dynamic preview cards: custom teaser looks > first 3 looks of Àṣà Lookbook > defaults
  const previewLooks =
    showcase.asaTeaser?.looks && showcase.asaTeaser.looks.length >= 3
      ? showcase.asaTeaser.looks
      : showcase.asaGallery && showcase.asaGallery.length >= 3
        ? showcase.asaGallery.slice(0, 3).map((look, i) => ({
            id: look.id || `look-${i + 1}`,
            title: `Look 0${i === 2 ? 4 : i + 1}`,
            image: look.image,
          }))
        : DEFAULT_LOOKS;

  return (
    <section className={styles.section} id="asa-teaser" ref={sectionRef}>
      {/* Background image with parallax */}
      <div className={styles.bg} ref={bgRef}>
        <Image
          src={bgImage}
          alt="Àṣà by Dofit"
          fill
          className={styles.bgImg}
          sizes="100vw"
          unoptimized={Boolean(bgImage?.startsWith('http'))}
        />
        <div className={styles.bgOverlay} />
      </div>

      {/* Adire pattern overlay */}
      <div className={styles.adirePattern} aria-hidden="true" />

      <div className={`${styles.content} wrap`}>
        {/* Top badge */}
        <div className={`${styles.badge} reveal`}>
          <span className={styles.badgeDot} />
          <span className="asa-body">A sub-brand of Dofit Wears</span>
        </div>

        {/* Headline */}
        <div className={`${styles.headlineWrap} reveal`}>
          <h2 className={`${styles.headline} asa-display`}>
            Àṣà
          </h2>
          <h3 className={`${styles.sub} asa-display`}>
            by Dofit
          </h3>
        </div>

        {/* Description with rotating text transition */}
        <div className={styles.descWrap}>
          <p key={statementIdx} className={`${styles.desc} asa-body`}>
            {TEASER_STATEMENTS[statementIdx]}
          </p>
        </div>

        {/* Multi-depth Preview images */}
        <div className={`${styles.preview} reveal`}>
          {previewLooks.slice(0, 3).map((item, idx) => (
            <div key={item.id || idx} className={styles.previewImg} ref={cardRefs[idx]}>
              <Image
                src={item.image}
                alt={item.title || `Àṣà look 0${idx + 1}`}
                fill
                className={styles.previewImgInner}
                sizes="180px"
                unoptimized={Boolean(item.image?.startsWith('http'))}
              />
              <div className={styles.cardTag}>{item.title}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={`${styles.ctas} reveal`}>
          <Link href="/asa" className="btn btn-asa-gold" id="asa-teaser-explore">
            Explore Àṣà Collection
          </Link>
          <Link href="/asa" className="btn btn-asa-outline" id="asa-teaser-story">
            Read the Story
          </Link>
        </div>
      </div>
    </section>
  );
}
