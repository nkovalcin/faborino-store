'use client'

import React, { useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/stores/cart'

export function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const { clearCart } = useCartStore()
  
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
        receipt_email: email,
      },
    })

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message || 'Nastala chyba pri spracovaní platby')
      } else {
        setMessage('Nastala neočakávaná chyba')
      }
    } else {
      // Payment succeeded, clear cart
      clearCart()
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <div className="space-y-4">
        <h3 className="text-h4 font-semibold text-charcoal">
          Kontaktné údaje
        </h3>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="smart-input"
            placeholder="vas@email.com"
          />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-2">
            Meno a priezvisko *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="smart-input"
            placeholder="Vaše meno"
          />
        </div>
      </div>

      {/* Payment Element */}
      <div className="space-y-4">
        <h3 className="text-h4 font-semibold text-charcoal">
          Platobné informácie
        </h3>
        
        <div className="p-4 border border-cream-white rounded-card bg-cream-white/50">
          <PaymentElement />
        </div>
      </div>

      {/* Error Message */}
      {message && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-card">
          <p className="text-red-700 text-sm">{message}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="loading-spinner" />
            Spracováva sa...
          </div>
        ) : (
          'Dokončiť objednávku'
        )}
      </Button>

      {/* Terms */}
      <div className="text-sm text-muted text-center">
        <p>
          Pokračovaním súhlasíte s našimi{' '}
          <a href="/obchodne-podmienky" className="text-primary hover:underline">
            obchodnými podmienkami
          </a>{' '}
          a{' '}
          <a href="/ochrana-sukromia" className="text-primary hover:underline">
            ochranou súkromia
          </a>
        </p>
      </div>
    </form>
  )
}