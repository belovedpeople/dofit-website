'use client';
import { useState, useEffect } from 'react';
import { defaultShowcaseContent, ShowcaseContent } from '@/data/showcase';

let cachedShowcase: ShowcaseContent = defaultShowcaseContent;
let subscribers: Array<(content: ShowcaseContent) => void> = [];

function notify(content: ShowcaseContent) {
  cachedShowcase = content;
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
        notify(data.showcase);
      }
    } catch (err) {
      console.error('Failed to fetch showcase content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    subscribers.push(setShowcase);
    refresh();

    return () => {
      subscribers = subscribers.filter((cb) => cb !== setShowcase);
    };
  }, []);

  return { showcase, loading, refresh };
}

