'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, Search, ShoppingCart, User, Heart } from 'lucide-react'
import { SearchInput } from '@/components/search/search-input'
import { useCartStore } from '@/stores/cart'
import { CartBadge } from './cart-badge'
import { cn } from '@/lib/utils'
import { useKeyboardShortcuts } from '@/components/accessibility/keyboard-navigation'

const navigationItems = [
  { name: 'Domov', href: '/sk' },
  { name: 'Kategórie', href: '/sk/kategorie' },
  { name: 'Produkty', href: '/sk/produkty' },
  { name: 'Poradca', href: '/sk/poradca' },
  { name: 'O nás', href: '/sk/o-nas' },
  { name: 'Podpora', href: '/sk/podpora' },
  { name: 'Newsletter', href: '/sk/newsletter' },
  { name: 'Kontakt', href: '/sk/kontakt' },
]

export function HeaderSimple() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { toggleCart } = useCartStore()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen)

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'ctrl+k': () => {
      setIsSearchOpen(true)
      setTimeout(() => {
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement
        if (searchInput) searchInput.focus()
      }, 100)
    },
    'ctrl+b': () => toggleCart(),
    'ctrl+h': () => router.push('/sk'),
    'ctrl+p': () => router.push('/sk/produkty'),
    'ctrl+c': () => router.push('/sk/kontakt'),
    'f1': () => router.push('/sk/podpora'),
    'esc': () => {
      setIsSearchOpen(false)
      setIsMenuOpen(false)
    }
  })

  return (
    <header className="sticky top-0 z-50 w-full bg-surface/95 backdrop-blur-sm border-b border-cream-white" role="banner">
      <div className="container-responsive">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/sk" 
            className="flex items-center space-x-2"
            aria-label="Faborino - Domovská stránka"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-h4 font-bold text-charcoal">Faborino</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Hlavná navigácia">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-2 py-1',
                  pathname === item.href
                    ? 'text-primary'
                    : 'text-charcoal'
                )}
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4" role="toolbar" aria-label="Akcie používateľa">
            {/* Search */}
            <button
              onClick={toggleSearch}
              className="p-2 hover:bg-primary/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Otvoriť vyhľadávanie"
              aria-expanded={isSearchOpen}
              aria-controls="search-dropdown"
            >
              <Search className="w-5 h-5 text-charcoal" />
            </button>

            {/* Wishlist */}
            <button 
              className="p-2 hover:bg-primary/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Obľúbené produkty"
            >
              <Heart className="w-5 h-5 text-charcoal" />
            </button>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative p-2 hover:bg-primary/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Otvoriť košík"
            >
              <ShoppingCart className="w-5 h-5 text-charcoal" />
              <CartBadge />
            </button>

            {/* User account */}
            <button 
              className="p-2 hover:bg-primary/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Používateľský účet"
            >
              <User className="w-5 h-5 text-charcoal" />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 hover:bg-primary/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Otvoriť menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-charcoal" />
              ) : (
                <Menu className="w-5 h-5 text-charcoal" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div 
            id="search-dropdown"
            className="py-4 border-t border-cream-white animate-fade-in"
            role="search"
            aria-label="Vyhľadávanie produktov"
          >
            <SearchInput
              placeholder="Hľadaj produkty..."
              className="w-full"
              autoFocus={true}
              showSuggestions={true}
            />
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden py-4 border-t border-cream-white animate-fade-in"
          >
            <nav className="flex flex-col space-y-4" role="navigation" aria-label="Mobilná navigácia">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-base font-medium transition-colors hover:text-primary py-2 px-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                    pathname === item.href
                      ? 'text-primary'
                      : 'text-charcoal'
                  )}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}