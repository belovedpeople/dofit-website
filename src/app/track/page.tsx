'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import DofitNavbar from '@/components/dofit/DofitNavbar';
import DofitFooter from '@/components/dofit/DofitFooter';
import { Order } from '@/data/orders';
import styles from './track.module.css';

function TrackContent() {
  const searchParams = useSearchParams();
  const urlRef = searchParams.get('ref') || '';

  const [query, setQuery] = useState(urlRef);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  const fetchTrack = async (searchVal: string) => {
    if (!searchVal.trim()) return;
    setLoading(true);
    setError('');
    try {
      const isPhone = /^[0-9+ ]{8,}$/.test(searchVal.trim());
      const param = isPhone ? `phone=${encodeURIComponent(searchVal)}` : `ref=${encodeURIComponent(searchVal)}`;
      const res = await fetch(`/api/orders?${param}`);
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
      } else {
        setOrder(null);
        setError('No order found matching this reference or phone number. Please check and try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to load order status right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlRef) {
      fetchTrack(urlRef);
    }
  }, [urlRef]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrack(query);
  };

  // Determine stage progression
  // 1: Pending | 2: Processing | 3: Dispatched | 4: Delivered
  const getStepStage = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Processing': return 2;
      case 'Dispatched': return 3;
      case 'Delivered': return 4;
      default: return 1;
    }
  };

  const currentStage = order ? getStepStage(order.status) : 0;

  return (
    <div className={styles.container}>
      <DofitNavbar />

      <main className={styles.main}>
        {/* Hero */}
        <div className={styles.hero}>
          <span className={styles.badge}>Live Dispatch Radar</span>
          <h1 className={`${styles.title} display`}>TRACK YOUR ORDER</h1>
          <p className={styles.sub}>
            Enter your order reference code (e.g. <code>#ORD-9842</code>) or the phone number used at checkout.
          </p>
        </div>

        {/* Search Card */}
        <div className={styles.searchCard}>
          <form onSubmit={handleSubmit} className={styles.searchForm}>
            <input
              type="text"
              placeholder="e.g. ORD-9842 or 08012345678"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={styles.input}
            />
            <button type="submit" disabled={loading} className={styles.searchBtn}>
              {loading ? 'Searching...' : 'Track Package →'}
            </button>
          </form>
          <p className={styles.hint}>
            💡 Tip: Your order reference was sent to your WhatsApp immediately after placing your order.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#EF4444', padding: '16px 20px', borderRadius: '12px', textAlign: 'center', marginBottom: '32px' }}>
            {error}
          </div>
        )}

        {/* Order Details */}
        {order && (
          <div className={styles.resultCard}>
            <div className={styles.headerRow}>
              <div>
                <div className={styles.ref}>#{order.id}</div>
                <div className={styles.date}>
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '100px',
                    fontWeight: 700,
                    fontSize: '12px',
                    background:
                      order.status === 'Delivered'
                        ? 'rgba(34, 197, 94, 0.15)'
                        : order.status === 'Dispatched'
                        ? 'rgba(168, 85, 247, 0.15)'
                        : 'rgba(255, 30, 106, 0.15)',
                    color:
                      order.status === 'Delivered'
                        ? '#4ADE80'
                        : order.status === 'Dispatched'
                        ? '#C084FC'
                        : 'var(--pink)',
                    border: `1px solid ${
                      order.status === 'Delivered'
                        ? 'rgba(34, 197, 94, 0.3)'
                        : order.status === 'Dispatched'
                        ? 'rgba(168, 85, 247, 0.3)'
                        : 'rgba(255, 30, 106, 0.3)'
                    }`,
                  }}
                >
                  ● {order.status}
                </span>
              </div>
            </div>

            {/* Stepper */}
            <div className={styles.stepper}>
              {[
                { stage: 1, icon: '📝', title: 'Order Placed', desc: 'Routed via WhatsApp' },
                { stage: 2, icon: '✨', title: 'Processing', desc: 'Handcrafted & Packed in Lagos' },
                { stage: 3, icon: '🚚', title: 'Dispatched', desc: 'With Courier Logistics' },
                { stage: 4, icon: '🎉', title: 'Delivered', desc: 'Arrived at Destination' },
              ].map((step) => {
                const isDone = currentStage >= step.stage;
                const isCurrent = currentStage === step.stage;
                return (
                  <div
                    key={step.stage}
                    className={`${styles.step} ${isDone ? styles.stepCompleted : ''} ${isCurrent ? styles.stepCurrent : ''}`}
                  >
                    <div className={styles.stepIcon}>
                      {isDone && !isCurrent ? '✓' : step.icon}
                    </div>
                    <div className={styles.stepTitle}>{step.title}</div>
                    <div className={styles.stepDesc}>{step.desc}</div>
                  </div>
                );
              })}
            </div>

            {/* Customer & Address Details */}
            <div className={styles.infoGrid}>
              <div className={styles.infoBlock}>
                <h4>Delivery Address</h4>
                <p><strong>{order.customer.fullName}</strong></p>
                <p>{order.customer.address}</p>
                <p>{order.customer.city}, {order.customer.state}</p>
                <p style={{ marginTop: '4px', opacity: 0.6 }}>📞 {order.customer.phone}</p>
              </div>

              <div className={styles.infoBlock}>
                <h4>Delivery Method</h4>
                <p>
                  <strong>{order.customer.city?.toLowerCase() === 'lagos' ? 'Express Lagos Dispatch (24h)' : 'Interstate Verified Logistics (2–3 Days)'}</strong>
                </p>
                <p style={{ opacity: 0.6, marginTop: '4px' }}>
                  Payment Method: WhatsApp Transfer
                </p>
                {order.customer.notes && (
                  <p style={{ marginTop: '6px', fontSize: '12px', fontStyle: 'italic', opacity: 0.7 }}>
                    &ldquo;{order.customer.notes}&rdquo;
                  </p>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className={styles.itemsList}>
              <h4 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                Package Items ({order.items.length})
              </h4>
              {order.items.map((item, idx) => (
                <div key={idx} className={styles.itemRow}>
                  <div className={styles.itemMain}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemMeta}>
                      Brand: {item.brand === 'asa' ? 'Àṣà Couture' : 'Dofit Wears'} · Size: <strong>{item.size}</strong> · Qty: <strong>{item.quantity}</strong>
                    </span>
                  </div>
                  <span className={styles.itemPrice}>
                    ₦{item.totalPrice.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Total Bar */}
            <div className={styles.totalBar}>
              <span>Total Paid</span>
              <span style={{ color: 'var(--pink)' }}>₦{order.totalAmount.toLocaleString()}</span>
            </div>

            {/* WhatsApp Support Action */}
            <a
              href={`https://wa.me/2349016946854?text=${encodeURIComponent(
                `Hello Dofit Team, I am checking on my order ref #${order.id}. Can you provide an update on dispatch status?`
              )}`}
              target="_blank"
              rel="noreferrer"
              className={styles.waHelpBtn}
            >
              💬 Need Help with this Order? Chat on WhatsApp
            </a>
          </div>
        )}
      </main>

      <DofitFooter />
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#09090F' }} />}>
      <TrackContent />
    </Suspense>
  );
}
