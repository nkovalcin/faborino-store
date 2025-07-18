'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useCartStore } from '@/stores/cart'
import { 
  Home, 
  Package, 
  Grid3X3, 
  ShoppingCart, 
  User, 
  Menu,
  Search,
  Phone,
  Heart,
  ChevronRight,
  Star,
  Award,
  Info
} from 'lucide-react'

const navigationItems = [
  { href: '/sk', label: 'Domov', icon: Home },
  { href: '/sk/produkty', label: 'Produkty', icon: Package },
  { href: '/sk/kategorie', label: 'Kategórie', icon: Grid3X3 },
  { href: '/sk/o-nas', label: 'O nás', icon: Info },
  { href: '/sk/kontakt', label: 'Kontakt', icon: Phone },
]

const categories = [
  { name: 'Stolíčky', href: '/sk/kategorie/stolicky', icon: '🪑' },
  { name: 'Stoly', href: '/sk/kategorie/stoly', icon: '🪑' },
  { name: 'Poličky', href: '/sk/kategorie/policky', icon: '📚' },
  { name: 'Lezecké prvky', href: '/sk/kategorie/lezecke', icon: '🧗' },
  { name: 'Hračky', href: '/sk/kategorie/hracky', icon: '🧸' },
  { name: 'Kojenecké', href: '/sk/kategorie/kojenecke', icon: '👶' },
]

export function MobileNavigation() {
  const pathname = usePathname()
  const { items, getItemCount } = useCartStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const totalItems = getItemCount()

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-cream-white md:hidden">
        <div className="container-responsive">
          <div className="flex items-center justify-between h-14">
            {/* Menu Button */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle className="text-left">Menu</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  {/* Main Navigation */}
                  <div className="space-y-1 mb-6">
                    {navigationItems.map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                            isActive
                              ? 'bg-primary text-white'
                              : 'hover:bg-surface text-charcoal'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>

                  {/* Categories */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-muted mb-3 px-3">
                      Kategórie
                    </h3>
                    <div className="space-y-1">
                      {categories.map((category) => (
                        <Link
                          key={category.href}
                          href={category.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface text-charcoal transition-colors"
                        >
                          <span className="text-lg">{category.icon}</span>
                          <span className="text-sm">{category.name}</span>
                          <ChevronRight className="w-4 h-4 ml-auto text-muted" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Trust Indicators */}
                  <div className="border-t border-cream-white pt-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>4.9/5 hodnotenie</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted">
                        <Award className="w-4 h-4 text-primary" />
                        <span>12,000+ spokojných zákazníkov</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/sk" className="flex items-center">
              <span className="text-xl font-bold text-primary">Faborino</span>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="p-2">
                <Search className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Heart className="w-5 h-5" />
              </Button>
              <Link href="/sk/kosik">
                <Button variant="ghost" size="sm" className="p-2 relative">
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 text-xs">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-cream-white md:hidden">
        <div className="grid grid-cols-5 gap-1">
          {navigationItems.slice(0, 4).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 py-2 px-1 transition-colors ${
                  isActive
                    ? 'text-primary bg-primary/5'
                    : 'text-muted hover:text-charcoal'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
          <Link
            href="/sk/kosik"
            className={`flex flex-col items-center gap-1 py-2 px-1 transition-colors relative ${
              pathname === '/sk/kosik'
                ? 'text-primary bg-primary/5'
                : 'text-muted hover:text-charcoal'
            }`}
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 w-4 h-4 rounded-full p-0 text-xs">
                  {totalItems}
                </Badge>
              )}
            </div>
            <span className="text-xs font-medium">Košík</span>
          </Link>
        </div>
      </div>

      {/* Spacer for fixed headers */}
      <div className="h-14 md:hidden" />
    </>
  )
}

export function MobileBottomSpacer() {
  return <div className="h-16 md:hidden" />
}