'use client';
import { useState, useEffect, createContext, useContext } from 'react';
import styles from './AdminAuthGate.module.css';

interface AdminUserSession {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AdminAuthContextType {
  user: AdminUserSession | null;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  logout: async () => {},
});

export const useAdminAuth = () => useContext(AdminAuthContext);

export default function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'auth' | 'unauth'>('loading');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<AdminUserSession | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/admin-auth')
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated && d.user) {
          setUser(d.user);
          setStatus('auth');
        } else {
          setStatus('unauth');
        }
      })
      .catch(() => setStatus('unauth'));
  }, []);

  const login = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        setUser(data.user);
        setStatus('auth');
      } else {
        setError(data.error || 'Invalid credentials. Access denied.');
      }
    } catch {
      setError('Connection error. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch('/api/admin-auth', { method: 'DELETE' });
    setUser(null);
    setStatus('unauth');
    setPassword('');
  };

  if (status === 'loading') {
    return (
      <div className={styles.loader}>
        <div className={styles.spinner} />
        <span>Verifying credentials...</span>
      </div>
    );
  }

  if (status === 'unauth') {
    return (
      <div className={styles.gate}>
        <div className={styles.gateCard}>
          <div className={styles.gateLogo}>
            <span className={styles.logoDot} />
            DOFIT WEARS · MANAGEMENT CONSOLE
          </div>
          <h2 className={styles.gateTitle}>Staff &amp; Admin Sign In</h2>
          <p className={styles.gateSub}>
            Enter your authorized staff email and security password
          </p>

          <form className={styles.gateForm} onSubmit={login}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="admin-email">
                Staff Email
              </label>
              <input
                id="admin-email"
                className={styles.gateInput}
                type="email"
                placeholder="admin@dofit.fit"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
                required
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="admin-password">
                Password
              </label>
              <input
                id="admin-password"
                className={styles.gateInput}
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {error && <p className={styles.gateError}>{error}</p>}

            <button type="submit" className={styles.gateBtn} disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In to Console →'}
            </button>
          </form>

          <div className={styles.gateBadge}>
            <span>🔒</span>
            <span>Secured via Supabase Postgres &amp; Multi-Staff Access</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminAuthContext.Provider value={{ user, logout }}>
      {children}
      <button className={styles.logoutBtn} onClick={logout} title="Sign Out">
        🔓 Sign Out {user?.name ? `(${user.name})` : ''}
      </button>
    </AdminAuthContext.Provider>
  );
}
