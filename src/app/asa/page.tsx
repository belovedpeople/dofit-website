'use client';
import AsaNavbar from '@/components/asa/AsaNavbar';
import AsaHero from '@/components/asa/AsaHero';
import AsaStory from '@/components/asa/AsaStory';
import AsaProducts from '@/components/asa/AsaProducts';
import AsaGallery from '@/components/asa/AsaGallery';
import AsaFooter from '@/components/asa/AsaFooter';
import { useScrollReveal, useParallax } from '@/hooks/useScrollEffects';

export default function AsaPage() {
  useScrollReveal();
  useParallax();

  return (
    <>
      <AsaNavbar />
      <main style={{ background: 'var(--asa-void)', minHeight: '100vh', position: 'relative' }}>
        <AsaHero />
        <AsaStory />
        <AsaProducts />
        <AsaGallery />
      </main>
      <AsaFooter />
    </>
  );
}
