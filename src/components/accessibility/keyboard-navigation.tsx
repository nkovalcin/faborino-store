'use client'

import { useEffect, useState, ReactNode } from 'react'

interface KeyboardNavigationProps {
  children: ReactNode
  showFocusIndicator?: boolean
  className?: string
}

export function KeyboardNavigation({ 
  children, 
  showFocusIndicator = true, 
  className = ''
}: KeyboardNavigationProps) {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboardUser(true)
      }
    }

    const handleMouseDown = () => {
      setIsKeyboardUser(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  return (
    <div 
      className={`${className} ${isKeyboardUser && showFocusIndicator ? 'keyboard-user' : ''}`}
      data-keyboard-user={isKeyboardUser}
    >
      {children}
    </div>
  )
}

// Hook for keyboard shortcuts
export function useKeyboardShortcuts(shortcuts: Record<string, () => void>) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      const modifiers = {
        ctrl: e.ctrlKey,
        alt: e.altKey,
        shift: e.shiftKey,
        meta: e.metaKey
      }

      for (const [shortcut, handler] of Object.entries(shortcuts)) {
        if (matchesShortcut(shortcut, key, modifiers)) {
          e.preventDefault()
          handler()
          break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

function matchesShortcut(
  shortcut: string, 
  key: string, 
  modifiers: { ctrl: boolean; alt: boolean; shift: boolean; meta: boolean }
): boolean {
  const parts = shortcut.toLowerCase().split('+')
  const targetKey = parts[parts.length - 1]
  const targetModifiers = parts.slice(0, -1)

  if (key !== targetKey) return false

  const expectedModifiers = {
    ctrl: targetModifiers.includes('ctrl'),
    alt: targetModifiers.includes('alt'),
    shift: targetModifiers.includes('shift'),
    meta: targetModifiers.includes('meta') || targetModifiers.includes('cmd')
  }

  return (
    modifiers.ctrl === expectedModifiers.ctrl &&
    modifiers.alt === expectedModifiers.alt &&
    modifiers.shift === expectedModifiers.shift &&
    modifiers.meta === expectedModifiers.meta
  )
}

// Component for accessible buttons
interface AccessibleButtonProps {
  children: ReactNode
  onClick?: () => void
  onKeyDown?: (e: React.KeyboardEvent) => void
  disabled?: boolean
  'aria-label'?: string
  'aria-describedby'?: string
  className?: string
}

export function AccessibleButton({
  children,
  onClick,
  onKeyDown,
  disabled = false,
  className = '',
  ...ariaProps
}: AccessibleButtonProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onKeyDown) {
      onKeyDown(e)
    }
    
    if ((e.key === 'Enter' || e.key === ' ') && onClick && !disabled) {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className={`focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${className}`}
      {...ariaProps}
    >
      {children}
    </button>
  )
}