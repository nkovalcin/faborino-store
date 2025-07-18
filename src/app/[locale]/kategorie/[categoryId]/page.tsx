'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Grid, List, ArrowUpDown, Star, ShoppingCart, Eye, Heart } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductsAPI, type ProductWithCategory } from '@/lib/api/products';
import { CategoriesAPI, type CategoryWithProductCount } from '@/lib/api/categories';

type SortOption = 'popularity' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest';

export default function CategoryPage() {
  const locale = useLocale();
  const params = useParams();
  const router = useRouter();
  const t = useTranslations();
  const categoryId = params.categoryId as string;
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [category, setCategory] = useState<CategoryWithProductCount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch category details
        const categoriesResponse = await CategoriesAPI.getCategories(true);
        const foundCategory = categoriesResponse.categories.find(cat => cat.slug === categoryId);
        
        if (!foundCategory) {
          setError('Kategória sa nenašla');
          return;
        }
        
        setCategory(foundCategory);
        
        // Fetch products for this category
        const productsResponse = await ProductsAPI.getProducts({
          categoryId: foundCategory.id,
          sortBy: sortBy === 'popularity' ? 'created_at' : sortBy.replace('_asc', '').replace('_desc', ''),
          sortOrder: sortBy.includes('_desc') ? 'desc' : 'asc',
          limit: 50
        });
        
        setProducts(productsResponse.products);
      } catch (error) {
        console.error('Error fetching category and products:', error);
        setError('Nepodarilo sa načítať kategóriu a produkty');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategoryAndProducts();
  }, [categoryId, sortBy]);

  const ProductCard = ({ product, className = '' }: { product: ProductWithCategory; className?: string }) => (
    <Link href={`/${locale}/produkty/${product.id}`}>
      <Card className={`group hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer ${className}`}>
        <CardContent className="p-0">
          <div className="relative">
            <Image
              src={product.images?.[0] || '/images/placeholder-product.jpg'}
              alt={typeof product.name === 'string' ? product.name : JSON.stringify(product.name)}
              width={400}
              height={300}
              className="w-full h-48 object-cover rounded-t-lg group-hover:brightness-110 transition-all duration-300"
            />
            <Badge className="absolute top-2 right-2 bg-amber-500 text-white text-xs">
              {product.age_min}-{product.age_max}m
            </Badge>
          </div>
          
          <div className="p-3">
            <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
              {typeof product.name === 'string' ? product.name : product.name[locale as keyof typeof product.name] || product.name.sk}
            </h3>
            
            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
              {typeof product.description === 'string' ? product.description : product.description?.[locale as keyof typeof product.description] || product.description?.sk || ''}
            </p>
            
            <div className="flex items-center mb-2">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3 h-3 ${i < 4 ? 'fill-current' : ''}`} 
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600">
                4.8 (127)
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">
                  {product.price.toFixed(2)} €
                </span>
                {product.compare_price && product.compare_price > product.price && (
                  <span className="text-sm text-gray-500 line-through">
                    {product.compare_price.toFixed(2)} €
                  </span>
                )}
              </div>
              
              {product.inventory_quantity > 0 && product.inventory_quantity <= 5 && (
                <Badge variant="outline" className="border-orange-500 text-orange-700 text-xs">
                  Len {product.inventory_quantity} ks
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5F3] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A574] mx-auto mb-4"></div>
          <p className="text-[#6B7280]">Načítava sa kategória...</p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-[#F7F5F3] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Kategória sa nenašla'}</p>
          <Button onClick={() => router.push(`/${locale}/kategorie`)} className="btn-primary">
            Späť na kategórie
          </Button>
        </div>
      </div>
    );
  }

  const breadcrumbs = [
    { label: 'Domov', href: `/${locale}` },
    { label: 'Kategórie', href: `/${locale}/kategorie` },
    { label: typeof category.name === 'string' ? category.name : category.name[locale as keyof typeof category.name] || category.name.sk, href: `/${locale}/kategorie/${categoryId}` }
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F3]">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="container-smart py-2">
          <nav className="flex space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center">
                {index > 0 && <span className="text-[#6B7280] mx-2">/</span>}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-[#3A3A3A] font-medium">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="text-[#6B7280] hover:text-[#D4A574] transition-colors">
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-hero opacity-20"></div>
        <div className="container-smart py-8 relative">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-[#3A3A3A] mb-4">
              {typeof category.name === 'string' ? category.name : category.name[locale as keyof typeof category.name] || category.name.sk}
            </h1>
            <p className="text-lg text-[#6B7280] max-w-3xl mx-auto mb-6">
              {typeof category.description === 'string' ? category.description : category.description?.[locale as keyof typeof category.description] || category.description?.sk || ''}
            </p>
            <Badge className="bg-[#D4A574] text-white text-sm px-4 py-2">
              {products.length} produktov
            </Badge>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="container-smart py-6">
        {/* Toolbar */}
        <Card className="card-3d p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="w-auto"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Späť
              </Button>
              <span className="text-sm text-[#6B7280]">
                Zobrazuje sa <span className="font-medium text-[#3A3A3A]">{products.length}</span> produktov
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-[#6B7280]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="border border-[#E5E7EB] rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-[#D4A574] transition-all duration-200"
                >
                  <option value="popularity">Obľúbenosť</option>
                  <option value="price_asc">Cena: najnižšia</option>
                  <option value="price_desc">Cena: najvyššia</option>
                  <option value="name_asc">Názov: A-Z</option>
                  <option value="name_desc">Názov: Z-A</option>
                  <option value="newest">Najnovšie</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex border border-[#E5E7EB] rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 transition-all duration-200 ${viewMode === 'grid' ? 'bg-[#D4A574] text-white shadow-soft' : 'text-[#6B7280] hover:bg-[#F7F5F3] hover:text-[#3A3A3A]'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 transition-all duration-200 ${viewMode === 'list' ? 'bg-[#D4A574] text-white shadow-soft' : 'text-[#6B7280] hover:bg-[#F7F5F3] hover:text-[#3A3A3A]'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-6'
          }>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                className={viewMode === 'list' ? 'flex' : ''}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-[#F7F5F3] rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-8 h-8 text-[#6B7280]" />
              </div>
              <h3 className="text-xl font-semibold text-[#3A3A3A] mb-3">
                Žiadne produkty v tejto kategórii
              </h3>
              <p className="text-[#6B7280] mb-6">
                Momentálne nemáme žiadne produkty v tejto kategórii
              </p>
              <Button
                onClick={() => router.push(`/${locale}/kategorie`)}
                className="btn-primary"
              >
                Prejsť na kategórie
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}