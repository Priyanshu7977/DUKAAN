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
  id: string; // unique combo of product.id + size + color
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
