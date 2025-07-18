'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { NewsletterSignup } from './newsletter-signup'
import { X, AlertCircle, Gift, Clock, ArrowLeft } from 'lucide-react'

interface NewsletterExitIntentProps {
  enabled?: boolean
  title?: string
  description?: string
  offerDiscount?: boolean
  className?: string
}

export function NewsletterExitIntent({ 
  enabled = true,
  title = "Počkajte! Nenechajte si ujsť naše ponuky",
  description = "Prihláste sa k odberu newsletteru a dostanete exkluzívne zľavy a novinky o Montessori produktoch.",
  offerDiscount = true,
  className = ''
}: NewsletterExitIntentProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)

  useEffect(() => {
    if (!enabled) return

    // Check if user has already seen exit intent
    const hasSeenExitIntent = localStorage.getItem('newsletter-exit-intent-seen')
    if (hasSeenExitIntent) {
      setHasTriggered(true)
      return
    }

    let isExiting = false

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves from the top of the page
      if (e.clientY <= 0 && !isExiting && !hasTriggered) {
        isExiting = true
        setIsOpen(true)
        setHasTriggered(true)
        localStorage.setItem('newsletter-exit-intent-seen', 'true')
      }
    }

    const handleMouseEnter = () => {
      isExiting = false
    }

    // Add a small delay to prevent accidental triggers
    const addListeners = () => {
      document.addEventListener('mouseleave', handleMouseLeave)
      document.addEventListener('mouseenter', handleMouseEnter)
    }

    const timer = setTimeout(addListeners, 5000) // Wait 5 seconds before enabling

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [enabled, hasTriggered])

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleSuccess = () => {
    // Auto-close after successful signup
    setTimeout(() => {
      setIsOpen(false)
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className={`max-w-2xl p-0 ${className}`}>
        <div className="relative">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          {/* Header with animation */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="animate-bounce">
                <AlertCircle className="w-8 h-8" />
              </div>
              <span className="text-lg font-bold">Počkajte!</span>
            </div>
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-white/90 text-sm">{description}</p>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              {offerDiscount && (
                <div className="mb-4">
                  <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full">
                    <Gift className="w-4 h-4" />
                    <span className="font-medium">Exkluzívna 15% zľava</span>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4 text-sm text-muted">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Iba pre nových odberateľov</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Gift className="w-4 h-4" />
                    <span>Okamžité doručenie kódu</span>
                  </div>
                </div>
                
                <div className="max-w-md mx-auto">
                  <NewsletterSignup
                    variant="popup"
                    title={offerDiscount ? "Získajte 15% zľavu" : "Prihlásiť sa k odberu"}
                    description={offerDiscount ? "Zadajte email a dostanete zľavový kód SAVE15" : "Nenechajte si ujsť naše novinky"}
                    showDiscount={offerDiscount}
                  />
                </div>
              </div>
            </div>
            
            {/* Benefits */}
            <div className="border-t pt-6">
              <h3 className="text-center font-medium text-charcoal mb-4">
                Čo dostanete v newsletteri:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Gift className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-medium text-sm">Exkluzívne zľavy</h4>
                  <p className="text-xs text-muted">Až do 30% na vybrané produkty</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <AlertCircle className="w-6 h-6 text-secondary" />
                  </div>
                  <h4 className="font-medium text-sm">Prvé informácie</h4>
                  <p className="text-xs text-muted">O nových produktoch a kolekciách</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-6 h-6 text-accent" />
                  </div>
                  <h4 className="font-medium text-sm">Rady a tipy</h4>
                  <p className="text-xs text-muted">Pre výchovu podľa Montessori</p>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="text-center mt-6 pt-4 border-t">
              <div className="flex items-center justify-center gap-2 text-sm text-muted mb-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Alebo sa vráťte k nákupu</span>
              </div>
              <button
                onClick={handleClose}
                className="text-sm text-muted hover:text-charcoal transition-colors underline"
              >
                Pokračovať bez prihlásenia
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}