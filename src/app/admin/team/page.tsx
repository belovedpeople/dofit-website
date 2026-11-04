'use client';
import { useState, useEffect } from 'react';
import styles from '../admin.module.css';

interface StaffUser {
  id: string;
  email: string;
  name: string;
  role: 'Super Admin' | 'Store Admin' | 'Fulfillment Staff';
  created_at?: string;
  createdAt?: string;
  last_login?: string;
  lastLogin?: string;
}

export default function AdminTeamPage() {
  const [team, setTeam] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Super Admin' | 'Store Admin' | 'Fulfillment Staff'>('Store Admin');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin-users');
      const data = await res.json();
      if (data.users) {
        setTeam(data.users);
      }
    } catch (err) {
      console.error('Failed to fetch admin users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setFormError('Please enter both email and password.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    setFormError('');
    setFormSuccess('');

    try {
      const res = await fetch('/api/admin-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || 'Store Staff',
          email: email.trim().toLowerCase(),
          password,
          role,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFormSuccess(data.message || 'Staff member added successfully!');
        setName('');
        setEmail('');
        setPassword('');
        fetchTeam();
        setTimeout(() => {
          setShowAddModal(false);
          setFormSuccess('');
        }, 1500);
      } else {
        setFormError(data.error || 'Failed to add staff member.');
      }
    } catch {
      setFormError('Connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevoke = async (id: string, userEmail: string) => {
    if (userEmail.toLowerCase() === 'brainwerkin@gmail.com') {
      alert('The primary master administrator (brainwerkin@gmail.com) cannot be deleted.');
      return;
    }

    if (!confirm(`Are you sure you want to revoke admin access for ${userEmail}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin-users?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setTeam((prev) => prev.filter((u) => u.id !== id));
      } else {
        alert(data.error || 'Failed to revoke access.');
      }
    } catch {
      alert('Error revoking access. Please try again.');
    }
  };

  return (
    <div>
      {/* Header and Add Button */}
      <div className={styles.tableHeaderRow} style={{ marginBottom: '24px' }}>
        <div>
          <h2 className={styles.tableTitle}>Staff &amp; Admin Management</h2>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>
            Manage authorized team accounts, assign store roles, and grant worker credentials via Supabase
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowAddModal(true);
            setFormError('');
            setFormSuccess('');
          }}
          className={styles.actionBtn}
          style={{ background: 'var(--pink)', color: '#fff', border: 'none', padding: '10px 20px' }}
        >
          ➕ Add New Admin / Worker
        </button>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid} style={{ marginBottom: '28px' }}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total Active Staff</span>
          <div className={styles.kpiValue} style={{ color: 'var(--pink)' }}>
            {team.length}
          </div>
          <span className={styles.kpiSub}>Authorized dashboard logins</span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Primary Master Account</span>
          <div className={styles.kpiValue} style={{ fontSize: '16px', color: '#38BDF8', marginTop: '4px' }}>
            brainwerkin@gmail.com
          </div>
          <span className={styles.kpiSub}>Super Administrator</span>
        </div>

        <div className={`${styles.kpiCard} ${styles.kpiCardAsa}`}>
          <span className={styles.kpiLabel}>Security Status</span>
          <div className={styles.kpiValue} style={{ color: 'var(--asa-gold)', fontSize: '20px' }}>
            ✓ Protected
          </div>
          <span className={styles.kpiSub}>Encrypted HTTP-Only Sessions</span>
        </div>
      </div>

      {/* Team Table */}
      <div className={styles.tableCard}>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Team Member</th>
                <th>Email Address</th>
                <th>Role &amp; Permissions</th>
                <th>Added Date</th>
                <th>Last Login</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '32px' }}>
                    Loading authorized team members...
                  </td>
                </tr>
              ) : team.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'rgba(255,255,255,0.4)' }}>
                    No staff accounts found.
                  </td>
                </tr>
              ) : (
                team.map((member) => {
                  const isMaster = member.email.toLowerCase() === 'brainwerkin@gmail.com';
                  const created = member.created_at || member.createdAt;
                  const lastActive = member.last_login || member.lastLogin;

                  return (
                    <tr key={member.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px' }}>{isMaster ? '👑' : '👤'}</span>
                          <div>
                            <strong style={{ color: '#fff', fontSize: '13.5px' }}>{member.name}</strong>
                            {isMaster && (
                              <div style={{ fontSize: '10px', color: 'var(--pink)', fontWeight: 700 }}>
                                Primary Owner
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <code style={{ color: '#38BDF8', fontSize: '13px' }}>{member.email}</code>
                      </td>
                      <td>
                        <span
                          style={{
                            background:
                              member.role === 'Super Admin'
                                ? 'rgba(255, 30, 106, 0.15)'
                                : member.role === 'Store Admin'
                                ? 'rgba(232, 160, 32, 0.15)'
                                : 'rgba(56, 189, 248, 0.15)',
                            color:
                              member.role === 'Super Admin'
                                ? 'var(--pink)'
                                : member.role === 'Store Admin'
                                ? 'var(--asa-gold)'
                                : '#38BDF8',
                            padding: '3px 10px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                          }}
                        >
                          {member.role}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '12px', opacity: 0.7 }}>
                          {created ? new Date(created).toLocaleDateString() : 'Active'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '12px', opacity: 0.7 }}>
                          {lastActive ? new Date(lastActive).toLocaleDateString() : 'Never'}
                        </span>
                      </td>
                      <td>
                        {isMaster ? (
                          <span style={{ fontSize: '11px', opacity: 0.4 }}>Permanent</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRevoke(member.id, member.email)}
                            style={{
                              background: 'none',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              color: '#EF4444',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                            }}
                            title="Revoke Admin Access"
                          >
                            Revoke Access
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              background: '#12121A',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '460px',
              width: '100%',
              boxShadow: '0 24px 80px rgba(0,0,0,0.8)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '18px', margin: 0, color: '#fff' }}>Add Admin or Worker</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '18px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.5)', margin: '0 0 20px' }}>
              Create login credentials for a new manager, dispatcher, or team member.
            </p>

            <form onSubmit={handleAddStaff} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tunde Adeyemi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>
                  Login Email
                </label>
                <input
                  type="email"
                  placeholder="worker@dofit.fit"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                  required
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>
                    Login Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ background: 'none', border: 'none', color: 'var(--pink)', fontSize: '11px', cursor: 'pointer' }}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>
                  Role &amp; Permissions
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#1c1c28',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                >
                  <option value="Store Admin">Store Admin (Full Store Management)</option>
                  <option value="Fulfillment Staff">Fulfillment Staff (Orders &amp; Dispatch)</option>
                  <option value="Super Admin">Super Admin (All Permissions)</option>
                </select>
              </div>

              {formError && (
                <p style={{ color: '#EF4444', fontSize: '12px', margin: '4px 0 0' }}>{formError}</p>
              )}

              {formSuccess && (
                <p style={{ color: '#34D399', fontSize: '12px', margin: '4px 0 0' }}>{formSuccess}</p>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    flex: 2,
                    padding: '12px',
                    background: 'var(--pink)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {submitting ? 'Creating...' : 'Grant Access →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
