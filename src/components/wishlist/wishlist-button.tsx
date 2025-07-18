'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWishlistStore } from '@/stores/wishlist'
import { Product } from '@/lib/types'
import { cn } from '@/lib/utils'

interface WishlistButtonProps {
  product: Product
  variant?: 'default' | 'icon' | 'compact'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function WishlistButton({ 
  product, 
  variant = 'default', 
  size = 'md',
  className = ''
}: WishlistButtonProps) {
  const { addItem, removeItem, isInWishlist } = useWishlistStore()
  const [isLoading, setIsLoading] = useState(false)
  
  const inWishlist = isInWishlist(product.id)
  
  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isLoading) return
    
    setIsLoading(true)
    
    try {
      if (inWishlist) {
        removeItem(product.id)
      } else {
        addItem(product)
      }
    } finally {
      setTimeout(() => setIsLoading(false), 300)
    }
  }
  
  if (variant === 'icon') {
    return (
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={cn(
          'w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm',
          size === 'sm' && 'w-8 h-8',
          size === 'lg' && 'w-12 h-12',
          className
        )}
      >
        <Heart 
          className={cn(
            'w-5 h-5 transition-colors',
            size === 'sm' && 'w-4 h-4',
            size === 'lg' && 'w-6 h-6',
            inWishlist ? 'text-red-500 fill-red-500' : 'text-charcoal',
            isLoading && 'animate-pulse'
          )} 
        />
      </button>
    )
  }
  
  if (variant === 'compact') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        disabled={isLoading}
        className={cn('p-2', className)}
      >
        <Heart 
          className={cn(
            'w-4 h-4 transition-colors',
            inWishlist ? 'text-red-500 fill-red-500' : 'text-muted',
            isLoading && 'animate-pulse'
          )} 
        />
      </Button>
    )
  }
  
  return (
    <Button
      variant={inWishlist ? 'secondary' : 'outline'}
      size={size}
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        'flex items-center gap-2',
        className
      )}
    >
      <Heart 
        className={cn(
          'w-4 h-4 transition-colors',
          inWishlist ? 'text-red-500 fill-red-500' : 'text-charcoal',
          isLoading && 'animate-pulse'
        )} 
      />
      {inWishlist ? 'V obľúbených' : 'Pridať do obľúbených'}
    </Button>
  )
}