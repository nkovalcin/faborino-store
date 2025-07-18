'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/stores/cart'
import { Product } from '@/lib/types'

interface AddToCartSectionProps {
  product: Product
}

export function AddToCartSection({ product }: AddToCartSectionProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCartStore()

  const handleAddToCart = () => {
    console.log('Add to cart clicked for:', product.name, 'quantity:', quantity)
    addItem(product, quantity)
    // Show success message or feedback
    alert(`${product.name} bol pridaný do košíka!`)
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, quantity + change)
    setQuantity(newQuantity)
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center border border-cream-white rounded-card">
          <button 
            onClick={() => handleQuantityChange(-1)}
            className="px-3 py-2 hover:bg-cream-white/50 transition-colors"
          >
            -
          </button>
          <span className="px-4 py-2 border-x border-cream-white">{quantity}</span>
          <button 
            onClick={() => handleQuantityChange(1)}
            className="px-3 py-2 hover:bg-cream-white/50 transition-colors"
          >
            +
          </button>
        </div>
        <Button size="lg" className="flex-1" onClick={handleAddToCart}>
          <ShoppingCart className="w-5 h-5 mr-2" />
          Pridať do košíka
        </Button>
      </div>
      
      <Button size="lg" variant="outline" className="w-full">
        Kúpiť teraz
      </Button>
    </div>
  )
}