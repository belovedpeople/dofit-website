import { NextRequest, NextResponse } from 'next/server';
import { getAllVouchers, Voucher } from '@/data/vouchers';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { code, subtotal } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ success: false, error: 'Please enter a voucher code' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();
    const cartSubtotal = Number(subtotal) || 0;

    let voucher: Voucher | null = null;

    // Check Supabase first
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('vouchers')
          .select('*')
          .eq('code', cleanCode)
          .single();

        if (!error && data) {
          voucher = {
            id: data.id,
            code: data.code,
            discountType: data.discount_type,
            discountValue: Number(data.discount_value),
            minSpend: Number(data.min_spend || 0),
            maxUses: Number(data.max_uses || 0),
            usedCount: Number(data.used_count || 0),
            expiresAt: data.expires_at,
            isActive: Boolean(data.is_active),
            createdAt: data.created_at,
          };
        }
      } catch (err) {
        console.error('Supabase voucher apply error:', err);
      }
    }

    // Fallback to local vouchers
    if (!voucher) {
      const all = getAllVouchers();
      voucher = all.find((v) => v.code.toUpperCase() === cleanCode) || null;
    }

    // Validation checks
    if (!voucher) {
      return NextResponse.json({ success: false, error: 'Invalid voucher code' }, { status: 404 });
    }

    if (!voucher.isActive) {
      return NextResponse.json({ success: false, error: 'This voucher is currently inactive' }, { status: 400 });
    }

    // Check expiration
    if (voucher.expiresAt) {
      const expiry = new Date(voucher.expiresAt).getTime();
      if (Date.now() > expiry) {
        return NextResponse.json({ success: false, error: 'This voucher has expired' }, { status: 400 });
      }
    }

    // Check usage limit
    if (voucher.maxUses > 0 && voucher.usedCount >= voucher.maxUses) {
      return NextResponse.json({ success: false, error: 'This voucher has reached its maximum usage limit' }, { status: 400 });
    }

    // Check minimum spend
    if (voucher.minSpend > 0 && cartSubtotal < voucher.minSpend) {
      return NextResponse.json({
        success: false,
        error: `Minimum spend of ₦${voucher.minSpend.toLocaleString()} required to use this voucher`,
      }, { status: 400 });
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (voucher.discountType === 'percentage') {
      discountAmount = Math.round(cartSubtotal * (voucher.discountValue / 100));
    } else {
      discountAmount = Math.min(cartSubtotal, voucher.discountValue);
    }

    return NextResponse.json({
      success: true,
      code: voucher.code,
      discount: discountAmount,
      discountType: voucher.discountType,
      discountValue: voucher.discountValue,
      message: `${voucher.discountType === 'percentage' ? `${voucher.discountValue}%` : `₦${voucher.discountValue.toLocaleString()}`} discount applied!`,
    });
  } catch (err) {
    console.error('Voucher apply error:', err);
    return NextResponse.json({ success: false, error: 'Failed to apply voucher' }, { status: 500 });
  }
}

