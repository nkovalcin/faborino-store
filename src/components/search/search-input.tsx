'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { searchProducts } from '@/lib/mock-products'
import { 
  Search, 
  X, 
  Clock, 
  TrendingUp, 
  Filter,
  ArrowRight,
  Star,
  Package
} from 'lucide-react'

interface SearchInputProps {
  placeholder?: string
  onSearch?: (query: string) => void
  onShowAdvanced?: () => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showSuggestions?: boolean
  autoFocus?: boolean
}

export function SearchInput({
  placeholder = 'Hľadať produkty...',
  onSearch,
  onShowAdvanced,
  className = '',
  size = 'md',
  showSuggestions = true,
  autoFocus = false
}: SearchInputProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [popularSearches] = useState([
    'Učiaca veža',
    'Kuchynka',
    'Rovnovážna doska',
    'Montessori postieľka',
    'Lezecký trojuholník',
    'Stôl a stolička',
    'Dreveného nábytku',
    'Balančné hračky'
  ])
  
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('faborino_recent_searches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (query.length > 2) {
      const timer = setTimeout(() => {
        fetchSuggestions(query)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setSuggestions([])
    }
  }, [query])

  const fetchSuggestions = async (searchQuery: string) => {
    if (!showSuggestions) return
    
    setLoading(true)
    try {
      const results = await searchProducts(searchQuery)
      setSuggestions(results.slice(0, 5))
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return
    
    // Add to recent searches
    const newRecentSearches = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery)
    ].slice(0, 5)
    
    setRecentSearches(newRecentSearches)
    localStorage.setItem('faborino_recent_searches', JSON.stringify(newRecentSearches))
    
    setIsOpen(false)
    setQuery('')
    
    if (onSearch) {
      onSearch(searchQuery)
    } else {
      router.push(`/sk/produkty?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      handleSearch(query.trim())
    }
  }

  const handleClear = () => {
    setQuery('')
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('faborino_recent_searches')
  }

  const sizeClasses = {
    sm: 'h-10 text-sm',
    md: 'h-12 text-base',
    lg: 'h-14 text-lg'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative" role="search">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-muted ${iconSizes[size]}`} aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            role="searchbox"
            aria-label="Vyhľadávanie produktov"
            aria-autocomplete="list"
            aria-expanded={isOpen}
            aria-controls={isOpen ? 'search-suggestions' : undefined}
            aria-describedby="search-instructions"
            className={`
              w-full ${sizeClasses[size]} pl-10 pr-20 
              border border-cream-white rounded-full
              focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
              transition-all duration-200
              bg-white hover:border-primary/30
            `}
          />
          <div id="search-instructions" className="sr-only">
            Začnite písať pre zobrazenie návrhov produktov
          </div>
          
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-cream-white/50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Vymazať vyhľadávanie"
              >
                <X className="w-4 h-4 text-muted" />
              </button>
            )}
            
            {onShowAdvanced && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onShowAdvanced}
                className="p-1"
                aria-label="Rozšírené vyhľadávanie"
              >
                <Filter className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              type="submit"
              size="sm"
              className="rounded-full"
              disabled={!query.trim()}
              aria-label="Vyhľadať"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </form>

      {/* Search Suggestions Dropdown */}
      {isOpen && showSuggestions && (
        <div 
          id="search-suggestions"
          className="absolute top-full left-0 right-0 z-50 mt-2"
          role="listbox"
          aria-label="Návrhy vyhľadávania"
        >
          <Card className="shadow-lg border-cream-white">
            <CardContent className="p-0">
              {/* Query suggestions */}
              {query.length > 2 && (
                <div className="p-4 border-b border-cream-white">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-charcoal">Produkty</h4>
                    {loading && (
                      <div 
                        className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"
                        aria-label="Načítavanie návrhov"
                      />
                    )}
                  </div>
                  
                  {suggestions.length > 0 ? (
                    <div className="space-y-2" role="group" aria-label="Návrhy produktov">
                      {suggestions.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleSearch(product.name)}
                          className="w-full flex items-center gap-3 p-2 hover:bg-cream-white/50 rounded-lg text-left transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          role="option"
                          aria-label={`Produkt ${product.name}, cena ${product.price}€`}
                        >
                          <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package className="w-5 h-5 text-muted" aria-hidden="true" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-charcoal text-sm line-clamp-1">
                              {product.name}
                            </h5>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-medium text-primary">
                                {product.price}€
                              </span>
                              <div className="flex items-center gap-1" role="img" aria-label="Hodnotenie 4.8 z 5">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                                <span className="text-xs text-muted">4.8</span>
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted" aria-hidden="true" />
                        </button>
                      ))}
                      
                      <button
                        onClick={() => handleSearch(query)}
                        className="w-full p-2 text-left hover:bg-cream-white/50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        role="option"
                        aria-label={`Vyhľadať všetky produkty pre ${query}`}
                      >
                        <div className="flex items-center gap-2">
                          <Search className="w-4 h-4 text-muted" aria-hidden="true" />
                          <span className="text-sm text-charcoal">
                            Hľadať "<span className="font-medium">{query}</span>"
                          </span>
                        </div>
                      </button>
                    </div>
                  ) : !loading && query.length > 2 && (
                    <div className="text-center py-4" role="status" aria-live="polite">
                      <p className="text-sm text-muted">Nenašli sme žiadne produkty</p>
                    </div>
                  )}
                </div>
              )}

              {/* Recent searches */}
              {recentSearches.length > 0 && (
                <div className="p-4 border-b border-cream-white">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-charcoal flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Nedávne vyhľadávania
                    </h4>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-muted hover:text-charcoal"
                    >
                      Vymazať
                    </button>
                  </div>
                  
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="w-full flex items-center gap-2 p-2 hover:bg-cream-white/50 rounded-lg text-left transition-colors"
                      >
                        <Clock className="w-4 h-4 text-muted" />
                        <span className="text-sm text-charcoal">{search}</span>
                        <ArrowRight className="w-4 h-4 text-muted ml-auto" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular searches */}
              {query.length === 0 && (
                <div className="p-4">
                  <h4 className="font-medium text-charcoal mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Populárne vyhľadávania
                  </h4>
                  
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((search, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
                        onClick={() => handleSearch(search)}
                      >
                        {search}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}