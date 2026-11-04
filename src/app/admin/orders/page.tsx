'use client';
import { useState, useEffect } from 'react';
import { Order } from '@/data/orders';
import OrderReceiptModal from '@/components/admin/OrderReceiptModal';
import styles from '../admin.module.css';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [brandFilter, setBrandFilter] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/orders?id=${encodeURIComponent(orderToDelete.id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete order');
      }

      setOrders((prev) => prev.filter((o) => o.id !== orderToDelete.id));
      if (selectedOrder && selectedOrder.id === orderToDelete.id) {
        setSelectedOrder(null);
      }
      setOrderToDelete(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error deleting order');
    } finally {
      setDeleting(false);
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
        {/* Desktop Table View */}
        <div className={styles.desktopTableWrap}>
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
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className={styles.actionBtn}
                              style={{ padding: '6px 12px', fontSize: '11.5px' }}
                            >
                              Inspect
                            </button>
                            <button
                              type="button"
                              onClick={() => setReceiptOrder(ord)}
                              className={styles.actionBtn}
                              style={{ padding: '6px 10px', fontSize: '11.5px', background: 'rgba(255,255,255,0.08)' }}
                              title="Generate PDF or Image Receipt"
                            >
                              🧾 Receipt
                            </button>
                            <button
                              type="button"
                              onClick={() => setOrderToDelete(ord)}
                              style={{
                                background: 'rgba(239, 68, 68, 0.12)',
                                border: '1px solid rgba(239, 68, 68, 0.28)',
                                color: '#EF4444',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                fontSize: '11.5px',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                              title="Delete this order"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Order Cards View */}
        <div className={styles.mobileCardList}>
          {filteredOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
              No orders match the selected filter criteria.
            </div>
          ) : (
            filteredOrders.map((ord) => {
              const cleanPhone = ord.customer.phone.replace(/[^0-9]/g, '');
              const waCustomerLink = `https://wa.me/${
                cleanPhone.startsWith('234') ? cleanPhone : '234' + cleanPhone.replace(/^0/, '')
              }`;

              return (
                <div key={ord.id} className={styles.mobileOrderCard}>
                  <div className={styles.mobileOrderHeader}>
                    <div>
                      <div className={styles.mobileOrderRef}>#{ord.id}</div>
                      <div className={styles.mobileOrderDate}>
                        {new Date(ord.createdAt).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                    <div>
                      {ord.brand === 'asa' ? (
                        <span className={styles.brandBadgeAsa}>Àṣà</span>
                      ) : ord.brand === 'dofit' ? (
                        <span className={styles.brandBadgeDofit}>Dofit</span>
                      ) : (
                        <span className={styles.brandBadgeDofit}>Mixed</span>
                      )}
                    </div>
                  </div>

                  {/* Customer & Direct WhatsApp */}
                  <div className={styles.mobileCustomerRow}>
                    <div>
                      <div className={styles.mobileCustomerName}>{ord.customer.fullName}</div>
                      <div className={styles.mobileCustomerPhone}>{ord.customer.phone}</div>
                    </div>
                    <a
                      href={waCustomerLink}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.mobileWaBtn}
                      title="Chat customer on WhatsApp"
                    >
                      💬 Chat
                    </a>
                  </div>

                  {/* Items Summary */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 12px', borderRadius: '8px', fontSize: '12px' }}>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Items ({ord.items.reduce((s, i) => s + i.quantity, 0)})
                    </div>
                    {ord.items.map((it, idx) => (
                      <div key={idx} style={{ color: 'rgba(255,255,255,0.85)', padding: '2px 0' }}>
                        • <strong>{it.quantity}x</strong> {it.name} <span style={{ color: 'var(--pink)' }}>({it.size})</span>
                      </div>
                    ))}
                    <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.5)', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      📍 {ord.customer.address}, {ord.customer.city}
                    </div>
                  </div>

                  {/* Footer with Total and Status Dropdown */}
                  <div className={styles.mobileOrderFooter}>
                    <div>
                      <div style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>Total</div>
                      <div className={styles.mobileOrderTotal}>₦{ord.totalAmount.toLocaleString()}</div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value as Order['status'])}
                        className={styles.mobileStatusSelect}
                        aria-label="Update order status"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => setSelectedOrder(ord)}
                        className={styles.actionBtn}
                        style={{ minHeight: '40px', padding: '0 12px', fontSize: '12px' }}
                      >
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() => setReceiptOrder(ord)}
                        className={styles.actionBtn}
                        style={{ minHeight: '40px', padding: '0 10px', fontSize: '12px', background: 'rgba(255,255,255,0.08)' }}
                        title="Generate Receipt"
                      >
                        🧾 Receipt
                      </button>

                      <button
                        type="button"
                        onClick={() => setOrderToDelete(ord)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.12)',
                          border: '1px solid rgba(239, 68, 68, 0.28)',
                          color: '#EF4444',
                          minHeight: '40px',
                          minWidth: '40px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                        aria-label="Delete order"
                        title="Delete order"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Order Inspector Modal */}
      {selectedOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3000,
            padding: '14px',
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
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '24px 20px',
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
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <a
                href={`https://wa.me/${selectedOrder.customer.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className={`${styles.actionBtn} ${styles.actionBtnWa}`}
                style={{ flex: 1, minWidth: '180px', justifyContent: 'center', padding: '12px' }}
              >
                💬 Open WhatsApp Chat
              </a>
              <button
                type="button"
                onClick={() => setReceiptOrder(selectedOrder)}
                className={styles.actionBtn}
                style={{ padding: '12px 18px', background: 'rgba(255,30,106,0.15)', borderColor: 'var(--pink)', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}
                title="Generate PDF or Image Receipt"
              >
                <span>🧾</span>
                <span>Generate Receipt</span>
              </button>
              <button
                type="button"
                onClick={() => setOrderToDelete(selectedOrder)}
                style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.28)',
                  color: '#EF4444',
                  padding: '12px 18px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>🗑️</span>
                <span>Delete Order</span>
              </button>
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

      {/* Delete Order Confirmation Dialog */}
      {orderToDelete && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => !deleting && setOrderToDelete(null)}
        >
          <div
            style={{
              background: '#14141E',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '16px',
              padding: '28px 24px',
              maxWidth: '420px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 60px rgba(0,0,0,0.9), 0 0 30px rgba(239, 68, 68, 0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '44px', marginBottom: '14px' }}>🗑️</div>
            <h3 style={{ color: '#FFFFFF', fontSize: '19px', fontWeight: 800, margin: '0 0 8px' }}>
              Delete Order #{orderToDelete.id}?
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', lineHeight: 1.5, margin: '0 0 16px' }}>
              Are you sure you want to delete this order from <strong style={{ color: '#FFFFFF' }}>{orderToDelete.customer.fullName}</strong> for <strong style={{ color: 'var(--pink)' }}>₦{orderToDelete.totalAmount.toLocaleString()}</strong>?
              <br />
              <span style={{ color: '#EF4444', fontSize: '12px', display: 'block', marginTop: '6px' }}>
                ⚠️ This will permanently remove this order from sales and reports.
              </span>
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setOrderToDelete(null)}
                disabled={deleting}
                className={styles.actionBtn}
                style={{ minHeight: '44px', justifyContent: 'center' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteOrder}
                disabled={deleting}
                style={{
                  background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                  border: 'none',
                  color: '#FFFFFF',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Receipt Modal (PDF / Image / WhatsApp) */}
      <OrderReceiptModal
        order={receiptOrder}
        onClose={() => setReceiptOrder(null)}
      />
    </div>
  );
}
