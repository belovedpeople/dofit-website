'use client';
import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { products, Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import DofitNavbar from '@/components/dofit/DofitNavbar';
import DofitFooter from '@/components/dofit/DofitFooter';
import styles from './shop.module.css';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialBrand = searchParams.get('brand');

  const { addToCart } = useCart();
  const [selectedBrand, setSelectedBrand] = useState<'all' | 'dofit' | 'asa'>(
    initialBrand === 'dofit' ? 'dofit' : initialBrand === 'asa' ? 'asa' : 'all'
  );
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);
  const [quickSize, setQuickSize] = useState<string>('');

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (selectedBrand === 'all' || p.brand === selectedBrand) {
        set.add(p.category);
      }
    });
    return ['All', ...Array.from(set)];
  }, [selectedBrand]);

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
  }, [selectedBrand, selectedCategory, searchQuery, sortBy]);

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
                Dofit Activewear (7)
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
                Àṣà Cultural Capsule (9)
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

          {/* Category Pills */}
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
                onClick={() => {
                  setSelectedBrand('all');
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                style={{ marginTop: '16px' }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className={styles.productsGrid}>
              {filteredProducts.map((p) => {
                const isAsa = p.brand === 'asa';
                return (
                  <div key={p.id} className={`${styles.card} ${isAsa ? styles.cardAsa : styles.cardDofit}`}>
                    <Link href={`/products/${p.slug}`} className={styles.cardImgLink}>
                      <div className={styles.imgWrap}>
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          fill
                          className={styles.mainImg}
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                        {p.images[1] && (
                          <Image
                            src={p.images[1]}
                            alt={p.name}
                            fill
                            className={styles.hoverImg}
                            sizes="(max-width: 768px) 50vw, 33vw"
                          />
                        )}
                        {p.tag && (
                          <span className={`${styles.tag} ${isAsa ? styles.tagAsa : styles.tagDofit}`}>
                            {p.tag}
                          </span>
                        )}
                      </div>
                    </Link>

                    <div className={styles.cardDetails}>
                      <div className={styles.cardBrandLine}>
                        <span className={isAsa ? styles.brandTagAsa : styles.brandTagDofit}>
                          {isAsa ? 'Àṣà Couture' : 'Dofit Active'}
                        </span>
                        <span className={styles.categoryName}>{p.category}</span>
                      </div>

                      <Link href={`/products/${p.slug}`} className={styles.cardTitleLink}>
                        <h3 className={`${styles.cardTitle} ${isAsa ? 'asa-display' : 'display'}`}>
                          {p.name}
                        </h3>
                      </Link>

                      <div className={styles.cardBottomRow}>
                        <span className={styles.price}>{p.formattedPrice}</span>
                        <button
                          type="button"
                          className={styles.quickAddBtn}
                          onClick={() => handleQuickAdd(p)}
                          aria-label={`Quick Add ${p.name}`}
                        >
                          + Quick Add
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Quick Add Modal */}
      {quickAddProduct && (
        <div className={styles.quickModalOverlay} onClick={() => setQuickAddProduct(null)}>
          <div className={styles.quickModalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.quickModalHeader}>
              <div className={styles.quickModalImgWrap}>
                <Image
                  src={quickAddProduct.images[0]}
                  alt={quickAddProduct.name}
                  fill
                  className={styles.quickModalImg}
                  sizes="60px"
                />
              </div>
              <div className={styles.quickModalMeta}>
                <h4 className={`${styles.quickModalTitle} display`}>{quickAddProduct.name}</h4>
                <p className={styles.quickModalPrice}>{quickAddProduct.formattedPrice}</p>
              </div>
              <button
                type="button"
                className={styles.quickModalClose}
                onClick={() => setQuickAddProduct(null)}
              >
                ✕
              </button>
            </div>

            <div className={styles.quickSizeSection}>
              <span className={styles.quickSizeLabel}>Select Size:</span>
              <div className={styles.quickSizePills}>
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
