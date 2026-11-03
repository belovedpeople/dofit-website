export interface ShowcaseContent {
  dofitHero: {
    mainImage: string;
    floatingImage: string;
    floatingTitle: string;
    floatingPrice: string;
  };
  dofitInsta: Array<{
    id: string;
    src: string;
    alt: string;
    link?: string;
  }>;
  asaHero: {
    mainImage: string;
  };
  asaStory: {
    mainImage: string;
    yearBadge: string;
    seasonBadge: string;
  };
  asaGallery: Array<{
    id: string;
    category: string;
    title: string;
    tagline: string;
    image: string;
    quote: string;
  }>;
  socialLinks?: {
    whatsapp?: string;
    instagram?: string;
    tiktok?: string;
    twitter?: string;
    facebook?: string;
  };
}

export const defaultShowcaseContent: ShowcaseContent = {
  socialLinks: {
    whatsapp: 'https://wa.me/2348000000000',
    instagram: 'https://instagram.com/dofitwears',
    tiktok: 'https://tiktok.com/@dofitwears',
    twitter: 'https://x.com/dofitwears',
    facebook: '',
  },
  dofitHero: {
    mainImage: '/images/dofit-wears/2-Piece Biker Short Set.png',
    floatingImage: '/images/dofit-wears/Trim Tank Top.png',
    floatingTitle: 'Trim Tank Top',
    floatingPrice: '₦18,000',
  },
  dofitInsta: [
    { id: 'ig-1', src: '/images/dofit-wears/2-Piece Biker Short Set.png', alt: 'Biker Set' },
    { id: 'ig-2', src: '/images/asa/image1.png', alt: 'Àṣà 1' },
    { id: 'ig-3', src: '/images/dofit-wears/3-Piece Tracksuit  Activewear Set.png', alt: 'Tracksuit' },
    { id: 'ig-4', src: '/images/asa/image3.png', alt: 'Àṣà 3' },
    { id: 'ig-5', src: '/images/dofit-wears/Long-Sleeve Tennis Skirt Set.png', alt: 'Tennis Set' },
    { id: 'ig-6', src: '/images/asa/image5.png', alt: 'Àṣà 5' },
  ],
  asaHero: {
    mainImage: '/images/asa/image3.png',
  },
  asaStory: {
    mainImage: '/images/asa/image8.png',
    yearBadge: '2026',
    seasonBadge: 'Season Two',
  },
  asaGallery: [
    {
      id: 'look-1',
      category: 'Editorial',
      title: 'The Indigo Royalty',
      tagline: 'Hand-batik Adire meets oversized urban silhouette',
      image: '/images/asa/image7.png',
      quote: 'Every line dyed is an ancestor honored.',
    },
    {
      id: 'look-2',
      category: 'Runway',
      title: 'Lagos Midnight Cut',
      tagline: 'Raw-edge tailoring steeped in deep Yoruba dye-pits',
      image: '/images/asa/image8.png',
      quote: 'Tradition does not stop. It evolves.',
    },
    {
      id: 'look-3',
      category: 'Capsule',
      title: 'Afro-Futurism Vibe',
      tagline: 'Gen Z streetwear energy fused with ancient textile patterns',
      image: '/images/asa/image9.png',
      quote: 'Wear your roots like armor.',
    },
  ],
};

// In-memory runtime cache for server
export let showcaseStore: ShowcaseContent = JSON.parse(JSON.stringify(defaultShowcaseContent));

export function updateShowcaseStore(newData: Partial<ShowcaseContent>): ShowcaseContent {
  showcaseStore = {
    ...showcaseStore,
    ...newData,
  };
  return showcaseStore;
}

