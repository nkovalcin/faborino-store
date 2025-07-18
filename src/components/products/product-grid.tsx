'use client'

import React from 'react'
import { Product } from '@/lib/types'
import { ProductCard } from './product-card'

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  emptyMessage?: string
}

export function ProductGrid({ products, loading, emptyMessage = "Žiadne produkty sa nenašli." }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid-responsive">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-muted/20 rounded-full flex items-center justify-center">
          <span className="text-4xl opacity-50">📦</span>
        </div>
        <h3 className="text-h3 font-semibold text-charcoal mb-2">
          Žiadne produkty
        </h3>
        <p className="text-muted">
          {emptyMessage}
        </p>
      </div>
    )
  }

  return (
    <div className="grid-responsive">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

function ProductCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="aspect-product bg-muted/20 rounded-card mb-4" />
      <div className="space-y-3">
        <div className="h-4 bg-muted/20 rounded w-20" />
        <div className="h-5 bg-muted/20 rounded w-full" />
        <div className="h-4 bg-muted/20 rounded w-3/4" />
        <div className="h-4 bg-muted/20 rounded w-1/2" />
        <div className="h-10 bg-muted/20 rounded w-full" />
      </div>
    </div>
  )
}