export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: 'dofit' | 'asa';
  price: number;
  formattedPrice: string;
  category: string;
  tag?: string;
  description: string;
  features: string[];
  fabric: string;
  care: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  sizePrices?: Record<string, number>;
  images: string[];
  videos?: string[];
  inStock: boolean;
  stockCount: number;
}

export const products: Product[] = [
  // ── DOFIT WEARS (Activewear & Performance Streetwear) ──
  {
    id: 'dw-1',
    slug: 'biker-short-set',
    name: '2-Piece Biker Short Set',
    brand: 'dofit',
    price: 45000,
    formattedPrice: '₦45,000',
    category: 'Matching Sets',
    tag: 'Best Seller',
    description: 'Sculpting high-waist biker shorts paired with a compression halter crop top. Designed with seamless four-way stretch fabric that supports during high-intensity training while commanding attention on the street.',
    features: [
      'High-compression waistband with zero roll-down',
      'Sweat-wicking Dri-Tech microfiber',
      'Subtle silicone Dofit crest branding',
      'Squat-proof opaque double-weave construction'
    ],
    fabric: '78% Recycled Polyamide, 22% High-Grade Spandex (290 GSM)',
    care: ['Machine wash cold (30°C) with like colors', 'Do not tumble dry', 'Cool iron on reverse', 'Do not bleach'],
    colors: [
      { name: 'Onyx Black', hex: '#0A0A0A' },
      { name: 'Cyber Pink', hex: '#FF1E6A' },
      { name: 'Graphite', hex: '#2A2A2A' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      '/images/dofit-wears/2-Piece Biker Short Set.png',
      '/images/dofit-wears/Short-Sleeve Biker Romper (Unitard).png'
    ],
    inStock: true,
    stockCount: 8,
  },
  {
    id: 'dw-2',
    slug: 'long-sleeve-leggings-set',
    name: '2-Piece Long-Sleeve Leggings Set',
    brand: 'dofit',
    price: 52000,
    formattedPrice: '₦52,000',
    category: 'Matching Sets',
    tag: 'New Drop',
    description: 'An architectural silhouette engineered for cold mornings and high-style evenings. Form-fitting long-sleeve crop top with thumbholes paired with full-length ankle-sculpt leggings.',
    features: [
      'Ergonomic thumbhole sleeves for secure movement',
      'Ribbed contour panels shaping glutes and obliques',
      'Flatlock anti-chafing seams',
      'Heat-sealed reflective brand mark'
    ],
    fabric: '80% Nylon, 20% Elastane compression weave',
    care: ['Machine wash cold inside out', 'Hang dry in shade', 'Do not iron prints'],
    colors: [
      { name: 'Midnight Charcoal', hex: '#161616' },
      { name: 'Electric Berry', hex: '#FF1E6A' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    images: [
      '/images/dofit-wears/2-Piece Long-Sleeve Leggings Set.png',
      '/images/dofit-wears/2-Piece Biker Short Set.png'
    ],
    inStock: true,
    stockCount: 14,
  },
  {
    id: 'dw-3',
    slug: 'tracksuit-activewear-set',
    name: '3-Piece Tracksuit Activewear Set',
    brand: 'dofit',
    price: 68000,
    formattedPrice: '₦68,000',
    category: 'Outerwear',
    tag: 'Featured',
    description: 'The ultimate luxury streetwear athleisure trio: technical cropped zip jacket, micro sports bra, and relaxed high-rise track pants with adjustable bungee toggles.',
    features: [
      'Weather-resistant shell with breathable mesh inner lining',
      'Heavy-duty matte black YKK dual zippers',
      'Modular 3-piece versatility for gym or airport fits',
      'Deep concealed side zipper utility pockets'
    ],
    fabric: '100% Technical Taslan Nylon outer with Soft-Touch Bamboo Mesh lining',
    care: ['Gentle cycle cold', 'Fasten zippers before washing', 'Line dry only'],
    colors: [
      { name: 'Pitch Black', hex: '#0D0D0D' },
      { name: 'Hot Fuchsia Accent', hex: '#FF5490' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      '/images/dofit-wears/3-Piece Tracksuit  Activewear Set.png',
      '/images/dofit-wears/2-Piece Long-Sleeve Leggings Set.png'
    ],
    inStock: true,
    stockCount: 5,
  },
  {
    id: 'dw-4',
    slug: 'tennis-skirt-set',
    name: 'Long-Sleeve Tennis Skirt Set',
    brand: 'dofit',
    price: 49000,
    formattedPrice: '₦49,000',
    category: 'Matching Sets',
    tag: 'Trending',
    description: 'Retro court luxury meets modern Lagos Gen Z style. Cropped zip performance top with an airy pleated active skirt featuring hidden compressive liner shorts with phone pocket.',
    features: [
      'Built-in compression safety shorts with ball/phone pocket',
      'Flattering knife-pleat skirt design with aerated waistband',
      'Micro-mesh ventilated underarm inserts',
      'Anti-static and wrinkle-resistant fabric'
    ],
    fabric: '85% Recycled Polyester, 15% Spandex Performance Knit',
    care: ['Machine wash cold', 'Wash with similar synthetic fabrics', 'Tumble dry low'],
    colors: [
      { name: 'Pure Noir', hex: '#111111' },
      { name: 'Pink Ribbon', hex: '#FF1E6A' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    images: [
      '/images/dofit-wears/Long-Sleeve Tennis Skirt Set.png',
      '/images/dofit-wears/Ribbed Baby Tee.png'
    ],
    inStock: true,
    stockCount: 11,
  },
  {
    id: 'dw-5',
    slug: 'biker-romper-unitard',
    name: 'Short-Sleeve Biker Romper (Unitard)',
    brand: 'dofit',
    price: 38000,
    formattedPrice: '₦38,000',
    category: 'Rompers',
    tag: 'Must-Have',
    description: 'One piece, zero distractions. Sculpting all-in-one unitard engineered with targeted body-contouring compression lines and a sleek mock-neck front zipper.',
    features: [
      'Full body compression for an effortlessly contoured silhouette',
      'Front center zip with anti-pinch chin guard',
      'Mid-thigh 7-inch inseam with anti-ride silicone leg grip',
      'Zero-sheer ultra matte finish'
    ],
    fabric: '76% Polyamide, 24% Spandex ButterSoft™',
    care: ['Cold delicate cycle', 'Do not wring', 'Dry flat away from direct heat'],
    colors: [
      { name: 'Shadow Black', hex: '#0A0A0A' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      '/images/dofit-wears/Short-Sleeve Biker Romper (Unitard).png',
      '/images/dofit-wears/2-Piece Biker Short Set.png'
    ],
    inStock: true,
    stockCount: 9,
  },
  {
    id: 'dw-6',
    slug: 'ribbed-baby-tee',
    name: 'Ribbed Contour Baby Tee',
    brand: 'dofit',
    price: 22000,
    formattedPrice: '₦22,000',
    category: 'Tops',
    description: 'Y2K meets high-performance streetwear. Ultra-soft ribbed modal knit with capped baby-sleeves, cropped hem, and embroidered mini Dofit pink insignia on chest.',
    features: [
      'Micro-ribbed breathable organic blend',
      'Pre-shrunk fabric that holds shape all day',
      'Embroidered Dofit pink chest monogram',
      'High crew neckline with reinforced collar'
    ],
    fabric: '95% Modal Cotton, 5% Elastane (240 GSM)',
    care: ['Wash cold inside out', 'Do not tumble dry', 'Iron low temperature'],
    colors: [
      { name: 'Pitch Black', hex: '#000000' },
      { name: 'Hot Coral', hex: '#FF1E6A' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    images: [
      '/images/dofit-wears/Ribbed Baby Tee.png',
      '/images/dofit-wears/Trim Tank Top.png'
    ],
    inStock: true,
    stockCount: 20,
  },
  {
    id: 'dw-7',
    slug: 'trim-tank-top',
    name: 'Contrast Trim Tank Top',
    brand: 'dofit',
    price: 18000,
    formattedPrice: '₦18,000',
    category: 'Tops',
    description: 'Minimalist athletic tank top featuring contrasting electric pink edge binding and a supportive double-lined chest panel for bra-free comfort.',
    features: [
      'Scoop neck with contrast hot-pink piped edging',
      'Double-lined chest panel for maximum support & coverage',
      'Racerback cut providing full shoulder blade mobility',
      'Ultra-breathable lightweight stretch yarn'
    ],
    fabric: '88% Polyester, 12% Spandex AeroBreeze™',
    care: ['Machine wash warm (40°C)', 'Tumble dry low', 'Do not iron print'],
    colors: [
      { name: 'Black / Hot Pink', hex: '#FF1E6A' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      '/images/dofit-wears/Trim Tank Top.png',
      '/images/dofit-wears/Ribbed Baby Tee.png'
    ],
    inStock: true,
    stockCount: 17,
  },

  // ── ÀṢÀ BY DOFIT (Afrocentric Cultural Couture & Adire Capsule) ──
  {
    id: 'ap-1',
    slug: 'adire-cargo-jacket-set',
    name: 'Adire Indigo Cargo Jacket Set',
    brand: 'asa',
    price: 95000,
    formattedPrice: '₦95,000',
    category: 'Cultural Couture',
    tag: 'Exclusive Capsule',
    description: 'Hand-crafted Yoruba Adire resist-dyed twill tailored into a contemporary cropped utility jacket and wide-leg combat cargo pants. Each piece is dyed by artisan hands in Abeokuta, making every pattern subtly unique.',
    features: [
      'Authentic hand-batik indigo dye resist patterns',
      'Antique gold-finish engraved Yoruba brass hardware',
      'Oversized utility gusset pockets with storm flaps',
      'Custom Àṣà silk-screened monogram interior lining'
    ],
    fabric: '100% Hand-Woven Nigerian Heavyweight Cotton Canvas (380 GSM)',
    care: ['Specialist dry clean recommended or hand wash cold separately with mild detergent', 'Hang in shade', 'Do not bleach'],
    colors: [
      { name: 'Abeokuta Indigo', hex: '#1B3FA0' },
      { name: 'Ochre Gold Accent', hex: '#E8A020' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      '/images/asa/image1.png',
      '/images/asa/image2.png'
    ],
    inStock: true,
    stockCount: 4,
  },
  {
    id: 'ap-2',
    slug: 'asa-sculpt-corset-set',
    name: 'Àṣà Sculpted Corset & Palazzo Set',
    brand: 'asa',
    price: 88000,
    formattedPrice: '₦88,000',
    category: 'Cultural Couture',
    tag: 'Limited Run',
    description: 'An audacious collision of Victorian corset architecture and Yoruba ceremonial textile elegance. Structured boned corset top matched with billowing floor-length palazzo trousers.',
    features: [
      'Flexible internal boning that sculpts without pinching',
      'Lace-up back with antique brass grommets',
      'Flowing pleated wide-leg cut designed for dramatic movement',
      'Natural vegetable-based indigo dye formulation'
    ],
    fabric: '100% Organic African Cotton with Satin Weft',
    care: ['Dry clean only to protect structural boning', 'Store on padded hanger'],
    colors: [
      { name: 'Royal Indigo', hex: '#120E2A' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    images: [
      '/images/asa/image2.png',
      '/images/asa/image3.png'
    ],
    inStock: true,
    stockCount: 6,
  },
  {
    id: 'ap-3',
    slug: 'adire-wrap-kimono',
    name: 'Àṣà Heritage Wrap Kimono',
    brand: 'asa',
    price: 75000,
    formattedPrice: '₦75,000',
    category: 'Outerwear',
    tag: 'Cultural Heritage',
    description: 'An elevated genderless layering statement. Floor-grazing kimono robe with hand-stamped Adire geometric iconography, wide bell sleeves, and a matching gold-trimmed sash belt.',
    features: [
      'Traditional Eleko (cassava paste resist) motif designs',
      'Reversible contrast border trim',
      'Deep inset kimono pockets',
      'Includes detachable 2.5-meter Adire waist sash'
    ],
    fabric: 'Pre-washed Silk-Cotton Blend',
    care: ['Gentle hand wash cold with salt rinse to lock color', 'Iron on low while damp'],
    colors: [
      { name: 'Deep Sea Indigo', hex: '#0D0B1F' },
      { name: 'Sunlight Ochre', hex: '#E8A020' }
    ],
    sizes: ['One Size Fits Most'],
    images: [
      '/images/asa/image3.png',
      '/images/asa/image4.png'
    ],
    inStock: true,
    stockCount: 7,
  },
  {
    id: 'ap-4',
    slug: 'asa-sport-mesh-crop',
    name: 'Àṣà Sport Mesh Street Crop',
    brand: 'asa',
    price: 42000,
    formattedPrice: '₦42,000',
    category: 'Tops',
    tag: 'Afro-Gen Z',
    description: 'Where gym-ready activewear meets Nigerian street energy. Breathable sports mesh crop top infused with digitalized Adire pattern printing and reflective gold detailing.',
    features: [
      'Sublimated Adire resist pattern that will never fade',
      'Quick-drying aerated performance mesh',
      'Elasticized gold woven hem band',
      'High neck with ergonomic armhole cut'
    ],
    fabric: '82% Polyester, 18% Elastane Technical Mesh',
    care: ['Machine wash cold', 'Wash inside laundry pouch', 'Do not tumble dry'],
    colors: [
      { name: 'Cobalt / Indigo', hex: '#1B3FA0' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    images: [
      '/images/asa/image4.png',
      '/images/asa/image5.png'
    ],
    inStock: true,
    stockCount: 15,
  },
  {
    id: 'ap-5',
    slug: 'asa-tube-skirt-set',
    name: 'Àṣà Bandage Tube & Midi Skirt Set',
    brand: 'asa',
    price: 72000,
    formattedPrice: '₦72,000',
    category: 'Cultural Couture',
    tag: 'Limited Edition',
    description: 'Sleek, body-contouring 2-piece ensemble consisting of an off-shoulder banded tube top and an asymmetric wrap midi skirt adorned with Yoruba spiral motifs.',
    features: [
      'Asymmetric side slit with adjustable drawcord gathering',
      'Anti-slip silicone gripper on tube neckline',
      'Hand-painted wax resist accents',
      'Double-faced opaque cotton jersey'
    ],
    fabric: '92% Organic Nigerian Cotton, 8% Lycra',
    care: ['Hand wash cold with mild detergent', 'Flat dry in shade'],
    colors: [
      { name: 'Nocturne Indigo', hex: '#161230' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    images: [
      '/images/asa/image5.png',
      '/images/asa/image6.png'
    ],
    inStock: true,
    stockCount: 5,
  },
  {
    id: 'ap-6',
    slug: 'asa-oversized-track-jacket',
    name: 'Àṣà Artisan Track Bomber',
    brand: 'asa',
    price: 82000,
    formattedPrice: '₦82,000',
    category: 'Outerwear',
    tag: 'Streetwear Luxury',
    description: 'Oversized luxury streetwear bomber jacket merging authentic hand-dyed indigo panels with varsity ribbing and brushed gold metallic snap buttons.',
    features: [
      'Thermal quilted satin interior in champagne cream',
      'Heavyweight 2x2 ribbed collar, cuffs, and waistband',
      'Embossed leather Àṣà crest on chest',
      'Dual interior welt chest pockets'
    ],
    fabric: 'Artisan Adire Cotton Twill outer with Quilted Silk lining',
    care: ['Professional dry clean only'],
    colors: [
      { name: 'Indigo Black', hex: '#0A0818' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      '/images/asa/image6.png',
      '/images/asa/image7.png'
    ],
    inStock: true,
    stockCount: 3,
  },
  {
    id: 'ap-7',
    slug: 'asa-asymmetric-dress',
    name: 'Àṣà Draped Asymmetric Dress',
    brand: 'asa',
    price: 86000,
    formattedPrice: '₦86,000',
    category: 'Dresses',
    tag: 'Runway',
    description: 'Sculptural one-shoulder dress showcasing hand-pleated Adire textile with sweeping cascade drapery. Created for galas, art exhibits, and high-fashion red carpets.',
    features: [
      'Architectural one-shoulder drape with cascading side tail',
      'Concealed invisible side zipper',
      'Hand-dyed indigo gradient dip-effect',
      'Silk-touch lining throughout'
    ],
    fabric: 'Hand-Dyed Indigo Raw Silk & Cotton Weft',
    care: ['Specialist dry clean only'],
    colors: [
      { name: 'Midnight Sun Indigo', hex: '#1A1535' }
    ],
    sizes: ['S', 'M', 'L'],
    images: [
      '/images/asa/image7.png',
      '/images/asa/image8.png'
    ],
    inStock: true,
    stockCount: 4,
  },
  {
    id: 'ap-8',
    slug: 'asa-monogram-hoodie',
    name: 'Àṣà Heavyweight Cultural Hoodie',
    brand: 'asa',
    price: 58000,
    formattedPrice: '₦58,000',
    category: 'Outerwear',
    tag: 'Everyday Luxury',
    description: '500 GSM luxury loopback French terry hoodie featuring an oversized kangaroo pocket cut from hand-dyed Adire fabric and metallic gold Yoruba chest embroidery.',
    features: [
      '500 GSM ultra-heavyweight brushed French terry',
      'Authentic Adire kangaroo pocket and hood lining',
      'Dense metallic gold embroidered brand slogan',
      'Double-layered structured hood'
    ],
    fabric: '100% Combed Cotton Terry & Adire Textile Inset',
    care: ['Machine wash cold inside out', 'Do not tumble dry', 'Warm iron inside out'],
    colors: [
      { name: 'Void Indigo', hex: '#0D0B1F' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      '/images/asa/image8.png',
      '/images/asa/image9.png'
    ],
    inStock: true,
    stockCount: 12,
  },
  {
    id: 'ap-9',
    slug: 'asa-utility-vest',
    name: 'Àṣà Tactical Adire Vest',
    brand: 'asa',
    price: 64000,
    formattedPrice: '₦64,000',
    category: 'Outerwear',
    tag: 'Capsule Finale',
    description: 'Multi-pocket tactical vest layered with hand-dyed Adire patterns, military webbing straps, and quick-release cobra-style brass buckles.',
    features: [
      'Four 3D modular bellows pockets with snap flaps',
      'Adjustable side compression straps with brass hardware',
      'Reinforced D-ring utility clip loops',
      'Breathable spacer mesh rear panel for hot climates'
    ],
    fabric: 'Reinforced 14oz Adire Duck Canvas with Tactical Nylon webbing',
    care: ['Spot clean with cold water', 'Air dry only'],
    colors: [
      { name: 'Deep Indigo / Tactical Ochre', hex: '#1B3FA0' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      '/images/asa/image9.png',
      '/images/asa/image1.png'
    ],
    inStock: true,
    stockCount: 6,
  }
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug || p.id === slug);
}

export function getProductsByBrand(brand: 'dofit' | 'asa'): Product[] {
  return products.filter((p) => p.brand === brand);
}

// ─── Mutable runtime store (used by API routes) ───────────────────────────────
// This is a reference copy — mutations here are visible app-wide during the
// server session. For production, replace with a real database.
export const productsStore: Product[] = [...products];

