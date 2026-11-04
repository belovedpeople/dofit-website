'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/data/products';
import ProductFormModal from '@/components/admin/ProductFormModal';
import styles from '../admin.module.css';

export default function AdminProductsPage() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [brandFilter, setBrandFilter] = useState<'all' | 'dofit' | 'asa'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.products) setProductList(data.products);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (p: Product) => { setEditTarget(p); setModalOpen(true); };

  const handleSaved = (saved: Product) => {
    setProductList((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
    setModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await fetch(`/api/products/${deleteId}`, { method: 'DELETE' });
      setProductList((prev) => prev.filter((p) => p.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error('Delete failed', err);
    } finally {
      setDeleting(false);
    }
  };

  const updateStock = async (id: string, delta: number) => {
    const product = productList.find((p) => p.id === id);
    if (!product) return;
    const newStock = Math.max(0, product.stockCount + delta);
    try {
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockCount: newStock, inStock: newStock > 0 }),
      });
      setProductList((prev) =>
        prev.map((p) => p.id === id ? { ...p, stockCount: newStock, inStock: newStock > 0 } : p)
      );
    } catch (err) {
      console.error('Stock update failed', err);
    }
  };

  const toggleStatus = async (id: string) => {
    const product = productList.find((p) => p.id === id);
    if (!product) return;
    try {
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: !product.inStock }),
      });
      setProductList((prev) =>
        prev.map((p) => p.id === id ? { ...p, inStock: !p.inStock } : p)
      );
    } catch (err) {
      console.error('Status toggle failed', err);
    }
  };

  const filtered = productList.filter((p) => {
    const matchesBrand = brandFilter === 'all' || p.brand === brandFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBrand && matchesSearch;
  });

  return (
    <div>
      {/* Top Filter Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {(['all', 'dofit', 'asa'] as const).map((b) => (
            <button
              key={b}
              onClick={() => setBrandFilter(b)}
              className={styles.actionBtn}
              style={{
                background: brandFilter === b
                  ? b === 'asa' ? 'rgba(232,160,32,0.25)' : b === 'dofit' ? 'rgba(255,30,106,0.25)' : 'rgba(255,255,255,0.18)'
                  : 'rgba(255,255,255,0.06)',
                borderColor: brandFilter === b
                  ? b === 'asa' ? 'var(--asa-gold)' : b === 'dofit' ? 'var(--pink)' : 'rgba(255,255,255,0.3)'
                  : 'transparent',
                color: brandFilter === b
                  ? b === 'asa' ? 'var(--asa-gold)' : b === 'dofit' ? 'var(--pink)' : '#FFFFFF'
                  : '#FFFFFF',
              }}
            >
              {b === 'all' ? `All (${productList.length})` : b === 'dofit' ? `Dofit (${productList.filter((p) => p.brand === 'dofit').length})` : `Àṣà (${productList.filter((p) => p.brand === 'asa').length})`}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', flex: '1 1 280px', justifyContent: 'flex-end' }}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ background: '#15151D', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 16px', color: '#FFFFFF', fontSize: '14px', outline: 'none', minWidth: '160px', flex: 1 }}
          />
          <button
            onClick={openAdd}
            style={{ background: 'linear-gradient(135deg, #FF1E6A, #FF6B9D)', border: 'none', color: '#FFFFFF', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', minHeight: '40px' }}
          >
            + New Product
          </button>
        </div>
      </div>

      {/* Products Table (Desktop) */}
      <div className={styles.tableCard}>
        <div className={styles.desktopTableWrap}>
          <div style={{ overflowX: 'auto' }}>
            {loading ? (
              <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.35)' }}>Loading products...</div>
            ) : (
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Media</th>
                    <th>Inventory</th>
                    <th>Sizes</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '40px', opacity: 0.4 }}>
                        No products found
                      </td>
                    </tr>
                  )}
                  {filtered.map((product) => (
                    <tr key={product.id}>
                      {/* Product */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ position: 'relative', width: '44px', height: '54px', borderRadius: '6px', overflow: 'hidden', background: '#1A1A1A', flexShrink: 0 }}>
                            {product.images?.[0] ? (
                              <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: 'cover' }} unoptimized />
                            ) : (
                              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📦</div>
                            )}
                          </div>
                          <div>
                            <strong>{product.name}</strong>
                            {product.tag && <div style={{ fontSize: '10.5px', color: 'var(--pink)' }}>🏷 {product.tag}</div>}
                            <div style={{ fontSize: '10px', opacity: 0.3 }}>ID: {product.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* Brand */}
                      <td>
                        {product.brand === 'asa'
                          ? <span className={styles.brandBadgeAsa}>Àṣà</span>
                          : <span className={styles.brandBadgeDofit}>Dofit</span>
                        }
                      </td>

                      {/* Category */}
                      <td style={{ fontSize: '12.5px', opacity: 0.7 }}>{product.category}</td>

                      {/* Price */}
                      <td><strong>{product.formattedPrice}</strong></td>

                      {/* Media count */}
                      <td>
                        <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span>🖼 {product.images?.length || 0} img</span>
                          {(product.videos?.length ?? 0) > 0 && <span>🎬 {product.videos!.length} vid</span>}
                        </div>
                      </td>

                      {/* Stock */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button onClick={() => updateStock(product.id, -1)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#FFFFFF', width: '24px', height: '24px', borderRadius: '4px', cursor: 'pointer' }}>−</button>
                          <span style={{ fontWeight: 700, minWidth: '28px', textAlign: 'center', color: product.stockCount === 0 ? '#EF4444' : product.stockCount <= 10 ? '#EAB308' : '#4ADE80' }}>
                            {product.stockCount}
                          </span>
                          <button onClick={() => updateStock(product.id, 1)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#FFFFFF', width: '24px', height: '24px', borderRadius: '4px', cursor: 'pointer' }}>+</button>
                        </div>
                      </td>

                      {/* Sizes */}
                      <td>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '120px' }}>
                          {product.sizes.map((s) => (
                            <span key={s} style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 5px', borderRadius: '3px', fontSize: '10px' }}>{s}</span>
                          ))}
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <button
                          onClick={() => toggleStatus(product.id)}
                          style={{ background: product.inStock ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', border: `1px solid ${product.inStock ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, color: product.inStock ? '#4ADE80' : '#EF4444', padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                        >
                          {product.inStock ? '✓ In Stock' : '✕ Out of Stock'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'nowrap' }}>
                          <button
                            onClick={() => openEdit(product)}
                            className={styles.actionBtn}
                            style={{ fontSize: '11px', padding: '5px 10px' }}
                          >✏️ Edit</button>
                          <Link href={`/products/${product.slug}`} target="_blank" className={styles.actionBtn} style={{ fontSize: '11px', padding: '5px 10px' }}>
                            👁 View
                          </Link>
                          <button
                            onClick={() => setDeleteId(product.id)}
                            style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#EF4444', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}
                          >🗑 Del</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Mobile Product Cards View */}
        <div className={styles.mobileCardList}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
              Loading products...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
              No products match your search or filter.
            </div>
          ) : (
            filtered.map((product) => (
              <div key={product.id} className={styles.mobileProductCard}>
                <div className={styles.mobileProductMain}>
                  <div className={styles.mobileProductThumb}>
                    {product.images?.[0] ? (
                      <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: 'cover' }} unoptimized />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>📦</div>
                    )}
                  </div>
                  <div className={styles.mobileProductInfo}>
                    <div>
                      <h3 className={styles.mobileProductTitle}>{product.name}</h3>
                      <div className={styles.mobileProductMetaRow}>
                        {product.brand === 'asa' ? (
                          <span className={styles.brandBadgeAsa}>Àṣà</span>
                        ) : (
                          <span className={styles.brandBadgeDofit}>Dofit</span>
                        )}
                        <span style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.5)' }}>{product.category}</span>
                        {product.tag && (
                          <span style={{ fontSize: '10.5px', color: 'var(--pink)', background: 'rgba(255,30,106,0.1)', padding: '1px 6px', borderRadius: '4px' }}>
                            🏷 {product.tag}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={styles.mobileProductPrice}>{product.formattedPrice}</div>
                  </div>
                </div>

                {/* Stock Controls */}
                <div className={styles.mobileProductStockRow}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
                      Inventory Stock
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, fontSize: '15px', color: product.stockCount === 0 ? '#EF4444' : product.stockCount <= 10 ? '#EAB308' : '#4ADE80' }}>
                        {product.stockCount} units
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleStatus(product.id)}
                        style={{
                          background: product.inStock ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                          border: `1px solid ${product.inStock ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                          color: product.inStock ? '#4ADE80' : '#EF4444',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {product.inStock ? '● Active' : '○ Hidden'}
                      </button>
                    </div>
                  </div>

                  <div className={styles.mobileStockControls}>
                    <button
                      type="button"
                      className={styles.mobileStockBtn}
                      onClick={() => updateStock(product.id, -1)}
                      aria-label="Decrease stock"
                    >
                      −
                    </button>
                    <button
                      type="button"
                      className={styles.mobileStockBtn}
                      onClick={() => updateStock(product.id, 1)}
                      aria-label="Increase stock"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Sizes Summary */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', fontSize: '11.5px', color: 'rgba(255,255,255,0.6)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>Sizes:</span>
                  {product.sizes.map((s) => (
                    <span key={s} style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>
                      {s}{product.sizePrices?.[s] ? ` (₦${product.sizePrices[s].toLocaleString()})` : ''}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className={styles.mobileProductActions}>
                  <button
                    type="button"
                    className={styles.mobileEditBtn}
                    onClick={() => openEdit(product)}
                  >
                    ✏️ Edit Product & Sizes
                  </button>
                  <button
                    type="button"
                    className={styles.mobileDeleteBtn}
                    onClick={() => setDeleteId(product.id)}
                    aria-label="Delete product"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Floating Add Product Button for Mobile */}
      <button
        type="button"
        className={styles.mobileFab}
        onClick={openAdd}
        aria-label="Add new product"
      >
        <span style={{ fontSize: '18px', lineHeight: 1 }}>➕</span>
        <span>Add Product</span>
      </button>

      {/* Product Form Modal */}
      <ProductFormModal
        open={modalOpen}
        product={editTarget}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />

      {/* Delete Confirm Dialog */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#12121A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '32px', maxWidth: '380px', width: '90%', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🗑️</div>
            <h3 style={{ color: '#FFFFFF', marginBottom: '8px' }}>Delete Product?</h3>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', marginBottom: '24px' }}>
              This action cannot be undone. The product will be permanently removed.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={() => setDeleteId(null)} className={styles.actionBtn}>Cancel</button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                style={{ background: '#EF4444', border: 'none', color: '#FFFFFF', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
              >{deleting ? 'Deleting...' : 'Yes, Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
