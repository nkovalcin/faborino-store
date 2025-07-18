'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Mail, 
  Check, 
  X, 
  Gift, 
  Bell, 
  Star, 
  Sparkles,
  ArrowRight,
  Shield,
  Users,
  Zap
} from 'lucide-react'

interface NewsletterSignupProps {
  variant?: 'default' | 'minimal' | 'popup' | 'inline' | 'sidebar'
  title?: string
  description?: string
  placeholder?: string
  buttonText?: string
  showBenefits?: boolean
  showDiscount?: boolean
  className?: string
}

export function NewsletterSignup({
  variant = 'default',
  title = 'Nezmeškajte naše novinky',
  description = 'Prihláste sa k odberu a dostávajte informácie o novinkách, akciách a užitočných radách pre rodičov.',
  placeholder = 'Váš email',
  buttonText = 'Prihlásiť sa',
  showBenefits = true,
  showDiscount = false,
  className = ''
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const benefits = [
    {
      icon: Gift,
      title: 'Exkluzívne zľavy',
      description: 'Ako prvý sa dozviete o akciách a zľavách až do 30%'
    },
    {
      icon: Bell,
      title: 'Nové produkty',
      description: 'Informácie o najnovších Montessori produktoch'
    },
    {
      icon: Star,
      title: 'Odborné rady',
      description: 'Užitočné tipy pre výchovu a vývoj detí'
    },
    {
      icon: Sparkles,
      title: 'Darčeky',
      description: 'Občasné prekvapenia a darčeky pre odberateľov'
    }
  ]

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Zadajte prosím váš email')
      return
    }

    if (!validateEmail(email)) {
      setError('Zadajte prosím platný email')
      return
    }

    if (variant !== 'minimal' && !agreedToTerms) {
      setError('Musíte súhlasiť so spracovaním osobných údajov')
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setIsSuccess(true)
      setEmail('')
      setAgreedToTerms(false)
      
      // Reset success state after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000)
    } catch (error) {
      setError('Nastala chyba. Skúste to prosím znova.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={`${className}`}>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              disabled={isSubmitting}
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isSuccess ? (
              <Check className="w-4 h-4" />
            ) : (
              <Mail className="w-4 h-4" />
            )}
            {isSuccess ? 'Prihlásený!' : buttonText}
          </Button>
        </form>
      </div>
    )
  }

  // Popup variant
  if (variant === 'popup') {
    return (
      <Card className={`max-w-md mx-auto ${className}`}>
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <p className="text-sm text-muted">{description}</p>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="font-semibold text-charcoal mb-2">Úspešne prihlásený!</h3>
              <p className="text-sm text-muted">
                Ďakujeme za prihlásenie. Prvý newsletter dostanete už čoskoro.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  disabled={isSubmitting}
                />
                {error && (
                  <p className="text-red-500 text-sm mt-1">{error}</p>
                )}
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={setAgreedToTerms}
                />
                <label htmlFor="terms" className="text-sm text-muted">
                  Súhlasím so spracovaním osobných údajov a chcem dostávať newsletter
                </label>
              </div>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
                {buttonText}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    )
  }

  // Sidebar variant
  if (variant === 'sidebar') {
    return (
      <Card className={`${className}`}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Newsletter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted mb-4">
            Novinky a tipy priamo do vašej schránky
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
              disabled={isSubmitting}
            />
            
            <Button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="w-full"
              size="sm"
            >
              {isSubmitting ? (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isSuccess ? (
                <Check className="w-3 h-3" />
              ) : (
                <ArrowRight className="w-3 h-3" />
              )}
            </Button>
          </form>
          
          {error && (
            <p className="text-red-500 text-xs mt-2">{error}</p>
          )}
        </CardContent>
      </Card>
    )
  }

  // Default variant
  return (
    <div className={`${className}`}>
      <Card>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            {showDiscount && (
              <Badge className="bg-accent text-white">
                -10% zľava
              </Badge>
            )}
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <p className="text-muted">{description}</p>
        </CardHeader>
        
        <CardContent>
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-charcoal mb-2">
                Ďakujeme za prihlásenie!
              </h3>
              <p className="text-muted mb-4">
                Prvý newsletter s exkluzívnymi ponukami dostanete už čoskoro.
              </p>
              {showDiscount && (
                <div className="bg-accent/10 p-4 rounded-lg">
                  <p className="text-sm font-medium text-accent">
                    🎉 Váš 10% zľavový kód: WELCOME10
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    disabled={isSubmitting}
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                  )}
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms-default"
                    checked={agreedToTerms}
                    onCheckedChange={setAgreedToTerms}
                  />
                  <label htmlFor="terms-default" className="text-sm text-muted">
                    Súhlasím so spracovaním osobných údajov a chcem dostávať newsletter s informáciami o novinkách a akciách
                  </label>
                </div>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2"
                  size="lg"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Mail className="w-4 h-4" />
                  )}
                  {buttonText}
                </Button>
              </form>
              
              {showBenefits && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-px bg-gray-200 flex-1" />
                    <span className="text-sm text-muted">Čo získate</span>
                    <div className="h-px bg-gray-200 flex-1" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {benefits.map((benefit, index) => {
                      const Icon = benefit.icon
                      return (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium text-charcoal text-sm">
                              {benefit.title}
                            </h4>
                            <p className="text-xs text-muted">
                              {benefit.description}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-center gap-6 text-xs text-muted">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>Bez spamu</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>15,000+ odberateľov</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span>Jednoduché odhlásenie</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}