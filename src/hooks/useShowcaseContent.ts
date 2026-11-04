'use client';
import { useState, useEffect } from 'react';
import { defaultShowcaseContent, ShowcaseContent } from '@/data/showcase';

const STORAGE_KEY = 'dofit_showcase_v1';

// Read initial cached showcase from localStorage if present
let cachedShowcase: ShowcaseContent = defaultShowcaseContent;
if (typeof window !== 'undefined') {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object') {
        cachedShowcase = {
          ...defaultShowcaseContent,
          ...parsed,
          dofitHero: { ...defaultShowcaseContent.dofitHero, ...parsed.dofitHero },
          asaHero: { ...defaultShowcaseContent.asaHero, ...parsed.asaHero },
          asaStory: { ...defaultShowcaseContent.asaStory, ...parsed.asaStory },
        };
      }
    }
  } catch {
    // Ignore storage parse error
  }
}

let subscribers: Array<(content: ShowcaseContent) => void> = [];

export function notifyShowcaseUpdated(content: ShowcaseContent) {
  cachedShowcase = content;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
      window.dispatchEvent(new CustomEvent('dofit:showcase-updated', { detail: content }));
    } catch {
      // Ignore storage write error
    }
  }
  subscribers.forEach((cb) => cb(content));
}

export function useShowcaseContent() {
  const [showcase, setShowcase] = useState<ShowcaseContent>(cachedShowcase);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/showcase?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store',
          Pragma: 'no-cache',
        },
      });
      const data = await res.json();
      if (data?.showcase) {
        notifyShowcaseUpdated(data.showcase);
      }
    } catch (err) {
      console.error('Failed to fetch showcase content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    subscribers.push(setShowcase);

    const onCustomUpdate = (e: Event) => {
      const detail = (e as CustomEvent<ShowcaseContent>).detail;
      if (detail) setShowcase(detail);
    };

    const onStorageUpdate = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setShowcase(parsed);
        } catch {}
      }
    };

    window.addEventListener('dofit:showcase-updated', onCustomUpdate);
    window.addEventListener('storage', onStorageUpdate);

    refresh();

    return () => {
      subscribers = subscribers.filter((cb) => cb !== setShowcase);
      window.removeEventListener('dofit:showcase-updated', onCustomUpdate);
      window.removeEventListener('storage', onStorageUpdate);
    };
  }, []);

  return { showcase, loading, refresh };
}
