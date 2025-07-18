'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { VirtualizedProductGrid } from './virtualized-product-grid'
import { ProductCard } from './product-card'
import { SearchResults } from '@/components/search/search-results'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Search, Filter, Grid, List } from 'lucide-react'
import { Product } from '@/lib/types'
import { SearchInput } from '@/components/search/search-input'
import { SearchFiltersComponent } from '@/components/search/search-filters'
import { AdvancedSearch, SearchFilters } from '@/components/search/advanced-search'
import { NewsletterSignup } from '@/components/newsletter/newsletter-signup'

interface ProductsWithSearchProps {
  initialProducts: Product[]
}

export function ProductsWithSearch({ initialProducts }: ProductsWithSearchProps) {
  const [products] = useState<Product[]>(initialProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<string>('name-asc')
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    categories: [],
    priceRange: [0, 500],
    ageRange: [0, 72],
    materials: [],
    safetyCertifications: [],
    inStock: false,
    onSale: false,
    minRating: 0,
    dimensions: {},
    assemblyRequired: undefined,
    fastDelivery: false,
    brand: undefined,
    colors: [],
    sortBy: 'relevance'
  })
  
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('search') || ''

  useEffect(() => {
    applyFilters(filters)
  }, [products, filters])

  useEffect(() => {
    let filtered = [...products]
    
    // Apply sorting
    switch (sortBy) {
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      default:
        break
    }
    
    setFilteredProducts(filtered)
  }, [products, sortBy])

  const clearSearch = () => {
    window.history.pushState({}, '', '/sk/produkty')
    window.location.reload()
  }

  const handleAdvancedSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters)
    // Apply filters to products
    applyFilters(newFilters)
  }

  const applyFilters = (filterOptions: SearchFilters) => {
    let filtered = [...products]
    
    // Apply category filter
    if (filterOptions.categories.length > 0) {
      filtered = filtered.filter(product => 
        filterOptions.categories.includes(product.category.toLowerCase().replace(/\s+/g, '-'))
      )
    }
    
    // Apply price range filter
    filtered = filtered.filter(product => 
      product.price >= filterOptions.priceRange[0] && 
      product.price <= filterOptions.priceRange[1]
    )
    
    // Apply age range filter
    filtered = filtered.filter(product => 
      product.ageMin <= filterOptions.ageRange[1] && 
      product.ageMax >= filterOptions.ageRange[0]
    )
    
    // Apply stock filter
    if (filterOptions.inStock) {
      filtered = filtered.filter(product => product.stockStatus === 'In Stock')
    }
    
    // Apply sale filter
    if (filterOptions.onSale) {
      filtered = filtered.filter(product => product.originalPrice && product.originalPrice > product.price)
    }
    
    // Apply sorting
    switch (filterOptions.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
      default:
        break
    }
    
    setFilteredProducts(filtered)
  }

  const clearAllFilters = () => {
    const defaultFilters: SearchFilters = {
      query: '',
      categories: [],
      priceRange: [0, 500],
      ageRange: [0, 72],
      materials: [],
      safetyCertifications: [],
      inStock: false,
      onSale: false,
      minRating: 0,
      dimensions: {},
      assemblyRequired: undefined,
      fastDelivery: false,
      brand: undefined,
      colors: [],
      sortBy: 'relevance'
    }
    setFilters(defaultFilters)
    applyFilters(defaultFilters)
  }

  // If there's a search query, show search results
  if (searchQuery.trim()) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <section className="bg-gradient-to-r from-primary/5 to-accent/5 py-16">
          <div className="container-responsive">
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-h1 font-bold text-charcoal mb-4">
                Vyhľadávanie produktov
              </h1>
              <p className="text-muted text-lg">
                Nájdite presne to, čo hľadáte v našom sortimente
              </p>
            </div>
          </div>
        </section>

        {/* Search Results */}
        <section className="py-12">
          <div className="container-responsive">
            <SearchResults query={searchQuery} onClearSearch={clearSearch} />
          </div>
        </section>
      </div>
    )
  }

  // Regular products page
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary/5 to-accent/5 py-16">
        <div className="container-responsive">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-h1 font-bold text-charcoal mb-4">
              Naše produkty
            </h1>
            <p className="text-muted text-lg">
              Objavte náš kompletný sortiment Montessori nábytku a hračiek pre podporu prirodzeného vývoja vašich detí.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-surface border-b border-cream-white">
        <div className="container-responsive">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <AdvancedSearch onSearch={handleAdvancedSearch} currentFilters={filters}>
                <SearchInput
                  placeholder="Hľadať produkty..."
                  showSuggestions={true}
                  onShowAdvanced={() => {}}
                />
              </AdvancedSearch>
            </div>

            {/* View and Sort Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted">Zobraziť:</span>
                <div className="flex rounded-lg border border-cream-white overflow-hidden">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'hover:bg-cream-white/50 transition-colors'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'hover:bg-cream-white/50 transition-colors'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <select 
                className="smart-input min-w-[160px]"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name-asc">Názov (A-Z)</option>
                <option value="name-desc">Názov (Z-A)</option>
                <option value="price-asc">Cena (najnižšia)</option>
                <option value="price-desc">Cena (najvyššia)</option>
              </select>

              <AdvancedSearch onSearch={handleAdvancedSearch} currentFilters={filters}>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filtre
                </Button>
              </AdvancedSearch>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container-responsive">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 flex-shrink-0">
              <SearchFiltersComponent
                filters={filters}
                onFiltersChange={setFilters}
                onClearAll={clearAllFilters}
              />
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Results Info */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted">
                  Zobrazuje sa <span className="font-medium text-charcoal">1-{filteredProducts.length}</span> z <span className="font-medium text-charcoal">{filteredProducts.length}</span> produktov
                </p>
              </div>

              {/* Products Grid */}
              {viewMode === 'grid' ? (
                <VirtualizedProductGrid 
                  products={filteredProducts} 
                  itemsPerPage={24}
                />
              ) : (
                <div className="space-y-4">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-surface">
        <div className="container-responsive">
          <div className="text-center mb-12">
            <h2 className="text-h2 font-bold text-charcoal mb-4">
              Populárne kategórie
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Preskúmajte naše najobľúbenejšie kategórie produktov
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-8 gap-6">
            {[
              { name: 'Prvé kroky', count: 24, category: 'first-steps' },
              { name: 'Odvážni objavitelia', count: 18, category: 'brave-explorers' },
              { name: 'Istí lezci', count: 15, category: 'confident-climbers' },
              { name: 'Kreatívne priestory', count: 32, category: 'creative-spaces' },
            ].map((category) => (
              <Card key={category.name} className="group cursor-pointer hover-lift">
                <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="font-semibold text-lg mb-1 text-charcoal">{category.name}</h3>
                    <p className="text-sm text-muted">{category.count} produktov</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container-responsive">
          <div className="max-w-2xl mx-auto">
            <NewsletterSignup
              variant="minimal"
              title="Nezmeškajte nové produkty"
              description="Prihláste sa k odberu a dostávajte informácie o novinkách a špeciálnych ponukách."
              placeholder="Váš email"
              buttonText="Prihlásiť sa"
              className="text-center"
            />
          </div>
        </div>
      </section>
    </div>
  )
}