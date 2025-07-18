export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  currency: string;
  sku: string;
  ageMin: number;
  ageMax: number;
  materials: string[];
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  weight: number;
  safetyCertifications: string[];
  assemblyRequired: boolean;
  careInstructions: string;
  images: string[];
  stockStatus: 'In Stock' | 'Out of Stock' | 'Pre-order';
  shippingCost: number;
  shippingTime: string;
  productUrl: string;
  specifications: Record<string, any>;
  marketingHighlights?: string[];
  montessoriPrinciples?: string[];
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
  total: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  itemCount: number;
  currency: string;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  productCount: number;
  parentId?: string;
  children?: Category[];
}

export interface Order {
  id: string;
  orderNumber: string;
  customerEmail: string;
  customerId?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  currency: string;
  totalAmount: number;
  shippingAddress: Address;
  billingAddress: Address;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  stripePaymentIntentId?: string;
  items: OrderItem[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  total: number;
}

export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  countryCode: string;
  provinceCode?: string;
  postalCode: string;
  phone?: string;
}

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  acceptsMarketing: boolean;
  addresses: Address[];
  orders: Order[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface LocalizedContent {
  sk: string;
  en: string;
  de: string;
  fr: string;
}

export interface Newsletter {
  email: string;
  firstName?: string;
  lastName?: string;
  language: string;
  subscribedAt: Date;
  source: string;
}

export interface Review {
  id: string;
  productId: string;
  customerId: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  helpful: number;
  createdAt: Date;
}

export interface BlogPost {
  id: string;
  title: LocalizedContent;
  slug: string;
  excerpt: LocalizedContent;
  content: LocalizedContent;
  coverImage: string;
  author: {
    name: string;
    bio: string;
    avatar: string;
  };
  tags: string[];
  category: string;
  published: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SEO {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export interface AgeGroup {
  min: number;
  max: number;
  label: string;
  description: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  fees?: number;
  supportedCountries: string[];
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: number;
  trackingEnabled: boolean;
  supportedCountries: string[];
}

export interface FilterOptions {
  categories: string[];
  ageGroups: AgeGroup[];
  priceRange: {
    min: number;
    max: number;
  };
  materials: string[];
  inStock?: boolean;
  sortBy: 'name' | 'price' | 'age' | 'newest' | 'popularity';
  sortOrder: 'asc' | 'desc';
}

export interface SearchResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  filters: FilterOptions;
  suggestions?: string[];
}

export interface NavigationItem {
  id: string;
  label: LocalizedContent;
  href: string;
  children?: NavigationItem[];
  icon?: string;
  featured?: boolean;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}