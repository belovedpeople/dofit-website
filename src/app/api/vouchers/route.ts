import { NextRequest, NextResponse } from 'next/server';
import { vouchersStore, createVoucher, Voucher } from '@/data/vouchers';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// GET /api/vouchers — return all vouchers
export async function GET() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('vouchers')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const formatted: Voucher[] = data.map((row) => ({
          id: row.id,
          code: row.code,
          discountType: row.discount_type,
          discountValue: Number(row.discount_value),
          minSpend: Number(row.min_spend || 0),
          maxUses: Number(row.max_uses || 0),
          usedCount: Number(row.used_count || 0),
          expiresAt: row.expires_at,
          isActive: Boolean(row.is_active),
          createdAt: row.created_at,
        }));
        return NextResponse.json({ success: true, vouchers: formatted });
      }
    } catch (err) {
      console.error('Supabase vouchers fetch error:', err);
    }
  }

  return NextResponse.json({ success: true, vouchers: vouchersStore });
}

// POST /api/vouchers — create a new voucher
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, discountType, discountValue, minSpend, maxUses, expiresAt, isActive } = body;

    if (!code || !discountValue) {
      return NextResponse.json({ error: 'Code and discount value are required' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();

    const newVoucher = createVoucher({
      code: cleanCode,
      discountType: discountType === 'fixed' ? 'fixed' : 'percentage',
      discountValue: Number(discountValue),
      minSpend: Number(minSpend || 0),
      maxUses: Number(maxUses || 0),
      expiresAt: expiresAt || null,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('vouchers').insert([
          {
            id: newVoucher.id,
            code: newVoucher.code,
            discount_type: newVoucher.discountType,
            discount_value: newVoucher.discountValue,
            min_spend: newVoucher.minSpend,
            max_uses: newVoucher.maxUses,
            used_count: 0,
            expires_at: newVoucher.expiresAt,
            is_active: newVoucher.isActive,
            created_at: newVoucher.createdAt,
          },
        ]);
      } catch (err) {
        console.error('Supabase voucher insert error:', err);
      }
    }

    return NextResponse.json({ success: true, voucher: newVoucher }, { status: 201 });
  } catch (err) {
    console.error('Create voucher error:', err);
    return NextResponse.json({ error: 'Failed to create voucher' }, { status: 500 });
  }
}

