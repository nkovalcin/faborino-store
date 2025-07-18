'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/lib/utils'

export function CartSidebar() {
  const { 
    items, 
    isOpen, 
    setCartOpen, 
    updateQuantity, 
    removeItem
  } = useCartStore()
  
  const [totalAmount, setTotalAmount] = useState(0)
  const [itemCount, setItemCount] = useState(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      const total = items.reduce((sum, item) => sum + item.total, 0)
      const count = items.reduce((sum, item) => sum + item.quantity, 0)
      setTotalAmount(total)
      setItemCount(count)
    }
  }, [items, isClient])

  const handleClose = () => setCartOpen(false)

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity animate-fade-in"
        onClick={handleClose}
      />

      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-surface shadow-2xl z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cream-white">
          <h2 className="text-h3 font-semibold text-charcoal">
            Košík ({itemCount})
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-primary/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-muted mx-auto mb-4" />
              <h3 className="text-h4 font-medium text-charcoal mb-2">
                Váš košík je prázdny
              </h3>
              <p className="text-muted mb-6">
                Pridajte produkty do košíka a pokračujte v nákupe
              </p>
              <Button onClick={handleClose} asChild>
                <Link href="/sk/produkty">
                  Pokračovať v nákupe
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-cream-white/50 rounded-card">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={item.product.images[0] || '/images/placeholder-product.svg'}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-card"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-charcoal text-sm line-clamp-2 mb-1">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-muted mb-2">
                      {item.product.category}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border border-cream-white flex items-center justify-center hover:bg-primary/10"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border border-cream-white flex items-center justify-center hover:bg-primary/10"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-charcoal">
                          {formatPrice(item.total, item.product.currency)}
                        </span>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-1 hover:bg-red-100 rounded-full text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-cream-white p-6 space-y-4">
            {/* Subtotal */}
            <div className="flex justify-between items-center">
              <span className="text-charcoal">Medzisúčet:</span>
              <span className="font-semibold text-charcoal">
                {formatPrice(totalAmount, 'EUR')}
              </span>
            </div>
            
            {/* Shipping Info */}
            <div className="text-sm text-muted">
              {totalAmount >= 100 ? (
                <div className="flex items-center gap-2 text-green-600">
                  <span>✓ Bezplatná doprava</span>
                </div>
              ) : (
                <div>
                  Pridajte ešte {formatPrice(100 - totalAmount, 'EUR')} pre bezplatnú dopravu
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {totalAmount < 100 && (
              <div className="w-full bg-cream-white rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((totalAmount / 100) * 100, 100)}%` }}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleClose}
                asChild
              >
                <Link href="/sk/kosik">
                  Zobraziť košík
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                size="lg"
                onClick={handleClose}
                asChild
              >
                <Link href="/sk/checkout">
                  Pokračovať k pokladni
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}