import { NextRequest, NextResponse } from 'next/server';
import { productsStore, Product } from '@/data/products';
import { supabase, isSupabaseConfigured, mapRowToProduct, mapProductToRow, ProductRow } from '@/lib/supabase';

// GET /api/products — return all products (Supabase or fallback)
export async function GET() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch error:', error);
      } else if (data && data.length > 0) {
        return NextResponse.json({
          products: (data as ProductRow[]).map(mapRowToProduct),
          source: 'supabase',
        });
      } else if (data && data.length === 0 && productsStore.length > 0) {
        // Table is empty, seed initial products from local store
        const rows = productsStore.map(mapProductToRow);
        await supabase.from('products').insert(rows);
        return NextResponse.json({ products: productsStore, source: 'supabase-seeded' });
      }
    } catch (err) {
      console.error('Supabase query error:', err);
    }
  }

  return NextResponse.json({ products: productsStore, source: 'local' });
}

// POST /api/products — create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const required = ['name', 'brand', 'category', 'price', 'description'];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      slug: body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      name: body.name,
      brand: body.brand,
      price: Number(body.price),
      formattedPrice: `₦${Number(body.price).toLocaleString()}`,
      category: body.category,
      tag: body.tag || undefined,
      description: body.description,
      features: body.features || [],
      fabric: body.fabric || '',
      care: body.care || [],
      colors: body.colors || [],
      sizes: body.sizes || [],
      sizePrices: body.sizePrices && typeof body.sizePrices === 'object' ? body.sizePrices : undefined,
      images: body.images || [],
      videos: body.videos || [],
      inStock: body.inStock !== undefined ? body.inStock : true,
      stockCount: Number(body.stockCount) || 0,
    };

    if (isSupabaseConfigured && supabase) {
      const row = mapProductToRow(newProduct);
      let { error } = await supabase.from('products').insert([row]);
      if (error && error.message?.includes('size_prices')) {
        // Fallback if size_prices column has not yet been added to Supabase table
        const { size_prices: _, ...rowWithoutSizePrices } = row;
        const retry = await supabase.from('products').insert([rowWithoutSizePrices]);
        error = retry.error;
      }
      if (error) {
        console.error('Supabase insert error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    // Also keep local memory copy synced
    productsStore.unshift(newProduct);

    return NextResponse.json({ product: newProduct }, { status: 201 });
  } catch (err) {
    console.error('Create product error:', err);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
