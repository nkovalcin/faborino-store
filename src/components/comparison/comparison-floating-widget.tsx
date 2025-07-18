'use client'

import { useState } from 'react'
import { useComparisonStore } from '@/stores/comparison'
import { ComparisonModal } from './comparison-modal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Scale, X, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ComparisonFloatingWidget() {
  const { items, removeItem, clearComparison, getItemCount } = useComparisonStore()
  const [isMinimized, setIsMinimized] = useState(false)
  
  const itemCount = getItemCount()
  
  if (itemCount === 0) {
    return null
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className={cn(
        'bg-white rounded-lg shadow-lg border border-cream-white transition-all duration-300',
        isMinimized ? 'w-16 h-16' : 'w-full'
      )}>
        {isMinimized ? (
          <button
            onClick={() => setIsMinimized(false)}
            className="w-full h-full flex items-center justify-center relative"
          >
            <Scale className="w-6 h-6 text-primary" />
            <Badge className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 text-xs">
              {itemCount}
            </Badge>
          </button>
        ) : (
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-primary" />
                <span className="font-medium text-charcoal">Porovnanie</span>
                <Badge variant="secondary">{itemCount}</Badge>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Eye className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={clearComparison}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2 mb-3">
              {items.slice(0, 3).map((product) => (
                <div key={product.id} className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-surface rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={product.images[0] || '/images/placeholder-product.svg'} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm text-charcoal line-clamp-1 flex-1">
                    {product.name}
                  </span>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-3 h-3 text-gray-500" />
                  </button>
                </div>
              ))}
              
              {itemCount > 3 && (
                <div className="text-xs text-muted text-center">
                  +{itemCount - 3} ďalších produktov
                </div>
              )}
            </div>
            
            <ComparisonModal>
              <Button className="w-full" size="sm">
                <Scale className="w-4 h-4 mr-2" />
                Porovnať produkty
              </Button>
            </ComparisonModal>
          </div>
        )}
      </div>
    </div>
  )
}