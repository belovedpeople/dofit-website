import { createClient } from '@supabase/supabase-js';
import { Product } from '@/data/products';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface ProductRow {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  formatted_price: string;
  category: string;
  tag?: string | null;
  description: string;
  features: string[];
  fabric: string;
  care: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  images: string[];
  videos?: string[];
  in_stock: boolean;
  stock_count: number;
  created_at?: string;
  updated_at?: string;
}

export function mapRowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand as 'dofit' | 'asa',
    price: Number(row.price),
    formattedPrice: row.formatted_price,
    category: row.category,
    tag: row.tag || undefined,
    description: row.description,
    features: Array.isArray(row.features) ? row.features : [],
    fabric: row.fabric || '',
    care: Array.isArray(row.care) ? row.care : [],
    colors: Array.isArray(row.colors) ? row.colors : [],
    sizes: Array.isArray(row.sizes) ? row.sizes : [],
    images: Array.isArray(row.images) ? row.images : [],
    videos: Array.isArray(row.videos) ? row.videos : [],
    inStock: Boolean(row.in_stock),
    stockCount: Number(row.stock_count) || 0,
  };
}

export function mapProductToRow(product: Product): ProductRow {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    price: product.price,
    formatted_price: product.formattedPrice,
    category: product.category,
    tag: product.tag || null,
    description: product.description,
    features: product.features || [],
    fabric: product.fabric || '',
    care: product.care || [],
    colors: product.colors || [],
    sizes: product.sizes || [],
    images: product.images || [],
    videos: product.videos || [],
    in_stock: product.inStock,
    stock_count: product.stockCount,
  };
}
