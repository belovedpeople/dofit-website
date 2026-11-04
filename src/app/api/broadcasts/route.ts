import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  BroadcastNotification,
  getAllBroadcasts,
  setBroadcastsStore,
} from '@/data/broadcasts';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const SESSION_COOKIE = 'dofit_admin_session';
const BROADCAST_STORE_SLUG = 'pwa_broadcasts_store';

async function isAuthenticatedAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  return Boolean(session?.value);
}

// Helper to fetch broadcasts from Supabase showcase_content
async function getStoredBroadcasts(): Promise<BroadcastNotification[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('showcase_content')
        .select('content')
        .eq('slug', BROADCAST_STORE_SLUG)
        .single();

      if (!error && data?.content && Array.isArray(data.content.broadcasts)) {
        const cleaned = (data.content.broadcasts as BroadcastNotification[]).filter(
          (b) => b.id !== 'broadcast-1' && b.id !== 'broadcast-2'
        );
        setBroadcastsStore(cleaned);
        return cleaned;
      }
    } catch (err) {
      console.warn('Supabase broadcasts read warning:', err);
    }
  }
  return getAllBroadcasts().filter((b) => b.id !== 'broadcast-1' && b.id !== 'broadcast-2');
}

// Helper to persist broadcasts to Supabase showcase_content
async function persistBroadcasts(list: BroadcastNotification[]): Promise<void> {
  setBroadcastsStore(list);
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('showcase_content')
        .upsert(
          {
            slug: BROADCAST_STORE_SLUG,
            content: { broadcasts: list, updatedAt: new Date().toISOString() },
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'slug' }
        );
    } catch (err) {
      console.warn('Supabase broadcasts save warning:', err);
    }
  }
}

// GET /api/broadcasts — fetch latest broadcast & history
export async function GET() {
  const broadcasts = await getStoredBroadcasts();
  const sorted = [...broadcasts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return NextResponse.json({
    success: true,
    latest: sorted[0] || null,
    broadcasts: sorted,
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

    const currentList = await getStoredBroadcasts();

    const newBroadcast: BroadcastNotification = {
      id: `broadcast-${Date.now()}`,
      title: title.trim(),
      body: messageBody.trim(),
      url: url?.trim() || '/shop',
      tag: `dofit-${Date.now()}`,
      category: category || 'Drop Alert',
      createdAt: new Date().toISOString(),
      senderName: senderName || 'Admin Desk',
    };

    const updated = [newBroadcast, ...currentList.filter((b) => b.id !== newBroadcast.id)];
    await persistBroadcasts(updated);

    return NextResponse.json({
      success: true,
      message: 'Push notification broadcasted successfully to all PWA devices and active visitors!',
      broadcast: newBroadcast,
    });
  } catch (err) {
    console.error('Broadcast push error:', err);
    return NextResponse.json({ error: 'Failed to send broadcast' }, { status: 500 });
  }
}

// DELETE /api/broadcasts?id=... — delete broadcast permanently
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

    const currentList = await getStoredBroadcasts();
    const updated = currentList.filter((b) => b.id !== id);
    await persistBroadcasts(updated);

    return NextResponse.json({
      success: true,
      message: 'Broadcast deleted permanently',
    });
  } catch (err) {
    console.error('Delete broadcast error:', err);
    return NextResponse.json({ error: 'Failed to delete broadcast' }, { status: 500 });
  }
}
