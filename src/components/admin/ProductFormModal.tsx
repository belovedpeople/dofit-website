'use client';
import { useState, useEffect } from 'react';
import { Product } from '@/data/products';
import MediaUploader from './MediaUploader';
import styles from './ProductFormModal.module.css';

interface ProductFormModalProps {
  open: boolean;
  product?: Product | null; // null = create mode
  onClose: () => void;
  onSaved: (product: Product) => void;
}

const SIZES_DOFIT = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SIZES_ASA = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size', 'Custom'];
const CATEGORIES_DOFIT = ['Matching Sets', 'Outerwear', 'Tops', 'Bottoms', 'Accessories'];
const CATEGORIES_ASA = ['Adire Tops', 'Adire Bottoms', 'Adire Sets', 'Robes & Wraps', 'Accessories & Bags'];
const TAGS = ['Best Seller', 'New Drop', 'Featured', 'Trending', 'Limited Edition', 'Sold Out'];

function emptyForm(): Partial<Product> {
  return {
    name: '',
    brand: 'dofit',
    category: '',
    price: 0,
    tag: '',
    description: '',
    features: [''],
    fabric: '',
    care: [''],
    colors: [{ name: '', hex: '#000000' }],
    sizes: [],
    images: [],
    videos: [],
    inStock: true,
    stockCount: 10,
  };
}

