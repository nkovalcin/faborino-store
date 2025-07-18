'use client'

import { useEffect, useRef, ReactNode } from 'react'

interface FocusManagerProps {
  children: ReactNode
  restoreFocus?: boolean
  autoFocus?: boolean
  trapFocus?: boolean
  className?: string
}

export function FocusManager({ 
  children, 
  restoreFocus = false, 
  autoFocus = false, 
  trapFocus = false,
  className = ''
}: FocusManagerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (restoreFocus && isInitialMount.current) {
      previousFocusRef.current = document.activeElement as HTMLElement
    }
    isInitialMount.current = false

    return () => {
      if (restoreFocus && previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }
  }, [restoreFocus])

  useEffect(() => {
    if (autoFocus && containerRef.current) {
      const firstFocusable = getFocusableElements(containerRef.current)[0]
      if (firstFocusable) {
        firstFocusable.focus()
      }
    }
  }, [autoFocus])

  useEffect(() => {
    if (!trapFocus || !containerRef.current) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const focusableElements = getFocusableElements(containerRef.current!)
      const firstFocusable = focusableElements[0]
      const lastFocusable = focusableElements[focusableElements.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable?.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable?.focus()
          e.preventDefault()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [trapFocus])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ].join(', ')

  return Array.from(container.querySelectorAll(focusableSelectors)).filter(
    (element): element is HTMLElement => {
      return element instanceof HTMLElement && isVisible(element)
    }
  )
}

function isVisible(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element)
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0' &&
    element.offsetWidth > 0 &&
    element.offsetHeight > 0
  )
}