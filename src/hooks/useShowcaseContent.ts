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

  useEffect(() => {
    subscribers.push(setShowcase);

    setLoading(true);
    fetch('/api/showcase')
      .then((res) => res.json())
      .then((data) => {
        if (data.showcase) {
          notify(data.showcase);
        }
      })
      .catch((err) => console.error('Failed to fetch showcase content:', err))
      .finally(() => setLoading(false));

    return () => {
      subscribers = subscribers.filter((cb) => cb !== setShowcase);
    };
  }, []);

  return { showcase, loading };
}
