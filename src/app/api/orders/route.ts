import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders, createOrder, updateOrderStatus, Order } from '@/data/orders';
import { productsStore } from '@/data/products';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ref = searchParams.get('ref')?.trim().toUpperCase();
  const phone = searchParams.get('phone')?.trim().replace(/[^0-9]/g, '');

  // 1. If tracking specific order by reference or phone
  if (ref || phone) {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('orders').select('*');
        if (ref) {
          query = query.or(`id.ilike.%${ref}%`);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          const match = phone
            ? data.find((o) => (o.customer?.phone || '').replace(/[^0-9]/g, '').includes(phone))
            : data[0];
          if (match) {
            return NextResponse.json({
              success: true,
              order: {
                id: match.id,
                createdAt: match.created_at,
                customer: match.customer,
                items: match.items,
                subtotal: Number(match.subtotal),
                discount: Number(match.discount || 0),
                deliveryFee: Number(match.delivery_fee || 0),
                totalAmount: Number(match.total_amount),
                status: match.status,
                paymentMethod: match.payment_method,
                brand: match.brand,
                notes: match.notes,
              },
            });
          }
        }
      } catch (err) {
        console.error('Track order Supabase error:', err);
      }
    }

    // Fallback to local orders
    const all = getAllOrders();
    const found = all.find((o) => {
      if (ref && o.id.toUpperCase().includes(ref)) return true;
      if (phone && o.customer.phone.replace(/[^0-9]/g, '').includes(phone)) return true;
      return false;
    });

    if (found) {
      return NextResponse.json({ success: true, order: found });
    }
    return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
  }

  // 2. Return all orders for admin dashboard
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const formattedOrders = data.map((row) => ({
          id: row.id,
          createdAt: row.created_at,
          customer: row.customer,
          items: row.items,
          subtotal: Number(row.subtotal),
          discount: Number(row.discount || 0),
          deliveryFee: Number(row.delivery_fee || 0),
          totalAmount: Number(row.total_amount),
          status: row.status,
          paymentMethod: row.payment_method,
          brand: row.brand,
          notes: row.notes,
        }));
        return NextResponse.json({ success: true, orders: formattedOrders });
      }
    } catch (err) {
      console.error('Supabase orders fetch error:', err);
    }
  }

  const orders = getAllOrders();
  return NextResponse.json({ success: true, orders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newOrder = createOrder(body);

    // ── 1. Save Order to Supabase ──────────────────────────────────────────
    if (isSupabaseConfigured && supabase) {
      await supabase.from('orders').insert([
        {
          id: newOrder.id,
          customer: newOrder.customer,
          items: newOrder.items,
          subtotal: newOrder.subtotal,
          discount: newOrder.discount,
          delivery_fee: newOrder.deliveryFee,
          total_amount: newOrder.totalAmount,
          status: newOrder.status,
          payment_method: newOrder.paymentMethod,
          brand: newOrder.brand,
          notes: newOrder.notes || null,
          created_at: newOrder.createdAt,
        },
      ]);
    }

    // ── 2. INVENTORY AUTO-DEDUCTION ────────────────────────────────────────
    // Decrement stock count for each purchased product item
    for (const item of newOrder.items) {
      const pId = item.productId;
      const qty = Number(item.quantity) || 1;

      // Update in Supabase
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: prodData } = await supabase
            .from('products')
            .select('stock_count')
            .eq('id', pId)
            .single();

          if (prodData) {
            const currentStock = Number(prodData.stock_count) || 0;
            const newStock = Math.max(0, currentStock - qty);
            await supabase
              .from('products')
              .update({
                stock_count: newStock,
                in_stock: newStock > 0,
              })
              .eq('id', pId);
          }
        } catch (stockErr) {
          console.error('Failed to deduct Supabase stock for product:', pId, stockErr);
        }
      }

      // Update in local memory store
      const localProd = productsStore.find((p) => p.id === pId);
      if (localProd) {
        localProd.stockCount = Math.max(0, localProd.stockCount - qty);
        localProd.inStock = localProd.stockCount > 0;
      }
    }

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ success: false, error: 'Invalid order payload' }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;
    const updated = updateOrderStatus(id, status);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('orders').update({ status }).eq('id', id);
    }

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 400 });
  }
}
