'use client';
import { useState, useEffect } from 'react';
import styles from './AdminAuthGate.module.css';

export default function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'auth' | 'unauth'>('loading');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/admin-auth')
      .then((r) => r.json())
      .then((d) => setStatus(d.authenticated ? 'auth' : 'unauth'))
      .catch(() => setStatus('unauth'));
  }, []);

  const login = async () => {
    if (!password.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus('auth');
      } else {
        setError('Incorrect password. Try again.');
      }
    } catch {
      setError('Connection error. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch('/api/admin-auth', { method: 'DELETE' });
    setStatus('unauth');
    setPassword('');
  };

  if (status === 'loading') {
    return (
      <div className={styles.loader}>
        <div className={styles.spinner} />
        <span>Authenticating...</span>
      </div>
    );
  }

  if (status === 'unauth') {
    return (
      <div className={styles.gate}>
        <div className={styles.gateCard}>
          <div className={styles.gateLogo}>
            <span className={styles.logoDot} />
            DOFIT ADMIN
          </div>
          <h2 className={styles.gateTitle}>Restricted Access</h2>
          <p className={styles.gateSub}>Enter your admin password to continue</p>

          <div className={styles.gateForm}>
            <input
              className={styles.gateInput}
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && login()}
              autoFocus
            />
            {error && <p className={styles.gateError}>{error}</p>}
            <button className={styles.gateBtn} onClick={login} disabled={loading}>
              {loading ? 'Checking...' : 'Access Dashboard →'}
            </button>
          </div>

          <p className={styles.gateHint}>
            Default password: <code>dofit2026admin</code> — set <code>ADMIN_PASSWORD</code> env var to override
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      <button className={styles.logoutBtn} onClick={logout} title="Logout">
        🔓 Logout
      </button>
    </>
  );
}

