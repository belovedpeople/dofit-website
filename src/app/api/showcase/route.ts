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

// GET /api/showcase
export async function GET() {
  if (isSupabaseConfigured && supabase) {
    try {
      // 1. Try lookup by id 'main'
      let { data, error } = await supabase
        .from('showcase_content')
        .select('*')
        .eq('id', 'main')
        .maybeSingle();

      // 2. Fallback: try lookup by slug 'main'
      if (!data?.content) {
        const bySlug = await supabase
          .from('showcase_content')
          .select('*')
          .eq('slug', 'main')
          .maybeSingle();
        if (bySlug.data?.content) {
          data = bySlug.data;
          error = null;
        }
      }

      if (!error && data && data.content) {
        updateShowcaseStore(data.content);
        return NextResponse.json(
          { showcase: data.content, source: 'supabase' },
          { headers: NO_CACHE_HEADERS }
        );
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

// POST /api/showcase — update showcase data
export async function POST(request: NextRequest) {
  try {
    const body: Partial<ShowcaseContent> = await request.json();
    const updated = updateShowcaseStore(body);

    if (isSupabaseConfigured && supabase) {
      try {
        // Try upserting with id
        const resId = await supabase
          .from('showcase_content')
          .upsert({
            id: 'main',
            slug: 'main',
            content: updated,
            updated_at: new Date().toISOString(),
          });

        if (resId.error) {
          console.warn('Upsert with id warning, attempting slug conflict...', resId.error);
          await supabase
            .from('showcase_content')
            .upsert(
              {
                slug: 'main',
                content: updated,
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'slug' }
            );
        }
      } catch (err) {
        console.error('Supabase showcase upsert error:', err);
      }
    }

    return NextResponse.json(
      { success: true, showcase: updated },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err) {
    console.error('Showcase update error:', err);
    return NextResponse.json({ error: 'Failed to update showcase' }, { status: 500 });
  }
}

