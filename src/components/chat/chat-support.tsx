'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  Users,
  HeadphonesIcon,
  MessageSquare,
  Zap,
  Star,
  CheckCircle2
} from 'lucide-react'

interface ChatSupportProps {
  className?: string
}

export function ChatSupport({ className = '' }: ChatSupportProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const supportOptions = [
    {
      id: 'live-chat',
      title: 'Live Chat',
      description: 'Okamžitá pomoc s našimi expertmi',
      icon: MessageCircle,
      status: 'online',
      responseTime: '< 2 min',
      available: true,
      color: 'text-green-500'
    },
    {
      id: 'phone',
      title: 'Telefonická podpora',
      description: 'Zavolajte nám priamo',
      icon: Phone,
      status: 'busy',
      responseTime: '5-10 min',
      available: true,
      color: 'text-blue-500'
    },
    {
      id: 'email',
      title: 'Email podpora',
      description: 'Odpovieme do 24 hodín',
      icon: Mail,
      status: 'available',
      responseTime: '< 24 hod',
      available: true,
      color: 'text-purple-500'
    }
  ]

  const faqs = [
    {
      question: 'Ako dlho trvá dodanie?',
      answer: 'Štandardné dodanie trvá 3-5 pracovných dní.',
      category: 'Dodanie'
    },
    {
      question: 'Sú produkty bezpečné pre deti?',
      answer: 'Všetky naše produkty majú CE certifikáciu a sú testované.',
      category: 'Bezpečnosť'
    },
    {
      question: 'Môžem vrátiť produkt?',
      answer: 'Máte 30 dní na vrátenie produktu bez udania dôvodu.',
      category: 'Vrátenie'
    },
    {
      question: 'Aké sú platobné možnosti?',
      answer: 'Prijímame karty, PayPal, BLIK a bankový prevod.',
      category: 'Platba'
    }
  ]

  const testimonials = [
    {
      name: 'Mária K.',
      text: 'Vynikajúca zákaznícka podpora! Pomohli mi vybrať ideálny stolček.',
      rating: 5
    },
    {
      name: 'Peter S.',
      text: 'Rýchla odpoveď a odborné poradenstvo. Odporúčam!',
      rating: 5
    },
    {
      name: 'Anna L.',
      text: 'Milá komunikácia a užitočné rady pri výbere produktov.',
      rating: 5
    }
  ]

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-h2 font-bold text-charcoal mb-4">
          Potrebujete pomoc?
        </h2>
        <p className="text-muted max-w-2xl mx-auto">
          Náš tím expertov je tu pre vás. Vyberte si najvhodnejší spôsob komunikácie.
        </p>
      </div>

      {/* Support Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {supportOptions.map((option) => {
          const Icon = option.icon
          return (
            <Card 
              key={option.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedOption === option.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedOption(option.id)}
            >
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-${option.color.split('-')[1]}-50 flex items-center justify-center`}>
                  <Icon className={`w-8 h-8 ${option.color}`} />
                </div>
                <CardTitle className="text-lg">{option.title}</CardTitle>
                <p className="text-sm text-muted">{option.description}</p>
              </CardHeader>
              
              <CardContent className="text-center">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      option.status === 'online' ? 'bg-green-500' : 
                      option.status === 'busy' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <span className="text-xs text-muted capitalize">{option.status}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {option.responseTime}
                  </Badge>
                </div>
                
                <Button 
                  className="w-full" 
                  disabled={!option.available}
                  variant={selectedOption === option.id ? 'default' : 'outline'}
                >
                  {option.id === 'live-chat' && 'Začať chat'}
                  {option.id === 'phone' && 'Zavolať'}
                  {option.id === 'email' && 'Napísať email'}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted">Priemerná doba odozvy</span>
          </div>
          <p className="text-2xl font-bold text-charcoal">1.5 min</p>
        </Card>
        
        <Card className="text-center p-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-muted">Spokojnosť zákazníkov</span>
          </div>
          <p className="text-2xl font-bold text-charcoal">4.9/5</p>
        </Card>
        
        <Card className="text-center p-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-muted">Aktívnych agentov</span>
          </div>
          <p className="text-2xl font-bold text-charcoal">8</p>
        </Card>
        
        <Card className="text-center p-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-sm text-muted">Vyriešené dnes</span>
          </div>
          <p className="text-2xl font-bold text-charcoal">247</p>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Často kladené otázky
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, index) => (
              <div key={index} className="p-4 border border-cream-white rounded-lg">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="text-xs">
                    {faq.category}
                  </Badge>
                </div>
                <h4 className="font-medium text-charcoal mt-2 mb-2">
                  {faq.question}
                </h4>
                <p className="text-sm text-muted">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Testimonials */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Čo hovoria naši zákazníci
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-4 bg-surface rounded-lg">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted mb-2">
                  "{testimonial.text}"
                </p>
                <p className="text-xs font-medium text-charcoal">
                  {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-charcoal mb-4">
              Stále máte otázky?
            </h3>
            <p className="text-muted mb-6">
              Náš tím je k dispozícii 24/7 a rád vám pomôže s čímkoľvek potrebujete.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Začať chat
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +421 123 456 789
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                podpora@faborino.sk
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}