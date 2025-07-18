import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'secondary' | 'outline' | 'destructive'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        {
          'bg-primary text-white': variant === 'default',
          'bg-secondary text-charcoal': variant === 'secondary',
          'border border-cream-white text-muted': variant === 'outline',
          'bg-red-100 text-red-800': variant === 'destructive',
        },
        className
      )}
    >
      {children}
    </span>
  )
}