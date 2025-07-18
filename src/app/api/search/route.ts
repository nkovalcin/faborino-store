import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: 'Search query must be at least 2 characters long' },
        { status: 400 }
      );
    }

    // Build search query
    let searchQuery = supabase
      .from('products')
      .select(`
        id,
        name,
        description,
        slug,
        price,
        compare_price,
        images,
        age_min,
        age_max,
        material,
        categories (
          id,
          name,
          slug
        )
      `)
      .eq('is_active', true)
      .limit(limit);

    // Apply category filter if specified
    if (category) {
      searchQuery = searchQuery.eq('category_id', category);
    }

    // Search in name, description, and material
    searchQuery = searchQuery.or(
      `name.ilike.%${query}%,description.ilike.%${query}%,material.ilike.%${query}%`
    );

    const { data: products, error } = await searchQuery;

    if (error) {
      console.error('Error searching products:', error);
      return NextResponse.json(
        { error: 'Failed to search products' },
        { status: 500 }
      );
    }

    // Also search in categories
    const { data: categories } = await supabase
      .from('categories')
      .select('id, name, slug, description')
      .eq('is_active', true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(5);

    return NextResponse.json({
      products: products || [],
      categories: categories || [],
      query,
      totalResults: (products?.length || 0) + (categories?.length || 0)
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query, filters } = await request.json();

    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: 'Search query must be at least 2 characters long' },
        { status: 400 }
      );
    }

    // Build advanced search query
    let searchQuery = supabase
      .from('products')
      .select(`
        id,
        name,
        description,
        slug,
        price,
        compare_price,
        images,
        age_min,
        age_max,
        material,
        categories (
          id,
          name,
          slug
        )
      `)
      .eq('is_active', true);

    // Apply filters
    if (filters) {
      if (filters.category) {
        searchQuery = searchQuery.eq('category_id', filters.category);
      }
      
      if (filters.minPrice) {
        searchQuery = searchQuery.gte('price', filters.minPrice);
      }
      
      if (filters.maxPrice) {
        searchQuery = searchQuery.lte('price', filters.maxPrice);
      }
      
      if (filters.minAge) {
        searchQuery = searchQuery.gte('age_min', filters.minAge);
      }
      
      if (filters.maxAge) {
        searchQuery = searchQuery.lte('age_max', filters.maxAge);
      }
      
      if (filters.material) {
        searchQuery = searchQuery.ilike('material', `%${filters.material}%`);
      }
    }

    // Apply text search
    searchQuery = searchQuery.or(
      `name.ilike.%${query}%,description.ilike.%${query}%,material.ilike.%${query}%`
    );

    // Apply sorting
    const sortBy = filters?.sortBy || 'created_at';
    const sortOrder = filters?.sortOrder || 'desc';
    searchQuery = searchQuery.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const limit = filters?.limit || 20;
    const page = filters?.page || 1;
    const offset = (page - 1) * limit;
    searchQuery = searchQuery.range(offset, offset + limit - 1);

    const { data: products, error, count } = await searchQuery;

    if (error) {
      console.error('Error searching products:', error);
      return NextResponse.json(
        { error: 'Failed to search products' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      products: products || [],
      query,
      filters,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}