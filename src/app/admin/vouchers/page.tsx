'use client';
import { useState, useEffect } from 'react';
import { Voucher } from '@/data/vouchers';
import styles from '../admin.module.css';

export default function AdminVouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minSpend, setMinSpend] = useState<number>(0);
  const [maxUses, setMaxUses] = useState<number>(0);
  const [expiresAt, setExpiresAt] = useState('');
  const [isActive, setIsActive] = useState(true);

  const fetchVouchers = async () => {
    try {
      const res = await fetch('/api/vouchers');
      const data = await res.json();
      if (data.vouchers) setVouchers(data.vouchers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!code.trim()) {
      setError('Please enter a voucher code');
      return;
    }

    if (!discountValue || discountValue <= 0) {
      setError('Discount value must be greater than 0');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/vouchers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          discountType,
          discountValue: Number(discountValue),
          minSpend: Number(minSpend || 0),
          maxUses: Number(maxUses || 0),
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
          isActive,
        }),
      });
      const data = await res.json();
      if (res.ok && data.voucher) {
        setVouchers([data.voucher, ...vouchers]);
        setModalOpen(false);
        // Reset form
        setCode('');
        setDiscountType('percentage');
        setDiscountValue(10);
        setMinSpend(0);
        setMaxUses(0);
        setExpiresAt('');
        setIsActive(true);
      } else {
        setError(data.error || 'Failed to create voucher');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (voucher: Voucher) => {
    const nextStatus = !voucher.isActive;
    try {
      await fetch(`/api/vouchers/${voucher.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextStatus }),
      });
      setVouchers((prev) =>
        prev.map((v) => (v.id === voucher.id ? { ...v, isActive: nextStatus } : v))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this voucher?')) return;
    try {
      await fetch(`/api/vouchers/${id}`, { method: 'DELETE' });
      setVouchers((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const activeCount = vouchers.filter((v) => v.isActive).length;
  const totalUses = vouchers.reduce((acc, v) => acc + (v.usedCount || 0), 0);

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>Discount Vouchers &amp; Promo Codes</h2>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', margin: 0 }}>
            Create custom promo codes with usage limits, minimum spend rules, and expiration dates.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #FF1E6A, #FF6B9D)',
            border: 'none',
            color: '#FFFFFF',
            padding: '12px 24px',
            borderRadius: '10px',
            fontSize: '13.5px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(255,30,106,0.3)',
          }}
        >
          + Create New Voucher
        </button>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total Vouchers</span>
          <div className={styles.kpiValue}>{vouchers.length}</div>
          <span className={styles.kpiSub}>Configured discount codes</span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Active Vouchers</span>
          <div className={styles.kpiValue} style={{ color: '#4ADE80' }}>
            {activeCount}
          </div>
          <span className={styles.kpiSub}>Ready for customers at checkout</span>
        </div>

        <div className={`${styles.kpiCard} ${styles.kpiCardAsa}`}>
          <span className={styles.kpiLabel}>Total Customer Redemptions</span>
          <div className={styles.kpiValue} style={{ color: 'var(--asa-gold)' }}>
            {totalUses}
          </div>
          <span className={styles.kpiSub}>Times vouchers were applied</span>
        </div>
      </div>

      {/* Vouchers Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeaderRow}>
          <h2 className={styles.tableTitle}>All Promo Codes</h2>
        </div>

        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Loading vouchers...</div>
          ) : (
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Voucher Code</th>
                  <th>Discount</th>
                  <th>Min. Spend</th>
                  <th>Usage Limit</th>
                  <th>Expiration</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vouchers.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '40px', opacity: 0.4 }}>
                      No vouchers created yet. Click &quot;+ Create New Voucher&quot; to add one.
                    </td>
                  </tr>
                )}
                {vouchers.map((v) => {
                  const isExpired = v.expiresAt && new Date(v.expiresAt).getTime() < Date.now();
                  const isMaxedOut = v.maxUses > 0 && v.usedCount >= v.maxUses;

                  return (
                    <tr key={v.id}>
                      {/* Code */}
                      <td>
                        <strong style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.08em', fontSize: '16px', color: 'var(--pink)' }}>
                          {v.code}
                        </strong>
                      </td>

                      {/* Discount */}
                      <td>
                        <strong>
                          {v.discountType === 'percentage' ? `${v.discountValue}% OFF` : `₦${v.discountValue.toLocaleString()} OFF`}
                        </strong>
                      </td>

                      {/* Min Spend */}
                      <td style={{ fontSize: '12.5px', opacity: 0.7 }}>
                        {v.minSpend > 0 ? `₦${v.minSpend.toLocaleString()}` : 'No minimum'}
                      </td>

                      {/* Usage */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 700, color: isMaxedOut ? '#EF4444' : '#fff' }}>
                            {v.usedCount}
                          </span>
                          <span style={{ opacity: 0.4, fontSize: '11px' }}>
                            / {v.maxUses > 0 ? `${v.maxUses} max` : 'Unlimited'}
                          </span>
                        </div>
                      </td>

                      {/* Expiration */}
                      <td>
                        {v.expiresAt ? (
                          <div style={{ fontSize: '12px' }}>
                            <span style={{ color: isExpired ? '#EF4444' : '#fff' }}>
                              {new Date(v.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            {isExpired && <span style={{ color: '#EF4444', fontSize: '10px', display: 'block', fontWeight: 700 }}>EXPIRED</span>}
                          </div>
                        ) : (
                          <span style={{ opacity: 0.4, fontSize: '12px' }}>Never</span>
                        )}
                      </td>

                      {/* Status */}
                      <td>
                        <button
                          onClick={() => toggleStatus(v)}
                          style={{
                            background: v.isActive && !isExpired && !isMaxedOut ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                            border: `1px solid ${v.isActive && !isExpired && !isMaxedOut ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                            color: v.isActive && !isExpired && !isMaxedOut ? '#4ADE80' : '#EF4444',
                            padding: '4px 10px',
                            borderRadius: '100px',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          {v.isActive && !isExpired && !isMaxedOut ? '✓ Active' : isExpired ? 'Expired' : isMaxedOut ? 'Maxed Out' : 'Disabled'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td>
                        <button
                          onClick={() => handleDelete(v.id)}
                          style={{
                            background: 'rgba(239,68,68,0.12)',
                            border: '1px solid rgba(239,68,68,0.25)',
                            color: '#EF4444',
                            padding: '5px 12px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            cursor: 'pointer',
                          }}
                        >
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal: Create Voucher */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#12121A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '28px', maxWidth: '480px', width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.7)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: 0 }}>Create New Discount Voucher</h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '18px' }}>✕</button>
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', padding: '10px 14px', borderRadius: '8px', fontSize: '12.5px', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Code */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>
                  Voucher Code *
                </label>
                <input
                  type="text"
                  placeholder="e.g. VIP20, WELCOME5K"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  style={{ width: '100%', background: '#15151D', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '14px', fontWeight: 700, outline: 'none' }}
                  required
                />
              </div>

              {/* Discount Type + Value */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    style={{ width: '100%', background: '#15151D', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '13px', outline: 'none' }}
                  >
                    <option value="percentage">Percentage (% OFF)</option>
                    <option value="fixed">Fixed Amount (₦ OFF)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>
                    {discountType === 'percentage' ? 'Percentage (%)' : 'Amount (₦)'}
                  </label>
                  <input
                    type="number"
                    placeholder={discountType === 'percentage' ? '20' : '5000'}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    style={{ width: '100%', background: '#15151D', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '14px', outline: 'none' }}
                    required
                  />
                </div>
              </div>

              {/* Min Spend + Usage Limit */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>
                    Min. Spend (₦)
                  </label>
                  <input
                    type="number"
                    placeholder="0 (no minimum)"
                    value={minSpend || ''}
                    onChange={(e) => setMinSpend(Number(e.target.value))}
                    style={{ width: '100%', background: '#15151D', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>
                    Max Usage Count
                  </label>
                  <input
                    type="number"
                    placeholder="0 (unlimited)"
                    value={maxUses || ''}
                    onChange={(e) => setMaxUses(Number(e.target.value))}
                    style={{ width: '100%', background: '#15151D', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Expiry Date */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>
                  Expiration Date (Optional)
                </label>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  style={{ width: '100%', background: '#15151D', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '13px', outline: 'none' }}
                />
              </div>

              {/* Active Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="voucher-active-toggle"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--pink)', cursor: 'pointer' }}
                />
                <label htmlFor="voucher-active-toggle" style={{ fontSize: '13px', color: '#fff', cursor: 'pointer' }}>
                  Enable voucher immediately for customers
                </label>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className={styles.actionBtn}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    flex: 2,
                    background: 'linear-gradient(135deg, #FF1E6A, #FF6B9D)',
                    border: 'none',
                    color: '#fff',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  {saving ? 'Creating...' : 'Create Voucher ✓'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
