'use client';
import { useEffect } from 'react';
import Cursor from '@/components/shared/Cursor';
import DofitNavbar from '@/components/dofit/DofitNavbar';
import DofitHero from '@/components/dofit/DofitHero';
import DofitMarquee from '@/components/dofit/DofitMarquee';
import DofitCollectionGrid from '@/components/dofit/DofitCollectionGrid';
import DofitStatement from '@/components/dofit/DofitStatement';
import DofitAsaTeaser from '@/components/dofit/DofitAsaTeaser';
import DofitInstaGrid from '@/components/dofit/DofitInstaGrid';
import DofitFooter from '@/components/dofit/DofitFooter';
import { useScrollReveal, useParallax } from '@/hooks/useScrollEffects';

export default function HomePage() {
  useScrollReveal();
  useParallax();

  return (
    <>
      <DofitNavbar />
      <main>
        <DofitHero />
        <DofitMarquee />
        <DofitCollectionGrid />
        <DofitStatement />
        <DofitAsaTeaser />
        <DofitInstaGrid />
      </main>
      <DofitFooter />
    </>
  );
}
