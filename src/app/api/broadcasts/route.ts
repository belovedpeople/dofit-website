import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  getAllBroadcasts,
  getLatestBroadcast,
  addBroadcast,
  deleteBroadcast,
  BroadcastNotification,
} from '@/data/broadcasts';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const SESSION_COOKIE = 'dofit_admin_session';

async function isAuthenticatedAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  return Boolean(session?.value);
}

// GET /api/broadcasts — fetch latest broadcast & history
export async function GET() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('pwa_broadcasts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped: BroadcastNotification[] = data.map((b) => ({
          id: b.id,
          title: b.title,
          body: b.body,
          url: b.url || '/shop',
          tag: b.tag,
          category: b.category || 'Drop Alert',
          createdAt: b.created_at,
          senderName: b.sender_name || 'Admin',
        }));
        return NextResponse.json({
          success: true,
          latest: mapped[0] || null,
          broadcasts: mapped,
        });
      }
    } catch (err) {
      console.warn('Supabase broadcasts read warning:', err);
    }
  }

  return NextResponse.json({
    success: true,
    latest: getLatestBroadcast(),
    broadcasts: getAllBroadcasts(),
  });
}

// POST /api/broadcasts — send a new push broadcast
export async function POST(request: NextRequest) {
  const isAuthed = await isAuthenticatedAdmin();
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized: Admin login required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, body: messageBody, url, category, senderName } = body;

    if (!title || !messageBody) {
      return NextResponse.json(
        { error: 'Notification title and message body are required' },
        { status: 400 }
      );
    }

    // 1. Add to local store
    const broadcast = addBroadcast({
      title,
      body: messageBody,
      url,
      category,
      senderName,
    });

    // 2. Persist to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('pwa_broadcasts').insert({
          id: broadcast.id,
          title: broadcast.title,
          body: broadcast.body,
          url: broadcast.url,
          tag: broadcast.tag,
          category: broadcast.category,
          sender_name: broadcast.senderName,
          created_at: broadcast.createdAt,
        });
      } catch (err) {
        console.warn('Supabase broadcast insert warning:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Push notification broadcasted successfully to all PWA devices and active visitors!',
      broadcast,
    });
  } catch (err) {
    console.error('Broadcast push error:', err);
    return NextResponse.json({ error: 'Failed to send broadcast' }, { status: 500 });
  }
}

// DELETE /api/broadcasts?id=... — delete past broadcast
export async function DELETE(request: NextRequest) {
  const isAuthed = await isAuthenticatedAdmin();
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized: Admin login required' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Broadcast id is required' }, { status: 400 });
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('pwa_broadcasts').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase broadcast delete warning:', err);
      }
    }

    deleteBroadcast(id);

    return NextResponse.json({ success: true, message: 'Broadcast deleted successfully' });
  } catch (err) {
    console.error('Delete broadcast error:', err);
    return NextResponse.json({ error: 'Failed to delete broadcast' }, { status: 500 });
  }
}

