import { NextRequest, NextResponse } from 'next/server';
import { addSubscriber, getAllSubscribers, deleteSubscriber, Subscriber } from '@/data/subscribers';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// GET /api/newsletter — list all subscribers for Admin
export async function GET() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mapped: Subscriber[] = data.map((row) => ({
          id: row.id,
          email: row.email,
          createdAt: row.created_at,
          source: row.source || 'Stay Plugged In',
          status: row.status || 'active',
        }));
        return NextResponse.json({ success: true, subscribers: mapped, count: mapped.length });
      }
    } catch (err) {
      console.warn('Supabase newsletter fetch error, using local store:', err);
    }
  }

  const subs = getAllSubscribers();
  return NextResponse.json({ success: true, subscribers: subs, count: subs.length });
}

// POST /api/newsletter — subscribe a new email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.email?.trim().toLowerCase();
    const source = body.source || 'Stay Plugged In';

    if (!email || !email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // 1. Add to local in-memory store
    const { subscriber, isNew } = addSubscriber(email, source);

    // 2. Persist to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('newsletter_subscribers').upsert(
          {
            email,
            source,
            status: 'active',
            created_at: subscriber.createdAt,
          },
          { onConflict: 'email' }
        );
      } catch (err) {
        console.warn('Supabase newsletter write warning:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: isNew
        ? "You're in! 🎉 Welcome to the Dofit & Àṣà VIP drop list."
        : "You're already subscribed! You'll receive first-look access to our next drop.",
      subscriber,
      isNew,
    });
  } catch (err) {
    console.error('Newsletter subscribe error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to process subscription. Please try again.' },
      { status: 500 }
    );
  }
}

// DELETE /api/newsletter?id=sub-123
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing subscriber ID' }, { status: 400 });
    }

    deleteSubscriber(id);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('newsletter_subscribers').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase newsletter delete warning:', err);
      }
    }

    return NextResponse.json({ success: true, message: 'Subscriber removed' });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to remove subscriber' }, { status: 500 });
  }
}
