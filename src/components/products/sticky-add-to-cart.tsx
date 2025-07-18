'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, Plus, Minus, Heart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/stores/cart'
import { Product } from '@/lib/types'
import { formatPrice } from '@/lib/utils'

interface StickyAddToCartProps {
  product: Product
  averageRating?: number
  totalReviews?: number
}

export function StickyAddToCart({ 
  product, 
  averageRating = 4.8, 
  totalReviews = 0 
}: StickyAddToCartProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const { addItem, getItem } = useCartStore()

  const cartItem = getItem(product.id)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      
      // Show sticky bar when user scrolls past the first screen
      // and hide it when near the bottom (footer area)
      const showAt = windowHeight * 0.8
      const hideAt = documentHeight - windowHeight * 1.5
      
      setIsVisible(scrollY > showAt && scrollY < hideAt)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleAddToCart = async () => {
    if (isAdding) return
    
    setIsAdding(true)
    
    // Add items to cart
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
    
    // Show success feedback
    setTimeout(() => {
      setIsAdding(false)
      setQuantity(1)
    }, 500)
  }

  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, 10))
  }

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1))
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-cream-white shadow-lg md:hidden">
      <div className="container-responsive py-4">
        <div className="flex items-center gap-3">
          {/* Product Image */}
          <div className="w-12 h-12 bg-surface rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={product.images[0] || '/images/placeholder-product.svg'} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm text-charcoal truncate">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-bold text-primary">
                {formatPrice(product.price, product.currency)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-muted line-through">
                  {formatPrice(product.originalPrice, product.currency)}
                </span>
              )}
              {totalReviews > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-muted">
                    {averageRating} ({totalReviews})
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-surface rounded-lg">
              <button
                onClick={decrementQuantity}
                className="p-2 hover:bg-cream-white rounded-l-lg transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4 text-charcoal" />
              </button>
              <span className="px-3 py-2 text-sm font-medium min-w-[40px] text-center">
                {quantity}
              </span>
              <button
                onClick={incrementQuantity}
                className="p-2 hover:bg-cream-white rounded-r-lg transition-colors"
                disabled={quantity >= 10}
              >
                <Plus className="w-4 h-4 text-charcoal" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={product.stockStatus === 'Out of Stock' || isAdding}
              className="px-4 py-2 text-sm"
            >
              {isAdding ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Pridávam...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  <span>
                    {product.stockStatus === 'Out of Stock' ? 'Vypredané' : 'Do košíka'}
                  </span>
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Stock Status */}
        {product.stockStatus === 'In Stock' && (
          <div className="mt-2 text-center">
            <Badge variant="outline" className="text-xs">
              ✓ Skladom - expedícia do 24h
            </Badge>
          </div>
        )}
        
        {product.stockStatus === 'Out of Stock' && (
          <div className="mt-2 text-center">
            <Badge variant="outline" className="text-xs text-red-600">
              ⚠️ Momentálne vypredané
            </Badge>
          </div>
        )}

        {/* Cart Item Count */}
        {cartItem && (
          <div className="mt-2 text-center">
            <Badge variant="secondary" className="text-xs">
              {cartItem.quantity}x už v košíku
            </Badge>
          </div>
        )}
      </div>
    </div>
  )
}