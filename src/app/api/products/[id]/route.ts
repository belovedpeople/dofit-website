import { NextRequest, NextResponse } from 'next/server';
import { productsStore, Product } from '@/data/products';
import { supabase, isSupabaseConfigured, mapRowToProduct, mapProductToRow, ProductRow } from '@/lib/supabase';

// GET /api/products/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`id.eq.${id},slug.eq.${id}`)
      .single();

    if (!error && data) {
      return NextResponse.json({ product: mapRowToProduct(data as ProductRow) });
    }
  }

  const product = productsStore.find((p) => p.id === id || p.slug === id);
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ product });
}

// PUT /api/products/[id] — update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const idx = productsStore.findIndex((p) => p.id === id);
    const existing = idx >= 0 ? productsStore[idx] : null;

    const updated: Product = {
      ...(existing || {}),
      ...body,
      id: existing?.id || id,
      slug: body.name
        ? body.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
        : (existing?.slug || id),
      formattedPrice:
        body.price !== undefined
          ? `₦${Number(body.price).toLocaleString()}`
          : (existing?.formattedPrice || `₦${Number(body.price || 0).toLocaleString()}`),
      price: body.price !== undefined ? Number(body.price) : (existing?.price || 0),
      stockCount: body.stockCount !== undefined ? Number(body.stockCount) : (existing?.stockCount || 0),
      sizePrices: body.sizePrices !== undefined ? body.sizePrices : existing?.sizePrices,
    };

    if (isSupabaseConfigured && supabase) {
      const row = mapProductToRow(updated);
      let { error } = await supabase
        .from('products')
        .update(row)
        .eq('id', id);

      if (error && error.message?.includes('size_prices')) {
        const { size_prices: _, ...rowWithoutSizePrices } = row;
        const retry = await supabase
          .from('products')
          .update(rowWithoutSizePrices)
          .eq('id', id);
        error = retry.error;
      }

      if (error) {
        console.error('Supabase update error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    if (idx >= 0) {
      productsStore[idx] = updated;
    }

    return NextResponse.json({ product: updated });
  } catch (err) {
    console.error('Update product error:', err);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE /api/products/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  const idx = productsStore.findIndex((p) => p.id === id);
  if (idx !== -1) {
    productsStore.splice(idx, 1);
  }

  return NextResponse.json({ deleted: id });
}
