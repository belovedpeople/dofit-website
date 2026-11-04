export interface AdminUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'Super Admin' | 'Store Admin' | 'Fulfillment Staff';
  createdAt: string;
  lastLogin?: string;
}

// Initial Admin Users Store
// Primary master administrator requested: brainwerkin@gmail.com / dofit2026admin
export let adminUsersStore: AdminUser[] = [
  {
    id: 'admin-master',
    email: 'brainwerkin@gmail.com',
    password: 'dofit2026admin',
    name: 'Lead Administrator',
    role: 'Super Admin',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'admin-dolapo',
    email: 'dolapo@dofit.fit',
    password: 'dofit2026admin',
    name: 'Dolapo',
    role: 'Super Admin',
    createdAt: '2026-11-04T00:00:00.000Z',
  },
];

export function getAllAdminUsers(): Omit<AdminUser, 'password'>[] {
  return adminUsersStore.map(({ password: _, ...user }) => user);
}

export function getAdminByEmail(email: string): AdminUser | undefined {
  const clean = email.trim().toLowerCase();
  return adminUsersStore.find((u) => u.email.toLowerCase() === clean);
}

export function verifyAdminCredentials(
  email: string,
  password: string
): Omit<AdminUser, 'password'> | null {
  const cleanEmail = email.trim().toLowerCase();
  const user = adminUsersStore.find(
    (u) => u.email.toLowerCase() === cleanEmail && u.password === password
  );

  if (user) {
    user.lastLogin = new Date().toISOString();
    const { password: _, ...safeUser } = user;
    return safeUser;
  }

  // Also support default master fallback
  if (
    cleanEmail === 'brainwerkin@gmail.com' &&
    password === 'dofit2026admin'
  ) {
    return {
      id: 'admin-master',
      email: 'brainwerkin@gmail.com',
      name: 'Lead Administrator',
      role: 'Super Admin',
      createdAt: '2026-01-01T00:00:00.000Z',
      lastLogin: new Date().toISOString(),
    };
  }

  return null;
}

export function addAdminUser(data: {
  email: string;
  password: string;
  name: string;
  role?: 'Super Admin' | 'Store Admin' | 'Fulfillment Staff';
}): { user: Omit<AdminUser, 'password'>; isNew: boolean } {
  const cleanEmail = data.email.trim().toLowerCase();
  const existing = adminUsersStore.find((u) => u.email.toLowerCase() === cleanEmail);

  if (existing) {
    existing.name = data.name || existing.name;
    existing.password = data.password || existing.password;
    if (data.role) existing.role = data.role;
    const { password: _, ...safeExisting } = existing;
    return { user: safeExisting, isNew: false };
  }

  const newUser: AdminUser = {
    id: `admin-${Date.now()}`,
    email: cleanEmail,
    password: data.password,
    name: data.name || 'Store Staff',
    role: data.role || 'Store Admin',
    createdAt: new Date().toISOString(),
  };

  adminUsersStore.push(newUser);
  const { password: _, ...safeNew } = newUser;
  return { user: safeNew, isNew: true };
}

export function updateAdminPassword(emailOrId: string, newPass: string): boolean {
  const clean = emailOrId.trim().toLowerCase();
  const user = adminUsersStore.find(
    (u) => u.id === emailOrId || u.email.toLowerCase() === clean
  );
  if (user) {
    user.password = newPass;
    return true;
  }
  return false;
}

export function deleteAdminUser(id: string): boolean {
  // Prevent deleting the primary master admin
  const target = adminUsersStore.find((u) => u.id === id);
  if (target?.email.toLowerCase() === 'brainwerkin@gmail.com') {
    return false;
  }

  const initial = adminUsersStore.length;
  adminUsersStore = adminUsersStore.filter((u) => u.id !== id);
  return adminUsersStore.length < initial;
}

