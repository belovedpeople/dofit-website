import { NextRequest, NextResponse } from 'next/server';
import { showcaseStore, updateShowcaseStore, defaultShowcaseContent, ShowcaseContent } from '@/data/showcase';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// GET /api/showcase
export async function GET() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('showcase_content')
        .select('*')
        .eq('id', 'main')
        .single();

      if (!error && data && data.content) {
        updateShowcaseStore(data.content);
        return NextResponse.json({ showcase: data.content, source: 'supabase' });
      }
    } catch (err) {
      console.error('Supabase showcase read error:', err);
    }
  }

  return NextResponse.json({ showcase: showcaseStore, source: 'local' });
}

// POST /api/showcase — update showcase data
export async function POST(request: NextRequest) {
  try {
    const body: Partial<ShowcaseContent> = await request.json();
    const updated = updateShowcaseStore(body);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('showcase_content')
          .upsert({
            id: 'main',
            content: updated,
            updated_at: new Date().toISOString(),
          });
      } catch (err) {
        console.error('Supabase showcase upsert error:', err);
      }
    }

    return NextResponse.json({ success: true, showcase: updated });
  } catch (err) {
    console.error('Showcase update error:', err);
    return NextResponse.json({ error: 'Failed to update showcase' }, { status: 500 });
  }
}