export default function ProductFormModal({ open, product, onClose, onSaved }: ProductFormModalProps) {
  const isEdit = !!product;
  const [form, setForm] = useState<Partial<Product>>(isEdit ? { ...product } : emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'media' | 'variants' | 'details'>('basic');
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(isEdit && product ? { ...product, videos: product.videos || [] } : emptyForm());
      setError('');
      setActiveTab('basic');
      if (isEdit && product?.category) {
        const isStandard =
          CATEGORIES_DOFIT.includes(product.category) ||
          CATEGORIES_ASA.includes(product.category);
        setIsCustomCategory(!isStandard);
      } else {
        setIsCustomCategory(false);
      }
    }
  }, [open, product, isEdit]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [open]);

  if (!open) return null;

  const set = (field: keyof Product, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // ── Dynamic list helpers ──
  const updateListItem = (field: 'features' | 'care', idx: number, value: string) => {
    const arr = [...((form[field] as string[]) || [])];
    arr[idx] = value;
    set(field, arr);
  };
  const addListItem = (field: 'features' | 'care') =>
    set(field, [...((form[field] as string[]) || []), '']);
  const removeListItem = (field: 'features' | 'care', idx: number) =>
    set(field, ((form[field] as string[]) || []).filter((_, i) => i !== idx));

  const updateColor = (idx: number, key: 'name' | 'hex', value: string) => {
    const arr = [...(form.colors || [])];
    arr[idx] = { ...arr[idx], [key]: value };
    set('colors', arr);
  };
  const addColor = () => set('colors', [...(form.colors || []), { name: '', hex: '#FF1E6A' }]);
  const removeColor = (idx: number) => set('colors', (form.colors || []).filter((_, i) => i !== idx));

  const toggleSize = (size: string) => {
    const current = form.sizes || [];
    set('sizes', current.includes(size) ? current.filter((s) => s !== size) : [...current, size]);
  };

  const handleSubmit = async () => {
    setError('');
    if (!form.name?.trim()) return setError('Product name is required.');
    if (!form.category?.trim()) return setError('Category is required.');
    if (!form.price || form.price <= 0) return setError('Price must be greater than 0.');
    if (!form.description?.trim()) return setError('Description is required.');

    setSaving(true);
    try {
      const url = isEdit ? `/api/products/${product!.id}` : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          features: (form.features || []).filter(Boolean),
          care: (form.care || []).filter(Boolean),
          colors: (form.colors || []).filter((c) => c.name),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      onSaved(data.product);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const sizeOptions = form.brand === 'asa' ? SIZES_ASA : SIZES_DOFIT;
  const categoryOptions = form.brand === 'asa' ? CATEGORIES_ASA : CATEGORIES_DOFIT;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>
              {isEdit ? '✏️ Edit Product' : '➕ Add New Product'}
            </h2>
            <p className={styles.modalSub}>
              {isEdit ? `Editing: ${product!.name}` : 'Fill in the product details below'}
            </p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {(['basic', 'media', 'variants', 'details'] as const).map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'basic' && '📋 Basic Info'}
              {tab === 'media' && '📸 Media'}
              {tab === 'variants' && '🎨 Variants'}
              {tab === 'details' && '📝 Details'}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          {/* ── BASIC TAB ── */}
          {activeTab === 'basic' && (
            <div className={styles.formGrid}>
              <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                <label className={styles.label}>Product Name *</label>
                <input
                  className={styles.input}
                  placeholder="e.g. 2-Piece Biker Short Set"
                  value={form.name || ''}
                  onChange={(e) => set('name', e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Brand *</label>
                <select
                  className={styles.select}
                  value={form.brand || 'dofit'}
                  onChange={(e) => set('brand', e.target.value as 'dofit' | 'asa')}
                >
                  <option value="dofit">Dofit Wears</option>
                  <option value="asa">Àṣà by Dofit</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className={styles.label}>Category *</label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomCategory(!isCustomCategory);
                      if (!isCustomCategory && !form.category) {
                        set('category', '');
                      }
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--pink, #FF1E6A)',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    {isCustomCategory ? '← Choose from standard list' : '➕ Create Custom Category'}
                  </button>
                </div>

                {isCustomCategory ? (
                  <input
                    className={styles.input}
                    placeholder="Type custom category (e.g. Athleisure, Robes, Luxury Streetwear)..."
                    value={form.category || ''}
                    onChange={(e) => set('category', e.target.value)}
                    autoFocus
                  />
                ) : (
                  <select
                    className={styles.select}
                    value={form.category || ''}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setIsCustomCategory(true);
                        set('category', '');
                      } else {
                        set('category', e.target.value);
                      }
                    }}
                  >
                    <option value="">Select category...</option>
                    {categoryOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    <option value="__custom__">+ Enter Custom Category...</option>
                  </select>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Price (₦) *</label>
                <input
                  className={styles.input}
                  type="number"
                  placeholder="45000"
                  value={form.price || ''}
                  onChange={(e) => set('price', Number(e.target.value))}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Tag / Badge</label>
                <select
                  className={styles.select}
                  value={form.tag || ''}
                  onChange={(e) => set('tag', e.target.value || undefined)}
                >
                  <option value="">None</option>
                  {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Stock Count</label>
                <input
                  className={styles.input}
                  type="number"
                  placeholder="10"
                  value={form.stockCount ?? ''}
                  onChange={(e) => set('stockCount', Number(e.target.value))}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Availability</label>
                <div className={styles.toggleRow}>
                  <button
                    className={`${styles.toggleBtn} ${form.inStock ? styles.toggleBtnActive : ''}`}
                    onClick={() => set('inStock', true)}
                  >✓ In Stock</button>
                  <button
                    className={`${styles.toggleBtn} ${!form.inStock ? styles.toggleBtnDanger : ''}`}
                    onClick={() => set('inStock', false)}
                  >✕ Out of Stock</button>
                </div>
              </div>

              <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                <label className={styles.label}>Description *</label>
                <textarea
                  className={styles.textarea}
                  rows={4}
                  placeholder="Describe the product..."
                  value={form.description || ''}
                  onChange={(e) => set('description', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* ── MEDIA TAB ── */}
          {activeTab === 'media' && (
            <div>
              <p className={styles.tabHint}>
                Upload product images and videos. Drag to reorder — the first item is the primary display image.
                Hover over videos to preview them.
              </p>
              <MediaUploader
                productId={product?.id || `new-${Date.now()}`}
                existingImages={form.images || []}
                existingVideos={form.videos || []}
                onChange={(images, videos) => {
                  set('images', images);
                  set('videos', videos);
                }}
              />
              <div className={styles.mediaStats}>
                <span>🖼 {(form.images || []).length} image(s)</span>
                <span>🎬 {(form.videos || []).length} video(s)</span>
              </div>
            </div>
          )}

          {/* ── VARIANTS TAB ── */}
          {activeTab === 'variants' && (
            <div className={styles.variantsSection}>
              {/* Sizes */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Available Sizes</label>
                <div className={styles.sizeGrid}>
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      className={`${styles.sizeBtn} ${(form.sizes || []).includes(size) ? styles.sizeBtnActive : ''}`}
                      onClick={() => toggleSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Per Size (Optional) */}
              {form.sizes && form.sizes.length > 0 && (
                <div className={styles.formGroup} style={{ marginTop: '4px' }}>
                  <div className={styles.listHeader}>
                    <label className={styles.label}>💰 Price Per Size (Optional)</label>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>
                      Base: ₦{(form.price || 0).toLocaleString()}
                    </span>
                  </div>
                  <p style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.45)', margin: '0 0 10px', lineHeight: 1.4 }}>
                    Leave blank to use base price (₦{(form.price || 0).toLocaleString()}). Set custom prices for sizes that cost differently.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                    {form.sizes.map((size) => (
                      <div
                        key={size}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '8px',
                          padding: '8px 10px',
                        }}
                      >
                        <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--pink, #FF1E6A)', marginBottom: '4px' }}>
                          Size {size}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '11.5px', color: 'rgba(255, 255, 255, 0.35)' }}>₦</span>
                          <input
                            type="number"
                            className={styles.input}
                            style={{ padding: '6px 8px', fontSize: '14px', height: '36px' }}
                            placeholder={`${form.price || 0}`}
                            value={form.sizePrices?.[size] ?? ''}
                            onChange={(e) => {
                              const val = e.target.value === '' ? undefined : Number(e.target.value);
                              const next = { ...(form.sizePrices || {}) };
                              if (val === undefined || isNaN(val) || val <= 0) {
                                delete next[size];
                              } else {
                                next[size] = val;
                              }
                              set('sizePrices', Object.keys(next).length > 0 ? next : undefined);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              <div className={styles.formGroup}>
                <div className={styles.listHeader}>
                  <label className={styles.label}>Colors</label>
                  <button className={styles.addItemBtn} onClick={addColor}>+ Add Color</button>
                </div>
                <div className={styles.colorList}>
                  {(form.colors || []).map((color, idx) => (
                    <div key={idx} className={styles.colorRow}>
                      <input
                        type="color"
                        className={styles.colorPicker}
                        value={color.hex || '#000000'}
                        onChange={(e) => updateColor(idx, 'hex', e.target.value)}
                      />
                      <input
                        className={styles.input}
                        placeholder="Color name (e.g. Onyx Black)"
                        value={color.name}
                        onChange={(e) => updateColor(idx, 'name', e.target.value)}
                      />
                      <button className={styles.removeItemBtn} onClick={() => removeColor(idx)}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── DETAILS TAB ── */}
          {activeTab === 'details' && (
            <div className={styles.detailsSection}>
              {/* Fabric */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Fabric / Material</label>
                <input
                  className={styles.input}
                  placeholder="e.g. 78% Recycled Polyamide, 22% Spandex"
                  value={form.fabric || ''}
                  onChange={(e) => set('fabric', e.target.value)}
                />
              </div>

              {/* Features */}
              <div className={styles.formGroup}>
                <div className={styles.listHeader}>
                  <label className={styles.label}>Key Features</label>
                  <button className={styles.addItemBtn} onClick={() => addListItem('features')}>+ Add Feature</button>
                </div>
                <div className={styles.dynamicList}>
                  {(form.features || []).map((feat, idx) => (
                    <div key={idx} className={styles.listRow}>
                      <span className={styles.listBullet}>•</span>
                      <input
                        className={styles.input}
                        placeholder={`Feature ${idx + 1}`}
                        value={feat}
                        onChange={(e) => updateListItem('features', idx, e.target.value)}
                      />
                      <button className={styles.removeItemBtn} onClick={() => removeListItem('features', idx)}>✕</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Care */}
              <div className={styles.formGroup}>
                <div className={styles.listHeader}>
                  <label className={styles.label}>Care Instructions</label>
                  <button className={styles.addItemBtn} onClick={() => addListItem('care')}>+ Add Instruction</button>
                </div>
                <div className={styles.dynamicList}>
                  {(form.care || []).map((care, idx) => (
                    <div key={idx} className={styles.listRow}>
                      <span className={styles.listBullet}>—</span>
                      <input
                        className={styles.input}
                        placeholder={`Care instruction ${idx + 1}`}
                        value={care}
                        onChange={(e) => updateListItem('care', idx, e.target.value)}
                      />
                      <button className={styles.removeItemBtn} onClick={() => removeListItem('care', idx)}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          {error && <p className={styles.errorMsg}>⚠️ {error}</p>}
          <div className={styles.footerActions}>
            <button className={styles.cancelBtn} onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button className={styles.saveBtn} onClick={handleSubmit} disabled={saving}>
              {saving ? '⏳ Saving...' : isEdit ? '💾 Update Product' : '✅ Create Product'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

