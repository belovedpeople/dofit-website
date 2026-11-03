'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Product } from '@/data/products';
import { useLiveProducts } from '@/hooks/useLiveProducts';
import { useCart } from '@/context/CartContext';
import DofitNavbar from '@/components/dofit/DofitNavbar';
import AsaNavbar from '@/components/asa/AsaNavbar';
import DofitFooter from '@/components/dofit/DofitFooter';
import AsaFooter from '@/components/asa/AsaFooter';
import styles from './product.module.css';

interface ProductDetailClientProps {
  initialProduct?: Product;
  slug: string;
}

export default function ProductDetailClient({ initialProduct, slug }: ProductDetailClientProps) {
  const { products: liveProducts, loading: productsLoading } = useLiveProducts();

  const product =
    liveProducts.find((p) => p.slug === slug || p.id === slug) ||
    initialProduct;

  const { addToCart } = useCart();
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Standard');
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'features' | 'fabric' | 'shipping'>('features');
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    if (product) {
      if (product.sizes?.[0]) setSelectedSize(product.sizes[0]);
      if (product.colors?.[0]?.name) setSelectedColor(product.colors[0].name);
    }
  }, [product]);

  if (!product && !productsLoading) {
    notFound();
  }

  if (!product) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        Loading product...
      </div>
    );
  }

  const isAsa = product.brand === 'asa';
  const isOutOfStock = !product.inStock || product.stockCount === 0;

  // Unified list of images and videos
  const mediaList: Array<{ type: 'image' | 'video'; url: string }> = [
    ...(product.images || []).map((url) => ({ type: 'image' as const, url })),
    ...(product.videos || []).map((url) => ({ type: 'video' as const, url })),
  ];

  const currentMedia = mediaList[selectedMediaIndex] || mediaList[0] || { type: 'image', url: '/images/dofit-wears/2-Piece Biker Short Set.png' };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const relatedProducts = liveProducts
    .filter((p) => p.id !== product.id && p.brand === product.brand)
    .slice(0, 3);

  return (
    <div className={`${styles.page} ${isAsa ? styles.asaTheme : styles.dofitTheme}`}>
      {/* Dynamic Navbar based on brand */}
      {isAsa ? <AsaNavbar /> : <DofitNavbar />}

      <main className={styles.main}>
        {/* Breadcrumbs */}
        <div className="wrap">
          <nav className={styles.breadcrumbs} aria-label="Breadcrumbs">
            <Link href="/" className={styles.breadLink}>Home</Link>
            <span className={styles.breadSep}>/</span>
            <Link href={isAsa ? '/asa' : '/shop'} className={styles.breadLink}>
              {isAsa ? 'Àṣà Collection' : 'Dofit Activewear'}
            </Link>
            <span className={styles.breadSep}>/</span>
            <span className={styles.breadCurrent}>{product.name}</span>
          </nav>
        </div>

        {/* Product Showcase */}
        <section className={`wrap ${styles.productGrid}`}>
          {/* Left: Gallery (Photos + Videos) */}
          <div className={styles.gallery}>
            {/* Main Stage */}
            <div className={styles.mainImageWrap}>
              {currentMedia.type === 'video' ? (
                <video
                  key={currentMedia.url}
                  src={currentMedia.url}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className={styles.mainVideo}
                />
              ) : (
                <Image
                  key={currentMedia.url}
                  src={currentMedia.url}
                  alt={product.name}
                  fill
                  priority
                  className={styles.mainImage}
                  sizes="(max-width: 900px) 100vw, 50vw"
                  unoptimized={currentMedia.url.startsWith('http')}
                />
              )}
              {product.tag && (
                <span className={`${styles.tagBadge} ${isAsa ? styles.tagAsa : styles.tagDofit}`}>
                  {product.tag}
                </span>
              )}
            </div>

            {/* Thumbnails row (Images + Videos) */}
            {mediaList.length > 1 && (
              <div className={styles.thumbnailRow}>
                {mediaList.map((media, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`${styles.thumbBtn} ${selectedMediaIndex === index ? styles.thumbActive : ''}`}
                    onClick={() => setSelectedMediaIndex(index)}
                    aria-label={`View media ${index + 1}`}
                  >
                    {media.type === 'video' ? (
                      <div className={styles.videoThumbWrapper}>
                        <video src={media.url} className={styles.thumbVideo} muted />
                        <span className={styles.videoPlayBadge}>▶ Video</span>
                      </div>
                    ) : (
                      <Image
                        src={media.url}
                        alt=""
                        fill
                        className={styles.thumbImg}
                        sizes="90px"
                        unoptimized={media.url.startsWith('http')}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Controls */}
          <div className={styles.infoCol}>
            <div className={styles.brandRow}>
              <span className={isAsa ? styles.brandBadgeAsa : styles.brandBadgeDofit}>
                {isAsa ? 'Àṣà by Dofit · Cultural Couture' : 'Dofit Wears · Performance'}
              </span>
              <div className={styles.rating}>
                <span>★★★★★</span>
                <span className={styles.ratingCount}>4.9 (48 reviews)</span>
              </div>
            </div>

            <h1 className={`${styles.title} ${isAsa ? 'asa-display' : 'display'}`}>
              {product.name}
            </h1>

            <div className={styles.priceRow}>
              <span className={styles.price}>{product.formattedPrice}</span>
              <span className={styles.stockNotice}>
                {isOutOfStock
                  ? '🔴 Currently Out of Stock'
                  : product.stockCount <= 5
                  ? `🔥 Only ${product.stockCount} left in stock`
                  : '✓ In Stock (Ready to Ship)'}
              </span>
            </div>

            <p className={styles.desc}>{product.description}</p>

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className={styles.optionGroup}>
                <div className={styles.optionHeader}>
                  <span className={styles.optionLabel}>Color:</span>
                  <span className={styles.optionVal}>{selectedColor}</span>
                </div>
                <div className={styles.colorSwatches}>
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      className={`${styles.swatch} ${selectedColor === c.name ? styles.swatchActive : ''}`}
                      style={{ backgroundColor: c.hex }}
                      onClick={() => setSelectedColor(c.name)}
                      title={c.name}
                      aria-label={`Select color ${c.name}`}
                    >
                      {selectedColor === c.name && <span className={styles.swatchCheck}>✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className={styles.optionGroup}>
                <div className={styles.optionHeader}>
                  <span className={styles.optionLabel}>Select Size:</span>
                  <button
                    type="button"
                    className={styles.sizeGuideLink}
                    onClick={() => setSizeGuideOpen(true)}
                  >
                    Size Guide 📐
                  </button>
                </div>
                <div className={styles.sizeGrid}>
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`${styles.sizeBtn} ${selectedSize === s ? styles.sizeActive : ''}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Bag */}
            <div className={styles.actionRow}>
              <div className={styles.qtyControl}>
                <button
                  type="button"
                  className={styles.qtyBtn}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  disabled={isOutOfStock}
                >
                  −
                </button>
                <span className={styles.qtyVal}>{quantity}</span>
                <button
                  type="button"
                  className={styles.qtyBtn}
                  onClick={() => setQuantity((q) => Math.min(product.stockCount || 10, q + 1))}
                  aria-label="Increase quantity"
                  disabled={isOutOfStock}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className={`btn ${isAsa ? 'btn-gold' : 'btn-pink'} ${styles.addBtn} ${addedAnimation ? styles.addedPulse : ''} ${isOutOfStock ? styles.btnDisabled : ''}`}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                {isOutOfStock
                  ? 'SOLD OUT'
                  : addedAnimation
                  ? '✓ ADDED TO BAG'
                  : `ADD TO BAG · ${product.formattedPrice}`}
              </button>
            </div>

            {/* Trust Badges */}
            <div className={styles.trustStrip}>
              <div className={styles.trustItem}>
                <span>⚡</span>
                <span>Express Lagos Delivery (Same Day / 24 Hours)</span>
              </div>
              <div className={styles.trustItem}>
                <span>🔄</span>
                <span>Free 7-Day Size Exchanges</span>
              </div>
              <div className={styles.trustItem}>
                <span>🇳🇬</span>
                <span>Proudly Crafted & Packaged in Nigeria</span>
              </div>
            </div>

            {/* Details Tabs */}
            <div className={styles.tabs}>
              <div className={styles.tabHeaders}>
                <button
                  type="button"
                  className={`${styles.tabHeader} ${activeTab === 'features' ? styles.tabHeaderActive : ''}`}
                  onClick={() => setActiveTab('features')}
                >
                  Features
                </button>
                <button
                  type="button"
                  className={`${styles.tabHeader} ${activeTab === 'fabric' ? styles.tabHeaderActive : ''}`}
                  onClick={() => setActiveTab('fabric')}
                >
                  Fabric & Care
                </button>
                <button
                  type="button"
                  className={`${styles.tabHeader} ${activeTab === 'shipping' ? styles.tabHeaderActive : ''}`}
                  onClick={() => setActiveTab('shipping')}
                >
                  Shipping & Returns
                </button>
              </div>

              <div className={styles.tabContent}>
                {activeTab === 'features' && (
                  <ul className={styles.featureList}>
                    {product.features?.map((f, i) => (
                      <li key={i}>
                        <span className={styles.bullet}>✦</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === 'fabric' && (
                  <div className={styles.fabricContent}>
                    {product.fabric && (
                      <p>
                        <strong>Material:</strong> {product.fabric}
                      </p>
                    )}
                    {product.care && product.care.length > 0 && (
                      <div>
                        <strong>Care Instructions:</strong>
                        <ul className={styles.featureList}>
                          {product.care.map((c, i) => (
                            <li key={i}>
                              <span className={styles.bullet}>—</span>
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className={styles.shippingContent}>
                    <p>
                      <strong>Lagos:</strong> ₦2,500 flat dispatch (Free over ₦50,000) · 12–24h.
                    </p>
                    <p>
                      <strong>Interstate (Abuja, PH, Ibadan, etc.):</strong> ₦5,000 · 2–3 business days via verified logistics.
                    </p>
                    <p>
                      <strong>International:</strong> DHL Express available on WhatsApp inquiry.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className={`wrap ${styles.relatedSection}`}>
            <h2 className={`${styles.relatedTitle} ${isAsa ? 'asa-display' : 'display'}`}>
              COMPLETE THE LOOK
            </h2>
            <div className={styles.relatedGrid}>
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/products/${rel.slug}`}
                  className={styles.relatedCard}
                >
                  <div className={styles.relatedImgWrap}>
                    <Image
                      src={rel.images[0] || '/images/dofit-wears/2-Piece Biker Short Set.png'}
                      alt={rel.name}
                      fill
                      className={styles.relatedImg}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      unoptimized={rel.images[0]?.startsWith('http')}
                    />
                  </div>
                  <div className={styles.relatedInfo}>
                    <h3 className={`${styles.relatedName} ${isAsa ? 'asa-display' : 'display'}`}>
                      {rel.name}
                    </h3>
                    <span className={styles.relatedPrice}>{rel.formattedPrice}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <div className={styles.modalOverlay} onClick={() => setSizeGuideOpen(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={`${styles.modalTitle} display`}>SIZE GUIDE</h3>
              <button
                type="button"
                className={styles.modalClose}
                onClick={() => setSizeGuideOpen(false)}
              >
                ✕
              </button>
            </div>
            <p className={styles.modalSub}>All measurements are indicated in inches (True to size fits).</p>
            <div className={styles.tableWrap}>
              <table className={styles.sizeTable}>
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Bust</th>
                    <th>Waist</th>
                    <th>Hips</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>XS (UK 6)</td><td>30 - 32&quot;</td><td>24 - 26&quot;</td><td>33 - 35&quot;</td></tr>
                  <tr><td>S (UK 8-10)</td><td>33 - 35&quot;</td><td>26 - 28&quot;</td><td>36 - 38&quot;</td></tr>
                  <tr><td>M (UK 12)</td><td>36 - 38&quot;</td><td>29 - 31&quot;</td><td>39 - 41&quot;</td></tr>
                  <tr><td>L (UK 14)</td><td>39 - 41&quot;</td><td>32 - 34&quot;</td><td>42 - 44&quot;</td></tr>
                  <tr><td>XL (UK 16)</td><td>42 - 45&quot;</td><td>35 - 38&quot;</td><td>45 - 48&quot;</td></tr>
                </tbody>
              </table>
            </div>
            <button
              type="button"
              className="btn btn-pink"
              style={{ width: '100%', marginTop: '20px' }}
              onClick={() => setSizeGuideOpen(false)}
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Footer */}
      {isAsa ? <AsaFooter /> : <DofitFooter />}
    </div>
  );
}
