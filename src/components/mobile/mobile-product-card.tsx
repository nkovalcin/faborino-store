'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/lib/types'
import { useCartStore } from '@/stores/cart'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Plus,
  Eye,
  Zap,
  Package
} from 'lucide-react'

interface MobileProductCardProps {
  product: Product
  variant?: 'default' | 'compact' | 'list'
}

export function MobileProductCard({ product, variant = 'default' }: MobileProductCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const { addItem, getItem } = useCartStore()

  const cartItem = getItem(product.id)
  const isInCart = cartItem && cartItem.quantity > 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isLoading) return
    
    setIsLoading(true)
    addItem(product)
    
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  if (variant === 'compact') {
    return (
      <Link href={`/sk/produkty/${product.id}`}>
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
          <div className="aspect-square relative">
            <Image
              src={product.images[0] || '/images/placeholder-product.svg'}
              alt={product.name}
              fill
              className="object-cover"
            />
            
            {/* Quick Actions */}
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              <button
                onClick={handleLike}
                className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'text-red-500 fill-red-500' : 'text-charcoal'}`} />
              </button>
            </div>

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.originalPrice && product.originalPrice > product.price && (
                <Badge className="bg-red-500 text-white text-xs">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </Badge>
              )}
              {product.stockStatus === 'Low Stock' && (
                <Badge variant="outline" className="bg-white/90 text-orange-600 border-orange-600 text-xs">
                  <Package className="w-3 h-3 mr-1" />
                  Posledné kusy
                </Badge>
              )}
            </div>
          </div>
          
          <CardContent className="p-3">
            <h3 className="font-medium text-sm text-charcoal mb-1 line-clamp-2">
              {product.name}
            </h3>
            
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${
                    i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`} />
                ))}
              </div>
              <span className="text-xs text-muted ml-1">(24)</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-primary">
                  {formatPrice(product.price, product.currency)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-muted line-through">
                    {formatPrice(product.originalPrice, product.currency)}
                  </span>
                )}
              </div>
              
              <Button
                size="sm"
                variant={isInCart ? "secondary" : "default"}
                onClick={handleAddToCart}
                disabled={isLoading || product.stockStatus === 'Out of Stock'}
                className="h-8 px-3"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isInCart ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  if (variant === 'list') {
    return (
      <Link href={`/sk/produkty/${product.id}`}>
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <div className="flex gap-3">
              <div className="w-20 h-20 relative bg-surface rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={product.images[0] || '/images/placeholder-product.svg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm text-charcoal mb-1 line-clamp-2">
                  {product.name}
                </h3>
                
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${
                        i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`} />
                    ))}
                  </div>
                  <span className="text-xs text-muted ml-1">(24)</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary text-sm">
                      {formatPrice(product.price, product.currency)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-muted line-through">
                        {formatPrice(product.originalPrice, product.currency)}
                      </span>
                    )}
                  </div>
                  
                  <Button
                    size="sm"
                    variant={isInCart ? "secondary" : "default"}
                    onClick={handleAddToCart}
                    disabled={isLoading || product.stockStatus === 'Out of Stock'}
                    className="h-7 px-2"
                  >
                    {isLoading ? (
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : isInCart ? (
                      <Eye className="w-3 h-3" />
                    ) : (
                      <Plus className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={`/sk/produkty/${product.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow group">
        <div className="aspect-square relative">
          <Image
            src={product.images[0] || '/images/placeholder-product.svg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button
              onClick={handleLike}
              className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-red-500' : 'text-charcoal'}`} />
            </button>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.originalPrice && product.originalPrice > product.price && (
              <Badge className="bg-red-500 text-white">
                <Zap className="w-3 h-3 mr-1" />
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </Badge>
            )}
            {product.stockStatus === 'Low Stock' && (
              <Badge variant="outline" className="bg-white/90 text-orange-600 border-orange-600">
                <Package className="w-3 h-3 mr-1" />
                Posledné kusy
              </Badge>
            )}
          </div>

          {/* Quick Add Button */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              onClick={handleAddToCart}
              disabled={isLoading || product.stockStatus === 'Out of Stock'}
              className="rounded-full w-12 h-12 p-0 shadow-lg"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isInCart ? (
                <Eye className="w-5 h-5" />
              ) : (
                <ShoppingCart className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="mb-2">
            <Badge variant="outline" className="text-xs mb-2">
              {product.category}
            </Badge>
            <h3 className="font-semibold text-charcoal mb-1 line-clamp-2">
              {product.name}
            </h3>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${
                  i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`} />
              ))}
            </div>
            <span className="text-sm text-muted">(24)</span>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-primary">
                {formatPrice(product.price, product.currency)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted line-through">
                  {formatPrice(product.originalPrice, product.currency)}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {product.ageMin}-{product.ageMax}m
            </Badge>
            
            <div className="flex items-center gap-2">
              {product.stockStatus === 'In Stock' && (
                <div className="flex items-center gap-1 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs">Skladom</span>
                </div>
              )}
              {product.stockStatus === 'Out of Stock' && (
                <div className="flex items-center gap-1 text-red-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-xs">Vypredané</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}