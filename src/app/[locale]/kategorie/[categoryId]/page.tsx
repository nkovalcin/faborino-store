'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Grid, List, ArrowUpDown, Star, ShoppingCart, Eye, Heart } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getMockProducts } from '@/lib/mock-products';

type SortOption = 'popularity' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest';

interface Product {
  id: string;
  name: string;
  handle: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  ageRange: string;
  onSale?: boolean;
  isNew?: boolean;
  inStock: boolean;
  stockCount?: number;
  shortDescription: string;
  category: string;
  subcategory?: string;
  createdAt: string;
}

// Category mapping with descriptions
const categoryData = {
  'first-steps': {
    name: 'Prvé Kroky',
    description: 'Pre najmenších - senzorický rozvoj a základné motorické zručnosti',
    ageRange: '0-36 mesiacov',
    color: 'bg-pink-100 text-pink-600',
    subcategories: [
      { id: 'baby-swings', name: 'Detské Hojdačky', description: 'Bezpečné hojdačky pre najmenších' },
      { id: 'baby-hammocks', name: 'Detské Hojdacie Postieľky', description: 'Upokojujúce kolísky pre novorodencov' },
      { id: 'baby-gym-mats', name: 'Gymnastické Podložky', description: 'Podložky pre motorický rozvoj' },
      { id: 'door-bouncers', name: 'Dverové Hojdačky', description: 'Hojdačky do dverí pre zábavu' },
      { id: 'sensory-swings', name: 'Senzorické Hojdačky', description: 'Hojdačky pre senzorický rozvoj' },
      { id: 'climbing-blocks', name: 'Mäkké Bloky', description: 'Penové bloky pre prvé lezenie' }
    ]
  },
  'brave-explorers': {
    name: 'Odvážni Objavitelia',
    description: 'Pre aktívne deti - pokročilé motorické zručnosti a nezávislosť',
    ageRange: '12-120 mesiacov',
    color: 'bg-blue-100 text-blue-600',
    subcategories: [
      { id: 'balance-boards', name: 'Balanćné Dosky', description: 'Dosky pre tréning rovnováhy' },
      { id: 'climbing-triangles', name: 'Pikler Trojuholníky', description: 'Klasické lezecké trojuholníky' },
      { id: 'balance-beams', name: 'Balanćné Kladiny', description: 'Kladiny pre pokročilú rovnováhu' },
      { id: 'learning-towers', name: 'Učiace Veže', description: 'Veže pre nezávislé objavovanie' },
      { id: 'small-climbing-frames', name: 'Malé Preliezky', description: 'Preliezky pre domáce použitie' },
      { id: 'toddler-slides', name: 'Detské Šmýkačky', description: 'Šmýkačky pre malé deti' }
    ]
  },
  'confident-climbers': {
    name: 'Sebavedomí Lezci',
    description: 'Pre pokročilých - komplexné pohyby a budovanie sily',
    ageRange: '36+ mesiacov',
    color: 'bg-green-100 text-green-600',
    subcategories: [
      { id: 'climbing-walls', name: 'Lezecké Steny', description: 'Steny pre pokročilé lezenie' },
      { id: 'swedish-ladders', name: 'Švédske Rebríky', description: 'Rebríky pre gymnastiku' },
      { id: 'complete-climbing-sets', name: 'Kompletné Lezecké Sety', description: 'Veľké lezecké komplexy' },
      { id: 'climbing-accessories', name: 'Lezecké Príslušenstvo', description: 'Doplnky pre lezecké aktivity' },
      { id: 'garden-swings', name: 'Záhradné Hojdačky', description: 'Hojdačky pre vonkajšie použitie' },
      { id: 'gymnastics-equipment', name: 'Gymnastické Náčinie', description: 'Náčinie pre domácu gymnastiku' }
    ]
  },
  'creative-spaces': {
    name: 'Kreatívne Priestory',
    description: 'Pre predstavivosť - nábytok a praktické životné zručnosti',
    ageRange: '12-120 mesiacov',
    color: 'bg-purple-100 text-purple-600',
    subcategories: [
      { id: 'childrens-furniture', name: 'Detský Nábytok', description: 'Nábytok pre detskú izbu' },
      { id: 'bookshelves', name: 'Knižnice', description: 'Police pre detské knihy' },
      { id: 'clothes-rails', name: 'Vešiaky na Oblečenie', description: 'Vešiaky pre samostatnosť' },
      { id: 'sandboxes', name: 'Pieskoviská', description: 'Pieskoviská pre kreativitu' },
      { id: 'tents', name: 'Detské Stany', description: 'Stany pre hru a odpočinok' }
    ]
  },
  'growing-together': {
    name: 'Rastieme Spolu',
    description: 'Modulárne produkty, ktoré sa prispôsobujú vývoju dieťaťa',
    ageRange: 'Rozšíriteľné',
    color: 'bg-amber-100 text-amber-600',
    subcategories: [
      { id: 'modular-climbing-sets', name: 'Modulárne Lezecké Sety', description: 'Rozšíriteľné lezecké systémy' },
      { id: 'expandable-blocks', name: 'Rozšíriteľné Bloky', description: 'Bloky pre modulárne stavby' },
      { id: 'progressive-balance-sets', name: 'Progresívne Balanćné Sety', description: 'Sety pre postupný rozvoj' },
      { id: 'combination-frames', name: 'Kombinované Rámy', description: 'Multifunkčné rámy' }
    ]
  },
  'essential-accessories': {
    name: 'Potrebné Príslušenstvo',
    description: 'Bezpečnosť a údržba produktov',
    ageRange: 'Všetky vekové kategórie',
    color: 'bg-red-100 text-red-600',
    subcategories: [
      { id: 'safety-equipment', name: 'Bezpečnostné Vybavenie', description: 'Vybavenie pre bezpečnosť' },
      { id: 'replacement-parts', name: 'Náhradné Časti', description: 'Náhradné diely' },
      { id: 'wall-decorations', name: 'Nástenné Dekorácie', description: 'Dekorácie do detskej izby' },
      { id: 'maintenance-items', name: 'Údržba', description: 'Produkty na údržbu' }
    ]
  }
};

