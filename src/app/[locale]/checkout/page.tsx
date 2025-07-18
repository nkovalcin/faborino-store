'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, ArrowLeft, CreditCard, Truck, Shield, Lock, MapPin, User, Mail, Phone, Check, QrCode, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PaymentMethods, PaymentMethod } from '@/components/payments/payment-methods'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/lib/utils'

type CheckoutStep = 'shipping' | 'payment' | 'confirmation'

interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  street: string
  city: string
  postalCode: string
  country: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalAmount, getItemCount } = useCartStore()
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('revolut')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'SK'
  })

  const totalAmount = getTotalAmount()
  const itemCount = getItemCount()

  useEffect(() => {
    if (items.length === 0) {
      router.push('/sk/kosik')
      return
    }
  }, [items, router])

  const handleShippingInfoChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleNextStep = () => {
    if (currentStep === 'shipping') {
      // Validate shipping info
      const required = ['firstName', 'lastName', 'email', 'phone', 'street', 'city', 'postalCode']
      const hasAllRequired = required.every(field => shippingInfo[field as keyof ShippingInfo].trim() !== '')
      
      if (!hasAllRequired) {
        setError('Prosím vyplňte všetky povinné polia')
        return
      }
      
      setError('')
      setCurrentStep('payment')
    } else if (currentStep === 'payment') {
      setCurrentStep('confirmation')
    }
  }

  const handlePreviousStep = () => {
    if (currentStep === 'payment') {
      setCurrentStep('shipping')
    } else if (currentStep === 'confirmation') {
      setCurrentStep('payment')
    }
  }

  const handlePaymentSubmit = async (method: PaymentMethod) => {
    setLoading(true)
    setError('')
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Redirect based on payment method
      if (method === 'revolut') {
        router.push('/sk/checkout/success')
      } else if (method === 'iban') {
        router.push('/sk/checkout/bank-transfer/12345')
      } else if (method === 'cash_on_delivery') {
        router.push('/sk/checkout/success')
      }
    } catch (error) {
      setError('Nastala chyba pri spracovaní platby. Skúste to znova.')
    } finally {
      setLoading(false)
    }
  }

  const shippingCost = totalAmount >= 100 ? 0 : 4.99
  const finalTotal = totalAmount + shippingCost

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-h1 font-bold text-charcoal mb-4">
            Košík je prázdny
          </h1>
          <p className="text-muted mb-6">
            Pridajte produkty do košíka pred pokračovaním k pokladni.
          </p>
          <Link href="/sk/produkty">
            <Button>Pokračovať v nákupe</Button>
          </Link>
        </div>
      </div>
    )
  }

  const steps = [
    { id: 'shipping', name: 'Dodacie údaje', icon: MapPin },
    { id: 'payment', name: 'Platba', icon: CreditCard },
    { id: 'confirmation', name: 'Potvrdenie', icon: Check },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container-smart py-8">
        {/* Breadcrumb */}
        <nav className="breadcrumb mb-8">
          <Link href="/sk" className="breadcrumb-item">Domov</Link>
          <ChevronRight className="w-4 h-4 breadcrumb-separator" />
          <Link href="/sk/kosik" className="breadcrumb-item">Košík</Link>
          <ChevronRight className="w-4 h-4 breadcrumb-separator" />
          <span className="text-muted">Pokladňa</span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-h1 font-bold text-charcoal mb-2">
              Pokladňa
            </h1>
            <p className="text-muted">
              Dokončite svoju objednávku bezpečne a rýchlo
            </p>
          </div>
          <Link href="/sk/kosik">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Späť do košíka
            </Button>
          </Link>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between relative">
              {/* Background line */}
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-0.5 bg-gray-200"></div>
              </div>
              
              {steps.map((step, index) => {
                const isActive = step.id === currentStep
                const isCompleted = steps.findIndex(s => s.id === currentStep) > index
                const Icon = step.icon
                
                return (
                  <div key={step.id} className="relative flex flex-col items-center">
                    {/* Step Circle */}
                    <div className={`relative z-10 flex items-center justify-center w-14 h-14 rounded-full border-4 transition-all duration-300 ${
                      isActive ? 'bg-primary border-primary text-white shadow-lg scale-110' :
                      isCompleted ? 'bg-green-500 border-green-500 text-white shadow-md' :
                      'bg-white border-gray-300 text-gray-400 shadow-sm'
                    }`}>
                      {isCompleted && !isActive ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    
                    {/* Step Number */}
                    <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                      isActive ? 'bg-white text-primary' :
                      isCompleted ? 'bg-white text-green-600' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {index + 1}
                    </div>
                    
                    {/* Step Label */}
                    <div className="mt-4 text-center">
                      <p className={`text-sm font-semibold transition-colors duration-200 ${
                        isActive ? 'text-primary' :
                        isCompleted ? 'text-green-600' :
                        'text-gray-400'
                      }`}>
                        {step.name}
                      </p>
                      {isActive && (
                        <div className="mt-1 w-2 h-2 bg-primary rounded-full mx-auto animate-pulse"></div>
                      )}
                    </div>
                  </div>
                )
              })}
              
              {/* Progress Line */}
              <div className="absolute inset-0 flex items-center">
                <div className="relative w-full h-0.5 bg-gray-200">
                  <div 
                    className="absolute h-full bg-gradient-to-r from-primary to-green-500 transition-all duration-500 ease-out"
                    style={{ 
                      width: `${(steps.findIndex(s => s.id === currentStep) / (steps.length - 1)) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security badges */}
        <div className="flex items-center justify-center gap-6 mb-8 p-4 bg-surface rounded-card border border-cream-white">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Shield className="w-5 h-5 text-green-600" />
            <span>SSL Zabezpečenie</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <Lock className="w-5 h-5 text-green-600" />
            <span>Bezpečné platby</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <CreditCard className="w-5 h-5 text-green-600" />
            <span>Všetky hlavné karty</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <Truck className="w-5 h-5 text-green-600" />
            <span>Rýchla doprava</span>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-card">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Shipping Information */}
            {currentStep === 'shipping' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Dodacie údaje
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">
                        Meno *
                      </label>
                      <input
                        type="text"
                        className="smart-input"
                        value={shippingInfo.firstName}
                        onChange={(e) => handleShippingInfoChange('firstName', e.target.value)}
                        placeholder="Vaše meno"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">
                        Priezvisko *
                      </label>
                      <input
                        type="text"
                        className="smart-input"
                        value={shippingInfo.lastName}
                        onChange={(e) => handleShippingInfoChange('lastName', e.target.value)}
                        placeholder="Vaše priezvisko"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        className="smart-input"
                        value={shippingInfo.email}
                        onChange={(e) => handleShippingInfoChange('email', e.target.value)}
                        placeholder="vas@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">
                        Telefón *
                      </label>
                      <input
                        type="tel"
                        className="smart-input"
                        value={shippingInfo.phone}
                        onChange={(e) => handleShippingInfoChange('phone', e.target.value)}
                        placeholder="+421 123 456 789"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Ulica a číslo domu *
                    </label>
                    <input
                      type="text"
                      className="smart-input"
                      value={shippingInfo.street}
                      onChange={(e) => handleShippingInfoChange('street', e.target.value)}
                      placeholder="Hlavná ulica 123"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">
                        Mesto *
                      </label>
                      <input
                        type="text"
                        className="smart-input"
                        value={shippingInfo.city}
                        onChange={(e) => handleShippingInfoChange('city', e.target.value)}
                        placeholder="Bratislava"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">
                        PSČ *
                      </label>
                      <input
                        type="text"
                        className="smart-input"
                        value={shippingInfo.postalCode}
                        onChange={(e) => handleShippingInfoChange('postalCode', e.target.value)}
                        placeholder="12345"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">
                        Krajina *
                      </label>
                      <select
                        className="smart-select"
                        value={shippingInfo.country}
                        onChange={(e) => handleShippingInfoChange('country', e.target.value)}
                      >
                        <option value="SK">Slovensko</option>
                        <option value="CZ">Česká republika</option>
                        <option value="DE">Nemecko</option>
                        <option value="AT">Rakúsko</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Method */}
            {currentStep === 'payment' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Spôsob platby
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PaymentMethods
                    selectedMethod={selectedPaymentMethod}
                    onMethodChange={setSelectedPaymentMethod}
                    onPaymentSubmit={handlePaymentSubmit}
                    loading={loading}
                  />
                </CardContent>
              </Card>
            )}

            {/* Confirmation */}
            {currentStep === 'confirmation' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    Potvrdenie objednávky
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-charcoal mb-3">Dodacie údaje</h4>
                      <div className="text-sm text-muted space-y-1">
                        <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                        <p>{shippingInfo.street}</p>
                        <p>{shippingInfo.postalCode} {shippingInfo.city}</p>
                        <p>{shippingInfo.country}</p>
                        <p>{shippingInfo.email}</p>
                        <p>{shippingInfo.phone}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-charcoal mb-3">Platba</h4>
                      <div className="text-sm text-muted">
                        <p>
                          {selectedPaymentMethod === 'revolut' && 'Platba kartou'}
                          {selectedPaymentMethod === 'iban' && 'Bankový prevod'}
                          {selectedPaymentMethod === 'cash_on_delivery' && 'Platba pri dobierke'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <Button 
                      onClick={() => handlePaymentSubmit(selectedPaymentMethod)}
                      disabled={loading}
                      className="w-full"
                      size="lg"
                    >
                      {loading ? 'Spracováva sa...' : 'Dokončiť objednávku'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handlePreviousStep}
                disabled={currentStep === 'shipping'}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Späť
              </Button>
              
              {currentStep !== 'confirmation' && (
                <Button onClick={handleNextStep}>
                  Pokračovať
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Súhrn objednávky</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 bg-cream-white rounded-lg overflow-hidden">
                        <span className="absolute top-0 right-0 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center -translate-y-1 translate-x-1">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-charcoal text-sm line-clamp-1">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-muted">
                          {item.quantity} × {formatPrice(item.price, item.product.currency)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-medium text-charcoal">
                          {formatPrice(item.total, item.product.currency)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Medzisúčet:</span>
                    <span className="font-medium">{formatPrice(totalAmount, 'EUR')}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Doprava:</span>
                    <span className="font-medium">
                      {shippingCost === 0 ? 'Zadarmo' : formatPrice(shippingCost, 'EUR')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-lg font-semibold border-t pt-2">
                    <span>Celkom:</span>
                    <span>{formatPrice(finalTotal, 'EUR')}</span>
                  </div>
                </div>
                
                {shippingCost === 0 && (
                  <div className="text-sm text-green-600 bg-green-50 p-3 rounded-card">
                    ✓ Bezplatná doprava
                  </div>
                )}
                
                {/* Terms and CTA in Payment Step */}
                {currentStep === 'payment' && (
                  <div className="border-t pt-4 space-y-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="terms"
                        className="mt-1"
                        required
                      />
                      <label htmlFor="terms" className="text-sm text-muted">
                        Súhlasím s{' '}
                        <Link href="/sk/obchodne-podmienky" className="text-primary hover:underline">
                          obchodnými podmienkami
                        </Link>
                        {' '}a{' '}
                        <Link href="/sk/ochrana-sukromia" className="text-primary hover:underline">
                          ochranou súkromia
                        </Link>
                      </label>
                    </div>
                    
                    <Button 
                      onClick={() => handlePaymentSubmit(selectedPaymentMethod)}
                      disabled={loading}
                      className="w-full"
                      size="lg"
                    >
                      {loading ? 'Spracováva sa...' : (
                        <>
                          {selectedPaymentMethod === 'revolut' && (
                            <>
                              <CreditCard className="w-4 h-4 mr-2" />
                              Zaplatiť kartou
                            </>
                          )}
                          {selectedPaymentMethod === 'iban' && (
                            <>
                              <QrCode className="w-4 h-4 mr-2" />
                              Vygenerovať QR kód
                            </>
                          )}
                          {selectedPaymentMethod === 'cash_on_delivery' && (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Odoslať objednávku
                            </>
                          )}
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}