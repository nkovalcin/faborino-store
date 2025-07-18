'use client'

import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCartStore } from '@/stores/cart'
import { formatPrice, calculateShipping } from '@/lib/utils'

export function OrderSummary() {
  const { items, getTotalAmount } = useCartStore()
  const totalAmount = getTotalAmount()
  
  const shipping = calculateShipping(items)
  const tax = totalAmount * 0.2
  const finalTotal = totalAmount + shipping.cost + tax

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle>Súhrn objednávky</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={item.product.images[0] || '/images/placeholder-product.svg'}
                  alt={item.product.name}
                  fill
                  className="object-cover rounded-card"
                />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-medium">
                  {item.quantity}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-charcoal text-sm line-clamp-2">
                  {item.product.name}
                </h4>
                <p className="text-xs text-muted">
                  {item.product.category}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-medium">
                    {formatPrice(item.total, item.product.currency)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-cream-white pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Medzisúčet:</span>
            <span>{formatPrice(totalAmount, 'EUR')}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Doprava:</span>
            <span>
              {shipping.cost === 0 ? 'Zadarmo' : formatPrice(shipping.cost, 'EUR')}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>DPH (20%):</span>
            <span>{formatPrice(tax, 'EUR')}</span>
          </div>
        </div>

        <div className="border-t border-cream-white pt-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>Celkom:</span>
            <span>{formatPrice(finalTotal, 'EUR')}</span>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="bg-cream-white/50 p-4 rounded-card">
          <h4 className="font-medium text-charcoal text-sm mb-2">
            Informácie o doprave
          </h4>
          <div className="space-y-1 text-sm text-muted">
            <p>• Doba doručenia: {shipping.estimatedDays} pracovné dni</p>
            <p>• Doprava kurierom</p>
            <p>• Platba pri prevzatí možná</p>
            {shipping.cost === 0 && (
              <p className="text-green-600 font-medium">• Bezplatná doprava!</p>
            )}
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-green-50 p-4 rounded-card">
          <h4 className="font-medium text-green-800 text-sm mb-2">
            Bezpečná platba
          </h4>
          <div className="space-y-1 text-sm text-green-700">
            <p>• 256-bit SSL šifrovanie</p>
            <p>• Spracované cez Stripe</p>
            <p>• Žiadne údaje o karte sa neukladajú</p>
            <p>• 30-dňová záruka vrátenia peňazí</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}