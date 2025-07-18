'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useCartStore } from '@/stores/cart'
import { WishlistButton } from '@/components/wishlist/wishlist-button'
import { QuickViewModal } from '@/components/products/quick-view-modal'
import { ComparisonButton } from '@/components/comparison/comparison-button'
import { Product } from '@/lib/types'
import { formatPrice, getAgeRangeLabel, calculateDiscountPercentage } from '@/lib/utils'
import { getMockReviewsForProduct, getReviewStats } from '@/lib/mock-reviews'

interface ProductCardProps {
  product: Product
  showAddToCart?: boolean
  showWishlist?: boolean
}

export function ProductCard({ product, showAddToCart = true, showWishlist = true }: ProductCardProps) {
  const { addItem } = useCartStore()
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Adding to cart:', product.name)
    addItem(product)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: Implement wishlist functionality
  }

  const discountPercentage = product.originalPrice 
    ? calculateDiscountPercentage(product.originalPrice, product.price)
    : 0

  const ageLabel = getAgeRangeLabel(product.ageMin, product.ageMax)
  
  const reviews = getMockReviewsForProduct(product.id)
  const reviewStats = getReviewStats(reviews)

  return (
    <Card 
      className="product-card group relative" 
      role="article"
      aria-label={`Produkt: ${product.name}`}
    >
      <Link 
        href={`/sk/produkty/${product.id}`} 
        className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-card"
        aria-label={`Zobraziť detaily produktu ${product.name}`}
      >
        <div className="aspect-product relative overflow-hidden bg-cream-white">
          {/* Product Image */}
          <Image
            src={product.images[0] || '/images/placeholder-product.svg'}
            alt={`Obrázok produktu ${product.name}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2" role="img" aria-label="Značky produktu">
            {discountPercentage > 0 && (
              <span className="discount-badge" aria-label={`Zľava ${discountPercentage} percent`}>
                -{discountPercentage}%
              </span>
            )}
            {product.stockStatus === 'Out of Stock' && (
              <span 
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                aria-label="Produkt je vypredaný"
              >
                Vypredané
              </span>
            )}
          </div>
          
          {/* Age badge */}
          <div className="absolute top-4 right-4 z-10">
            <span className="age-badge" aria-label={`Vhodné pre vek ${ageLabel}`}>
              {ageLabel}
            </span>
          </div>
          
          {/* Action buttons */}
          <div 
            className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            role="toolbar"
            aria-label="Akcie pre produkt"
          >
            {showWishlist && (
              <WishlistButton product={product} variant="icon" size="sm" />
            )}
            <ComparisonButton product={product} variant="icon" size="sm" />
            <QuickViewModal product={product}>
              <button
                className="p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                title="Rýchly náhľad"
                aria-label={`Rýchly náhľad produktu ${product.name}`}
              >
                <Eye className="w-4 h-4 text-charcoal" />
              </button>
            </QuickViewModal>
          </div>
        </div>
        
        {/* Product Info */}
        <div className="p-4">
          <div className="mb-2">
            <span className="text-xs text-muted uppercase tracking-wide">
              {product.category}
            </span>
          </div>
          
          <h3 className="font-semibold text-charcoal mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <p className="text-sm text-muted line-clamp-2 mb-3">
            {product.description}
          </p>
          
          {/* Safety certifications */}
          {product.safetyCertifications.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.safetyCertifications.slice(0, 2).map((cert, index) => (
                <span key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {cert}
                </span>
              ))}
            </div>
          )}
          
          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="price-display">
                {formatPrice(product.price, product.currency)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="price-original">
                  {formatPrice(product.originalPrice, product.currency)}
                </span>
              )}
            </div>
            
            {/* Rating */}
            {reviewStats.total > 0 && (
              <div className="flex items-center gap-1" role="img" aria-label={`Hodnotenie ${reviewStats.average} z 5 hviezd, ${reviewStats.total} hodnotení`}>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                <span className="text-sm text-muted">
                  {reviewStats.average} ({reviewStats.total})
                </span>
              </div>
            )}
          </div>
          
          {/* Add to Cart Button */}
          {showAddToCart && (
            <Button 
              onClick={handleAddToCart}
              className="w-full"
              variant="primary"
              disabled={product.stockStatus === 'Out of Stock'}
              aria-label={product.stockStatus === 'Out of Stock' ? 'Produkt je vypredaný' : `Pridať ${product.name} do košíka`}
            >
              <ShoppingCart className="w-4 h-4 mr-2" aria-hidden="true" />
              {product.stockStatus === 'Out of Stock' ? 'Vypredané' : 'Do košíka'}
            </Button>
          )}
        </div>
      </Link>
    </Card>
  )
}