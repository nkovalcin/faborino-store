'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { NewsletterSignup } from './newsletter-signup'
import { X, Gift, Sparkles } from 'lucide-react'

interface NewsletterPopupProps {
  delay?: number // Delay in milliseconds before showing popup
  showAfterScroll?: boolean // Show after user scrolls
  showOnExit?: boolean // Show when user tries to leave
  className?: string
}

export function NewsletterPopup({ 
  delay = 10000, // Default 10 seconds
  showAfterScroll = false,
  showOnExit = false,
  className = ''
}: NewsletterPopupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    // Check if user has already seen the popup
    const hasSeenPopup = localStorage.getItem('newsletter-popup-seen')
    if (hasSeenPopup) {
      setHasShown(true)
      return
    }

    // Show after delay
    if (!showAfterScroll && !showOnExit) {
      const timer = setTimeout(() => {
        if (!hasShown) {
          setIsOpen(true)
          setHasShown(true)
          localStorage.setItem('newsletter-popup-seen', 'true')
        }
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [delay, showAfterScroll, showOnExit, hasShown])

  // Handle scroll-based popup
  useEffect(() => {
    if (!showAfterScroll || hasShown) return

    const handleScroll = () => {
      const scrolled = window.scrollY > window.innerHeight * 0.5
      if (scrolled && !hasScrolled) {
        setHasScrolled(true)
        setIsOpen(true)
        setHasShown(true)
        localStorage.setItem('newsletter-popup-seen', 'true')
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [showAfterScroll, hasShown, hasScrolled])

  // Handle exit intent
  useEffect(() => {
    if (!showOnExit || hasShown) return

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setIsOpen(true)
        setHasShown(true)
        localStorage.setItem('newsletter-popup-seen', 'true')
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [showOnExit, hasShown])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem('newsletter-popup-seen', 'true')
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className={`max-w-2xl ${className}`}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="sr-only">Newsletter prihlásenie</DialogTitle>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </DialogHeader>
        
        <div className="relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full -z-10" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/10 to-primary/10 rounded-full -z-10" />
          
          <div className="relative z-10">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <Sparkles className="w-6 h-6 text-accent animate-pulse" />
              </div>
              
              <h2 className="text-2xl font-bold text-charcoal mb-2">
                Získajte 10% zľavu na prvý nákup!
              </h2>
              <p className="text-muted">
                Prihláste sa k odberu newsletteru a dostanete exkluzívny zľavový kód plus najnovšie informácie o Montessori produktoch.
              </p>
            </div>
            
            <NewsletterSignup
              variant="popup"
              title="Získajte 10% zľavu"
              description="Prihláste sa k odberu a dostanete zľavový kód WELCOME10"
              showDiscount={true}
            />
            
            <div className="text-center mt-4">
              <button
                onClick={handleClose}
                className="text-sm text-muted hover:text-charcoal transition-colors"
              >
                Nie, ďakujem
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}