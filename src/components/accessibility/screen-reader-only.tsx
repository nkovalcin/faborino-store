'use client'

import { ReactNode } from 'react'

interface ScreenReaderOnlyProps {
  children: ReactNode
  as?: keyof JSX.IntrinsicElements
  className?: string
}

export function ScreenReaderOnly({ 
  children, 
  as: Component = 'span', 
  className = '' 
}: ScreenReaderOnlyProps) {
  return (
    <Component className={`sr-only ${className}`}>
      {children}
    </Component>
  )
}

// Utility component for live regions
interface LiveRegionProps {
  children: ReactNode
  priority?: 'polite' | 'assertive' | 'off'
  atomic?: boolean
  relevant?: 'additions' | 'removals' | 'text' | 'all'
  className?: string
}

export function LiveRegion({ 
  children, 
  priority = 'polite', 
  atomic = false, 
  relevant = 'additions text',
  className = ''
}: LiveRegionProps) {
  return (
    <div
      aria-live={priority}
      aria-atomic={atomic}
      aria-relevant={relevant}
      className={`sr-only ${className}`}
    >
      {children}
    </div>
  )
}

// Component for status updates
interface StatusProps {
  children: ReactNode
  type?: 'status' | 'alert' | 'log'
  className?: string
}

export function Status({ 
  children, 
  type = 'status', 
  className = ''
}: StatusProps) {
  const roleMap = {
    status: 'status',
    alert: 'alert',
    log: 'log'
  }

  return (
    <div
      role={roleMap[type]}
      aria-live={type === 'alert' ? 'assertive' : 'polite'}
      className={`sr-only ${className}`}
    >
      {children}
    </div>
  )
}