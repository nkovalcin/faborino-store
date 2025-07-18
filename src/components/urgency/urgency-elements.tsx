'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Clock, Users, Package, Zap, TrendingUp, AlertCircle } from 'lucide-react'

interface CountdownTimerProps {
  targetDate?: Date
  variant?: 'default' | 'sale' | 'shipping'
  className?: string
}

export function CountdownTimer({ 
  targetDate = new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
  variant = 'default',
  className = ''
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const target = targetDate.getTime()
      const difference = target - now

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        })
      } else {
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  const getVariantStyles = () => {
    switch (variant) {
      case 'sale':
        return {
          bg: 'bg-gradient-to-r from-red-500 to-orange-500',
          text: 'text-white',
          title: 'FLASH VÝPREDAJ KONČÍ O:'
        }
      case 'shipping':
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-purple-500',
          text: 'text-white',
          title: 'EXPEDÍCIA DNES KONČÍ O:'
        }
      default:
        return {
          bg: 'bg-gradient-to-r from-primary to-accent',
          text: 'text-white',
          title: 'AKCIA KONČÍ O:'
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <Card className={`border-0 ${className}`}>
      <CardContent className={`p-4 ${styles.bg} rounded-card`}>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Clock className={`w-4 h-4 ${styles.text}`} />
            <span className={`text-sm font-medium ${styles.text}`}>
              {styles.title}
            </span>
          </div>
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${styles.text}`}>
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <div className={`text-xs ${styles.text}/80`}>hod</div>
            </div>
            <div className={`text-xl font-bold ${styles.text}`}>:</div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${styles.text}`}>
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <div className={`text-xs ${styles.text}/80`}>min</div>
            </div>
            <div className={`text-xl font-bold ${styles.text}`}>:</div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${styles.text}`}>
                {timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <div className={`text-xs ${styles.text}/80`}>sek</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface StockLevelProps {
  stockCount: number
  totalStock: number
  lowStockThreshold?: number
  variant?: 'default' | 'critical' | 'progress'
  className?: string
}

export function StockLevel({ 
  stockCount, 
  totalStock, 
  lowStockThreshold = 10,
  variant = 'default',
  className = ''
}: StockLevelProps) {
  const percentage = (stockCount / totalStock) * 100
  const isLowStock = stockCount <= lowStockThreshold
  const isCritical = stockCount <= 3

  if (variant === 'progress') {
    return (
      <Card className={`border-0 bg-surface ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-charcoal">
              Na sklade
            </span>
            <span className="text-sm text-muted">
              {stockCount} ks
            </span>
          </div>
          <Progress 
            value={percentage} 
            className="h-2 mb-2"
            indicatorClassName={
              isCritical ? 'bg-red-500' : 
              isLowStock ? 'bg-orange-500' : 
              'bg-green-500'
            }
          />
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              isCritical ? 'bg-red-500' : 
              isLowStock ? 'bg-orange-500' : 
              'bg-green-500'
            }`} />
            <span className="text-xs text-muted">
              {isCritical ? 'Kriticky nízky stav' : 
               isLowStock ? 'Nízky stav' : 
               'Dostatočný stav'}
            </span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === 'critical' && isCritical) {
    return (
      <Badge className={`bg-red-500 text-white animate-pulse ${className}`}>
        <AlertCircle className="w-3 h-3 mr-1" />
        Len {stockCount} ks na sklade!
      </Badge>
    )
  }

  if (isLowStock) {
    return (
      <Badge variant="outline" className={`border-orange-500 text-orange-700 ${className}`}>
        <Package className="w-3 h-3 mr-1" />
        Len {stockCount} ks zostáva
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className={`border-green-500 text-green-700 ${className}`}>
      <Package className="w-3 h-3 mr-1" />
      {stockCount} ks skladom
    </Badge>
  )
}

interface RecentActivityProps {
  className?: string
}

export function RecentActivity({ className = '' }: RecentActivityProps) {
  const [activities, setActivities] = useState([
    { id: 1, product: 'Montessori stolček', location: 'Bratislava', time: '2 min', visible: true },
    { id: 2, product: 'Lezecký trojuholník', location: 'Košice', time: '5 min', visible: true },
    { id: 3, product: 'Drevená polička', location: 'Prešov', time: '8 min', visible: true }
  ])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    const interval = setInterval(() => {
      setActivities(prev => {
        const newActivity = {
          id: Date.now(),
          product: ['Montessori stolček', 'Lezecký trojuholník', 'Drevená polička', 'Detský stôl'][Math.floor(Math.random() * 4)],
          location: ['Bratislava', 'Košice', 'Prešov', 'Nitra', 'Žilina'][Math.floor(Math.random() * 5)],
          time: '1 min',
          visible: false
        }
        
        setTimeout(() => {
          setActivities(current => 
            current.map(item => 
              item.id === newActivity.id ? { ...item, visible: true } : item
            )
          )
        }, 100)

        return [newActivity, ...prev.slice(0, 2)]
      })
    }, 15000) // New activity every 15 seconds

    return () => clearInterval(interval)
  }, [])

  if (!isClient) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-charcoal">Nedávne objednávky</span>
        </div>
        
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-3 p-3 bg-surface rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <div className="flex-1 text-sm">
              <span className="text-muted">Niekto z</span>{' '}
              <span className="font-medium text-charcoal">{activity.location}</span>{' '}
              <span className="text-muted">objednal</span>{' '}
              <span className="font-medium text-charcoal">{activity.product}</span>
            </div>
            <span className="text-xs text-muted">pred {activity.time}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-charcoal">Nedávne objednávky</span>
      </div>
      
      {activities.map((activity) => (
        <div
          key={activity.id}
          className={`flex items-center gap-3 p-3 bg-surface rounded-lg transition-all duration-500 ${
            activity.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          }`}
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <div className="flex-1 text-sm">
            <span className="text-muted">Niekto z</span>{' '}
            <span className="font-medium text-charcoal">{activity.location}</span>{' '}
            <span className="text-muted">objednal</span>{' '}
            <span className="font-medium text-charcoal">{activity.product}</span>
          </div>
          <span className="text-xs text-muted">pred {activity.time}</span>
        </div>
      ))}
    </div>
  )
}

interface ViewingCountProps {
  count?: number
  className?: string
}

export function ViewingCount({ count = 5, className = '' }: ViewingCountProps) {
  const [viewCount, setViewCount] = useState(count)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const initialCount = Math.floor(Math.random() * 8) + 3
    setViewCount(initialCount)
    
    const interval = setInterval(() => {
      setViewCount(prev => {
        const change = Math.floor(Math.random() * 3) - 1 // -1, 0, or 1
        const newCount = Math.max(2, Math.min(15, prev + change))
        return newCount
      })
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex -space-x-1">
        {[...Array(Math.min(viewCount, 5))].map((_, i) => (
          <div
            key={i}
            className="w-6 h-6 rounded-full bg-primary/20 border-2 border-white flex items-center justify-center"
          >
            <Users className="w-3 h-3 text-primary" />
          </div>
        ))}
      </div>
      <span className="text-sm text-muted">
        {viewCount} ľudí si práve prezerá tento produkt
      </span>
    </div>
  )
}

interface FastShippingProps {
  cutoffTime?: string
  className?: string
}

export function FastShipping({ cutoffTime = '16:00', className = '' }: FastShippingProps) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const cutoff = new Date(today.getTime() + parseInt(cutoffTime.split(':')[0]) * 60 * 60 * 1000 + parseInt(cutoffTime.split(':')[1]) * 60 * 1000)
      
      if (now > cutoff) {
        // Move to next day
        cutoff.setDate(cutoff.getDate() + 1)
      }
      
      const diff = cutoff.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      
      setTimeLeft(`${hours}h ${minutes}m`)
    }

    updateTimeLeft()
    const interval = setInterval(updateTimeLeft, 60000)
    return () => clearInterval(interval)
  }, [cutoffTime])

  return (
    <Card className={`border-0 bg-gradient-to-r from-green-50 to-emerald-50 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-charcoal text-sm">
              Expedícia dnes do {cutoffTime}
            </p>
            <p className="text-xs text-muted">
              Objednaj do {timeLeft} a dostaneš zajtra
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface SaleTimerProps {
  discountPercentage: number
  originalPrice: number
  salePrice: number
  className?: string
}

export function SaleTimer({ 
  discountPercentage, 
  originalPrice, 
  salePrice,
  className = ''
}: SaleTimerProps) {
  return (
    <Card className={`border-0 bg-gradient-to-r from-red-500 to-orange-500 ${className}`}>
      <CardContent className="p-4">
        <div className="text-center text-white">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">FLASH VÝPREDAJ</span>
          </div>
          
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-2xl font-bold">-{discountPercentage}%</span>
            <div className="text-right">
              <div className="text-sm line-through opacity-75">
                {originalPrice.toFixed(2)}€
              </div>
              <div className="text-lg font-bold">
                {salePrice.toFixed(2)}€
              </div>
            </div>
          </div>
          
          <CountdownTimer variant="sale" className="bg-transparent" />
        </div>
      </CardContent>
    </Card>
  )
}