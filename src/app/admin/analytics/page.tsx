'use client';
import { useState, useEffect } from 'react';
import { Product } from '@/data/products';
import { Order } from '@/data/orders';
import styles from '../admin.module.css';

interface Stats {
  totalRevenue: number;
  dofitRevenue: number;
  asaRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalProducts: number;
  inStockProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
  topProducts: { name: string; brand: string; stockCount: number; price: number }[];
  revenueByMonth: { month: string; revenue: number }[];
  ordersByStatus: { status: string; count: number; color: string }[];
}

const STATUS_COLORS: Record<string, string> = {
  Pending: '#EAB308',
  Processing: '#60A5FA',
  Dispatched: '#C084FC',
  Delivered: '#4ADE80',
  Cancelled: '#EF4444',
};

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/orders').then((r) => r.json()),
      fetch('/api/products').then((r) => r.json()),
    ]).then(([ordersData, productsData]) => {
      const orders: Order[] = ordersData.orders || [];
      const products: Product[] = productsData.products || [];

      const deliveredOrders = orders.filter((o) => o.status === 'Delivered');
      const totalRevenue = deliveredOrders.reduce((s, o) => s + o.totalAmount, 0);
      const dofitRevenue = deliveredOrders.filter((o) => o.brand === 'dofit' || o.brand === 'mixed').reduce((s, o) => s + o.totalAmount, 0);
      const asaRevenue = deliveredOrders.filter((o) => o.brand === 'asa').reduce((s, o) => s + o.totalAmount, 0);

      const statusCounts: Record<string, number> = {};
      orders.forEach((o) => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });

      const revenueByMonth: Record<string, number> = {};
      deliveredOrders.forEach((o) => {
        const d = new Date(o.createdAt);
        const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
        revenueByMonth[key] = (revenueByMonth[key] || 0) + o.totalAmount;
      });

      const topProducts = [...products]
        .sort((a, b) => b.price - a.price)
        .slice(0, 5);

      setStats({
        totalRevenue,
        dofitRevenue,
        asaRevenue,
        totalOrders: orders.length,
        pendingOrders: orders.filter((o) => o.status === 'Pending' || o.status === 'Processing').length,
        deliveredOrders: orders.filter((o) => o.status === 'Delivered').length,
        totalProducts: products.length,
        inStockProducts: products.filter((p) => p.inStock).length,
        outOfStockProducts: products.filter((p) => !p.inStock).length,
        lowStockProducts: products.filter((p) => p.stockCount <= 10 && p.inStock).length,
        topProducts,
        revenueByMonth: Object.entries(revenueByMonth).map(([month, revenue]) => ({ month, revenue })),
        ordersByStatus: Object.entries(statusCounts).map(([status, count]) => ({
          status, count, color: STATUS_COLORS[status] || '#888',
        })),
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.35)' }}>Loading analytics...</div>;
  if (!stats) return null;

  const maxRevenue = Math.max(...stats.revenueByMonth.map((r) => r.revenue), 1);
  const maxOrdersBar = Math.max(...stats.ordersByStatus.map((s) => s.count), 1);

  return (
    <div>
      {/* KPI Section */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total Revenue (Delivered)</span>
          <div className={styles.kpiValue}>₦{stats.totalRevenue.toLocaleString()}</div>
          <span className={styles.kpiSub}>{stats.deliveredOrders} delivered of {stats.totalOrders} total orders</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Dofit Wears Revenue</span>
          <div className={styles.kpiValue} style={{ color: 'var(--pink)' }}>₦{stats.dofitRevenue.toLocaleString()}</div>
          <span className={styles.kpiSub}>Activewear & Streetwear</span>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiCardAsa}`}>
          <span className={styles.kpiLabel}>Àṣà Revenue</span>
          <div className={styles.kpiValue} style={{ color: 'var(--asa-gold)' }}>₦{stats.asaRevenue.toLocaleString()}</div>
          <span className={styles.kpiSub}>Adire & Couture</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Pending Fulfilment</span>
          <div className={styles.kpiValue} style={{ color: '#EAB308' }}>{stats.pendingOrders}</div>
          <span className={styles.kpiSub}>{stats.deliveredOrders} delivered total</span>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>

        {/* Revenue by Month Bar Chart */}
        <div className={styles.tableCard}>
          <div className={styles.tableHeaderRow}>
            <h2 className={styles.tableTitle}>Revenue by Month</h2>
          </div>
          <div style={{ padding: '20px 24px' }}>
            {stats.revenueByMonth.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>No data yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {stats.revenueByMonth.map(({ month, revenue }) => (
                  <div key={month} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ width: '52px', fontSize: '11.5px', color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}>{month}</span>
                    <div style={{ flex: 1, height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(revenue / maxRevenue) * 100}%`, background: 'linear-gradient(90deg, #FF1E6A, #FF6B9D)', borderRadius: '5px', transition: 'width 0.6s ease' }} />
                    </div>
                    <span style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.6)', width: '80px', textAlign: 'right', flexShrink: 0 }}>₦{(revenue / 1000).toFixed(0)}k</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Orders by Status */}
        <div className={styles.tableCard}>
          <div className={styles.tableHeaderRow}>
            <h2 className={styles.tableTitle}>Orders by Status</h2>
          </div>
          <div style={{ padding: '20px 24px' }}>
            {stats.ordersByStatus.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>No orders yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {stats.ordersByStatus.map(({ status, count, color }) => (
                  <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ width: '80px', fontSize: '11.5px', color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}>{status}</span>
                    <div style={{ flex: 1, height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(count / maxOrdersBar) * 100}%`, background: color, borderRadius: '5px', opacity: 0.8 }} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color, width: '24px', textAlign: 'right', flexShrink: 0 }}>{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inventory Health */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Total Products', value: stats.totalProducts, color: '#FFFFFF', icon: '👗' },
          { label: 'In Stock', value: stats.inStockProducts, color: '#4ADE80', icon: '✅' },
          { label: 'Out of Stock', value: stats.outOfStockProducts, color: '#EF4444', icon: '❌' },
          { label: 'Low Stock (≤10)', value: stats.lowStockProducts, color: '#EAB308', icon: '⚠️' },
        ].map(({ label, value, color, icon }) => (
          <div key={label} className={styles.kpiCard} style={{ padding: '18px 20px' }}>
            <span className={styles.kpiLabel}>{icon} {label}</span>
            <div className={styles.kpiValue} style={{ fontSize: '28px', color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Top Products by Price */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeaderRow}>
          <h2 className={styles.tableTitle}>Top Products (by Price)</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Stock Health</th>
              </tr>
            </thead>
            <tbody>
              {stats.topProducts.map((p, i) => (
                <tr key={p.name}>
                  <td style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>#{i + 1}</td>
                  <td><strong>{p.name}</strong></td>
                  <td>
                    {p.brand === 'asa'
                      ? <span className={styles.brandBadgeAsa}>Àṣà</span>
                      : <span className={styles.brandBadgeDofit}>Dofit</span>
                    }
                  </td>
                  <td><strong>₦{p.price.toLocaleString()}</strong></td>
                  <td style={{ fontWeight: 700, color: p.stockCount === 0 ? '#EF4444' : p.stockCount <= 10 ? '#EAB308' : '#4ADE80' }}>{p.stockCount}</td>
                  <td>
                    <div style={{ width: '100px', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.min(100, (p.stockCount / 30) * 100)}%`, background: p.stockCount <= 10 ? '#EAB308' : '#4ADE80', borderRadius: '3px' }} />
                    </div>
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

