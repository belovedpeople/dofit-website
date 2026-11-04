import { Metadata } from 'next';
import { getProductBySlug, productsStore, Product } from '@/data/products';
import { supabase, isSupabaseConfigured, mapRowToProduct, ProductRow } from '@/lib/supabase';
import ProductDetailClient from './ProductDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function resolveProduct(idOrSlug: string): Promise<Product | null> {
  const local =
    productsStore.find((p) => p.slug === idOrSlug || p.id === idOrSlug) ||
    getProductBySlug(idOrSlug);
  if (local) return local;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
        .single();
      if (!error && data) {
        return mapRowToProduct(data as ProductRow);
      }
    } catch {
      // ignore
    }
  }

  return null;
}

function getAbsoluteImageUrl(src?: string): string {
  if (!src) return 'https://dofit.fit/images/dofit-wears/2-Piece%20Biker%20Short%20Set.png';
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return encodeURI(src);
  }
  const clean = src.startsWith('/') ? src : `/${src}`;
  return encodeURI(`https://dofit.fit${clean}`);
}

function getImageMime(url: string): string {
  if (url.toLowerCase().endsWith('.png')) return 'image/png';
  if (url.toLowerCase().endsWith('.webp')) return 'image/webp';
  return 'image/jpeg';
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await resolveProduct(id);

  if (!product) {
    return {
      title: 'Product Drop | Dofit Wears & Àṣà',
      description: 'Discover luxury activewear and cultural Adire couture by Dofit.',
    };
  }

  const brandName = product.brand === 'asa' ? 'Àṣà by Dofit' : 'Dofit Wears';
  const title = `${product.name} — ${brandName}`;
  const priceDisplay =
    product.sizePrices && Object.keys(product.sizePrices).length > 0
      ? `From ₦${Math.min(
          product.price,
          ...Object.values(product.sizePrices).filter((v) => typeof v === 'number' && v > 0)
        ).toLocaleString()}`
      : product.formattedPrice;

  const description = `${product.description.slice(0, 140)}... ${priceDisplay} · Fast Lagos Delivery & Nationwide Dispatch.`;
  const primaryImage = getAbsoluteImageUrl(product.images?.[0]);
  const productUrl = `https://dofit.fit/products/${product.slug || id}`;

  return {
    title,
    description,
    metadataBase: new URL('https://dofit.fit'),
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title,
      description,
      url: productUrl,
      siteName: 'Dofit Wears & Àṣà',
      type: 'website',
      locale: 'en_NG',
      images: [
        {
          url: primaryImage,
          secureUrl: primaryImage,
          width: 1200,
          height: 630,
          alt: product.name,
          type: getImageMime(primaryImage),
        },
        {
          url: primaryImage,
          secureUrl: primaryImage,
          width: 800,
          height: 800,
          alt: product.name,
          type: getImageMime(primaryImage),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [primaryImage],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const initialProduct = await resolveProduct(id);

  return <ProductDetailClient initialProduct={initialProduct || undefined} slug={id} />;
}
