'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { ProductCardOptimized } from './product-card-optimized'
import { Product } from '@/lib/types'
import { performanceUtils } from '@/lib/performance'

interface VirtualizedProductGridProps {
  products: Product[]
  itemsPerPage?: number
  className?: string
}

export function VirtualizedProductGrid({ 
  products, 
  itemsPerPage = 24,
  className = '' 
}: VirtualizedProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([])

  // Calculate visible products for current page
  const paginatedProducts = useMemo(() => {
    const startIndex = 0
    const endIndex = currentPage * itemsPerPage
    return products.slice(startIndex, endIndex)
  }, [products, currentPage, itemsPerPage])

  // Update visible products when pagination changes
  useEffect(() => {
    setVisibleProducts(paginatedProducts)
  }, [paginatedProducts])

  // Intersection observer for infinite scroll
  const loadMoreProducts = useCallback(() => {
    if (isLoading) return
    
    const hasMore = currentPage * itemsPerPage < products.length
    if (!hasMore) return
    
    setIsLoading(true)
    
    // Simulate async loading with delay
    setTimeout(() => {
      setCurrentPage(prev => prev + 1)
      setIsLoading(false)
    }, 300)
  }, [currentPage, itemsPerPage, products.length, isLoading])

  // Throttled scroll handler
  const handleScroll = useMemo(
    () => performanceUtils.throttle(() => {
      const threshold = 200
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = document.documentElement.clientHeight
      
      if (scrollTop + clientHeight >= scrollHeight - threshold) {
        loadMoreProducts()
      }
    }, 100),
    [loadMoreProducts]
  )

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Render priority items first (first 6 products)
  const priorityItems = visibleProducts.slice(0, 6)
  const normalItems = visibleProducts.slice(6)

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-6">
        {/* Priority items with high priority loading */}
        {priorityItems.map((product) => (
          <ProductCardOptimized 
            key={product.id} 
            product={product} 
            priority={true}
          />
        ))}
        
        {/* Normal items with lazy loading */}
        {normalItems.map((product) => (
          <ProductCardOptimized 
            key={product.id} 
            product={product} 
            priority={false}
          />
        ))}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-muted">Načítavam viac produktov...</span>
          </div>
        </div>
      )}

      {/* Load more button as fallback */}
      {!isLoading && currentPage * itemsPerPage < products.length && (
        <div className="text-center py-8">
          <button
            onClick={loadMoreProducts}
            className="btn btn-outline"
            disabled={isLoading}
          >
            Načítať viac produktov
          </button>
        </div>
      )}

      {/* End of results */}
      {currentPage * itemsPerPage >= products.length && products.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted">Zobrazili ste všetky produkty</p>
        </div>
      )}
    </div>
  )
}