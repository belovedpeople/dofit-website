'use client';
import { useState, useEffect } from 'react';
import { Order } from '@/data/orders';
import styles from '../admin.module.css';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [brandFilter, setBrandFilter] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = () => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) setOrders(data.orders);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    const matchesBrand =
      brandFilter === 'All' ||
      o.brand === brandFilter ||
      (brandFilter === 'dofit' && o.brand === 'mixed');
    return matchesStatus && matchesBrand;
  });

  return (
    <div>
      {/* Top Controls: Filter Pills */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {/* Status Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['All', 'Pending', 'Processing', 'Dispatched', 'Delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={styles.actionBtn}
              style={{
                background: statusFilter === st ? 'var(--pink)' : 'rgba(255,255,255,0.06)',
                borderColor: statusFilter === st ? 'var(--pink)' : 'rgba(255,255,255,0.12)',
                color: statusFilter === st ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
                fontWeight: statusFilter === st ? 700 : 500,
              }}
            >
              {st} ({st === 'All' ? orders.length : orders.filter((o) => o.status === st).length})
            </button>
          ))}
        </div>

        {/* Brand Filters */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setBrandFilter('All')}
            className={styles.actionBtn}
            style={{
              background: brandFilter === 'All' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)',
            }}
          >
            All Brands
          </button>
          <button
            onClick={() => setBrandFilter('dofit')}
            className={styles.actionBtn}
            style={{
              background: brandFilter === 'dofit' ? 'rgba(255,30,106,0.3)' : 'rgba(255,255,255,0.06)',
              borderColor: brandFilter === 'dofit' ? 'var(--pink)' : 'transparent',
              color: brandFilter === 'dofit' ? 'var(--pink)' : '#FFFFFF',
            }}
          >
            Dofit Wears
          </button>
          <button
            onClick={() => setBrandFilter('asa')}
            className={styles.actionBtn}
            style={{
              background: brandFilter === 'asa' ? 'rgba(232,160,32,0.3)' : 'rgba(255,255,255,0.06)',
              borderColor: brandFilter === 'asa' ? 'var(--asa-gold)' : 'transparent',
              color: brandFilter === 'asa' ? 'var(--asa-gold)' : '#FFFFFF',
            }}
          >
            Àṣà by Dofit
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className={styles.tableCard}>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Order Ref</th>
                <th>Date</th>
                <th>Customer Name</th>
                <th>Phone</th>
                <th>Delivery Address</th>
                <th>Brand</th>
                <th>Items Ordered</th>
                <th>Total (₦)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '40px' }}>
                    No orders match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const cleanPhone = ord.customer.phone.replace(/[^0-9]/g, '');
                  const waCustomerLink = `https://wa.me/${
                    cleanPhone.startsWith('234') ? cleanPhone : '234' + cleanPhone.replace(/^0/, '')
                  }`;

                  return (
                    <tr key={ord.id}>
                      <td>
                        <strong style={{ color: 'var(--pink)' }}>#{ord.id}</strong>
                      </td>
                      <td style={{ fontSize: '12px', opacity: 0.6 }}>
                        {new Date(ord.createdAt).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td>
                        <strong>{ord.customer.fullName}</strong>
                      </td>
                      <td>
                        <a
                          href={waCustomerLink}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: '#25D366', textDecoration: 'none' }}
                          title="Open WhatsApp chat with customer"
                        >
                          {ord.customer.phone} 💬
                        </a>
                      </td>
                      <td style={{ maxWidth: '200px' }}>
                        <div style={{ fontSize: '12.5px', lineHeight: 1.3 }}>
                          {ord.customer.address}
                          <div style={{ opacity: 0.5, fontSize: '11px' }}>
                            {ord.customer.city}, {ord.customer.state}
                          </div>
                        </div>
                      </td>
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
                        {ord.items.map((it, idx) => (
                          <div key={idx} style={{ fontSize: '12px' }}>
                            • {it.quantity}x {it.name} ({it.size})
                          </div>
                        ))}
                      </td>
                      <td>
                        <strong>₦{ord.totalAmount.toLocaleString()}</strong>
                      </td>
                      <td>
                        <select
                          value={ord.status}
                          onChange={(e) =>
                            handleStatusChange(ord.id, e.target.value as Order['status'])
                          }
                          style={{
                            background: '#1A1A24',
                            border: '1px solid rgba(255,255,255,0.15)',
                            color: '#FFFFFF',
                            borderRadius: '6px',
                            padding: '6px 8px',
                            fontSize: '12px',
                            outline: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className={styles.actionBtn}
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Inspector Modal */}
      {selectedOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            style={{
              background: '#121218',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '560px',
              padding: '28px',
              position: 'relative',
              boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '24px',
                    color: '#FFFFFF',
                  }}
                >
                  Order #{selectedOrder.id}
                </h3>
                <span style={{ fontSize: '12px', opacity: 0.5 }}>
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '20px',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            {/* Customer info card */}
            <div
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px',
                fontSize: '13px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div>
                <strong>Customer:</strong> {selectedOrder.customer.fullName}
              </div>
              <div>
                <strong>Phone:</strong> {selectedOrder.customer.phone}
              </div>
              <div>
                <strong>Address:</strong> {selectedOrder.customer.address},{' '}
                {selectedOrder.customer.city}, {selectedOrder.customer.state}
              </div>
              {selectedOrder.customer.notes && (
                <div>
                  <strong>Notes:</strong> {selectedOrder.customer.notes}
                </div>
              )}
            </div>

            {/* Item list */}
            <h4
              style={{
                fontSize: '11px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                opacity: 0.5,
                marginBottom: '12px',
              }}
            >
              Items in Order
            </h4>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                marginBottom: '20px',
              }}
            >
              {selectedOrder.items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 14px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '8px',
                    fontSize: '13px',
                  }}
                >
                  <div>
                    <strong>{item.name}</strong>
                    <div style={{ fontSize: '11px', opacity: 0.6 }}>
                      Brand: {item.brand === 'asa' ? 'Àṣà' : 'Dofit'} | Size: {item.size} | Qty:{' '}
                      {item.quantity}
                    </div>
                  </div>
                  <strong style={{ color: 'var(--pink)' }}>
                    ₦{item.totalPrice.toLocaleString()}
                  </strong>
                </div>
              ))}
            </div>

            {/* Total Row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '14px 0',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                fontSize: '16px',
                fontWeight: 700,
                color: '#FFFFFF',
                marginBottom: '20px',
              }}
            >
              <span>Total Payable</span>
              <span style={{ color: 'var(--pink)' }}>
                ₦{selectedOrder.totalAmount.toLocaleString()}
              </span>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href={`https://wa.me/${selectedOrder.customer.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className={`${styles.actionBtn} ${styles.actionBtnWa}`}
                style={{ flex: 1, justifyContent: 'center', padding: '12px' }}
              >
                💬 Open WhatsApp Chat
              </a>
              <button
                onClick={() => setSelectedOrder(null)}
                className={styles.actionBtn}
                style={{ padding: '12px 20px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
