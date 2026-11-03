'use client';
import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductBySlug, Product } from '@/data/products';
import { useLiveProducts } from '@/hooks/useLiveProducts';
import { useCart } from '@/context/CartContext';
import DofitNavbar from '@/components/dofit/DofitNavbar';
import AsaNavbar from '@/components/asa/AsaNavbar';
import DofitFooter from '@/components/dofit/DofitFooter';
import AsaFooter from '@/components/asa/AsaFooter';
import styles from './product.module.css';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.id as string;
  const { products: liveProducts, loading: productsLoading } = useLiveProducts();

  const product = liveProducts.find((p) => p.slug === slug || p.id === slug) || getProductBySlug(slug);

  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
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

  const handleAddToCart = () => {
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
          {/* Left: Gallery */}
          <div className={styles.gallery}>
            {/* Main Stage */}
            <div className={styles.mainImageWrap}>
              <Image
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                fill
                priority
                className={styles.mainImage}
                sizes="(max-width: 900px) 100vw, 50vw"
              />
              {product.tag && (
                <span className={`${styles.tagBadge} ${isAsa ? styles.tagAsa : styles.tagDofit}`}>
                  {product.tag}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className={styles.thumbnailRow}>
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`${styles.thumbBtn} ${selectedImage === index ? styles.thumbActive : ''}`}
                    onClick={() => setSelectedImage(index)}
                    aria-label={`View photo ${index + 1}`}
                  >
                    <Image src={img} alt="" fill className={styles.thumbImg} sizes="90px" />
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
                {product.stockCount <= 5 ? `🔥 Only ${product.stockCount} left in stock` : '✓ In Stock (Ready to Ship)'}
              </span>
            </div>

            <p className={styles.description}>{product.description}</p>

            {/* Color selection */}
            {product.colors.length > 0 && (
              <div className={styles.sectionBlock}>
                <span className={styles.blockLabel}>
                  Color: <strong>{selectedColor}</strong>
                </span>
                <div className={styles.colorPills}>
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      className={`${styles.colorBtn} ${selectedColor === c.name ? styles.colorActive : ''}`}
                      onClick={() => setSelectedColor(c.name)}
                    >
                      <span className={styles.colorSwatch} style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size selection */}
            <div className={styles.sectionBlock}>
              <div className={styles.sizeLabelRow}>
                <span className={styles.blockLabel}>Select Size: <strong>{selectedSize}</strong></span>
                <button
                  type="button"
                  className={styles.sizeGuideLink}
                  onClick={() => setSizeGuideOpen(true)}
                >
                  Size Guide 📐
                </button>
              </div>
              <div className={styles.sizePills}>
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

            {/* Quantity and Add to Bag */}
            <div className={styles.actionsRow}>
              <div className={styles.qtyBox}>
                <button
                  type="button"
                  className={styles.qtyBtn}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className={styles.qtyVal}>{quantity}</span>
                <button
                  type="button"
                  className={styles.qtyBtn}
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className={`btn ${isAsa ? 'btn-asa-gold' : 'btn-pink'} ${styles.addBtn}`}
                onClick={handleAddToCart}
              >
                {addedAnimation ? '✓ Added to Bag' : `Add to Bag · ${(product.price * quantity).toLocaleString('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 })}`}
              </button>
            </div>

            {/* Highlights guarantee */}
            <div className={styles.perksList}>
              <div className={styles.perkItem}>
                <span className={styles.perkIcon}>⚡</span>
                <span>Express Lagos Delivery (Same Day / 24 Hours)</span>
              </div>
              <div className={styles.perkItem}>
                <span className={styles.perkIcon}>🔄</span>
                <span>Free 7-Day Size Exchanges</span>
              </div>
              <div className={styles.perkItem}>
                <span className={styles.perkIcon}>🇳🇬</span>
                <span>Proudly Crafted & Packaged in Nigeria</span>
              </div>
            </div>

            {/* Accordion Tabs */}
            <div className={styles.tabsContainer}>
              <div className={styles.tabHeaders}>
                <button
                  type="button"
                  className={`${styles.tabHeader} ${activeTab === 'features' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('features')}
                >
                  Features
                </button>
                <button
                  type="button"
                  className={`${styles.tabHeader} ${activeTab === 'fabric' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('fabric')}
                >
                  Fabric & Care
                </button>
                <button
                  type="button"
                  className={`${styles.tabHeader} ${activeTab === 'shipping' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('shipping')}
                >
                  Shipping & Returns
                </button>
              </div>

              <div className={styles.tabBody}>
                {activeTab === 'features' && (
                  <ul className={styles.featuresList}>
                    {product.features.map((feat, i) => (
                      <li key={i} className={styles.featItem}>
                        <span className={styles.featBullet}>✦</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === 'fabric' && (
                  <div className={styles.fabricDetails}>
                    <p><strong>Composition:</strong> {product.fabric}</p>
                    <div style={{ marginTop: '12px' }}>
                      <strong>Care Instructions:</strong>
                      <ul className={styles.careList}>
                        {product.care.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className={styles.shippingDetails}>
                    <p><strong>Lagos Mainland & Island:</strong> ₦3,500 standard delivery (Free on orders over ₦75,000).</p>
                    <p style={{ marginTop: '8px' }}><strong>Interstate (Abuja, PH, Ibadan, etc.):</strong> 2 - 4 business days via DHL / GIG Express.</p>
                    <p style={{ marginTop: '8px' }}><strong>Worldwide Shipping:</strong> 4 - 7 business days via DHL Express International.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Complete The Look Section */}
        {relatedProducts.length > 0 && (
          <section className={`wrap ${styles.relatedSection}`}>
            <h2 className={`${styles.relatedTitle} ${isAsa ? 'asa-display' : 'display'}`}>
              Complete The Look
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
                      src={rel.images[0]}
                      alt={rel.name}
                      fill
                      className={styles.relatedImg}
                      sizes="(max-width: 768px) 100vw, 33vw"
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
