'use client';
import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/data/products';
import { useLiveProducts } from '@/hooks/useLiveProducts';
import { useCart } from '@/context/CartContext';
import DofitNavbar from '@/components/dofit/DofitNavbar';
import DofitFooter from '@/components/dofit/DofitFooter';
import styles from './shop.module.css';

const AVAILABLE_SIZES = ['All', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

function ShopContent() {
  const searchParams = useSearchParams();
  const initialBrand = searchParams.get('brand');
  const { products } = useLiveProducts();

  const { addToCart } = useCart();
  const [selectedBrand, setSelectedBrand] = useState<'all' | 'dofit' | 'asa'>(
    initialBrand === 'dofit' ? 'dofit' : initialBrand === 'asa' ? 'asa' : 'all'
  );
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSize, setSelectedSize] = useState('All');
  const [priceRange, setPriceRange] = useState<'all' | 'under-40k' | '40k-60k' | 'above-60k'>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);
  const [quickSize, setQuickSize] = useState<string>('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (selectedBrand === 'all' || p.brand === selectedBrand) {
        set.add(p.category);
      }
    });
    return ['All', ...Array.from(set)];
  }, [products, selectedBrand]);

  // Active filters count
  const activeFiltersCount =
    (selectedBrand !== 'all' ? 1 : 0) +
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedSize !== 'All' ? 1 : 0) +
    (priceRange !== 'all' ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (searchQuery ? 1 : 0);

  const resetAllFilters = () => {
    setSelectedBrand('all');
    setSelectedCategory('All');
    setSelectedSize('All');
    setPriceRange('all');
    setInStockOnly(false);
    setSearchQuery('');
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Brand filter
    if (selectedBrand !== 'all') {
      list = list.filter((p) => p.brand === selectedBrand);
    }

    // Category filter
    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Size filter
    if (selectedSize !== 'All') {
      list = list.filter((p) => (p.sizes || []).includes(selectedSize));
    }

    // Price range
    if (priceRange === 'under-40k') {
      list = list.filter((p) => p.price < 40000);
    } else if (priceRange === '40k-60k') {
      list = list.filter((p) => p.price >= 40000 && p.price <= 60000);
    } else if (priceRange === 'above-60k') {
      list = list.filter((p) => p.price > 60000);
    }

    // In stock only
    if (inStockOnly) {
      list = list.filter((p) => p.inStock && p.stockCount > 0);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      list.reverse();
    }

    return list;
  }, [products, selectedBrand, selectedCategory, selectedSize, priceRange, inStockOnly, searchQuery, sortBy]);

  const handleQuickAdd = (p: Product) => {
    setQuickAddProduct(p);
    setQuickSize(p.sizes[0] || 'M');
  };

  const confirmQuickAdd = () => {
    if (quickAddProduct) {
      addToCart(quickAddProduct, quickSize);
      setQuickAddProduct(null);
    }
  };

  return (
    <div className={styles.container}>
      <DofitNavbar />

      <main className={styles.main}>
        {/* Header Hero */}
        <section className={styles.shopHero}>
          <div className="wrap">
            <span className={styles.heroEyebrow}>THE COMPLETE ARCHIVE</span>
            <h1 className={`${styles.heroTitle} display`}>
              ALL DROPS &amp; <span className={styles.heroPink}>COLLECTIONS</span>
            </h1>
            <p className={styles.heroSub}>
              Explore high-performance activewear from Dofit Wears and Afrocentric Adire couture from Àṣà by Dofit.
            </p>

            {/* Brand Toggle Tabs */}
            <div className={styles.brandToggleWrap}>
              <button
                type="button"
                className={`${styles.brandTab} ${selectedBrand === 'all' ? styles.brandTabActive : ''}`}
                onClick={() => {
                  setSelectedBrand('all');
                  setSelectedCategory('All');
                }}
              >
                All Collections ({products.length})
              </button>
              <button
                type="button"
                className={`${styles.brandTab} ${selectedBrand === 'dofit' ? styles.brandTabDofitActive : ''}`}
                onClick={() => {
                  setSelectedBrand('dofit');
                  setSelectedCategory('All');
                }}
              >
                <span className={styles.dofitDot} />
                Dofit Activewear ({products.filter((p) => p.brand === 'dofit').length})
              </button>
              <button
                type="button"
                className={`${styles.brandTab} ${selectedBrand === 'asa' ? styles.brandTabAsaActive : ''}`}
                onClick={() => {
                  setSelectedBrand('asa');
                  setSelectedCategory('All');
                }}
              >
                <span className={styles.asaDot} />
                Àṣà Cultural Capsule ({products.filter((p) => p.brand === 'asa').length})
              </button>
            </div>

            {/* Mobile Filter Button */}
            <div>
              <button
                type="button"
                className={styles.mobileFilterTrigger}
                onClick={() => setDrawerOpen(true)}
              >
                ⚡ Filters &amp; Sizes {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </button>
            </div>
          </div>
        </section>

        {/* Filter and Search Bar */}
        <section className={`wrap ${styles.filterBarSection}`}>
          <div className={styles.filterBar}>
            {/* Search Input */}
            <div className={styles.searchWrap}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search fits, sets, fabrics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              {searchQuery && (
                <button
                  type="button"
                  className={styles.clearSearch}
                  onClick={() => setSearchQuery('')}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className={styles.sortWrap}>
              <label htmlFor="shop-sort" className={styles.sortLabel}>Sort By:</label>
              <select
                id="shop-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className={styles.sortSelect}
              >
                <option value="featured">Featured Drops</option>
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Pills (Desktop) */}
          <div className={styles.categoryPills}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`${styles.catPill} ${selectedCategory === cat ? styles.catPillActive : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Product Results Grid */}
        <section className={`wrap ${styles.gridSection}`}>
          {filteredProducts.length === 0 ? (
            <div className={styles.noResults}>
              <p className={styles.noResultsTitle}>No pieces found</p>
              <p className={styles.noResultsSub}>Try adjusting your search terms or filters.</p>
              <button
                type="button"
                className="btn btn-outline-pink"
                onClick={resetAllFilters}
                style={{ marginTop: '16px' }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className={styles.productsGrid}>
              {filteredProducts.map((p) => {
                const isAsa = p.brand === 'asa';
                const isOutOfStock = !p.inStock || p.stockCount === 0;

                return (
                  <div key={p.id} className={`${styles.card} ${isAsa ? styles.cardAsa : styles.cardDofit}`}>
                    <Link href={`/products/${p.slug}`} className={styles.cardImgLink}>
                      <div className={styles.imgWrap}>
                        <Image
                          src={p.images[0] || '/images/dofit-wears/2-Piece Biker Short Set.png'}
                          alt={p.name}
                          fill
                          className={styles.img}
                          sizes="(max-width: 540px) 100vw, (max-width: 860px) 50vw, 33vw"
                          unoptimized={p.images[0]?.startsWith('http')}
                        />
                        <div className={styles.overlay} />

                        {/* Top Badges */}
                        <div className={styles.cardBadges}>
                          {p.tag && (
                            <span className={`${styles.tagBadge} ${isAsa ? styles.tagBadgeAsa : styles.tagBadgeDofit}`}>
                              {p.tag}
                            </span>
                          )}
                          {isOutOfStock && (
                            <span className={styles.tagBadge} style={{ background: '#EF4444', color: '#fff' }}>
                              Sold Out
                            </span>
                          )}
                        </div>

                        {/* Brand Pill */}
                        <span className={`${styles.brandPill} ${isAsa ? styles.brandPillAsa : styles.brandPillDofit}`}>
                          {isAsa ? 'Àṣà' : 'Dofit'}
                        </span>
                      </div>
                    </Link>

                    {/* Content */}
                    <div className={styles.cardInfo}>
                      <div className={styles.cardMeta}>
                        <span className={styles.category}>{p.category}</span>
                        <div className={styles.colors}>
                          {p.colors?.map((c) => (
                            <span
                              key={c.name}
                              className={styles.colorDot}
                              style={{ backgroundColor: c.hex }}
                              title={c.name}
                            />
                          ))}
                        </div>
                      </div>

                      <h3 className={`${styles.name} ${isAsa ? 'asa-display' : 'display'}`}>
                        <Link href={`/products/${p.slug}`} className={styles.nameLink}>
                          {p.name}
                        </Link>
                      </h3>

                      {/* Pricing and Action Button */}
                      <div className={styles.bottomRow}>
                        <div className={styles.priceCol}>
                          <span className={styles.price}>{p.formattedPrice}</span>
                          <span className={`${styles.stockStatus} ${isOutOfStock ? styles.stockStatusOut : ''}`}>
                            {isOutOfStock ? '● Sold Out' : '✓ In Stock'}
                          </span>
                        </div>

                        <button
                          type="button"
                          className={`${styles.quickAddBtn} ${isAsa ? styles.quickAddAsa : styles.quickAddDofit}`}
                          onClick={() => handleQuickAdd(p)}
                          aria-label={`Quick add ${p.name}`}
                          disabled={isOutOfStock}
                        >
                          <span>{isOutOfStock ? 'Sold Out' : '+ Add to Bag'}</span>
                        </button>
                      </div>

                      {/* Sizes Preview */}
                      {p.sizes && p.sizes.length > 0 && (
                        <div className={styles.sizeRow}>
                          <span className={styles.sizeLabel}>Sizes:</span>
                          {p.sizes.map((s) => (
                            <button
                              key={s}
                              type="button"
                              className={styles.sizePill}
                              onClick={() => {
                                setQuickSize(s);
                                handleQuickAdd(p);
                              }}
                              title={`Select size ${s}`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* ======================================================== */}
      {/* MOBILE FILTER & SIZE DRAWER */}
      {/* ======================================================== */}
      {drawerOpen && (
        <div className={styles.drawerOverlay} onClick={(e) => e.target === e.currentTarget && setDrawerOpen(false)}>
          <aside className={styles.drawer}>
            <div className={styles.drawerHeader}>
              <h3 className={styles.drawerTitle}>⚡ Filters &amp; Sizes</h3>
              <button
                type="button"
                className={styles.drawerClose}
                onClick={() => setDrawerOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className={styles.drawerBody}>
              {/* Brand Filter */}
              <div>
                <h4 className={styles.drawerSectionTitle}>Brand</h4>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {(['all', 'dofit', 'asa'] as const).map((b) => (
                    <button
                      key={b}
                      type="button"
                      className={`${styles.sizePillBtn} ${selectedBrand === b ? styles.sizePillBtnActive : ''}`}
                      onClick={() => setSelectedBrand(b)}
                    >
                      {b === 'all' ? 'All' : b === 'dofit' ? 'Dofit Wears' : 'Àṣà Couture'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes Filter */}
              <div>
                <h4 className={styles.drawerSectionTitle}>Size</h4>
                <div className={styles.sizePillsGrid}>
                  {AVAILABLE_SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`${styles.sizePillBtn} ${selectedSize === size ? styles.sizePillBtnActive : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h4 className={styles.drawerSectionTitle}>Price Range</h4>
                <div className={styles.priceOptions}>
                  {[
                    { id: 'all', label: 'All Prices' },
                    { id: 'under-40k', label: 'Under ₦40,000' },
                    { id: '40k-60k', label: '₦40,000 – ₦60,000' },
                    { id: 'above-60k', label: 'Above ₦60,000' },
                  ].map((pr) => (
                    <button
                      key={pr.id}
                      type="button"
                      className={`${styles.priceOptionBtn} ${priceRange === pr.id ? styles.priceOptionBtnActive : ''}`}
                      onClick={() => setPriceRange(pr.id as any)}
                    >
                      {pr.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability Filter */}
              <div>
                <h4 className={styles.drawerSectionTitle}>Availability</h4>
                <button
                  type="button"
                  className={`${styles.priceOptionBtn} ${inStockOnly ? styles.priceOptionBtnActive : ''}`}
                  onClick={() => setInStockOnly(!inStockOnly)}
                >
                  {inStockOnly ? '✓ Showing In-Stock Only' : 'Show All (Including Sold Out)'}
                </button>
              </div>
            </div>

            <div className={styles.drawerFooter}>
              <button
                type="button"
                className={styles.resetBtn}
                onClick={resetAllFilters}
              >
                Reset
              </button>
              <button
                type="button"
                className={styles.applyBtn}
                onClick={() => setDrawerOpen(false)}
              >
                Apply ({filteredProducts.length} Items)
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Quick Add Modal */}
      {quickAddProduct && (
        <div className={styles.modalOverlay} onClick={() => setQuickAddProduct(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h4 className={`${styles.modalTitle} display`}>{quickAddProduct.name}</h4>
              <button
                type="button"
                className={styles.modalClose}
                onClick={() => setQuickAddProduct(null)}
              >
                ✕
              </button>
            </div>
            <p className={styles.modalPrice}>{quickAddProduct.formattedPrice}</p>
            <p className={styles.sizeGuideHint}>Select your size:</p>
            <div className={styles.quickSizes}>
              {quickAddProduct.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`${styles.quickSizeBtn} ${quickSize === s ? styles.quickSizeActive : ''}`}
                  onClick={() => setQuickSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-pink"
              style={{ width: '100%', marginTop: '20px' }}
              onClick={confirmQuickAdd}
            >
              Add to Bag · {quickAddProduct.formattedPrice}
            </button>
          </div>
        </div>
      )}

      <DofitFooter />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0A0A0A' }} />}>
      <ShopContent />
    </Suspense>
  );
}
