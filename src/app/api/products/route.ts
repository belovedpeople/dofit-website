import { NextRequest, NextResponse } from 'next/server';
import { productsStore, Product } from '@/data/products';

// GET /api/products — return all products
export async function GET() {
  return NextResponse.json({ products: productsStore });
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
      images: body.images || [],
      videos: body.videos || [],
      inStock: body.inStock !== undefined ? body.inStock : true,
      stockCount: Number(body.stockCount) || 0,
    };

    productsStore.unshift(newProduct);
    return NextResponse.json({ product: newProduct }, { status: 201 });
  } catch (err) {
    console.error('Create product error:', err);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

