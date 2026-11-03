import { Metadata } from 'next';
import { getProductBySlug } from '@/data/products';
import ProductDetailClient from './ProductDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductBySlug(id);

  if (!product) {
    return {
      title: 'Product | Dofit Wears & Àṣà',
      description: 'Discover luxury activewear and cultural Adire couture by Dofit.',
    };
  }

  const brandName = product.brand === 'asa' ? 'Àṣà by Dofit' : 'Dofit Wears';
  const title = `${product.name} — ${brandName}`;
  const description = `${product.description.slice(0, 150)}... ${product.formattedPrice} · Made in Lagos, Nigeria.`;
  const primaryImage = product.images?.[0] || '/images/dofit-wears/2-Piece Biker Short Set.png';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: primaryImage,
          width: 1200,
          height: 630,
          alt: product.name,
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
  const initialProduct = getProductBySlug(id);

  return <ProductDetailClient initialProduct={initialProduct} slug={id} />;
}
