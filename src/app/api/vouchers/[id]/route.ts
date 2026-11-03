import { NextRequest, NextResponse } from 'next/server';
import { updateVoucher, deleteVoucher, vouchersStore } from '@/data/vouchers';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// PUT /api/vouchers/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const updated = updateVoucher(id, body);

    if (isSupabaseConfigured && supabase) {
      try {
        const updatePayload: Record<string, any> = {};
        if (body.isActive !== undefined) updatePayload.is_active = Boolean(body.isActive);
        if (body.discountValue !== undefined) updatePayload.discount_value = Number(body.discountValue);
        if (body.discountType !== undefined) updatePayload.discount_type = body.discountType;
        if (body.minSpend !== undefined) updatePayload.min_spend = Number(body.minSpend);
        if (body.maxUses !== undefined) updatePayload.max_uses = Number(body.maxUses);
        if (body.expiresAt !== undefined) updatePayload.expires_at = body.expiresAt;

        await supabase.from('vouchers').update(updatePayload).eq('id', id);
      } catch (err) {
        console.error('Supabase voucher update error:', err);
      }
    }

    if (!updated) {
      return NextResponse.json({ error: 'Voucher not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, voucher: updated });
  } catch (err) {
    console.error('Update voucher error:', err);
    return NextResponse.json({ error: 'Failed to update voucher' }, { status: 500 });
  }
}

// DELETE /api/vouchers/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('vouchers').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase voucher delete error:', err);
    }
  }

  const ok = deleteVoucher(id);
  return NextResponse.json({ success: ok });
}