export default function CategoryPage() {
  const locale = useLocale();
  const params = useParams();
  const router = useRouter();
  const t = useTranslations();
  const categoryId = params.categoryId as string;
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');

  const category = categoryData[categoryId as keyof typeof categoryData];

  // Mock products - in real app, this would come from CSV data
  const mockProducts: Product[] = [
    {
      id: 'MAM_001',
      name: 'MAMOI® Baby swing Light grey 3-in-1',
      handle: 'mamoi-baby-swing-light-grey-3-in-1',
      price: 59.99,
      image: 'https://mamoi.me/wp-content/uploads/2023/06/lifestyle_3w1-szara_2-1.jpg',
      rating: 4.8,
      reviews: 42,
      ageRange: '6m - 10r',
      inStock: true,
      stockCount: 8,
      shortDescription: 'Drevená dverová hojdačka, ktorá sa prispôsobuje veku dieťaťa.',
      category: categoryId,
      subcategory: 'baby-swings',
      createdAt: '2024-01-15'
    },
    {
      id: 'MAM_007',
      name: 'MAMOI® Balance Board Natural Wood',
      handle: 'mamoi-balance-board-natural-wood',
      price: 29.99,
      image: 'https://mamoi.me/balance-board-natural-1.jpg',
      rating: 4.9,
      reviews: 127,
      ageRange: '18m - 12r',
      inStock: true,
      stockCount: 15,
      shortDescription: 'Drevená balanćná doska pre tréning rovnováhy.',
      category: categoryId,
      subcategory: 'balance-boards',
      createdAt: '2024-02-01'
    },
    {
      id: 'MAM_009',
      name: 'MAMOI® Pikler Triangle Small Natural',
      handle: 'mamoi-pikler-triangle-small-natural',
      price: 49.99,
      image: 'https://mamoi.me/pikler-triangle-small-1.jpg',
      rating: 4.7,
      reviews: 89,
      ageRange: '12m - 6r',
      inStock: true,
      stockCount: 6,
      shortDescription: 'Klasický Pikler lezecký trojuholník pre batoľatá.',
      category: categoryId,
      subcategory: 'climbing-triangles',
      createdAt: '2024-01-20'
    }
  ];

  // Apply filters and sorting
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...mockProducts];

    // Apply subcategory filter
    if (selectedSubcategory !== 'all') {
      filtered = filtered.filter(product => product.subcategory === selectedSubcategory);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popularity':
      default:
        filtered.sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews));
        break;
    }

    return filtered;
  }, [mockProducts, selectedSubcategory, sortBy]);

  const ProductCard = ({ product, className = '' }: { product: Product; className?: string }) => (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardContent className="p-0">
        <div className="relative">
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={300}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <Badge className="absolute top-2 right-2 bg-amber-500 text-white text-xs">
            {product.ageRange}
          </Badge>
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-t-lg flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
              <Button size="sm" variant="outline" className="bg-white/90 hover:bg-white text-xs">
                <Eye className="w-3 h-3 mr-1" />
                Náhľad
              </Button>
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-xs">
                <ShoppingCart className="w-3 h-3 mr-1" />
                Kúpiť
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-3">
          <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
            {product.name}
          </h3>
          
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
            {product.shortDescription}
          </p>
          
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400 mr-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} 
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">
              {product.rating} ({product.reviews})
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">
                {product.price} €
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {product.originalPrice} €
                </span>
              )}
            </div>
            
            {product.stockCount && product.stockCount <= 5 && (
              <Badge variant="outline" className="border-orange-500 text-orange-700 text-xs">
                Len {product.stockCount} ks
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Kategória sa nenašla</h1>
          <Button onClick={() => router.push(`/${locale}/kategorie`)} className="bg-amber-600 hover:bg-amber-700">
            Späť na kategórie
          </Button>
        </div>
      </div>
    );
  }

  const breadcrumbs = [
    { label: 'Domov', href: `/${locale}` },
    { label: 'Kategórie', href: `/${locale}/kategorie` },
    { label: category.name, href: `/${locale}/kategorie/${categoryId}` }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <nav className="flex space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center">
                {index > 0 && <span className="text-gray-400 mx-2">/</span>}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-gray-900 font-medium">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="text-gray-600 hover:text-amber-600">
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${category.color}`}>
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
                <p className="text-sm text-gray-600">{category.description}</p>
                <Badge variant="outline" className="mt-1 text-xs">
                  {category.ageRange}
                </Badge>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push(`/${locale}/kategorie`)}
              className="text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Späť
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Subcategories Sidebar */}
          <div className="lg:w-80">
            <Card className="sticky top-4">
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-3">Podkategórie</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedSubcategory('all')}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                      selectedSubcategory === 'all' ? 'bg-amber-100 text-amber-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-sm">Všetky produkty</span>
                    <span className="text-xs text-gray-500">
                      {mockProducts.length}
                    </span>
                  </button>
                  {category.subcategories.map((subcategory) => (
                    <button
                      key={subcategory.id}
                      onClick={() => setSelectedSubcategory(subcategory.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                        selectedSubcategory === subcategory.id ? 'bg-amber-100 text-amber-700' : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="text-left">
                        <div className="text-sm text-gray-700">{subcategory.name}</div>
                        <div className="text-xs text-gray-500">{subcategory.description}</div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {mockProducts.filter(p => p.subcategory === subcategory.id).length}
                      </span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products */}
          <div className="flex-1">
            {/* Toolbar */}
            <Card className="p-3 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    Zobrazuje sa <span className="font-medium">{filteredAndSortedProducts.length}</span> produktov
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 text-gray-500" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                  <div className="flex border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-l-lg ${viewMode === 'grid' ? 'bg-amber-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-r-lg ${viewMode === 'list' ? 'bg-amber-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Products Grid */}
            {filteredAndSortedProducts.length > 0 ? (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                  : 'space-y-3'
              }>
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    className={viewMode === 'list' ? 'flex' : ''}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Žiadne produkty sa nenašli
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Skúste vybrať inú podkategóriu
                  </p>
                  <Button
                    onClick={() => setSelectedSubcategory('all')}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    Zobraziť všetky produkty
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}