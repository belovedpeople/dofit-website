import { NextRequest, NextResponse } from 'next/server';
import { productsStore, Product } from '@/data/products';

// GET /api/products/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
  const idx = productsStore.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  try {
    const body = await request.json();
    const existing = productsStore[idx];

    const updated: Product = {
      ...existing,
      ...body,
      id: existing.id, // never override id
      slug: body.name
        ? body.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        : existing.slug,
      formattedPrice:
        body.price !== undefined
          ? `₦${Number(body.price).toLocaleString()}`
          : existing.formattedPrice,
      price: body.price !== undefined ? Number(body.price) : existing.price,
      stockCount: body.stockCount !== undefined ? Number(body.stockCount) : existing.stockCount,
    };

    productsStore[idx] = updated;
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
  const idx = productsStore.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const [removed] = productsStore.splice(idx, 1);
  return NextResponse.json({ deleted: removed.id });
}

