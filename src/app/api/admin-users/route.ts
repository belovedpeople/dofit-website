import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  getAllAdminUsers,
  addAdminUser,
  deleteAdminUser,
  adminUsersStore,
} from '@/data/adminUsers';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const SESSION_COOKIE = 'dofit_admin_session';

async function isAuthenticatedAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  return Boolean(session?.value);
}

// GET /api/admin-users — list all admin accounts (passwords omitted)
export async function GET() {
  const authed = await isAuthenticatedAdmin();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }

  // 1. Try fetching from Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id, email, name, role, created_at, last_login')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, users: data });
      }
    } catch (err) {
      console.warn('Supabase admin_users list warning:', err);
    }
  }

  // Fallback to local store
  const users = getAllAdminUsers();
  return NextResponse.json({ success: true, users });
}

// POST /api/admin-users — add a new admin or worker
export async function POST(request: NextRequest) {
  const authed = await isAuthenticatedAdmin();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { email, password, name, role } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Add to local store
    const { user, isNew } = addAdminUser({
      email: cleanEmail,
      password,
      name: name?.trim() || 'Store Staff',
      role: role || 'Store Admin',
    });

    // 2. Persist to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('admin_users').upsert(
          {
            id: user.id,
            email: cleanEmail,
            password,
            name: user.name,
            role: user.role,
            created_at: user.createdAt,
          },
          { onConflict: 'email' }
        );
      } catch (err) {
        console.warn('Supabase admin_users upsert warning:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: isNew
        ? `Successfully registered ${user.name} (${user.email}) as ${user.role}`
        : `Updated credentials for ${user.email}`,
      user,
    });
  } catch (err) {
    console.error('Error adding admin user:', err);
    return NextResponse.json({ error: 'Failed to add admin user' }, { status: 500 });
  }
}

// DELETE /api/admin-users?id=admin-123 — remove staff member
export async function DELETE(request: NextRequest) {
  const authed = await isAuthenticatedAdmin();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const removed = deleteAdminUser(id);
    if (!removed) {
      return NextResponse.json(
        { error: 'Cannot remove the primary master administrator (brainwerkin@gmail.com)' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('admin_users').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase admin delete warning:', err);
      }
    }

    return NextResponse.json({ success: true, message: 'User access revoked' });
  } catch {
    return NextResponse.json({ error: 'Failed to remove admin user' }, { status: 500 });
  }
}

