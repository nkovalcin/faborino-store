'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/stores/cart'

export function CheckoutForm() {
  const router = useRouter()
  const { clearCart } = useCartStore()
  
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Handle order creation without Stripe
      // This would process Revolut, Bank Transfer, or COD payment
      setMessage('Objednávka bola úspešne vytvorená!')
      clearCart()
      router.push('/checkout/success')
    } catch (error) {
      console.error('Error processing payment:', error)
      setMessage('Nastala chyba pri spracovaní objednávky.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Celé meno
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        />
      </div>

      {message && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">{message}</p>
        </div>
      )}

      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-amber-600 hover:bg-amber-700 text-white"
      >
        {isLoading ? 'Spracovávam...' : 'Dokončiť objednávku'}
      </Button>
    </form>
  )
}