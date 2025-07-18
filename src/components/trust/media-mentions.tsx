'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Quote } from 'lucide-react'

interface MediaMentionsProps {
  variant?: 'logos' | 'testimonials' | 'awards'
  className?: string
}

const mediaLogos = [
  {
    name: 'Slovenské noviny',
    logo: '/images/media/slovenskenoviny-logo.png',
    url: 'https://slovenskenoviny.sk',
    description: 'Najčítanejšie noviny na Slovensku'
  },
  {
    name: 'SME.sk',
    logo: '/images/media/sme-logo.png',
    url: 'https://sme.sk',
    description: 'Hlavný spravodajský portál'
  },
  {
    name: 'Mama a Ja',
    logo: '/images/media/mamaaja-logo.png',
    url: 'https://mamaaja.sk',
    description: 'Magazín pre mamičky'
  },
  {
    name: 'Detský svet',
    logo: '/images/media/detskysvet-logo.png',
    url: 'https://detskysvet.sk',
    description: 'Špecializovaný portál pre rodičov'
  },
  {
    name: 'Bratislavské noviny',
    logo: '/images/media/bratislavskenoviny-logo.png',
    url: 'https://bratislavskenoviny.sk',
    description: 'Regionálne spravodajstvo'
  }
]

const mediaTestimonials = [
  {
    publication: 'Mama a Ja',
    quote: '"Faborino prináša na slovenský trh kvalitné Montessori produkty, ktoré skutočne podporujú prirodzený vývoj detí."',
    author: 'Jana Nováková',
    role: 'Redaktorka',
    date: 'November 2024',
    url: 'https://mamaaja.sk/faborino-recenzia'
  },
  {
    publication: 'SME.sk',
    quote: '"Slovenská značka, ktorá dokázala spojiť tradičnú remeselnosť s moderným Montessori prístupom."',
    author: 'Peter Kováč',
    role: 'Novinár',
    date: 'Oktober 2024',
    url: 'https://sme.sk/faborino-uspech'
  },
  {
    publication: 'Detský svet',
    quote: '"Produkty Faborino sme testovali 3 mesiace a môžeme potvrdiť ich výnimočnú kvalitu a bezpečnosť."',
    author: 'Zuzana Svobodová',
    role: 'Testovacia redaktorka',
    date: 'September 2024',
    url: 'https://detskysvet.sk/test-faborino'
  }
]

const awards = [
  {
    title: 'Najlepší startup roku 2024',
    organization: 'Slovak Business Agency',
    year: '2024',
    icon: '🏆',
    description: 'Ocenenie za inovatívny prístup k detskému nábytku'
  },
  {
    title: 'Montessori Quality Award',
    organization: 'European Montessori Network',
    year: '2024',
    icon: '🎖️',
    description: 'Certifikát kvality pre Montessori produkty'
  },
  {
    title: 'Eco-Friendly Product 2024',
    organization: 'Green Slovakia',
    year: '2024',
    icon: '🌱',
    description: 'Ocenenie za environmentálne šetrné výrobky'
  },
  {
    title: 'Parent\'s Choice Award',
    organization: 'Rodičovské fórum SK',
    year: '2023',
    icon: '⭐',
    description: 'Voľba rodičov pre najlepšie detské produkty'
  }
]

export function MediaMentions({ variant = 'logos', className = '' }: MediaMentionsProps) {
  if (variant === 'testimonials') {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-charcoal mb-2">
            Čo o nás píšu médiá
          </h3>
          <p className="text-muted text-sm">
            Dôveryhodné zdroje oceňujú našu kvalitu
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mediaTestimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Quote className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-charcoal mb-3 leading-relaxed">
                      {testimonial.quote}
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-primary text-sm">
                          {testimonial.publication}
                        </span>
                        <ExternalLink className="w-3 h-3 text-muted" />
                      </div>
                      <p className="text-xs text-muted">
                        {testimonial.author}, {testimonial.role}
                      </p>
                      <p className="text-xs text-muted">
                        {testimonial.date}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (variant === 'awards') {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-charcoal mb-2">
            Ocenenia a certifikáty
          </h3>
          <p className="text-muted text-sm">
            Nezávislé potvrdenie našej kvality
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {awards.map((award, index) => (
            <Card key={index} className="border-0 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{award.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-charcoal text-sm mb-1">
                      {award.title}
                    </h4>
                    <p className="text-xs text-muted mb-2">
                      {award.organization} • {award.year}
                    </p>
                    <p className="text-xs text-muted">
                      {award.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center">
        <h3 className="text-sm font-medium text-charcoal mb-2">
          Píšu o nás
        </h3>
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-6">
        {mediaLogos.map((media, index) => (
          <div key={index} className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
            <img 
              src={media.logo} 
              alt={media.name}
              className="h-8 object-contain grayscale hover:grayscale-0 transition-all"
              onError={(e) => {
                // Fallback to text if image fails
                e.currentTarget.style.display = 'none'
                const textElement = e.currentTarget.nextElementSibling as HTMLElement
                if (textElement) {
                  textElement.style.display = 'block'
                }
              }}
            />
            <span className="text-sm font-medium text-muted hidden">
              {media.name}
            </span>
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <Badge variant="outline" className="text-xs">
          a ďalšie médiá...
        </Badge>
      </div>
    </div>
  )
}

interface PressKitProps {
  className?: string
}

export function PressKit({ className = '' }: PressKitProps) {
  return (
    <div className={`text-center ${className}`}>
      <h4 className="font-medium text-charcoal mb-2">
        Pre médiá a blogerov
      </h4>
      <p className="text-sm text-muted mb-4">
        Potrebujete materiály pre článok? Kontaktujte nás.
      </p>
      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <Badge variant="outline" className="text-xs">
          Tlaková správa
        </Badge>
        <Badge variant="outline" className="text-xs">
          Produktové fotky
        </Badge>
        <Badge variant="outline" className="text-xs">
          Logo balíček
        </Badge>
      </div>
    </div>
  )
}