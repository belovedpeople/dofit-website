'use client';
import { useEffect } from 'react';

export function useScrollReveal() {
  useEffect(() => {
    const classes = ['reveal', 'reveal-left', 'reveal-right', 'reveal-scale', 'stagger-children'];
    const elements: Element[] = [];
    classes.forEach(cls => {
      document.querySelectorAll(`.${cls}`).forEach(el => elements.push(el));
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export function useParallax() {
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      document.documentElement.style.setProperty('--scroll-y', `${scrollY}px`);
      document.documentElement.style.setProperty('--scroll-pct', `${scrollY / document.body.offsetHeight}`);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}
