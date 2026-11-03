import { NextResponse } from 'next/server';
import { getAllOrders, createOrder, updateOrderStatus, Order } from '@/data/orders';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function GET() {
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
