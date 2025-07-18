'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/stores/cart'

export function CartBadge() {
  const { items } = useCartStore()
  const [itemCount, setItemCount] = useState(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      const count = items.reduce((total, item) => total + item.quantity, 0)
      setItemCount(count)
    }
  }, [items, isClient])

  if (!isClient || itemCount === 0) {
    return null
  }

  return (
    <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
      {itemCount}
    </span>
  )
}