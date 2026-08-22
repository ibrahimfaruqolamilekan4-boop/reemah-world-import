import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Luxury 24-Piece Gold Stainless Steel Cutlery Set',
    category: 'Kitchen Utensils',
    price: 35000,
    originalPrice: 45000,
    description: 'Directly imported from top-tier Chinese tableware factories. Elegant matte mirror finish mirror-polished 304 stainless steel. Rust-resistant, dishwasher safe, and elevates any dining table.',
    mediaUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 24,
    likes: ['user-1', 'user-2'],
    comments: [
      {
        id: 'c-1',
        userId: 'user-1',
        userName: 'Amina Bello',
        rating: 5,
        comment: 'Absolute luxury! Ordered for my kitchen and everyone asks where I got it.',
        createdAt: '2026-07-20T10:30:00Z'
      },
      {
        id: 'c-2',
        userId: 'user-2',
        userName: 'Chidi Okeke',
        rating: 5,
        comment: 'Very heavy and high quality 304 steel. Worth every naira!',
        createdAt: '2026-07-21T14:15:00Z'
      }
    ],
    ratingAverage: 5.0,
    isFeatured: true,
    createdAt: '2026-07-15T08:00:00Z'
  },
  {
    id: 'prod-2',
    title: 'Minimalist Nordic Ceramic Dinnerware Set (36 pcs)',
    category: 'Kitchen Utensils',
    price: 85000,
    originalPrice: 105000,
    description: 'Exquisite glazed ceramic plates, bowls, and mugs with gold rim detailing. Microwave and oven safe. Direct factory import with thick shockproof packaging.',
    mediaUrl: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 12,
    likes: ['user-3'],
    comments: [
      {
        id: 'c-3',
        userId: 'user-3',
        userName: 'Fatima Aliyu',
        rating: 4,
        comment: 'Stunning dinnerware set. Arrived intact with no breakages.',
        createdAt: '2026-07-22T09:00:00Z'
      }
    ],
    ratingAverage: 4.8,
    isFeatured: true,
    createdAt: '2026-07-16T11:00:00Z'
  },
  {
    id: 'prod-3',
    title: 'Modern LED Crystal Chandelier Pendant Light',
    category: 'Smart Home & Lighting',
    price: 120000,
    originalPrice: 150000,
    description: 'Transform your living room or dining area with this luxury dimmable LED crystal pendant light. Energy efficient and breathtakingly bright.',
    mediaUrl: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=80',
    stock: 8,
    likes: ['user-1', 'user-4', 'user-5'],
    comments: [
      {
        id: 'c-4',
        userId: 'user-4',
        userName: 'Tunde Bakare',
        rating: 5,
        comment: 'Breathtaking light fixture. Installed it over my dining table and it looks like a 5-star hotel.',
        createdAt: '2026-07-21T18:20:00Z'
      }
    ],
    ratingAverage: 5.0,
    isFeatured: true,
    createdAt: '2026-07-14T12:00:00Z'
  },
  {
    id: 'prod-4',
    title: 'Smart Touchless Automatic Kitchen Trash Can (50L)',
    category: 'Electrical Goods',
    price: 45000,
    originalPrice: 55000,
    description: 'Motion sensor smart garbage bin with odor sealing and sleek stainless steel fingerprint-proof body. USB rechargeable.',
    mediaUrl: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=800&q=80',
    stock: 15,
    likes: ['user-2'],
    comments: [],
    ratingAverage: 4.5,
    isFeatured: false,
    createdAt: '2026-07-18T14:00:00Z'
  },
  {
    id: 'prod-5',
    title: 'Luxury Velvet Accent Living Room Armchair & Ottoman',
    category: 'Home Interior & Decor',
    price: 180000,
    originalPrice: 220000,
    description: 'Ergonomic plush velvet armchair with golden metal legs. Direct import from high-end furniture manufacturers in Guangzhou.',
    mediaUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    stock: 5,
    likes: ['user-1', 'user-3'],
    comments: [
      {
        id: 'c-5',
        userId: 'user-3',
        userName: 'Fatima Aliyu',
        rating: 5,
        comment: 'Super comfy and adds so much class to my parlor!',
        createdAt: '2026-07-22T16:00:00Z'
      }
    ],
    ratingAverage: 4.9,
    isFeatured: true,
    createdAt: '2026-07-12T10:00:00Z'
  },
  {
    id: 'prod-6',
    title: 'Multi-Function Digital Air Fryer & Steam Oven (12L)',
    category: 'Electrical Goods',
    price: 95000,
    originalPrice: 115000,
    description: 'Healthy oil-free cooking with smart touch LED control panel, 10 preset cooking modes, and glass observation window.',
    mediaUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    stock: 19,
    likes: ['user-5'],
    comments: [],
    ratingAverage: 4.7,
    isFeatured: false,
    createdAt: '2026-07-19T09:30:00Z'
  },
  {
    id: 'prod-7',
    title: 'Nordic Abstract Golden Sunset Canvas Wall Art Set (3 pcs)',
    category: 'Home Interior & Decor',
    price: 28000,
    originalPrice: 35000,
    description: 'High-definition waterproof canvas prints framed with luxurious aluminum alloy borders. Ready to hang.',
    mediaUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    stock: 30,
    likes: ['user-4'],
    comments: [],
    ratingAverage: 4.6,
    isFeatured: false,
    createdAt: '2026-07-17T15:00:00Z'
  },
  {
    id: 'prod-8',
    title: 'Automatic Electric Wine Opener & Aerator Set',
    category: 'Kitchen Utensils',
    price: 18500,
    originalPrice: 24000,
    description: 'Open wine bottles in 6 seconds with this sleek cordless electric corkscrew. Includes foil cutter, vacuum stopper, and aerator pourer.',
    mediaUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
    stock: 25,
    likes: [],
    comments: [],
    ratingAverage: 4.8,
    isFeatured: false,
    createdAt: '2026-07-20T11:00:00Z'
  }
];
