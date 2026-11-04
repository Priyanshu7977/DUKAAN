export type Category = 
  | 'all' 
  | 'shirts' 
  | 'trousers' 
  | 'co-ords' 
  | 'outerwear' 
  | 'knitwear' 
  | 'essentials'
  | 'accessories';

export type Gender = 'all' | 'men' | 'women' | 'unisex';

export interface ProductColor {
  name: string;
  hex: string;
  imageIndex?: number;
}

export interface ProductSize {
  size: string;
  inStock: boolean;
  quantityRemaining?: number;
}

export interface ProductDetails {
  composition: string;
  fit: string;
  origin: string;
  washCare: string;
  weight?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  category: Category;
  gender: 'men' | 'women' | 'unisex';
  collection: string;
  collectionSlug: string;
  description: string;
  shortDescription: string;
  details: ProductDetails;
  colors: ProductColor[];
  sizes: ProductSize[];
  images: string[];
  isNew?: boolean;
  isSignature?: boolean;
  isFeatured?: boolean;
  badge?: string;
  tags: string[];
  createdAt: string;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  season: string;
  year: string;
  heroImage: string;
  editorialImage: string;
  secondaryImage?: string;
  story: string;
  description: string;
  palette: Array<{ name: string; hex: string }>;
  featuredQuote: string;
}

export interface JournalArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: 'Atelier Notes' | 'Materiality' | 'Architecture' | 'Conversations' | 'Campaign';
  date: string;
  readTime: string;
  author: {
    name: string;
    role: string;
  };
  coverImage: string;
  excerpt: string;
  content: Array<{
    type: 'paragraph' | 'heading' | 'quote' | 'image' | 'two-images';
    text?: string;
    image?: string;
    caption?: string;
    images?: string[];
  }>;
}

export interface FilterState {
  category: Category;
  gender: Gender;
  collection: string;
  minPrice: number;
  maxPrice: number;
  sizes: string[];
  colors: string[];
  inStockOnly: boolean;
  sortBy: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'name-asc';
}

export interface UserAddress {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface UserOrder {
  id: string;
  date: string;
  status: 'Processing' | 'In Transit' | 'Delivered' | 'Cancelled';
  total: number;
  paymentMethod: 'COD' | 'Prepaid Online';
  items: Array<{
    id: string;
    name: string;
    price: number;
    size: string;
    color: string;
    image: string;
    quantity: number;
  }>;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  memberSince: string;
  tier: string;
  walletBalance: number;
  addresses: UserAddress[];
  orders: UserOrder[];
}
