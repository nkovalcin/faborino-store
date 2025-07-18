'use client'

import { useState, useEffect } from 'react'
import { ProductCard } from '@/components/products/product-card'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { searchProducts } from '@/lib/mock-products'
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Grid, 
  List,
  X
} from 'lucide-react'

interface SearchResultsProps {
  query: string
  onClearSearch: () => void
}

export function SearchResults({ query, onClearSearch }: SearchResultsProps) {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState<'relevance' | 'price-low' | 'price-high' | 'name'>('relevance')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    if (query.trim()) {
      performSearch(query.trim())
    } else {
      setProducts([])
    }
  }, [query])

  const performSearch = async (searchQuery: string) => {
    setLoading(true)
    try {
      const results = await searchProducts(searchQuery)
      let sortedResults = [...results]

      switch (sortBy) {
        case 'price-low':
          sortedResults.sort((a, b) => a.price - b.price)
          break
        case 'price-high':
          sortedResults.sort((a, b) => b.price - a.price)
          break
        case 'name':
          sortedResults.sort((a, b) => a.name.localeCompare(b.name))
          break
        default:
          // Keep relevance order
          break
      }

      setProducts(sortedResults)
    } catch (error) {
      console.error('Search error:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (query.trim()) {
      performSearch(query.trim())
    }
  }, [sortBy])

  if (!query.trim()) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-h3 font-semibold text-charcoal">
            Výsledky vyhľadávania
          </h2>
          <Badge variant="outline">
            {loading ? 'Hľadám...' : `${products.length} produktov`}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSearch}
            className="text-muted hover:text-charcoal"
          >
            <X className="w-4 h-4 mr-1" />
            Vymazať
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-cream-white rounded-card text-sm"
          >
            <option value="relevance">Relevantnosť</option>
            <option value="price-low">Cena: od najnižšej</option>
            <option value="price-high">Cena: od najvyššej</option>
            <option value="name">Názov: A-Z</option>
          </select>

          {/* View Mode */}
          <div className="flex border border-cream-white rounded-card">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-muted hover:text-charcoal'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'text-muted hover:text-charcoal'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Query */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Search className="w-4 h-4" />
            <span>Hľadáte: "{query}"</span>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="loading-spinner mx-auto mb-4" />
          <p className="text-muted">Hľadám produkty...</p>
        </div>
      )}

      {/* No Results */}
      {!loading && products.length === 0 && query.trim() && (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="w-16 h-16 text-muted mx-auto mb-4" />
            <h3 className="font-semibold text-charcoal mb-2">
              Nenašli sme žiadne produkty
            </h3>
            <p className="text-muted mb-6">
              Skúste zmeniť vyhľadávacie kritériá alebo použiť iné kľúčové slová
            </p>
            <div className="space-y-2 text-sm text-muted">
              <p>Návrhy:</p>
              <ul className="space-y-1">
                <li>• Skontrolujte preklepy</li>
                <li>• Použite všeobecnejšie termíny</li>
                <li>• Skúste hľadať podľa kategórie</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {!loading && products.length > 0 && (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-6'
            : 'space-y-4'
        }>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}