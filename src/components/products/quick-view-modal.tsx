'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Product } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { WishlistButton } from '@/components/wishlist/wishlist-button'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/lib/utils'
import { 
  Star, 
  Eye, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Truck, 
  Shield, 
  RotateCcw,
  Info,
  Share2
} from 'lucide-react'

interface QuickViewModalProps {
  product: Product
  children: React.ReactNode
}

export function QuickViewModal({ product, children }: QuickViewModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isAdding, setIsAdding] = useState(false)
  
  const { addItem, getItem } = useCartStore()
  const cartItem = getItem(product.id)

  const handleAddToCart = async () => {
    if (isAdding) return
    
    setIsAdding(true)
    
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
    
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Rýchly náhľad produktu</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative bg-surface rounded-lg overflow-hidden">
              <Image
                src={product.images[selectedImage] || '/images/placeholder-product.svg'}
                alt={product.name}
                fill
                className="object-cover"
              />
              
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <WishlistButton 
                  product={product} 
                  variant="icon" 
                  size="sm"
                />
                <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm">
                  <Share2 className="w-4 h-4 text-charcoal" />
                </button>
              </div>
            </div>
            
            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.slice(0, 5).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={image || '/images/placeholder-product.jpg'}
                      alt={`${product.name} ${index + 1}`}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="space-y-4">
            <div>
              <Badge variant="outline" className="mb-2">
                {product.category}
              </Badge>
              <h2 className="text-2xl font-bold text-charcoal mb-2">
                {product.name}
              </h2>
              
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${
                      i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`} />
                  ))}
                </div>
                <span className="text-sm text-muted">(4.8) • 24 recenzií</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(product.price, product.currency)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-muted line-through">
                  {formatPrice(product.originalPrice, product.currency)}
                </span>
              )}
              {product.originalPrice && (
                <Badge className="bg-red-500 text-white">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </Badge>
              )}
            </div>
            
            <p className="text-muted leading-relaxed">
              {product.description}
            </p>
            
            {/* Age Range */}
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted">Vhodné pre vek:</span>
              <Badge variant="secondary">
                {product.ageMin}-{product.ageMax} mesiacov
              </Badge>
            </div>
            
            {/* Quantity Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Množstvo:</span>
                <div className="flex items-center bg-surface rounded-lg">
                  <button
                    onClick={decrementQuantity}
                    className="p-2 hover:bg-cream-white rounded-l-lg transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium min-w-[50px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="p-2 hover:bg-cream-white rounded-r-lg transition-colors"
                    disabled={quantity >= 10}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {product.stockStatus === 'In Stock' && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  ✓ Skladom
                </Badge>
              )}
            </div>
            
            {/* Add to Cart */}
            <Button
              onClick={handleAddToCart}
              disabled={product.stockStatus === 'Out of Stock' || isAdding}
              className="w-full h-12 text-lg"
            >
              {isAdding ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Pridávam...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>
                    {product.stockStatus === 'Out of Stock' ? 'Vypredané' : 'Pridať do košíka'}
                  </span>
                </div>
              )}
            </Button>
            
            {cartItem && (
              <div className="text-center">
                <Badge variant="secondary">
                  {cartItem.quantity}x už v košíku
                </Badge>
              </div>
            )}
            
            {/* Features */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-cream-white">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="w-4 h-4 text-primary" />
                <span>Doprava 2-3 dni</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-primary" />
                <span>2 roky záruka</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <RotateCcw className="w-4 h-4 text-primary" />
                <span>30 dní na vrátenie</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Eye className="w-4 h-4 text-primary" />
                <span>Detailný náhľad</span>
              </div>
            </div>
            
            {/* View Full Details */}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setIsOpen(false)
                window.location.href = `/sk/produkty/${product.id}`
              }}
            >
              Zobraziť všetky detaily
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}