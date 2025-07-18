'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Grid, List, ArrowUpDown, Filter, Star, ShoppingCart, Eye, Target, Sparkles } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductsAPI, type ProductWithCategory } from '@/lib/api/products';
import { getLocalizedProductName, getLocalizedProductDescription, type SupportedLocale } from '@/lib/utils/multilingual';

type SortOption = 'popularity' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest';

export default function ProductsPage() {
  const locale = useLocale();
  const t = useTranslations();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await ProductsAPI.getProducts({
          sortBy: sortBy === 'popularity' ? 'created_at' : sortBy.replace('_asc', '').replace('_desc', ''),
          sortOrder: sortBy.includes('_desc') ? 'desc' : 'asc',
          page: pagination.page,
          limit: pagination.limit
        });
        
        setProducts(response.products);
        setPagination(response.pagination);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Nepodarilo sa načítať produkty. Skúste to znova.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [sortBy, pagination.page]);

  // Products are already sorted by the backend
  const sortedProducts = products;

  const ProductCard = ({ product, className = '' }: { product: ProductWithCategory; className?: string }) => (
    <Link href={`/${locale}/produkty/${product.id}`}>
      <Card className={`card-product group cursor-pointer h-full hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ${className}`}>
        <CardContent className="p-0">
          <div className="relative overflow-hidden rounded-t-2xl">
            <Image
              src={product.images?.[0] || '/images/placeholder-product.jpg'}
              alt={getLocalizedProductName(product, locale as SupportedLocale)}
              width={400}
              height={300}
              className="w-full h-64 object-cover image-product group-hover:brightness-110 transition-all duration-300"
            />
            
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <div className="badge-age">
                {product.age_min}-{product.age_max}m
              </div>
              {product.compare_price && product.compare_price > product.price && (
                <div className="badge-sale">
                  ZĽAVA
                </div>
              )}
            </div>
            
            {/* Smooth hover effect */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 rounded-t-2xl"></div>
          </div>
          
          <div className="p-6">
            <h3 className="text-lg font-semibold text-[#3A3A3A] mb-2 group-hover:text-[#D4A574] transition-colors line-clamp-2">
              {getLocalizedProductName(product, locale as SupportedLocale)}
            </h3>
            
            <p className="text-[#6B7280] mb-4 line-clamp-2">
              {getLocalizedProductDescription(product, locale as SupportedLocale)}
            </p>
            
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < 4 ? 'fill-current' : ''}`} 
                  />
                ))}
              </div>
              <span className="text-sm text-[#6B7280]">
                4.8 (127)
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[#3A3A3A]">
                  {product.price.toFixed(2)} €
                </span>
                {product.compare_price && product.compare_price > product.price && (
                  <span className="text-lg text-[#6B7280] line-through">
                    {product.compare_price.toFixed(2)} €
                  </span>
                )}
              </div>
              
              {product.inventory_quantity > 0 && (
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Skladom
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  const breadcrumbs = [
    { label: 'Domov', href: `/${locale}` },
    { label: 'Produkty', href: `/${locale}/produkty` }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5F3] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A574] mx-auto mb-4"></div>
          <p className="text-[#6B7280]">Načítajú sa produkty...</p>
        </div>
      </div>
    );
  }

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

      {/* Header with Pattern */}
      <div className="bg-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-hero opacity-20"></div>
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'url(/images/pattern-faborino-1.png)',
            backgroundSize: '150px 150px',
            backgroundRepeat: 'repeat'
          }}
        ></div>
        
        <div className="container-smart py-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-soft mb-6">
              <Sparkles className="w-5 h-5 text-[#D4A574]" />
              <span className="text-sm font-medium text-[#3A3A3A]">Kompletná ponuka</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-[#3A3A3A] mb-4">
              Všetky <span className="text-gradient">Produkty</span>
            </h1>
            <p className="text-lg text-[#6B7280] max-w-3xl mx-auto">
              Prehliadajte si našu kompletnu ponuku prémiových Montessori nábytkov a hračiek pre deti všetkých vekových kategórií
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-smart py-6">
        {/* Toolbar */}
        <Card className="card-3d p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#6B7280]">
                Zobrazuje sa <span className="font-medium text-[#3A3A3A]">{sortedProducts.length}</span> produktov
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
        {sortedProducts.length > 0 ? (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-6'
          }>
            {sortedProducts.map((product) => (
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
                <Target className="w-8 h-8 text-[#6B7280]" />
              </div>
              <h3 className="text-xl font-semibold text-[#3A3A3A] mb-3">
                Žiadne produkty sa nenašli
              </h3>
              <p className="text-[#6B7280] mb-6">
                Momentálne nemáme žiadne produkty k dispozícii
              </p>
              <Button
                onClick={() => window.location.href = `/${locale}/kategorie`}
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