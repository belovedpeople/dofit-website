'use client';
import { useState, useEffect } from 'react';
import { Subscriber } from '@/data/subscribers';
import styles from '../admin.module.css';

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(false);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter');
      const data = await res.json();
      if (data.subscribers) {
        setSubscribers(data.subscribers);
      }
    } catch (err) {
      console.error('Error fetching subscribers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to remove ${email} from the subscriber list?`)) return;

    try {
      const res = await fetch(`/api/newsletter?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSubscribers((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleCopyAll = () => {
    const emails = subscribers.map((s) => s.email).join(', ');
    navigator.clipboard.writeText(emails);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Email,Source,Date Subscribed,Status']
        .concat(
          subscribers.map(
            (s) => `"${s.email}","${s.source}","${new Date(s.createdAt).toLocaleDateString()}","${s.status}"`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dofit_newsletter_subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSubscribers = subscribers.filter(
    (s) =>
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header with Title and Actions */}
      <div className={styles.tableHeaderRow} style={{ marginBottom: '24px' }}>
        <div>
          <h2 className={styles.tableTitle}>Stay Plugged In — VIP Subscribers</h2>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>
            Audience members who subscribed to drops, secret restocks, and Àṣà capsule releases
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleCopyAll}
            className={styles.actionBtn}
            title="Copy comma-separated list of emails"
          >
            {copyFeedback ? '✓ Copied Emails!' : '📋 Copy All Emails'}
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className={styles.actionBtn}
            title="Export subscriber list as CSV"
          >
            📥 Export CSV
          </button>
          <button
            type="button"
            onClick={fetchSubscribers}
            className={styles.actionBtn}
            title="Refresh list"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className={styles.kpiGrid} style={{ marginBottom: '28px' }}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total Audience Size</span>
          <div className={styles.kpiValue} style={{ color: 'var(--pink)' }}>
            {subscribers.length}
          </div>
          <span className={styles.kpiSub}>Active email leads</span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Stay Plugged In (Footer)</span>
          <div className={styles.kpiValue}>
            {subscribers.filter((s) => s.source.toLowerCase().includes('stay plugged') || s.source.toLowerCase().includes('footer')).length}
          </div>
          <span className={styles.kpiSub}>Subscribed via website footers</span>
        </div>

        <div className={`${styles.kpiCard} ${styles.kpiCardAsa}`}>
          <span className={styles.kpiLabel}>Àṣà Cultural Drops</span>
          <div className={styles.kpiValue} style={{ color: 'var(--asa-gold)' }}>
            {subscribers.filter((s) => s.source.toLowerCase().includes('asa')).length}
          </div>
          <span className={styles.kpiSub}>Capsule-specific enthusiasts</span>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by email or subscription source..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '480px',
            padding: '12px 16px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '13.5px',
            outline: 'none',
          }}
        />
      </div>

      {/* Subscribers Table */}
      <div className={styles.tableCard}>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Subscriber Email</th>
                <th>Joined Date</th>
                <th>Subscription Source</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px' }}>
                    Loading subscribers...
                  </td>
                </tr>
              ) : filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'rgba(255,255,255,0.4)' }}>
                    No subscribers found matching your search.
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((sub) => (
                  <tr key={sub.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '15px' }}>✉️</span>
                        <strong style={{ fontSize: '14px', color: '#fff' }}>{sub.email}</strong>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '13px' }}>
                        {new Date(sub.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                      <div style={{ fontSize: '11px', opacity: 0.5 }}>
                        {new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          background: sub.source.toLowerCase().includes('asa')
                            ? 'rgba(232, 160, 32, 0.15)'
                            : 'rgba(255, 30, 106, 0.12)',
                          color: sub.source.toLowerCase().includes('asa')
                            ? 'var(--asa-gold)'
                            : 'var(--pink)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600,
                        }}
                      >
                        {sub.source}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.statusTag} ${styles.statusDispatched}`}>
                        ● Active
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleDelete(sub.id, sub.email)}
                        style={{
                          background: 'none',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#EF4444',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                        title="Delete from list"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
