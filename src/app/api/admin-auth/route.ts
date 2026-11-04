import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminCredentials, addAdminUser } from '@/data/adminUsers';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const SESSION_COOKIE = 'dofit_admin_session';

// POST /api/admin-auth — login with email & password
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    let authUser: { id: string; email: string; name: string; role: string } | null = null;

    // 1. Check in Supabase admin_users table if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', cleanEmail)
          .eq('password', password)
          .maybeSingle();

        if (!error && data) {
          authUser = {
            id: data.id,
            email: data.email,
            name: data.name,
            role: data.role,
          };

          // Update last_login in Supabase
          await supabase
            .from('admin_users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', data.id);
        }
      } catch (err) {
        console.warn('Supabase admin-auth lookup error, checking local store:', err);
      }
    }

    // 2. If not found in Supabase or Supabase is not ready, verify against local store
    if (!authUser) {
      const verified = verifyAdminCredentials(cleanEmail, password);
      if (verified) {
        authUser = verified;

        // Auto-seed to Supabase if configured so future Supabase lookups succeed
        if (isSupabaseConfigured && supabase) {
          try {
            await supabase.from('admin_users').upsert(
              {
                id: verified.id,
                email: verified.email,
                password: password,
                name: verified.name,
                role: verified.role,
                created_at: verified.createdAt,
                last_login: new Date().toISOString(),
              },
              { onConflict: 'email' }
            );
          } catch (seedErr) {
            console.warn('Supabase admin seed note:', seedErr);
          }
        }
      }
    }

    if (!authUser) {
      return NextResponse.json(
        { ok: false, error: 'Invalid email or password. Please verify your credentials.' },
        { status: 401 }
      );
    }

    // 3. Set encrypted session cookie with user payload
    const cookieStore = await cookies();
    const sessionPayload = JSON.stringify({
      id: authUser.id,
      email: authUser.email,
      name: authUser.name,
      role: authUser.role,
      authenticatedAt: new Date().toISOString(),
    });

    cookieStore.set(SESSION_COOKIE, Buffer.from(sessionPayload).toString('base64'), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.json({
      ok: true,
      user: authUser,
      message: `Welcome back, ${authUser.name}`,
    });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ ok: false, error: 'Authentication failed' }, { status: 500 });
  }
}

// GET /api/admin-auth — verify active session
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE);

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ authenticated: false });
    }

    try {
      const decoded = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString('utf-8'));
      if (decoded && decoded.email) {
        return NextResponse.json({
          authenticated: true,
          user: {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role,
          },
        });
      }
    } catch {
      // Legacy simple cookie fallback
      if (sessionCookie.value === 'authenticated') {
        return NextResponse.json({
          authenticated: true,
          user: {
            id: 'admin-master',
            email: 'brainwerkin@gmail.com',
            name: 'Lead Administrator',
            role: 'Super Admin',
          },
        });
      }
    }

    return NextResponse.json({ authenticated: false });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}

// DELETE /api/admin-auth — logout
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  return NextResponse.json({ ok: true, message: 'Logged out successfully' });
}
