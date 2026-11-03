'use client';
import { useState, useEffect } from 'react';
import styles from './DofitStatement.module.css';

const STATEMENT_WORDS = [
  'Statements.',
  'Revolutions.',
  'Movements.',
  'Identities.',
  'Culture.',
];

export default function DofitStatement() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % STATEMENT_WORDS.length);
    }, 2600);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className={styles.section} id="story">
      {/* Background ambient light */}
      <div className={styles.bgGlow} aria-hidden="true" />

      <div className="wrap">
        <div className={`${styles.inner} reveal`}>
          {/* Top line */}
          <div className={styles.topRow}>
            <span className={styles.pill}>Our Philosophy</span>
            <div className={styles.divLine} />
          </div>

          {/* Big statement with kinetic text transition */}
          <h2 className={`${styles.statement} display`}>
            We Don&apos;t Make<br />
            <span className={styles.statementPink}>Clothes.</span><br />
            We Make
            <span className={styles.statementCycler}>
              <span key={STATEMENT_WORDS[index]} className={styles.statementOutline}>
                {' '}{STATEMENT_WORDS[index]}
              </span>
            </span>
          </h2>

          {/* Bottom content */}
          <div className={styles.bottom}>
            <div className={styles.bodyText}>
              <p>
                Dofit Wears was born from a refusal to choose between performance and beauty,
                between cultural pride and modern streetwear. Every stitch carries intention.
                Every silhouette tells a story.
              </p>
              <p>
                From the gym to the street, from Lagos to the world — we dress the ones who
                show up fully, boldly, and unapologetically.
              </p>
            </div>

            {/* Stats */}
            <div className={styles.statsRow}>
              {[
                { num: '2022', label: 'Founded in Lagos' },
                { num: '6+', label: 'Cities Worn In' },
                { num: '2', label: 'Iconic Brands' },
                { num: '∞', label: 'Possibilities' },
              ].map(s => (
                <div key={s.label} className={styles.stat}>
                  <span className={`${styles.statNum} display`}>{s.num}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
