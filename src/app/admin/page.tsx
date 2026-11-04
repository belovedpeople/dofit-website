'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Order } from '@/data/orders';
import { products } from '@/data/products';
import { Subscriber } from '@/data/subscribers';
import styles from './admin.module.css';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/orders').then((res) => res.json()),
      fetch('/api/newsletter').then((res) => res.json()).catch(() => ({ subscribers: [] })),
    ])
      .then(([ordersData, subsData]) => {
        if (ordersData.orders) setOrders(ordersData.orders);
        if (subsData.subscribers) setSubscribers(subsData.subscribers);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const deliveredOrders = orders.filter((o) => o.status === 'Delivered');
  const totalSales = deliveredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const dofitSales = deliveredOrders
    .filter((o) => o.brand === 'dofit' || o.brand === 'mixed')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const asaSales = deliveredOrders
    .filter((o) => o.brand === 'asa')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrders = orders.filter((o) => o.status === 'Pending' || o.status === 'Processing' || o.status === 'Dispatched');
  const lowStockProducts = products.filter((p) => p.stockCount <= 12);

  return (
    <div>
      {/* KPI Cards Grid */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Gross Sales (Delivered)</span>
          <div className={styles.kpiValue}>₦{totalSales.toLocaleString()}</div>
          <span className={styles.kpiSub}>
            {deliveredOrders.length} delivered · {pendingOrders.length} pending delivery
          </span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Dofit Wears Revenue</span>
          <div className={styles.kpiValue} style={{ color: 'var(--pink)' }}>
            ₦{dofitSales.toLocaleString()}
          </div>
          <span className={styles.kpiSub}>Delivered Drops</span>
        </div>

        <div className={`${styles.kpiCard} ${styles.kpiCardAsa}`}>
          <span className={styles.kpiLabel}>Àṣà by Dofit Revenue</span>
          <div className={styles.kpiValue} style={{ color: 'var(--asa-gold)' }}>
            ₦{asaSales.toLocaleString()}
          </div>
          <span className={styles.kpiSub}>Delivered Adire & Couture</span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Pending Fulfillment</span>
          <div className={styles.kpiValue}>{pendingOrders.length}</div>
          <span className={styles.kpiSub}>Awaiting confirmation / dispatch</span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>VIP Drop Subscribers</span>
          <div className={styles.kpiValue} style={{ color: '#38BDF8' }}>
            {subscribers.length}
          </div>
          <span className={styles.kpiSub}>Stay Plugged In email leads</span>
        </div>
      </div>

      {/* Recent WhatsApp Orders Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeaderRow}>
          <div>
            <h2 className={styles.tableTitle}>Recent Customer Orders</h2>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>
              Direct WhatsApp routing to +2349016946854
            </p>
          </div>
          <Link href="/admin/orders" className={styles.actionBtn}>
            View All Orders →
          </Link>
        </div>

        {/* Desktop Table View */}
        <div className={styles.desktopTableWrap}>
          <div style={{ overflowX: 'auto' }}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Order Ref</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Brand</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((ord) => {
                  const cleanPhone = ord.customer.phone.replace(/[^0-9]/g, '');
                  const waLink = `https://wa.me/${cleanPhone.startsWith('234') ? cleanPhone : '234' + cleanPhone.replace(/^0/, '')}`;
                  return (
                    <tr key={ord.id}>
                      <td>
                        <strong style={{ color: 'var(--pink)' }}>#{ord.id}</strong>
                        <div style={{ fontSize: '11px', opacity: 0.5 }}>
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        <strong>{ord.customer.fullName}</strong>
                        <div style={{ fontSize: '11px', opacity: 0.5 }}>
                          {ord.customer.city}, {ord.customer.state}
                        </div>
                      </td>
                      <td>{ord.customer.phone}</td>
                      <td>
                        {ord.brand === 'asa' ? (
                          <span className={styles.brandBadgeAsa}>Àṣà</span>
                        ) : ord.brand === 'dofit' ? (
                          <span className={styles.brandBadgeDofit}>Dofit</span>
                        ) : (
                          <span className={styles.brandBadgeDofit}>Mixed</span>
                        )}
                      </td>
                      <td>
                        {ord.items.map((it) => (
                          <div key={it.productId} style={{ fontSize: '12px' }}>
                            {it.quantity}x {it.name} ({it.size})
                          </div>
                        ))}
                      </td>
                      <td>
                        <strong>₦{ord.totalAmount.toLocaleString()}</strong>
                      </td>
                      <td>
                        <span
                          className={`${styles.statusTag} ${ord.status === 'Pending'
                              ? styles.statusPending
                              : ord.status === 'Processing'
                                ? styles.statusProcessing
                                : ord.status === 'Dispatched'
                                  ? styles.statusDispatched
                                  : styles.statusDelivered
                            }`}
                        >
                          ● {ord.status}
                        </span>
                      </td>
                      <td>
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noreferrer"
                          className={`${styles.actionBtn} ${styles.actionBtnWa}`}
                          title="Chat with Customer on WhatsApp"
                        >
                          💬 Chat
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Recent Orders Cards */}
        <div className={styles.mobileCardList}>
          {orders.slice(0, 4).map((ord) => {
            const cleanPhone = ord.customer.phone.replace(/[^0-9]/g, '');
            const waLink = `https://wa.me/${cleanPhone.startsWith('234') ? cleanPhone : '234' + cleanPhone.replace(/^0/, '')}`;
            return (
              <div key={ord.id} className={styles.mobileOrderCard}>
                <div className={styles.mobileOrderHeader}>
                  <div>
                    <div className={styles.mobileOrderRef}>#{ord.id}</div>
                    <div className={styles.mobileOrderDate}>
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span
                    className={`${styles.statusTag} ${
                      ord.status === 'Pending'
                        ? styles.statusPending
                        : ord.status === 'Processing'
                          ? styles.statusProcessing
                          : ord.status === 'Dispatched'
                            ? styles.statusDispatched
                            : styles.statusDelivered
                    }`}
                  >
                    ● {ord.status}
                  </span>
                </div>

                <div className={styles.mobileCustomerRow}>
                  <div>
                    <div className={styles.mobileCustomerName}>{ord.customer.fullName}</div>
                    <div className={styles.mobileCustomerPhone}>{ord.customer.phone}</div>
                  </div>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.mobileWaBtn}
                  >
                    💬 Chat
                  </a>
                </div>

                <div className={styles.mobileOrderFooter}>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                    {ord.items.reduce((s, i) => s + i.quantity, 0)} items ordered
                  </div>
                  <div className={styles.mobileOrderTotal}>₦{ord.totalAmount.toLocaleString()}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Latest VIP Drop Subscribers Card */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeaderRow}>
          <div>
            <h2 className={styles.tableTitle}>Stay Plugged In — Recent VIP Signups</h2>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>
              Emails collected from website footers and drop notifications ({subscribers.length} total)
            </p>
          </div>
          <Link href="/admin/subscribers" className={styles.actionBtn}>
            Manage All Subscribers →
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Subscription Source</th>
                <th>Joined</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.slice(0, 4).map((sub) => (
                <tr key={sub.id}>
                  <td>
                    <strong style={{ color: '#fff' }}>{sub.email}</strong>
                  </td>
                  <td>
                    <span
                      style={{
                        background: 'rgba(255, 30, 106, 0.12)',
                        color: 'var(--pink)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                      }}
                    >
                      {sub.source}
                    </span>
                  </td>
                  <td>{new Date(sub.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`${styles.statusTag} ${styles.statusDispatched}`}>
                      ● Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Stock Warning Radar */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeaderRow}>
          <div>
            <h2 className={styles.tableTitle}>Inventory Radar — Low Stock Alert</h2>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>
              Items nearing sell-out threshold (≤ 12 units)
            </p>
          </div>
          <Link href="/admin/products" className={styles.actionBtn}>
            Manage Catalog →
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Stock Level</th>
                <th>Available Sizes</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.name}</strong>
                    <div style={{ fontSize: '11px', opacity: 0.5 }}>{p.category}</div>
                  </td>
                  <td>
                    {p.brand === 'asa' ? (
                      <span className={styles.brandBadgeAsa}>Àṣà</span>
                    ) : (
                      <span className={styles.brandBadgeDofit}>Dofit</span>
                    )}
                  </td>
                  <td>{p.formattedPrice}</td>
                  <td>
                    <strong style={{ color: p.stockCount <= 5 ? '#EF4444' : '#EAB308' }}>
                      {p.stockCount} units left
                    </strong>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {p.sizes.map((s) => (
                        <span
                          key={s}
                          style={{
                            background: 'rgba(255,255,255,0.06)',
                            padding: '2px 6px',
                            borderRadius: '3px',
                            fontSize: '10px',
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.statusTag} ${styles.statusPending}`}>
                      Restock Soon
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
