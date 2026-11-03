'use client';
import { useState, useEffect } from 'react';
import { products as initialProducts, Product } from '@/data/products';

let cachedProducts: Product[] = [...initialProducts];
let subscribers: Array<(products: Product[]) => void> = [];

function notify(products: Product[]) {
  cachedProducts = products;
  subscribers.forEach((cb) => cb(products));
}

export function useLiveProducts() {
  const [productsList, setProductsList] = useState<Product[]>(cachedProducts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    subscribers.push(setProductsList);

    // Fetch latest live products from API (which queries Supabase)
    setLoading(true);
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.products && Array.isArray(data.products) && data.products.length > 0) {
          notify(data.products);
        }
      })
      .catch((err) => console.error('Failed to fetch live products:', err))
      .finally(() => setLoading(false));

    return () => {
      subscribers = subscribers.filter((cb) => cb !== setProductsList);
    };
  }, []);

  return { products: productsList, loading };
}
