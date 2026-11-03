'use client';
import { useState } from 'react';
import styles from '../admin.module.css';

export default function AdminCmsPage() {
  const [dofitWords, setDofitWords] = useState([
    'MADE OF.',
    'BUILT FOR.',
    'DRIVEN BY.',
    'DEFYING.',
    'RELENTLESS.',
    'UNSTOPPABLE.',
  ]);
  const [newDofitWord, setNewDofitWord] = useState('');

  const [announcementText, setAnnouncementText] = useState(
    '🔥 2026 SEASON DROP LIVE · FREE LAGOS DISPATCH OVER ₦50,000 · ORDER DIRECT VIA WHATSAPP (+2349016946854)'
  );

  const [asaTaglines, setAsaTaglines] = useState([
    { prefix: 'Àṣà', meaning: 'Yoruba for "culture" & "heritage"' },
    { prefix: 'Adire', meaning: 'Sacred indigo hand-dye reborn in modern couture' },
    { prefix: 'Ìtàn', meaning: 'Yoruba for "our living story" woven into every thread' },
    { prefix: 'Ìbílẹ̀', meaning: 'Rooted in ancestral soils, engineered for global fashion' },
  ]);

  const [savedToast, setSavedToast] = useState(false);

  const handleAddDofitWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDofitWord.trim()) return;
    setDofitWords([...dofitWords, newDofitWord.trim().toUpperCase()]);
    setNewDofitWord('');
  };

  const handleRemoveWord = (index: number) => {
    setDofitWords(dofitWords.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div>
      {/* Toast Alert */}
      {savedToast && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: '#22C55E',
            color: '#000000',
            fontWeight: 700,
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            zIndex: 1000,
          }}
        >
          ✓ Live Storefront CMS Changes Saved!
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
        }}
      >
        <div>
          <h2 className={styles.tableTitle} style={{ fontSize: '24px' }}>
            Storefront Copy & Content CMS
          </h2>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>
            Edit homepage kinetic headline transitions, announcements, and cultural taglines in real time.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="btn btn-pink"
          style={{ padding: '12px 24px', fontSize: '13px' }}
        >
          Save All CMS Changes
        </button>
      </div>

      {/* Grid of CMS Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* SECTION 1: DOFITS HERO ROTATING WORDS */}
        <div className={styles.tableCard} style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <span className={styles.brandBadgeDofit}>Dofit Wears Hero</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginTop: '6px' }}>
              Headline Kinetic Rotating Words
            </h3>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
              Cycles beneath <em>&ldquo;WEAR WHAT YOU&apos;RE...&rdquo;</em> on the homepage.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '18px' }}>
            {dofitWords.map((word, idx) => (
              <span
                key={idx}
                style={{
                  background: 'rgba(255,30,106,0.15)',
                  border: '1px solid rgba(255,30,106,0.4)',
                  color: 'var(--pink)',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {word}
                <button
                  onClick={() => handleRemoveWord(idx)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.6)',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                  title="Remove word"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          <form onSubmit={handleAddDofitWord} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="e.g. FEARLESS."
              value={newDofitWord}
              onChange={(e) => setNewDofitWord(e.target.value)}
              style={{
                flex: 1,
                background: '#14141C',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#FFFFFF',
                fontSize: '13px',
                outline: 'none',
              }}
            />
            <button type="submit" className={styles.actionBtn}>
              + Add Word
            </button>
          </form>
        </div>

        {/* SECTION 2: ANNOUNCEMENT TICKER */}
        <div className={styles.tableCard} style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <span className={styles.brandBadgeDofit}>Global Bar</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginTop: '6px' }}>
              Top Announcement Ticker
            </h3>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
              The marquee banner that scrolls across the top of both sites.
            </p>
          </div>

          <textarea
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            rows={4}
            style={{
              width: '100%',
              background: '#14141C',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px',
              padding: '12px',
              color: '#FFFFFF',
              fontSize: '13px',
              outline: 'none',
              resize: 'vertical',
              marginBottom: '12px',
            }}
          />
          <button onClick={handleSave} className={styles.actionBtn}>
            Update Announcement Bar
          </button>
        </div>

        {/* SECTION 3: ÀṢÀ CULTURAL ETHOS TAGLINES */}
        <div className={styles.tableCard} style={{ padding: '24px', gridColumn: '1 / -1' }}>
          <div style={{ marginBottom: '16px' }}>
            <span className={styles.brandBadgeAsa}>Àṣà by Dofit</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginTop: '6px' }}>
              Yoruba Cultural Ethos & Aphorisms
            </h3>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
              Rotates in the Àṣà hero next to <em>&ldquo;by Dofit&rdquo;</em> on <code>/asa</code>.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {asaTaglines.map((tag, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  background: '#14141C',
                  border: '1px solid rgba(232,160,32,0.2)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                }}
              >
                <strong style={{ color: 'var(--asa-gold)', minWidth: '80px' }}>
                  {tag.prefix}
                </strong>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>—</span>
                <input
                  type="text"
                  value={tag.meaning}
                  onChange={(e) => {
                    const copy = [...asaTaglines];
                    copy[idx].meaning = e.target.value;
                    setAsaTaglines(copy);
                  }}
                  style={{
                    flex: 1,
                    background: 'none',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
