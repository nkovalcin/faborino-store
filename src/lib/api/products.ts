import { supabase } from '@/lib/supabase';
import { Tables } from '@/lib/supabase';

export type Product = Tables<'products'>;
export type ProductWithCategory = Product & {
  categories: Tables<'categories'>;
};

export interface ProductFilters {
  categoryId?: string;
  subcategory?: string;
  minAge?: number;
  maxAge?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  page?: number;
}

export interface ProductsResponse {
  products: ProductWithCategory[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export class ProductsAPI {
  /**
   * Get all products with optional filters
   */
  static async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    const searchParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(`/api/products?${searchParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get a single product by ID
   */
  static async getProduct(productId: string): Promise<{
    product: ProductWithCategory & { reviews: any[] };
    relatedProducts: Product[];
  }> {
    const response = await fetch(`/api/products/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Create a new product
   */
  static async createProduct(productData: Partial<Product>): Promise<{ product: Product }> {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create product: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Update an existing product
   */
  static async updateProduct(productId: string, updates: Partial<Product>): Promise<{ product: Product }> {
    const response = await fetch(`/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`Failed to update product: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Delete a product (soft delete)
   */
  static async deleteProduct(productId: string): Promise<{ message: string }> {
    const response = await fetch(`/api/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete product: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Search products
   */
  static async searchProducts(query: string, filters: ProductFilters = {}): Promise<{
    products: ProductWithCategory[];
    categories: Tables<'categories'>[];
    query: string;
    totalResults: number;
  }> {
    const searchParams = new URLSearchParams({
      q: query,
      ...Object.fromEntries(
        Object.entries(filters).map(([key, value]) => [key, value?.toString() || ''])
      ),
    });

    const response = await fetch(`/api/search?${searchParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to search products: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get products by category
   */
  static async getProductsByCategory(categoryId: string, filters: Omit<ProductFilters, 'categoryId'> = {}): Promise<ProductsResponse> {
    return this.getProducts({ ...filters, categoryId });
  }

  /**
   * Get featured products
   */
  static async getFeaturedProducts(limit: number = 8): Promise<ProductWithCategory[]> {
    const { products } = await this.getProducts({
      sortBy: 'created_at',
      sortOrder: 'desc',
      limit,
    });

    return products;
  }

  /**
   * Get products by age range
   */
  static async getProductsByAge(minAge: number, maxAge: number, filters: Omit<ProductFilters, 'minAge' | 'maxAge'> = {}): Promise<ProductsResponse> {
    return this.getProducts({ ...filters, minAge, maxAge });
  }
}