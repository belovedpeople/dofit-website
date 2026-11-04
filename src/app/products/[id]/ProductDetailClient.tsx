'use client';
import { useState, useEffect } from 'react';
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
  const [copiedLink, setCopiedLink] = useState(false);

  // Fullscreen Lightbox & Zoom Viewer state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    if (product) {
      if (product.sizes?.[0]) setSelectedSize(product.sizes[0]);
      if (product.colors?.[0]?.name) setSelectedColor(product.colors[0].name);
    }
  }, [product]);

  // Reset selected media to 0 whenever navigating to a different product
  useEffect(() => {
    setSelectedMediaIndex(0);
    setLightboxOpen(false);
    setZoomLevel(1);
  }, [slug]);

  // Lock body scroll when lightbox or size guide modal is active
  useEffect(() => {
    if (lightboxOpen || sizeGuideOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      if (!lightboxOpen) setZoomLevel(1);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxOpen, sizeGuideOpen]);

  const handleCopyProductLink = async () => {
    if (typeof window !== 'undefined') {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      } catch {
        // Fallback for older browsers or restricted permissions
        const input = document.createElement('input');
        input.value = window.location.href;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }
    }
  };

  const handleShareProduct = async () => {
    if (typeof window !== 'undefined') {
      const shareUrl = window.location.href;
      const productName = product?.name || 'Dofit Wears';
      const shareText = `Check out the ${productName} on Dofit Wears!`;
      if (typeof navigator !== 'undefined' && navigator.share) {
        try {
          await navigator.share({
            title: `${productName} | Dofit Wears`,
            text: shareText,
            url: shareUrl,
          });
          return;
        } catch {
          // user cancelled or share unsupported, fallback to copy
        }
      }
      handleCopyProductLink();
    }
  };

  // Unified list of images and videos: VIDEOS FIRST as requested!
  const mediaList: Array<{ type: 'image' | 'video'; url: string }> = [
    ...(product?.videos || []).map((url) => ({ type: 'video' as const, url })),
    ...(product?.images || []).map((url) => ({ type: 'image' as const, url })),
  ];

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') {
        setZoomLevel(1);
        setLightboxIndex((prev) => (prev + 1) % (mediaList.length || 1));
      }
      if (e.key === 'ArrowLeft') {
        setZoomLevel(1);
        setLightboxIndex((prev) => (prev - 1 + (mediaList.length || 1)) % (mediaList.length || 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, mediaList.length]);

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setZoomLevel(1);
    setLightboxOpen(true);
  };

  const handleLightboxNext = () => {
    setZoomLevel(1);
    setLightboxIndex((prev) => (prev + 1) % (mediaList.length || 1));
  };

  const handleLightboxPrev = () => {
    setZoomLevel(1);
    setLightboxIndex((prev) => (prev - 1 + (mediaList.length || 1)) % (mediaList.length || 1));
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(Number((prev + 0.5).toFixed(1)), 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(Number((prev - 0.5).toFixed(1)), 1));
  };

  const handleToggleZoom = () => {
    setZoomLevel((prev) => (prev > 1 ? 1 : 2));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoomLevel === 1) {
      setTouchStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || zoomLevel > 1) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 50) {
      handleLightboxNext();
    } else if (diff < -50) {
      handleLightboxPrev();
    }
    setTouchStartX(null);
  };

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

  const activePrice = (product.sizePrices && selectedSize && product.sizePrices[selectedSize]) || product.price;
  const formattedActivePrice = (product.sizePrices && selectedSize && product.sizePrices[selectedSize])
    ? `₦${product.sizePrices[selectedSize].toLocaleString()}`
    : product.formattedPrice;

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
        <section
          className={`wrap ${styles.productGrid}`}
          style={{
            width: '100%',
            maxWidth: '100%',
            minWidth: 0,
            boxSizing: 'border-box',
          }}
        >
          {/* Left: Gallery (Photos + Videos) */}
          <div
            className={styles.gallery}
            style={{
              width: '100%',
              maxWidth: '100%',
              minWidth: 0,
              boxSizing: 'border-box',
            }}
          >
            {/* Main Stage */}
            <div
              className={styles.mainImageWrap}
              onClick={() => {
                if (currentMedia.type === 'image') {
                  handleOpenLightbox(selectedMediaIndex);
                }
              }}
              style={{
                cursor: currentMedia.type === 'image' ? 'zoom-in' : 'default',
                width: '100%',
                maxWidth: '100%',
                height: 'clamp(340px, 62vh, 520px)',
                maxHeight: '68vh',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
              }}
            >
              {currentMedia.type === 'video' ? (
                <video
                  key={currentMedia.url}
                  src={currentMedia.url}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className={styles.mainVideo}
                  style={{
                    width: '100%',
                    height: '100%',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    objectPosition: 'center',
                    display: 'block',
                    margin: 'auto',
                  }}
                />
              ) : (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    key={currentMedia.url}
                    src={currentMedia.url}
                    alt={product.name}
                    className={styles.mainImage}
                    style={{
                      width: '100%',
                      height: '100%',
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      objectPosition: 'center',
                      display: 'block',
                      margin: 'auto',
                    }}
                    loading="eager"
                  />
                  <button
                    type="button"
                    className={styles.zoomHintBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenLightbox(selectedMediaIndex);
                    }}
                    aria-label="Zoom and view full image"
                  >
                    <span>🔍</span> Tap to expand &amp; zoom
                  </button>
                </>
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
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={media.url}
                        alt=""
                        className={styles.thumbImg}
                        loading="lazy"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Controls */}
          <div
            className={styles.infoCol}
            style={{
              minWidth: 0,
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box',
            }}
          >
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
              <span className={styles.price}>{formattedActivePrice}</span>
              <span className={styles.stockNotice}>
                {isOutOfStock
                  ? '🔴 Currently Out of Stock'
                  : product.stockCount <= 5
                    ? `🔥 Only ${product.stockCount} left in stock`
                    : '✓ In Stock (Ready to Ship)'}
              </span>
            </div>

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
                  {product.sizes.map((s) => {
                    const hasCustomPrice =
                      product.sizePrices &&
                      product.sizePrices[s] &&
                      product.sizePrices[s] !== product.price;
                    return (
                      <button
                        key={s}
                        type="button"
                        className={`${styles.sizeBtn} ${selectedSize === s ? styles.sizeActive : ''}`}
                        onClick={() => setSelectedSize(s)}
                      >
                        <span>{s}</span>
                        {hasCustomPrice && (
                          <span
                            style={{
                              display: 'block',
                              fontSize: '9.5px',
                              opacity: 0.85,
                              marginTop: '2px',
                            }}
                          >
                            ₦{Number(product.sizePrices![s]).toLocaleString()}
                          </span>
                        )}
                      </button>
                    );
                  })}
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
                className={`btn ${isAsa ? 'btn-asa-gold' : 'btn-pink'} ${styles.addBtn} ${addedAnimation ? styles.addedPulse : ''} ${isOutOfStock ? styles.btnDisabled : ''}`}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                {isOutOfStock
                  ? 'SOLD OUT'
                  : addedAnimation
                    ? '✓ ADDED TO BAG'
                    : `ADD TO BAG · ${formattedActivePrice}`}
              </button>
            </div>

            {/* Share & Copy Product Link */}
            <div className={styles.shareSection}>
              <div className={styles.shareHeader}>
                <span className={styles.shareLabel}>Share this piece</span>
                {copiedLink && (
                  <span style={{ fontSize: '12px', color: '#4ADE80', fontWeight: 600 }}>
                    ✓ Link copied to clipboard!
                  </span>
                )}
              </div>
              <div className={styles.shareActions}>
                <button
                  type="button"
                  className={`${styles.shareBtn} ${copiedLink ? styles.shareBtnCopied : ''}`}
                  onClick={handleCopyProductLink}
                  title="Copy link to clipboard"
                >
                  <span>{copiedLink ? '✓' : '📋'}</span>
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>

                <button
                  type="button"
                  className={styles.shareBtn}
                  onClick={handleShareProduct}
                  title="Share to social media or contacts"
                >
                  <span>↗</span>
                  <span>Share</span>
                </button>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `Check out the ${product?.name || 'piece'} on Dofit: https://dofit.fit/products/${product?.id || ''}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.shareBtn} ${styles.shareBtnWa}`}
                  title="Share directly via WhatsApp"
                >
                  <span>💬</span>
                  <span>WhatsApp</span>
                </a>
              </div>
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

            {/* Product Story / Description */}
            <div className={styles.descWrap} style={{ margin: '24px 0 28px' }}>
              <h4 style={{ fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>
                Description &amp; Fit
              </h4>
              <p className={styles.desc}>{product.description}</p>
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
                    <p style={{ marginTop: '12px' }}>
                      <Link
                        href="/shipping-returns"
                        target="_blank"
                        style={{
                          color: isAsa ? 'var(--asa-gold)' : 'var(--pink)',
                          fontSize: '12.5px',
                          textDecoration: 'underline',
                          fontWeight: 600,
                        }}
                      >
                        View Full Shipping &amp; 7-Day Size Exchange Policy →
                      </Link>
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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={rel.images[0] || '/images/dofit-wears/2-Piece Biker Short Set.png'}
                      alt={rel.name}
                      className={styles.relatedImg}
                      loading="lazy"
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

      {/* Fullscreen Lightbox & Zoom Mode */}
      {lightboxOpen && (
        <div
          className={styles.lightboxOverlay}
          onClick={() => setLightboxOpen(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Bar: Counter, Zoom Actions & Close */}
          <div className={styles.lightboxTopBar} onClick={(e) => e.stopPropagation()}>
            <div className={styles.lightboxCounter}>
              {lightboxIndex + 1} / {mediaList.length}
            </div>

            <div className={styles.lightboxZoomControls}>
              {mediaList[lightboxIndex]?.type === 'image' && (
                <>
                  <button
                    type="button"
                    className={styles.lightboxIconBtn}
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 1}
                    title="Zoom Out"
                    aria-label="Zoom Out"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    className={styles.lightboxZoomLevelBadge}
                    onClick={handleToggleZoom}
                    title="Toggle 1x/2x Zoom"
                  >
                    {Math.round(zoomLevel * 100)}%
                  </button>
                  <button
                    type="button"
                    className={styles.lightboxIconBtn}
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 3}
                    title="Zoom In"
                    aria-label="Zoom In"
                  >
                    +
                  </button>
                </>
              )}
            </div>

            <button
              type="button"
              className={styles.lightboxCloseBtn}
              onClick={() => setLightboxOpen(false)}
              aria-label="Close View Mode"
            >
              ✕
            </button>
          </div>

          {/* Center Viewport with Left/Right Arrows */}
          <div className={styles.lightboxCenter} onClick={(e) => e.stopPropagation()}>
            {/* Prev Arrow */}
            {mediaList.length > 1 && (
              <button
                type="button"
                className={`${styles.lightboxNavArrow} ${styles.lightboxPrev}`}
                onClick={handleLightboxPrev}
                aria-label="Previous media slide"
              >
                ‹
              </button>
            )}

            {/* Media Canvas */}
            <div
              className={styles.lightboxMediaViewport}
              onDoubleClick={handleToggleZoom}
            >
              {mediaList[lightboxIndex]?.type === 'video' ? (
                <video
                  key={mediaList[lightboxIndex].url}
                  src={mediaList[lightboxIndex].url}
                  controls
                  autoPlay
                  playsInline
                  className={styles.lightboxVideo}
                />
              ) : (
                <div
                  className={styles.lightboxImageWrapper}
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    cursor: zoomLevel > 1 ? 'grab' : 'zoom-in',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mediaList[lightboxIndex]?.url || ''}
                    alt={product.name}
                    className={styles.lightboxImg}
                  />
                </div>
              )}
            </div>

            {/* Next Arrow */}
            {mediaList.length > 1 && (
              <button
                type="button"
                className={`${styles.lightboxNavArrow} ${styles.lightboxNext}`}
                onClick={handleLightboxNext}
                aria-label="Next media slide"
              >
                ›
              </button>
            )}
          </div>

          {/* Bottom Thumbnails Strip */}
          {mediaList.length > 1 && (
            <div className={styles.lightboxBottomBar} onClick={(e) => e.stopPropagation()}>
              <div className={styles.lightboxThumbsScroll}>
                {mediaList.map((m, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`${styles.lightboxThumbBtn} ${lightboxIndex === i ? styles.lightboxThumbActive : ''}`}
                    onClick={() => {
                      setZoomLevel(1);
                      setLightboxIndex(i);
                    }}
                    aria-label={`Jump to slide ${i + 1}`}
                  >
                    {m.type === 'video' ? (
                      <span className={styles.lightboxThumbPlay}>▶ Video</span>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.url}
                        alt=""
                        className={styles.lightboxThumbImg}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mobile Sticky Floating Add-to-Bag Bar */}
      <div className={`${styles.mobileStickyBar} ${isAsa ? styles.mobileStickyBarAsa : ''}`}>
        <div className={styles.mobileStickyInfo}>
          <span className={styles.mobileStickyPrice}>{formattedActivePrice}</span>
          <span className={styles.mobileStickyMeta}>
            {selectedSize ? `Size: ${selectedSize}` : 'Choose size'}
            {selectedColor ? ` · ${selectedColor}` : ''}
          </span>
        </div>
        <button
          type="button"
          className={`btn ${isAsa ? 'btn-asa-gold' : 'btn-pink'} ${styles.mobileStickyBtn} ${addedAnimation ? styles.addedPulse : ''} ${isOutOfStock ? styles.btnDisabled : ''}`}
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? 'Sold Out' : addedAnimation ? '✓ Added' : 'Add to Bag'}
        </button>
      </div>

      {/* Dynamic Footer */}
      {isAsa ? <AsaFooter /> : <DofitFooter />}
    </div>
  );
}

