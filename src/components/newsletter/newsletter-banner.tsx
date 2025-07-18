'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { NewsletterSignup } from './newsletter-signup'
import { X, Mail, Gift, ArrowRight, Bell } from 'lucide-react'

interface NewsletterBannerProps {
  position?: 'top' | 'bottom'
  variant?: 'simple' | 'discount' | 'announcement'
  dismissible?: boolean
  autoShow?: boolean
  className?: string
}

export function NewsletterBanner({ 
  position = 'top',
  variant = 'simple',
  dismissible = true,
  autoShow = true,
  className = ''
}: NewsletterBannerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    if (!autoShow) return

    // Check if user has dismissed the banner
    const dismissed = localStorage.getItem('newsletter-banner-dismissed')
    if (dismissed) {
      setIsDismissed(true)
      return
    }

    // Show banner after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [autoShow])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    localStorage.setItem('newsletter-banner-dismissed', 'true')
  }

  if (isDismissed || !isVisible) return null

  const positionClasses = {
    top: 'top-0',
    bottom: 'bottom-0'
  }

  // Simple variant
  if (variant === 'simple') {
    return (
      <div className={`fixed ${positionClasses[position]} left-0 right-0 z-40 ${className}`}>
        <div className="bg-primary text-white py-3 px-4">
          <div className="container-responsive">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  <span className="font-medium">Newsletter</span>
                </div>
                <p className="text-sm text-white/90">
                  Prihláste sa k odberu a dostávajte najnovšie informácie o produktoch
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <NewsletterSignup
                  variant="minimal"
                  placeholder="Váš email"
                  buttonText="Prihlásiť"
                />
                {dismissible && (
                  <button
                    onClick={handleDismiss}
                    className="p-1 hover:bg-white/20 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Discount variant
  if (variant === 'discount') {
    return (
      <div className={`fixed ${positionClasses[position]} left-0 right-0 z-40 ${className}`}>
        <div className="bg-gradient-to-r from-accent to-primary text-white py-4 px-4">
          <div className="container-responsive">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Gift className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-white text-accent text-xs">
                        -10%
                      </Badge>
                      <span className="font-medium">Exkluzívna zľava</span>
                    </div>
                    <p className="text-sm text-white/90">
                      Prihláste sa k odberu a získajte 10% zľavu na prvý nákup
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <NewsletterSignup
                  variant="minimal"
                  placeholder="Email pre zľavu"
                  buttonText="Získať zľavu"
                />
                {dismissible && (
                  <button
                    onClick={handleDismiss}
                    className="p-1 hover:bg-white/20 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Announcement variant
  if (variant === 'announcement') {
    return (
      <div className={`fixed ${positionClasses[position]} left-0 right-0 z-40 ${className}`}>
        <div className="bg-secondary text-white py-3 px-4">
          <div className="container-responsive">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <Bell className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="font-medium">🎉 Novinky v sortimente!</span>
                    <p className="text-sm text-white/90">
                      Nové Montessori produkty už čoskoro. Buďte prvý, kto sa o nich dozvie.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white text-white hover:bg-white hover:text-secondary"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Prihlásiť sa
                </Button>
                {dismissible && (
                  <button
                    onClick={handleDismiss}
                    className="p-1 hover:bg-white/20 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}