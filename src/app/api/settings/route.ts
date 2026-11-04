import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { siteSettingsStore, updateSettings, defaultSettings, SiteSettings } from '@/data/settings';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const SESSION_COOKIE = 'dofit_admin_session';

async function isAuthenticatedAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  return Boolean(session?.value);
}

// GET /api/settings — get current public settings & maintenance status
export async function GET() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase
        .from('showcase_content')
        .select('content')
        .eq('id', 'site_settings')
        .maybeSingle();

      if (data?.content && typeof data.content === 'object') {
        updateSettings(data.content);
        return NextResponse.json({
          success: true,
          settings: siteSettingsStore,
          source: 'supabase',
        });
      }
    } catch (err) {
      console.warn('Supabase settings query warning:', err);
    }
  }

  return NextResponse.json({
    success: true,
    settings: siteSettingsStore,
    source: 'local',
  });
}

// POST /api/settings — update override settings (Admin Only)
export async function POST(request: NextRequest) {
  const isAuthed = await isAuthenticatedAdmin();
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
  }

  try {
    const body: Partial<SiteSettings> = await request.json();
    const cookieStore = await cookies();
    const sessionVal = cookieStore.get(SESSION_COOKIE)?.value;
    let adminName = 'Admin';
    if (sessionVal) {
      try {
        const parsed = JSON.parse(Buffer.from(sessionVal, 'base64').toString('utf-8'));
        adminName = parsed.name || parsed.email || 'Admin';
      } catch {
        // ignore
      }
    }

    const updated = updateSettings(body, adminName);

    // Persist to Supabase showcase_content store
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('showcase_content').upsert({
          id: 'site_settings',
          content: updated,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Supabase settings upsert error:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Store settings updated successfully',
      settings: updated,
    });
  } catch (err) {
    console.error('Settings update error:', err);
    return NextResponse.json({ error: 'Failed to update store settings' }, { status: 500 });
  }
}

