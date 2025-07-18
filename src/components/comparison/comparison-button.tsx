'use client'

import { useState } from 'react'
import { useComparisonStore } from '@/stores/comparison'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Product } from '@/lib/types'
import { Scale, Check, Plus, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ComparisonButtonProps {
  product: Product
  variant?: 'default' | 'icon' | 'compact'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ComparisonButton({ 
  product, 
  variant = 'default', 
  size = 'md',
  className = ''
}: ComparisonButtonProps) {
  const { addItem, removeItem, isInComparison, isFull, canAdd } = useComparisonStore()
  const [isLoading, setIsLoading] = useState(false)
  
  const inComparison = isInComparison(product.id)
  const canAddProduct = canAdd() || inComparison
  
  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isLoading) return
    
    setIsLoading(true)
    
    try {
      if (inComparison) {
        removeItem(product.id)
      } else if (canAddProduct) {
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
        disabled={isLoading || (!canAddProduct && !inComparison)}
        className={cn(
          'w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm',
          size === 'sm' && 'w-8 h-8',
          size === 'lg' && 'w-12 h-12',
          (!canAddProduct && !inComparison) && 'opacity-50 cursor-not-allowed',
          className
        )}
        title={inComparison ? 'Odstrániť z porovnania' : 'Pridať do porovnania'}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        ) : inComparison ? (
          <Check className={cn(
            'w-5 h-5 text-green-500',
            size === 'sm' && 'w-4 h-4',
            size === 'lg' && 'w-6 h-6'
          )} />
        ) : !canAddProduct ? (
          <AlertCircle className={cn(
            'w-5 h-5 text-orange-500',
            size === 'sm' && 'w-4 h-4',
            size === 'lg' && 'w-6 h-6'
          )} />
        ) : (
          <Scale className={cn(
            'w-5 h-5 text-charcoal',
            size === 'sm' && 'w-4 h-4',
            size === 'lg' && 'w-6 h-6'
          )} />
        )}
      </button>
    )
  }
  
  if (variant === 'compact') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        disabled={isLoading || (!canAddProduct && !inComparison)}
        className={cn('p-2', className)}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        ) : inComparison ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : !canAddProduct ? (
          <AlertCircle className="w-4 h-4 text-orange-500" />
        ) : (
          <Scale className="w-4 h-4 text-charcoal" />
        )}
      </Button>
    )
  }
  
  return (
    <Button
      variant={inComparison ? 'secondary' : 'outline'}
      size={size}
      onClick={handleToggle}
      disabled={isLoading || (!canAddProduct && !inComparison)}
      className={cn(
        'flex items-center gap-2',
        (!canAddProduct && !inComparison) && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      ) : inComparison ? (
        <>
          <Check className="w-4 h-4 text-green-500" />
          V porovnaní
        </>
      ) : !canAddProduct ? (
        <>
          <AlertCircle className="w-4 h-4 text-orange-500" />
          Porovnanie plné
        </>
      ) : (
        <>
          <Scale className="w-4 h-4" />
          Porovnať
        </>
      )}
    </Button>
  )
}