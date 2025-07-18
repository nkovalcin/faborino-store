'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CreditCard, 
  Banknote, 
  QrCode,
  CheckCircle,
  Clock,
  AlertCircle,
  Copy
} from 'lucide-react'

export type PaymentMethod = 'revolut' | 'iban' | 'cash_on_delivery'

interface PaymentMethodsProps {
  selectedMethod: PaymentMethod
  onMethodChange: (method: PaymentMethod) => void
  onPaymentSubmit: (method: PaymentMethod) => void
  loading: boolean
}

export function PaymentMethods({ 
  selectedMethod, 
  onMethodChange, 
  onPaymentSubmit, 
  loading 
}: PaymentMethodsProps) {
  const [copied, setCopied] = useState(false)

  const paymentMethods = [
    {
      id: 'revolut' as PaymentMethod,
      name: 'Platba kartou',
      description: 'Okamžitá platba kreditnou alebo debetnou kartou',
      icon: <CreditCard className="w-6 h-6" />,
      badge: 'Odporúčané',
      badgeColor: 'bg-green-100 text-green-800',
      features: [
        'Okamžité spracovanie',
        'Bezpečné platby',
        'Všetky hlavné karty',
        'Mobile friendly'
      ],
      processingTime: 'Okamžite',
      fees: 'Bez poplatkov'
    },
    {
      id: 'iban' as PaymentMethod,
      name: 'Bankový prevod',
      description: 'Platba bankovým prevodom s QR kódom',
      icon: <Banknote className="w-6 h-6" />,
      badge: 'QR kód',
      badgeColor: 'bg-blue-100 text-blue-800',
      features: [
        'QR kód pre rýchlu platbu',
        'Všetky slovenské banky',
        'SEPA prevody',
        'Bez registrácie'
      ],
      processingTime: '1-2 prac. dni',
      fees: 'Podľa banky'
    },
    {
      id: 'cash_on_delivery' as PaymentMethod,
      name: 'Platba pri dobierke',
      description: 'Zaplatíte pri prevzatí zásielky',
      icon: <Banknote className="w-6 h-6" />,
      badge: 'Tradičné',
      badgeColor: 'bg-gray-100 text-gray-800',
      features: [
        'Platba pri doručení',
        'Hotovosť alebo karta',
        'Bez rizika',
        'Overenie tovaru'
      ],
      processingTime: 'Pri doručení',
      fees: '+2.99€'
    }
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-charcoal mb-2">
          Vyberte spôsob platby
        </h3>
        <p className="text-sm text-muted">
          Zvoľte si najvhodnejší spôsob platby pre vašu objednávku
        </p>
      </div>

      <div className="grid gap-4">
        {paymentMethods.map((method) => (
          <Card 
            key={method.id}
            className={`cursor-pointer transition-all ${
              selectedMethod === method.id 
                ? 'ring-2 ring-primary border-primary' 
                : 'hover:border-primary/50'
            }`}
            onClick={() => onMethodChange(method.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    selectedMethod === method.id ? 'bg-primary text-white' : 'bg-gray-100'
                  }`}>
                    {method.icon}
                  </div>
                  <div>
                    <CardTitle className="text-base">{method.name}</CardTitle>
                    <p className="text-sm text-muted">{method.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={method.badgeColor}>
                    {method.badge}
                  </Badge>
                  {selectedMethod === method.id && (
                    <CheckCircle className="w-5 h-5 text-primary" />
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Výhody:</h4>
                  <ul className="text-sm text-muted space-y-1">
                    {method.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Spracovanie:</h4>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted" />
                    <span className="text-sm">{method.processingTime}</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Poplatky:</h4>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-muted" />
                    <span className="text-sm">{method.fees}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>


      {/* Quick Copy for Support */}
      <Card className="bg-cream-white/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-charcoal text-sm">
                Potrebujete pomoc s platbou?
              </p>
              <p className="text-sm text-muted">
                Kontaktujte náš zákaznícky servis
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard('info@faborino.com')}
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied ? 'Skopírované!' : 'Skopírovať email'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}