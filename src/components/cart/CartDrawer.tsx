'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './CartDrawer.module.css';

const WHATSAPP_NUMBER = '2349016946854';

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    totalCount,
    toast,
  } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // Steps: 'cart' | 'checkout' | 'success'
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [lastOrderRef, setLastOrderRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Customer form fields
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: 'Lagos',
    state: 'Lagos',
    notes: '',
  });

  const grandTotal = Math.max(0, subtotal - discount);

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    const code = promoCode.trim().toUpperCase();
    if (code === 'DOFIT20' || code === 'GENZ20') {
      const disc = Math.round(subtotal * 0.2);
      setDiscount(disc);
      setPromoSuccess('20% discount applied!');
    } else if (code === 'ASA10') {
      const disc = Math.round(subtotal * 0.1);
      setDiscount(disc);
      setPromoSuccess('10% Àṣà culture discount applied!');
    } else {
      setPromoError('Invalid code. Try DOFIT20 or ASA10');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Build WhatsApp itemized order message & route to +2349016946854
  const handleWhatsAppCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      alert('Please fill in your name, phone number, and delivery address.');
      return;
    }

    setIsSubmitting(true);

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    setLastOrderRef(orderId);

    // 1. Construct formatted WhatsApp order receipt
    const itemsText = items
      .map(
        (it, idx) =>
          `${idx + 1}. *${it.product.name}* (${it.product.brand === 'asa' ? 'Àṣà' : 'Dofit'})\n` +
          `   • Size: *${it.selectedSize || 'M'}* | Qty: *${it.quantity}*\n` +
          `   • Price: ₦${(it.product.price * it.quantity).toLocaleString()}`
      )
      .join('\n\n');

    const brandType = items.some((i) => i.product.brand === 'asa')
      ? items.some((i) => i.product.brand === 'dofit')
        ? 'mixed'
        : 'asa'
      : 'dofit';

    const waMessage =
      `🛍️ *NEW ORDER — DOFIT WEARS & ÀṢÀ*\n` +
      `Order Ref: *#${orderId}*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Customer Name:* ${formData.fullName}\n` +
      `📞 *Phone Number:* ${formData.phone}\n` +
      `📍 *Delivery Address:* ${formData.address}, ${formData.city}, ${formData.state}\n` +
      (formData.notes ? `📝 *Notes:* ${formData.notes}\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `📦 *ORDER ITEMS:*\n${itemsText}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `💵 *Subtotal:* ₦${subtotal.toLocaleString()}\n` +
      (discount > 0 ? `🏷️ *Discount:* -₦${discount.toLocaleString()}\n` : '') +
      `💰 *TOTAL DUE:* *₦${grandTotal.toLocaleString()}*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `_Hello Dofit Team, I just placed this order on the website. Please provide payment details to confirm dispatch!_`;

    // 2. Persist to API so Admin Dashboard sees it immediately
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            fullName: formData.fullName,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            notes: formData.notes,
          },
          items: items.map((it) => ({
            productId: it.product.id,
            name: it.product.name,
            brand: it.product.brand,
            size: it.selectedSize || 'M',
            quantity: it.quantity,
            unitPrice: it.product.price,
            totalPrice: it.product.price * it.quantity,
            image: it.product.images[0],
          })),
          subtotal,
          discount,
          deliveryFee: 0,
          totalAmount: grandTotal,
          brand: brandType,
          notes: formData.notes,
        }),
      });
    } catch (err) {
      console.error('Failed to log order to admin API:', err);
    }

    // 3. Open WhatsApp directly to +2349016946854
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;
    window.open(waUrl, '_blank');

    setIsSubmitting(false);
    setStep('success');
  };

  const handleFinishAndReset = () => {
    setStep('cart');
    closeCart();
    if (clearCart) clearCart();
  };

  return (
    <>
      {/* Toast Notification */}
      <div className={`${styles.toast} ${toast.visible ? styles.toastVisible : ''}`}>
        <div className={styles.toastIcon}>✦</div>
        <span>{toast.message}</span>
      </div>

      {/* Backdrop */}
      <div
        className={`${styles.backdrop} ${isOpen ? styles.backdropActive : ''}`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}
        aria-label="Shopping Cart Drawer"
      >
        {/* Drawer Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.bagTitle}>
              {step === 'cart' ? 'SHOPPING BAG' : step === 'checkout' ? 'CHECKOUT' : 'ORDER SENT'}
            </span>
            {step === 'cart' && <span className={styles.itemBadge}>{totalCount}</span>}
          </div>
          <button className={styles.closeBtn} onClick={closeCart} aria-label="Close cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>



        {/* STEP 1: CART ITEMS */}
        {step === 'cart' && (
          <>
            <div className={styles.itemsList}>
              {items.length === 0 ? (
                <div className={styles.emptyCart}>
                  <div className={styles.emptyIcon}>🛍️</div>
                  <h3 className={styles.emptyTitle}>Your bag is empty</h3>
                  <p className={styles.emptySubtitle}>Explore the latest drops from Dofit Wears and Àṣà.</p>
                  <Link href="/shop" className="btn btn-pink" onClick={closeCart}>
                    Shop Collection
                  </Link>
                </div>
              ) : (
                items.map((item, idx) => {
                  const isAsa = item.product.brand === 'asa';
                  const currentSize = item.selectedSize || (item as any).size || 'M';

                  return (
                    <div key={`${item.product.id}-${currentSize}-${idx}`} className={styles.cartItem}>
                      <Link
                        href={`/products/${item.product.slug}`}
                        className={styles.cartItemImg}
                        onClick={closeCart}
                      >
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          sizes="80px"
                          style={{ objectFit: 'cover' }}
                        />
                      </Link>

                      <div className={styles.cartItemDetails}>
                        <div className={styles.itemBrandRow}>
                          <span className={isAsa ? styles.asaBadge : styles.dofitBadge}>
                            {isAsa ? 'Àṣà by Dofit' : 'Dofit Wears'}
                          </span>
                          <button
                            type="button"
                            className={styles.removeBtn}
                            onClick={() => removeFromCart(item.product.id, currentSize)}
                            title="Remove item"
                            aria-label="Remove item"
                          >
                            ✕
                          </button>
                        </div>

                        <Link
                          href={`/products/${item.product.slug}`}
                          className={styles.itemName}
                          onClick={closeCart}
                        >
                          {item.product.name}
                        </Link>

                        <div className={styles.itemMeta}>Size: {currentSize}</div>

                        <div className={styles.itemQtyPrice}>
                          <div className={styles.qtyControl}>
                            <button
                              type="button"
                              className={styles.qtyBtn}
                              onClick={() => updateQuantity(item.product.id, currentSize, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className={styles.qtyNum}>{item.quantity}</span>
                            <button
                              type="button"
                              className={styles.qtyBtn}
                              onClick={() => updateQuantity(item.product.id, currentSize, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          <div className={styles.itemPrice}>
                            ₦{(item.product.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {items.length > 0 && (
              <div className={styles.footer}>
                {/* Promo form */}
                <form className={styles.promoForm} onSubmit={applyPromo}>
                  <input
                    type="text"
                    placeholder="Discount code (e.g. DOFIT20)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className={styles.promoInput}
                  />
                  <button type="submit" className={styles.promoBtn}>Apply</button>
                </form>
                {promoError && <p className={styles.promoErrorText}>{promoError}</p>}
                {promoSuccess && <p className={styles.promoSuccessText}>{promoSuccess}</p>}

                {/* Totals */}
                <div className={styles.calcRow}>
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className={`${styles.calcRow} ${styles.discountRow}`}>
                    <span>Promo Discount</span>
                    <span>-₦{discount.toLocaleString()}</span>
                  </div>
                )}


                <div className={`${styles.calcRow} ${styles.grandTotalRow}`}>
                  <span>Total Due</span>
                  <span className={styles.grandPrice}>₦{grandTotal.toLocaleString()}</span>
                </div>

                {/* Switch to WhatsApp Details Step */}
                <button
                  className="btn btn-pink"
                  style={{ width: '100%', padding: '16px 24px', fontSize: '15px' }}
                  onClick={() => setStep('checkout')}
                >
                  Proceed to Checkout · ₦{grandTotal.toLocaleString()}
                </button>

                <div className={styles.trustBadges}>
                  <span>🟢 WhatsApp Order Routing</span>
                  <span>⚡ Direct Bank Transfer</span>
                  <span>📦 Next-Day Dispatch</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* STEP 2: WHATSAPP CUSTOMER DETAILS FORM */}
        {step === 'checkout' && (
          <form className={styles.checkoutForm} onSubmit={handleWhatsAppCheckout}>
            <div className={styles.checkoutHeader}>
              <div className={styles.waBadge}>
                <span>🟢 Direct WhatsApp Routing</span>
              </div>
              <h2 className={styles.checkoutTitle}>Delivery Details</h2>
              <p className={styles.checkoutSubtitle}>
                No login required. Enter your delivery info and your order will open automatically on WhatsApp (+2349016946854).
              </p>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Full Name *</label>
              <input
                type="text"
                name="fullName"
                required
                placeholder="e.g. Chidinma Okafor"
                value={formData.fullName}
                onChange={handleInputChange}
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Phone / WhatsApp Number *</label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="e.g. 0801 234 5678"
                value={formData.phone}
                onChange={handleInputChange}
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Delivery Address *</label>
              <input
                type="text"
                name="address"
                required
                placeholder="Street address, apartment or estate"
                value={formData.address}
                onChange={handleInputChange}
                className={styles.formInput}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>City / Area</label>
                <input
                  type="text"
                  name="city"
                  placeholder="e.g. Lekki Phase 1"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>State</label>
                <input
                  type="text"
                  name="state"
                  placeholder="e.g. Lagos"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Delivery Notes (Optional)</label>
              <textarea
                name="notes"
                placeholder="Special delivery instructions, landmark, etc."
                value={formData.notes}
                onChange={handleInputChange}
                className={styles.formTextarea}
              />
            </div>

            {/* Mini Summary Box */}
            <div className={styles.orderSummaryBox}>
              <div className={styles.summaryRow}>
                <span>Items ({totalCount})</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className={styles.summaryRow} style={{ color: 'var(--white)', fontWeight: 700 }}>
                <span>Total Due</span>
                <span style={{ color: 'var(--pink)' }}>₦{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="submit"
                className={styles.waOrderBtn}
                disabled={isSubmitting}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                {isSubmitting ? 'Opening WhatsApp...' : 'Complete Order on WhatsApp'}
              </button>

              <button
                type="button"
                className={styles.backBtn}
                onClick={() => setStep('cart')}
              >
                ← Back to Cart Summary
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: ORDER SUCCESS / ROUTED SCREEN */}
        {step === 'success' && (
          <div className={styles.successState}>
            <div className={styles.successIcon}>✓</div>
            <h2 className={styles.successTitle}>Order Dispatched to WhatsApp!</h2>
            <p className={styles.successDesc}>
              Your order receipt has been routed to our WhatsApp desk (+2349016946854). Please send the generated message to receive payment and delivery confirmation.
            </p>

            <div className={styles.orderSummaryBox} style={{ marginBottom: '24px' }}>
              <div className={styles.summaryRow}>
                <span>Order Reference</span>
                <strong className={styles.orderRef}>#{lastOrderRef}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Customer</span>
                <span>{formData.fullName}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Total Due</span>
                <strong style={{ color: 'var(--pink)' }}>₦{grandTotal.toLocaleString()}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
              <button
                className={styles.waOrderBtn}
                onClick={() => {
                  const url = `https://wa.me/${WHATSAPP_NUMBER}`;
                  window.open(url, '_blank');
                }}
              >
                Re-open WhatsApp Chat
              </button>

              <button
                className="btn btn-outline"
                style={{ width: '100%', padding: '14px 20px' }}
                onClick={handleFinishAndReset}
              >
                Back to Shopping
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
