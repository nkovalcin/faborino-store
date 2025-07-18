'use client'

import { useState } from 'react'
import { useComparisonStore } from '@/stores/comparison'
import { useCartStore } from '@/stores/cart'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/lib/utils'
import { 
  X, 
  ShoppingCart, 
  Star, 
  Plus, 
  Minus, 
  Check, 
  AlertCircle,
  Scale,
  Info
} from 'lucide-react'

interface ComparisonModalProps {
  children: React.ReactNode
}

export function ComparisonModal({ children }: ComparisonModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { items, removeItem, clearComparison, getItemCount } = useComparisonStore()
  const { addItem } = useCartStore()
  
  const handleAddToCart = (product: any) => {
    addItem(product)
  }
  
  const comparisonFeatures = [
    'Názov produktu',
    'Cena',
    'Hodnotenie',
    'Vek',
    'Kategória',
    'Materiál',
    'Rozmery',
    'Hmotnosť',
    'Bezpečnostné certifikáty',
    'Skladom',
    'Záruka'
  ]
  
  if (items.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5" />
              Porovnanie produktov
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center py-12">
            <Scale className="w-16 h-16 text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-charcoal mb-2">
              Žiadne produkty na porovnanie
            </h3>
            <p className="text-muted mb-6">
              Pridajte produkty do porovnania a vráťte sa sem
            </p>
            <Button onClick={() => setIsOpen(false)}>
              Pokračovať v nákupe
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5" />
              Porovnanie produktov ({getItemCount()})
            </DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={clearComparison}
              className="text-red-600 hover:text-red-700"
            >
              Vymazať všetko
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Product Images and Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((product) => (
              <Card key={product.id} className="relative">
                <button
                  onClick={() => removeItem(product.id)}
                  className="absolute top-2 right-2 z-10 w-6 h-6 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 shadow-sm"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
                
                <CardContent className="p-4">
                  <div className="aspect-square relative mb-4 bg-surface rounded-lg overflow-hidden">
                    <img
                      src={product.images[0] || '/images/placeholder-product.svg'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm text-charcoal line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-primary">
                        {formatPrice(product.price, product.currency)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted line-through">
                          {formatPrice(product.originalPrice, product.currency)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${
                            i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`} />
                        ))}
                      </div>
                      <span className="text-xs text-muted">(4.8)</span>
                    </div>
                    
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="w-full"
                      size="sm"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Pridať do košíka
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Separator />
          
          {/* Detailed Comparison Table */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-charcoal">
              Detailné porovnanie
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-3 bg-surface font-medium text-charcoal w-48">
                      Vlastnosť
                    </th>
                    {items.map((product) => (
                      <th key={product.id} className="text-left p-3 bg-surface font-medium text-charcoal min-w-48">
                        {product.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Price */}
                  <tr className="border-b border-cream-white">
                    <td className="p-3 font-medium text-charcoal">Cena</td>
                    {items.map((product) => (
                      <td key={product.id} className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-primary">
                            {formatPrice(product.price, product.currency)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted line-through">
                              {formatPrice(product.originalPrice, product.currency)}
                            </span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                  
                  {/* Rating */}
                  <tr className="border-b border-cream-white">
                    <td className="p-3 font-medium text-charcoal">Hodnotenie</td>
                    {items.map((product) => (
                      <td key={product.id} className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${
                                i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`} />
                            ))}
                          </div>
                          <span className="text-sm text-muted">(4.8)</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  
                  {/* Age Range */}
                  <tr className="border-b border-cream-white">
                    <td className="p-3 font-medium text-charcoal">Vek</td>
                    {items.map((product) => (
                      <td key={product.id} className="p-3">
                        <Badge variant="secondary">
                          {product.ageMin}-{product.ageMax} mesiacov
                        </Badge>
                      </td>
                    ))}
                  </tr>
                  
                  {/* Category */}
                  <tr className="border-b border-cream-white">
                    <td className="p-3 font-medium text-charcoal">Kategória</td>
                    {items.map((product) => (
                      <td key={product.id} className="p-3">
                        <Badge variant="outline">{product.category}</Badge>
                      </td>
                    ))}
                  </tr>
                  
                  {/* Materials */}
                  <tr className="border-b border-cream-white">
                    <td className="p-3 font-medium text-charcoal">Materiál</td>
                    {items.map((product) => (
                      <td key={product.id} className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {product.materials.map((material, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {material}
                            </Badge>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                  
                  {/* Dimensions */}
                  <tr className="border-b border-cream-white">
                    <td className="p-3 font-medium text-charcoal">Rozmery</td>
                    {items.map((product) => (
                      <td key={product.id} className="p-3">
                        <span className="text-sm">
                          {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} cm
                        </span>
                      </td>
                    ))}
                  </tr>
                  
                  {/* Weight */}
                  <tr className="border-b border-cream-white">
                    <td className="p-3 font-medium text-charcoal">Hmotnosť</td>
                    {items.map((product) => (
                      <td key={product.id} className="p-3">
                        <span className="text-sm">{product.weight} kg</span>
                      </td>
                    ))}
                  </tr>
                  
                  {/* Safety Certifications */}
                  <tr className="border-b border-cream-white">
                    <td className="p-3 font-medium text-charcoal">Bezpečnostné certifikáty</td>
                    {items.map((product) => (
                      <td key={product.id} className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {product.safetyCertifications.map((cert, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                  
                  {/* Stock Status */}
                  <tr className="border-b border-cream-white">
                    <td className="p-3 font-medium text-charcoal">Skladom</td>
                    {items.map((product) => (
                      <td key={product.id} className="p-3">
                        <Badge 
                          variant={product.stockStatus === 'In Stock' ? 'default' : 'secondary'}
                          className={product.stockStatus === 'In Stock' ? 'bg-green-500' : 'bg-red-500'}
                        >
                          {product.stockStatus === 'In Stock' ? 'Áno' : 'Nie'}
                        </Badge>
                      </td>
                    ))}
                  </tr>
                  
                  {/* Assembly Required */}
                  <tr className="border-b border-cream-white">
                    <td className="p-3 font-medium text-charcoal">Montáž</td>
                    {items.map((product) => (
                      <td key={product.id} className="p-3">
                        <span className="text-sm">
                          {product.assemblyRequired ? 'Potrebná' : 'Nepotrebná'}
                        </span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-cream-white">
            <div className="flex items-center gap-2 text-sm text-muted">
              <Info className="w-4 h-4" />
              <span>Maximálne môžete porovnať 4 produkty naraz</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Zavrieť
              </Button>
              <Button
                onClick={() => {
                  items.forEach(product => handleAddToCart(product))
                  setIsOpen(false)
                }}
                className="flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Pridať všetko do košíka
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}