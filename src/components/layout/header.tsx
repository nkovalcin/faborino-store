'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Menu, X, Search, ShoppingCart, User, Heart, Phone, Mail, MapPin, Truck } from 'lucide-react'
// import { Button } from '@/components/ui/button'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useCartStore } from '@/stores/cart'
import { cn } from '@/lib/utils'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const t = useTranslations('navigation')
  const tProducts = useTranslations('products')
  const tCommon = useTranslations('common')
  const tHeader = useTranslations('header')
  const locale = useLocale()
  const pathname = usePathname()
  const { getItemCount, toggleCart } = useCartStore()
  const itemCount = getItemCount()

  const navigationItems = [
    { name: t('home'), href: `/${locale}` },
    { name: t('categories'), href: `/${locale}/kategorie` },
    { name: t('products'), href: `/${locale}/produkty` },
    { name: tHeader('advisor'), href: `/${locale}/poradca` },
    { name: t('about'), href: `/${locale}/o-nas` },
    { name: t('contact'), href: `/${locale}/kontakt` },
  ]

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen)

  return (
    <header className="sticky top-0 z-50 w-full bg-surface/95 backdrop-blur-sm border-b border-cream-white">
      {/* Top Bar - International Info */}
      <div className="bg-gradient-to-r from-[#4A6741] to-[#A8B5A0] text-white">
        <div className="container-responsive">
          <div className="flex items-center justify-between h-10 text-xs md:text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4" />
                <span className="hidden sm:inline">{tHeader('shipping')}</span>
                <span className="sm:hidden">{tHeader('shippingShort')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span className="hidden md:inline">{tHeader('phone')}</span>
                <span className="md:hidden">{tHeader('support')}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span className="hidden lg:inline">info@faborino.com</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>🇸🇰 🇨🇿 🇩🇪 🇫🇷</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main Header */}
      <div className="container-responsive">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-h4 font-bold text-charcoal">Faborino</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname === item.href
                    ? 'text-primary'
                    : 'text-charcoal'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Search */}
            <button
              onClick={toggleSearch}
              className="p-2 hover:bg-primary/10 rounded-full transition-colors"
            >
              <Search className="w-5 h-5 text-charcoal" />
            </button>

            {/* Wishlist */}
            <button className="p-2 hover:bg-primary/10 rounded-full transition-colors">
              <Heart className="w-5 h-5 text-charcoal" />
            </button>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative p-2 hover:bg-primary/10 rounded-full transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-charcoal" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User account */}
            <button className="p-2 hover:bg-primary/10 rounded-full transition-colors">
              <User className="w-5 h-5 text-charcoal" />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 hover:bg-primary/10 rounded-full transition-colors"
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
          <div className="py-4 border-t border-cream-white animate-fade-in">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
              <input
                type="text"
                placeholder={tProducts('search')}
                className="smart-input pl-10 pr-4"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-cream-white animate-fade-in">
            <nav className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-base font-medium transition-colors hover:text-primary py-2',
                    pathname === item.href
                      ? 'text-primary'
                      : 'text-charcoal'
                  )}
                  onClick={() => setIsMenuOpen(false)}
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