import { NextRequest, NextResponse } from 'next/server';
import { showcaseStore, updateShowcaseStore, defaultShowcaseContent, ShowcaseContent } from '@/data/showcase';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
};

// GET /api/showcase — fetch current landing page showcase content
export async function GET() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('showcase_content')
        .select('content')
        .eq('id', 'main')
        .maybeSingle();

      if (!error && data?.content && typeof data.content === 'object') {
        updateShowcaseStore(data.content);
        return NextResponse.json(
          { showcase: data.content, source: 'supabase' },
          { headers: NO_CACHE_HEADERS }
        );
      }
      if (error) {
        console.warn('Supabase showcase_content lookup warning:', error.message);
      }
    } catch (err) {
      console.error('Supabase showcase read error:', err);
    }
  }

  return NextResponse.json(
    { showcase: showcaseStore, source: 'local' },
    { headers: NO_CACHE_HEADERS }
  );
}

// POST /api/showcase — update showcase data and persist to Supabase
export async function POST(request: NextRequest) {
  try {
    const body: Partial<ShowcaseContent> = await request.json();
    const updated = updateShowcaseStore(body);

    if (isSupabaseConfigured && supabase) {
      try {
        // Upsert matching public.showcase_content schema: (id, content, updated_at)
        const { error } = await supabase
          .from('showcase_content')
          .upsert({
            id: 'main',
            content: updated,
            updated_at: new Date().toISOString(),
          });

        if (error) {
          console.error('Supabase showcase upsert error:', error);
          return NextResponse.json(
            {
              error: `Database save failed: ${error.message}`,
              code: error.code,
              hint: error.hint,
            },
            { status: 500, headers: NO_CACHE_HEADERS }
          );
        }
      } catch (err: any) {
        console.error('Supabase showcase upsert exception:', err);
        return NextResponse.json(
          { error: err?.message || 'Database connection error during save' },
          { status: 500, headers: NO_CACHE_HEADERS }
        );
      }
    }

    return NextResponse.json(
      { success: true, showcase: updated },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: any) {
    console.error('Showcase update error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to update showcase' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
