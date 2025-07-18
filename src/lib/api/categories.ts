import { supabase } from '@/lib/supabase';
import { Tables } from '@/lib/supabase';

export type Category = Tables<'categories'>;

export interface CategoryWithProductCount extends Category {
  productCount: number;
}

export interface CategoriesResponse {
  categories: CategoryWithProductCount[];
}

export class CategoriesAPI {
  /**
   * Get all categories
   */
  static async getCategories(includeProducts: boolean = false): Promise<CategoriesResponse> {
    const searchParams = new URLSearchParams();
    
    if (includeProducts) {
      searchParams.append('includeProducts', 'true');
    }

    const response = await fetch(`/api/categories?${searchParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get subcategories for a parent category
   */
  static async getSubcategories(parentId: string): Promise<CategoriesResponse> {
    const searchParams = new URLSearchParams({
      parentId,
    });

    const response = await fetch(`/api/categories?${searchParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch subcategories: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Create a new category
   */
  static async createCategory(categoryData: Partial<Category>): Promise<{ category: Category }> {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create category: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get category hierarchy (main categories with subcategories)
   */
  static async getCategoryHierarchy(): Promise<{
    categories: (CategoryWithProductCount & { subcategories: CategoryWithProductCount[] })[];
  }> {
    // Get main categories
    const mainCategories = await this.getCategories(true);
    
    // Get subcategories for each main category
    const categoriesWithSubcategories = await Promise.all(
      mainCategories.categories.map(async (category) => {
        const subcategories = await this.getSubcategories(category.id);
        return {
          ...category,
          subcategories: subcategories.categories,
        };
      })
    );

    return {
      categories: categoriesWithSubcategories,
    };
  }

  /**
   * Get category by slug
   */
  static async getCategoryBySlug(slug: string): Promise<Category | null> {
    const { data: category, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching category by slug:', error);
      return null;
    }

    return category;
  }

  /**
   * Get main categories only (no parents)
   */
  static async getMainCategories(): Promise<CategoriesResponse> {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .is('parent_id', null)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching main categories:', error);
      throw new Error('Failed to fetch main categories');
    }

    return {
      categories: categories || [],
    };
  }
}