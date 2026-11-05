import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { showcaseStore, updateShowcaseStore, defaultShowcaseContent, ShowcaseContent } from '@/data/showcase';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 30;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
};

const CLOUDINARY_SHOWCASE_PUBLIC_ID = 'dofit/config/showcase_data';

/** Save showcase JSON to Cloudinary as a raw file — true cross-deploy persistence */
async function saveToCloudinary(data: ShowcaseContent): Promise<boolean> {
  try {
    const json = JSON.stringify(data);
    const base64 = Buffer.from(json).toString('base64');
    const dataUri = `data:application/json;base64,${base64}`;

    await cloudinary.uploader.upload(dataUri, {
      public_id: CLOUDINARY_SHOWCASE_PUBLIC_ID,
      resource_type: 'raw',
      overwrite: true,
      invalidate: true,
    });
    return true;
  } catch (err) {
    console.error('[Showcase] Cloudinary save error:', err);
    return false;
  }
}

/** Load showcase JSON from Cloudinary */
async function loadFromCloudinary(): Promise<ShowcaseContent | null> {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    if (!cloudName) return null;

    // Fetch the raw JSON file from Cloudinary CDN with cache-busting
    const url = `https://res.cloudinary.com/${cloudName}/raw/upload/${CLOUDINARY_SHOWCASE_PUBLIC_ID}.json?t=${Date.now()}`;
    const res = await fetch(url, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
    });

    if (!res.ok) return null;

    const text = await res.text();
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === 'object' && parsed.dofitHero) {
      return parsed as ShowcaseContent;
    }
    return null;
  } catch (err) {
    console.warn('[Showcase] Cloudinary load warning:', err);
    return null;
  }
}

/** Save to Supabase if configured */
async function saveToSupabase(data: ShowcaseContent): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase
      .from('showcase_content')
      .upsert({
        id: 'main',
        content: data,
        updated_at: new Date().toISOString(),
      });
    if (error) {
      console.warn('[Showcase] Supabase save warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Showcase] Supabase exception:', err);
    return false;
  }
}

/** Load from Supabase if configured */
async function loadFromSupabase(): Promise<ShowcaseContent | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('showcase_content')
      .select('content')
      .eq('id', 'main')
      .maybeSingle();

    if (!error && data?.content && typeof data.content === 'object' && (data.content as any).dofitHero) {
      return data.content as ShowcaseContent;
    }
    return null;
  } catch (err) {
    console.warn('[Showcase] Supabase load warning:', err);
    return null;
  }
}

// GET /api/showcase — load persisted showcase content
export async function GET() {
  // 1. Try Supabase first (if configured)
  const supabaseData = await loadFromSupabase();
  if (supabaseData) {
    updateShowcaseStore(supabaseData);
    return NextResponse.json(
      { showcase: supabaseData, source: 'supabase' },
      { headers: NO_CACHE_HEADERS }
    );
  }

  // 2. Fall back to Cloudinary JSON store (always available)
  const cloudinaryData = await loadFromCloudinary();
  if (cloudinaryData) {
    updateShowcaseStore(cloudinaryData);
    return NextResponse.json(
      { showcase: cloudinaryData, source: 'cloudinary' },
      { headers: NO_CACHE_HEADERS }
    );
  }

  // 3. Last resort: in-memory defaults
  return NextResponse.json(
    { showcase: showcaseStore, source: 'default' },
    { headers: NO_CACHE_HEADERS }
  );
}

// POST /api/showcase — persist showcase data
export async function POST(request: NextRequest) {
  try {
    const body: Partial<ShowcaseContent> = await request.json();

    // Deep-merge the update into the full current state
    const current = { ...defaultShowcaseContent, ...showcaseStore };
    const updated: ShowcaseContent = {
      ...current,
      ...body,
      dofitHero: { ...current.dofitHero, ...(body.dofitHero || {}) },
      asaHero: { ...current.asaHero, ...(body.asaHero || {}) },
      asaStory: { ...current.asaStory, ...(body.asaStory || {}) },
      dofitInsta: body.dofitInsta ?? current.dofitInsta,
      asaGallery: body.asaGallery ?? current.asaGallery,
      socialLinks: { ...current.socialLinks, ...(body.socialLinks || {}) },
    };

    updateShowcaseStore(updated);

    // Persist to both storage backends in parallel (fire and hope)
    const [supabaseOk, cloudinaryOk] = await Promise.all([
      saveToSupabase(updated),
      saveToCloudinary(updated),
    ]);

    if (!cloudinaryOk && !supabaseOk) {
      return NextResponse.json(
        { error: 'Failed to persist showcase data to any storage backend. Check Cloudinary/Supabase credentials.' },
        { status: 500, headers: NO_CACHE_HEADERS }
      );
    }

    return NextResponse.json(
      {
        success: true,
        showcase: updated,
        saved: { cloudinary: cloudinaryOk, supabase: supabaseOk },
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: any) {
    console.error('[Showcase] POST error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to update showcase' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
