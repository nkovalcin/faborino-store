'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ProductCard } from '@/components/products/product-card'
import { SearchInput } from './search-input'
import { SearchFiltersComponent } from './search-filters'
import { AdvancedSearch, SearchFilters } from './advanced-search'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { getAllProducts, searchProducts } from '@/lib/mock-products'
import { Product } from '@/lib/types'
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  SortAsc, 
  SortDesc,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react'

export function SearchPageContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
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
  const initialQuery = searchParams.get('q') || ''

  useEffect(() => {
    // Initialize with search query from URL
    if (initialQuery) {
      setFilters(prev => ({ ...prev, query: initialQuery }))
      performSearch(initialQuery)
    } else {
      // Load all products if no search query
      loadAllProducts()
    }
  }, [initialQuery])

  const loadAllProducts = async () => {
    setLoading(true)
    try {
      const allProducts = await getAllProducts()
      setProducts(allProducts)
      setFilteredProducts(allProducts)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const performSearch = async (query: string) => {
    setLoading(true)
    try {
      const results = await searchProducts(query)
      setProducts(results)
      applyFilters({ ...filters, query })
    } catch (error) {
      console.error('Error searching products:', error)
      setProducts([])
      setFilteredProducts([])
    } finally {
      setLoading(false)
    }
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
      case 'rating':
        filtered.sort((a, b) => 4.8 - 4.8) // Mock rating sort
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        break
      default:
        break
    }
    
    setFilteredProducts(filtered)
  }

  const handleSearch = (query: string) => {
    const newFilters = { ...filters, query }
    setFilters(newFilters)
    performSearch(query)
    
    // Update URL
    const url = new URL(window.location.href)
    if (query) {
      url.searchParams.set('q', query)
    } else {
      url.searchParams.delete('q')
    }
    window.history.replaceState({}, '', url.toString())
  }

  const handleAdvancedSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters)
    if (newFilters.query) {
      performSearch(newFilters.query)
    } else {
      applyFilters(newFilters)
    }
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
    setProducts([])
    setFilteredProducts([])
    
    // Clear URL
    const url = new URL(window.location.href)
    url.searchParams.delete('q')
    window.history.replaceState({}, '', url.toString())
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.categories.length > 0) count += filters.categories.length
    if (filters.materials.length > 0) count += filters.materials.length
    if (filters.safetyCertifications.length > 0) count += filters.safetyCertifications.length
    if (filters.colors.length > 0) count += filters.colors.length
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) count++
    if (filters.ageRange[0] > 0 || filters.ageRange[1] < 72) count++
    if (filters.minRating > 0) count++
    if (filters.inStock) count++
    if (filters.onSale) count++
    if (filters.fastDelivery) count++
    if (filters.assemblyRequired === false) count++
    return count
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary/5 to-accent/5 py-16">
        <div className="container-responsive">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-h1 font-bold text-charcoal mb-4">
              Vyhľadávanie produktov
            </h1>
            <p className="text-muted text-lg mb-8">
              Nájdite presne to, čo hľadáte v našom sortimente Montessori nábytku a hračiek
            </p>
            
            {/* Main Search */}
            <div className="max-w-2xl mx-auto">
              <SearchInput
                placeholder="Hľadať produkty..."
                onSearch={handleSearch}
                className="w-full"
                size="lg"
                showSuggestions={true}
                autoFocus={!initialQuery}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search Controls */}
      <section className="py-8 bg-surface border-b border-cream-white">
        <div className="container-responsive">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted">Výsledky:</span>
                <Badge variant="outline">
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Načítavam...
                    </div>
                  ) : (
                    `${filteredProducts.length} produktov`
                  )}
                </Badge>
              </div>
              
              {getActiveFiltersCount() > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {getActiveFiltersCount()} filtrov
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Vymazať všetko
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Sort */}
              <select
                value={filters.sortBy}
                onChange={(e) => {
                  const newFilters = { ...filters, sortBy: e.target.value as any }
                  setFilters(newFilters)
                  applyFilters(newFilters)
                }}
                className="smart-input min-w-[160px]"
              >
                <option value="relevance">Relevantnosť</option>
                <option value="price-low">Cena: od najnižšej</option>
                <option value="price-high">Cena: od najvyššej</option>
                <option value="name-asc">Názov: A-Z</option>
                <option value="name-desc">Názov: Z-A</option>
                <option value="rating">Hodnotenie</option>
                <option value="newest">Najnovšie</option>
              </select>

              {/* View Mode */}
              <div className="flex border border-cream-white rounded-lg overflow-hidden">
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

              {/* Advanced Search */}
              <AdvancedSearch onSearch={handleAdvancedSearch} currentFilters={filters}>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Rozšírené vyhľadávanie
                </Button>
              </AdvancedSearch>
            </div>
          </div>
        </div>
      </section>

      {/* Current Search Query */}
      {filters.query && (
        <section className="py-4 bg-cream-white/30">
          <div className="container-responsive">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted" />
              <span className="text-sm text-muted">
                Hľadáte: <span className="font-medium text-charcoal">"{filters.query}"</span>
              </span>
              <button
                onClick={() => handleSearch('')}
                className="p-1 hover:bg-white/50 rounded transition-colors"
              >
                <X className="w-3 h-3 text-muted" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-12">
        <div className="container-responsive">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 flex-shrink-0">
              <SearchFiltersComponent
                filters={filters}
                onFiltersChange={(newFilters) => {
                  setFilters(newFilters)
                  applyFilters(newFilters)
                }}
                onClearAll={clearAllFilters}
              />
            </aside>

            {/* Results */}
            <div className="flex-1">
              {/* Loading State */}
              {loading && (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-muted">Načítavam produkty...</p>
                </div>
              )}

              {/* No Results */}
              {!loading && filteredProducts.length === 0 && (products.length > 0 || filters.query) && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <AlertCircle className="w-16 h-16 text-muted mx-auto mb-4" />
                    <h3 className="font-semibold text-charcoal mb-2">
                      Nenašli sme žiadne produkty
                    </h3>
                    <p className="text-muted mb-6">
                      Skúste zmeniť vyhľadávacie kritériá alebo použiť iné filtre
                    </p>
                    <div className="space-y-2 text-sm text-muted">
                      <p>Návrhy:</p>
                      <ul className="space-y-1">
                        <li>• Skontrolujte preklepy</li>
                        <li>• Použite všeobecnejšie termíny</li>
                        <li>• Skúste odstrániť niektoré filtre</li>
                        <li>• Vyhľadajte podľa kategórie</li>
                      </ul>
                    </div>
                    <Button
                      onClick={clearAllFilters}
                      className="mt-6"
                      variant="outline"
                    >
                      Vymazať všetky filtre
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Products Grid */}
              {!loading && filteredProducts.length > 0 && (
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-6'
                    : 'space-y-4'
                }>
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

              {/* Load More */}
              {!loading && filteredProducts.length > 0 && (
                <div className="text-center mt-12">
                  <Button size="lg" variant="outline">
                    Načítať viac produktov
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}