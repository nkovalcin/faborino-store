'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCartStore } from '@/stores/cart'
import { formatPrice, calculateShipping } from '@/lib/utils'

export default function CartPage() {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    getTotalAmount, 
    getItemCount,
    clearCart 
  } = useCartStore()
  
  const totalAmount = getTotalAmount()
  const itemCount = getItemCount()

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const shipping = calculateShipping(items)
  const finalTotal = totalAmount + shipping.cost

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-responsive py-8">
          {/* Breadcrumb */}
          <nav className="breadcrumb mb-8">
            <Link href="/" className="breadcrumb-item">Domov</Link>
            <ChevronRight className="w-4 h-4 breadcrumb-separator" />
            <span className="text-muted">Košík</span>
          </nav>

          {/* Empty Cart */}
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 text-muted mx-auto mb-6" />
            <h1 className="text-h1 font-bold text-charcoal mb-4">
              Váš košík je prázdny
            </h1>
            <p className="text-muted text-lg mb-8 max-w-md mx-auto">
              Vyzerá to, že ste ešte nepridali žiadne produkty do košíka. 
              Prečítajte si našu ponuku a nájdite niečo pre vaše dieťa.
            </p>
            <Button size="lg" asChild>
              <Link href="/produkty">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Pokračovať v nákupe
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container-responsive py-8">
        {/* Breadcrumb */}
        <nav className="breadcrumb mb-8">
          <Link href="/" className="breadcrumb-item">Domov</Link>
          <ChevronRight className="w-4 h-4 breadcrumb-separator" />
          <span className="text-muted">Košík</span>
        </nav>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-h1 font-bold text-charcoal">
            Nákupný košík ({itemCount})
          </h1>
          <Button 
            variant="ghost" 
            onClick={clearCart}
            className="text-red-600 hover:text-red-700"
          >
            Vymazať všetko
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={item.product.images[0] || '/images/placeholder-product.jpg'}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-card"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-charcoal text-lg mb-1">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-muted">
                            {item.product.category} • SKU: {item.product.sku}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-2 hover:bg-red-100 rounded-full text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                            className="w-10 h-10 rounded-card border border-cream-white flex items-center justify-center hover:bg-primary/10"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                            className="w-10 h-10 rounded-card border border-cream-white flex items-center justify-center hover:bg-primary/10"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-semibold text-charcoal text-lg">
                            {formatPrice(item.total, item.product.currency)}
                          </div>
                          <div className="text-sm text-muted">
                            {formatPrice(item.price, item.product.currency)} za kus
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Continue Shopping */}
            <div className="pt-4">
              <Button variant="outline" asChild>
                <Link href="/produkty">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Pokračovať v nákupe
                </Link>
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Súhrn objednávky</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Medzisúčet:</span>
                  <span className="font-medium">
                    {formatPrice(totalAmount, 'EUR')}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Doprava:</span>
                  <span className="font-medium">
                    {shipping.cost === 0 ? 'Zadarmo' : formatPrice(shipping.cost, 'EUR')}
                  </span>
                </div>
                
                {shipping.cost === 0 && totalAmount >= 100 && (
                  <div className="text-sm text-green-600 bg-green-50 p-3 rounded-card">
                    ✓ Bezplatná doprava od 100€
                  </div>
                )}
                
                {totalAmount < 100 && (
                  <div className="text-sm text-muted bg-cream-white p-3 rounded-card">
                    Pridajte ešte {formatPrice(100 - totalAmount, 'EUR')} pre bezplatnú dopravu
                  </div>
                )}
                
                <div className="border-t border-cream-white pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Celkom:</span>
                    <span>{formatPrice(finalTotal, 'EUR')}</span>
                  </div>
                  <p className="text-sm text-muted mt-1">
                    Včítane DPH
                  </p>
                </div>
                
                <div className="space-y-2 pt-4">
                  <Button className="w-full" size="lg" asChild>
                    <Link href="/checkout">
                      Pokračovať k pokladni
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" size="lg" asChild>
                    <Link href="/produkty">
                      Pokračovať v nákupe
                    </Link>
                  </Button>
                </div>
                
                {/* Security Badges */}
                <div className="border-t border-cream-white pt-4">
                  <div className="flex items-center justify-center gap-4 text-xs text-muted">
                    <span>🔒 Bezpečné platby</span>
                    <span>🚚 Rýchla doprava</span>
                    <span>↩️ Ľahké vrátenie</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}