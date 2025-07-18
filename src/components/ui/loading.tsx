'use client'

import { Loader2, Package, ShoppingCart } from 'lucide-react'

interface LoadingProps {
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton'
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export function Loading({ 
  variant = 'spinner', 
  size = 'md', 
  text = 'Načítavam...',
  className = ''
}: LoadingProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  if (variant === 'spinner') {
    return (
      <div className={`flex items-center justify-center gap-2 ${className}`}>
        <Loader2 className={`${sizes[size]} animate-spin text-primary`} />
        {text && <span className={`text-muted ${textSizes[size]}`}>{text}</span>}
      </div>
    )
  }

  if (variant === 'dots') {
    return (
      <div className={`flex items-center justify-center gap-2 ${className}`}>
        <div className="flex gap-1">
          <div className={`${sizes[size]} bg-primary rounded-full animate-bounce`} style={{ animationDelay: '0ms' }} />
          <div className={`${sizes[size]} bg-primary rounded-full animate-bounce`} style={{ animationDelay: '150ms' }} />
          <div className={`${sizes[size]} bg-primary rounded-full animate-bounce`} style={{ animationDelay: '300ms' }} />
        </div>
        {text && <span className={`text-muted ${textSizes[size]}`}>{text}</span>}
      </div>
    )
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex items-center justify-center gap-2 ${className}`}>
        <div className={`${sizes[size]} bg-primary rounded-full animate-pulse`} />
        {text && <span className={`text-muted ${textSizes[size]} animate-pulse`}>{text}</span>}
      </div>
    )
  }

  if (variant === 'skeleton') {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export function ProductCardSkeleton() {
  return (
    <div className="product-card animate-pulse">
      <div className="aspect-product bg-gray-200 rounded-t-card"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
            <Package className="w-8 h-8 text-white animate-pulse" />
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-lg font-medium text-charcoal">Načítavam...</span>
        </div>
        <p className="text-muted text-sm">Pripravujeme obsah pre vás</p>
      </div>
    </div>
  )
}

export function CartLoader() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <ShoppingCart className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
        <Loading variant="dots" text="Aktualizujem košík..." />
      </div>
    </div>
  )
}