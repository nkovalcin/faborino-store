'use client'

import { useState } from 'react'
import { Product } from '@/lib/types'
import { ProductCard } from '@/components/products/product-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/lib/utils'
import { 
  ShoppingCart, 
  Plus, 
  Star, 
  TrendingUp, 
  Package, 
  ArrowRight,
  Check,
  Sparkles
} from 'lucide-react'

interface CrossSellProps {
  currentProduct: Product
  relatedProducts: Product[]
  className?: string
}

export function CrossSell({ currentProduct, relatedProducts, className = '' }: CrossSellProps) {
  const crossSellProducts = relatedProducts
    .filter(p => p.id !== currentProduct.id)
    .filter(p => p.category === currentProduct.category || p.subcategory === currentProduct.subcategory)
    .slice(0, 4)

  if (crossSellProducts.length === 0) return null

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h3 className="text-xl font-bold text-charcoal mb-2">
          Zákazníci si taktiež kúpili
        </h3>
        <p className="text-muted">
          Produkty, ktoré si často kupujú spolu s týmto produktom
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {crossSellProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

interface UpSellProps {
  currentProduct: Product
  upgrades: Product[]
  className?: string
}

export function UpSell({ currentProduct, upgrades, className = '' }: UpSellProps) {
  const [selectedUpgrade, setSelectedUpgrade] = useState<string | null>(null)
  const { addItem } = useCartStore()
  
  const handleUpgradeSelect = (product: Product) => {
    setSelectedUpgrade(product.id)
    addItem(product)
  }

  if (upgrades.length === 0) return null

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-bold text-charcoal">
            Vylepšenie produktu
          </h3>
        </div>
        <p className="text-muted">
          Prečo si nevybrať lepšiu variantu za trochu viac?
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {upgrades.map((upgrade) => {
          const priceDifference = upgrade.price - currentProduct.price
          const isSelected = selectedUpgrade === upgrade.id
          
          return (
            <Card key={upgrade.id} className={`relative overflow-hidden transition-all ${
              isSelected ? 'ring-2 ring-primary' : 'hover:shadow-md'
            }`}>
              {upgrade.originalPrice && upgrade.originalPrice > upgrade.price && (
                <div className="absolute top-2 right-2 z-10">
                  <Badge className="bg-red-500 text-white">
                    AKCIA
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">
                      {upgrade.name}
                    </CardTitle>
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${
                            i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`} />
                        ))}
                      </div>
                      <span className="text-xs text-muted">(4.8)</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      {formatPrice(upgrade.price, upgrade.currency)}
                    </div>
                    {upgrade.originalPrice && (
                      <div className="text-sm text-muted line-through">
                        {formatPrice(upgrade.originalPrice, upgrade.currency)}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-muted mb-4 line-clamp-3">
                  {upgrade.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">
                      {priceDifference > 0 ? '+' : ''}{formatPrice(priceDifference, upgrade.currency)} rozdiel
                    </span>
                  </div>
                  
                  {isSelected && (
                    <Badge variant="secondary" className="text-green-600">
                      <Check className="w-3 h-3 mr-1" />
                      Vybratý
                    </Badge>
                  )}
                </div>
                
                <Button
                  onClick={() => handleUpgradeSelect(upgrade)}
                  disabled={isSelected}
                  className="w-full"
                  variant={isSelected ? "secondary" : "default"}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Pridané do košíka
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Vybrať túto variantu
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

interface BundleDealsProps {
  currentProduct: Product
  bundles: {
    id: string
    name: string
    products: Product[]
    originalPrice: number
    bundlePrice: number
    savings: number
    description: string
  }[]
  className?: string
}

export function BundleDeals({ currentProduct, bundles, className = '' }: BundleDealsProps) {
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null)
  const { addItem } = useCartStore()
  
  const handleBundleSelect = (bundle: any) => {
    setSelectedBundle(bundle.id)
    bundle.products.forEach((product: Product) => {
      addItem(product)
    })
  }

  if (bundles.length === 0) return null

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Package className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-bold text-charcoal">
            Výhodné balíčky
          </h3>
        </div>
        <p className="text-muted">
          Ušetrite kúpou kompletného setu
        </p>
      </div>
      
      <div className="space-y-4">
        {bundles.map((bundle) => {
          const isSelected = selectedBundle === bundle.id
          const discountPercentage = Math.round((bundle.savings / bundle.originalPrice) * 100)
          
          return (
            <Card key={bundle.id} className={`relative overflow-hidden transition-all ${
              isSelected ? 'ring-2 ring-primary' : 'hover:shadow-md'
            }`}>
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-green-500 text-white">
                  -{discountPercentage}%
                </Badge>
              </div>
              
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-bold text-charcoal mb-2">
                      {bundle.name}
                    </h4>
                    <p className="text-muted mb-4">
                      {bundle.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="text-sm text-muted">Obsahuje:</div>
                      {bundle.products.map((product) => (
                        <div key={product.id} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{product.name}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-2xl font-bold text-primary">
                        {formatPrice(bundle.bundlePrice, 'EUR')}
                      </div>
                      <div className="text-lg text-muted line-through">
                        {formatPrice(bundle.originalPrice, 'EUR')}
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        Úspora {formatPrice(bundle.savings, 'EUR')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <Button
                      onClick={() => handleBundleSelect(bundle)}
                      disabled={isSelected}
                      size="lg"
                      className="w-full max-w-xs"
                      variant={isSelected ? "secondary" : "default"}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-5 h-5 mr-2" />
                          Pridané do košíka
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5 mr-2" />
                          Kúpiť balíček
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

interface FrequentlyBoughtTogetherProps {
  currentProduct: Product
  frequentlyBought: Product[]
  className?: string
}

export function FrequentlyBoughtTogether({ 
  currentProduct, 
  frequentlyBought, 
  className = '' 
}: FrequentlyBoughtTogetherProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([currentProduct.id])
  const { addItem } = useCartStore()
  
  const toggleProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }
  
  const allProducts = [currentProduct, ...frequentlyBought]
  const selectedItems = allProducts.filter(p => selectedProducts.includes(p.id))
  const totalPrice = selectedItems.reduce((sum, p) => sum + p.price, 0)
  
  const handleAddAllToCart = () => {
    selectedItems.forEach(product => {
      addItem(product)
    })
  }

  if (frequentlyBought.length === 0) return null

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Často kupované spolu
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {allProducts.map((product, index) => (
            <div key={product.id} className="flex items-center gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => toggleProduct(product.id)}
                  disabled={product.id === currentProduct.id}
                  className="w-4 h-4 text-primary"
                />
              </div>
              
              <div className="flex-1 flex items-center gap-3">
                <div className="w-12 h-12 bg-surface rounded-lg overflow-hidden">
                  <img 
                    src={product.images[0] || '/images/placeholder-product.svg'} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{product.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary">
                      {formatPrice(product.price, product.currency)}
                    </span>
                    {product.id === currentProduct.id && (
                      <Badge variant="secondary" className="text-xs">
                        Aktuálny
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {index < allProducts.length - 1 && (
                <Plus className="w-4 h-4 text-muted" />
              )}
            </div>
          ))}
        </div>
        
        <div className="border-t border-cream-white pt-4 mt-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-sm text-muted">Celková cena ({selectedItems.length} produktov):</span>
              <div className="text-xl font-bold text-primary">
                {formatPrice(totalPrice, 'EUR')}
              </div>
            </div>
            
            <Button 
              onClick={handleAddAllToCart}
              disabled={selectedItems.length === 0}
              className="flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Pridať všetko do košíka
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}