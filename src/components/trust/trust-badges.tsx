'use client'

import { Shield, Award, Truck, CheckCircle, Star, Users, Clock, Lock, RefreshCw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface TrustBadgesProps {
  variant?: 'default' | 'minimal' | 'detailed'
  className?: string
}

const trustBadges = [
  {
    icon: Shield,
    title: 'Certifikácia CE',
    description: 'Všetky produkty spĺňajú európske normy bezpečnosti',
    color: 'text-green-500',
    bgColor: 'bg-green-50'
  },
  {
    icon: Award,
    title: 'Montessori certifikované',
    description: 'Overené Montessori expertmi a pedagógmi',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50'
  },
  {
    icon: Truck,
    title: 'Rychlá doprava',
    description: 'Doručenie do 2-3 pracovných dní',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50'
  },
  {
    icon: RefreshCw,
    title: '30 dní na vrátenie',
    description: 'Bezplatné vrátenie do 30 dní',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50'
  },
  {
    icon: Lock,
    title: 'Bezpečná platba',
    description: 'SSL šifrovanie a overené platobné brány',
    color: 'text-red-500',
    bgColor: 'bg-red-50'
  },
  {
    icon: CheckCircle,
    title: '2 roky záruka',
    description: 'Rozšírená záruka na všetky produkty',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50'
  }
]

export function TrustBadges({ variant = 'default', className = '' }: TrustBadgesProps) {
  if (variant === 'minimal') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {trustBadges.slice(0, 4).map((badge, index) => {
          const Icon = badge.icon
          return (
            <Badge key={index} variant="outline" className="flex items-center gap-1">
              <Icon className={`w-3 h-3 ${badge.color}`} />
              <span className="text-xs">{badge.title}</span>
            </Badge>
          )
        })}
      </div>
    )
  }

  if (variant === 'detailed') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
        {trustBadges.map((badge, index) => {
          const Icon = badge.icon
          return (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg ${badge.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${badge.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-charcoal text-sm mb-1">
                      {badge.title}
                    </h4>
                    <p className="text-xs text-muted">
                      {badge.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {trustBadges.map((badge, index) => {
        const Icon = badge.icon
        return (
          <div key={index} className="flex items-center gap-2 text-sm">
            <Icon className={`w-4 h-4 ${badge.color}`} />
            <span className="text-muted">{badge.title}</span>
          </div>
        )
      })}
    </div>
  )
}

interface SocialProofProps {
  variant?: 'stats' | 'testimonial' | 'recent-activity'
  className?: string
}

const stats = [
  {
    value: '12,000+',
    label: 'Spokojných rodičov',
    icon: Users,
    color: 'text-blue-500'
  },
  {
    value: '4.9/5',
    label: 'Priemerné hodnotenie',
    icon: Star,
    color: 'text-yellow-500'
  },
  {
    value: '50,000+',
    label: 'Dodaných produktov',
    icon: CheckCircle,
    color: 'text-green-500'
  },
  {
    value: '< 24h',
    label: 'Priemerná expedícia',
    icon: Clock,
    color: 'text-purple-500'
  }
]

const testimonials = [
  {
    name: 'Anna K.',
    text: 'Najkvalitnejší detský nábytok, aký som kedy videla. Môj syn si ho miluje!',
    rating: 5,
    verified: true
  },
  {
    name: 'Michal P.',
    text: 'Perfektná kvalita, rýchle doručenie. Určite budeme objednávať znova.',
    rating: 5,
    verified: true
  },
  {
    name: 'Zuzana M.',
    text: 'Montessori prístup skutočne funguje. Vidím rozdiel v samostatnosti dcérky.',
    rating: 5,
    verified: true
  }
]

const recentActivity = [
  {
    product: 'Montessori stolček',
    location: 'Bratislava',
    time: '2 min',
    action: 'objednal'
  },
  {
    product: 'Lezecký trojuholník',
    location: 'Košice',
    time: '5 min',
    action: 'objednal'
  },
  {
    product: 'Drevená polička',
    location: 'Prešov',
    time: '8 min',
    action: 'objednal'
  }
]

export function SocialProof({ variant = 'stats', className = '' }: SocialProofProps) {
  if (variant === 'testimonial') {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-lg font-semibold text-charcoal mb-4">
          Čo hovoria naši zákazníci
        </h3>
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="bg-surface border-0">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-medium text-sm">
                    {testimonial.name[0]}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-charcoal text-sm">
                      {testimonial.name}
                    </span>
                    {testimonial.verified && (
                      <Badge variant="secondary" className="text-xs">
                        Overený nákup
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted text-sm">{testimonial.text}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (variant === 'recent-activity') {
    return (
      <div className={`space-y-2 ${className}`}>
        <h4 className="font-medium text-charcoal text-sm mb-3">
          Nedávne objednávky
        </h4>
        {recentActivity.map((activity, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-surface rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <p className="text-sm">
                <span className="text-muted">Niekto z</span>{' '}
                <span className="font-medium text-charcoal">{activity.location}</span>{' '}
                <span className="text-muted">{activity.action}</span>{' '}
                <span className="font-medium text-charcoal">{activity.product}</span>
              </p>
              <p className="text-xs text-muted">pred {activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div key={index} className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-charcoal mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-muted">
              {stat.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}

interface SecurityBadgesProps {
  className?: string
}

export function SecurityBadges({ className = '' }: SecurityBadgesProps) {
  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <Lock className="w-3 h-3 text-white" />
        </div>
        <span className="text-sm text-muted">SSL šifrovanie</span>
      </div>
      
      <div className="flex items-center gap-2">
        <img 
          src="/images/visa-logo.png" 
          alt="Visa" 
          className="h-6 opacity-60"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
        <img 
          src="/images/mastercard-logo.png" 
          alt="Mastercard" 
          className="h-6 opacity-60"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      </div>
      
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <Shield className="w-3 h-3 text-white" />
        </div>
        <span className="text-sm text-muted">Bezpečná platba</span>
      </div>
    </div>
  )
}