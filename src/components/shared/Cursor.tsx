'use client';
import { useEffect, useRef } from 'react';
import styles from './Cursor.module.css';

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Disable completely on touch devices and screens <= 1024px
    if (window.matchMedia('(max-width: 1024px), (hover: none), (pointer: coarse)').matches) {
      return;
    }

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const animate = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
      }
      requestAnimationFrame(animate);
    };

    const onEnterInteractive = () => {
      dotRef.current?.classList.add(styles.active);
      ringRef.current?.classList.add(styles.active);
    };

    const onLeaveInteractive = () => {
      dotRef.current?.classList.remove(styles.active);
      ringRef.current?.classList.remove(styles.active);
    };

    window.addEventListener('mousemove', onMove);
    const raf = requestAnimationFrame(animate);

    const interactives = document.querySelectorAll('a, button, [data-cursor="hover"]');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', onEnterInteractive);
      el.addEventListener('mouseleave', onLeaveInteractive);
    });

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className={styles.dot} />
      <div ref={ringRef} className={styles.ring} />
    </>
  );
}
