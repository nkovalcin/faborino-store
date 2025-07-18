import React from 'react'
import Link from 'next/link'
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

const footerLinks = {
  company: [
    { name: 'O nás', href: '/o-nas' },
    { name: 'Kontakt', href: '/kontakt' },
    { name: 'Kariéra', href: '/kariera' },
    { name: 'Novinky', href: '/blog' },
  ],
  support: [
    { name: 'Často kladené otázky', href: '/faq' },
    { name: 'Doprava a platba', href: '/doprava' },
    { name: 'Reklamácie', href: '/reklamacie' },
    { name: 'Montážny návod', href: '/montaz' },
  ],
  legal: [
    { name: 'Obchodné podmienky', href: '/obchodne-podmienky' },
    { name: 'Ochrana súkromia', href: '/ochrana-sukromia' },
    { name: 'Cookies', href: '/cookies' },
    { name: 'GDPR', href: '/gdpr' },
  ],
  categories: [
    { name: 'Prvé kroky', href: '/kategorie/first-steps' },
    { name: 'Odvážni prieskumníci', href: '/kategorie/brave-explorers' },
    { name: 'Sebavedomí lezci', href: '/kategorie/confident-climbers' },
    { name: 'Kreatívne priestory', href: '/kategorie/creative-spaces' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      <div className="container-smart">
        {/* Newsletter Section */}
        <div className="border-b border-white/10 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-semibold mb-4 text-white">
              Montessori tipy priamo do vašej schránky
            </h3>
            <p className="text-white/70 mb-6">
              Získajte praktické rady pre podporu nezávislosti vašich detí a exkluzívne ponuky.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Váš email"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-transparent transition-all duration-200"
              />
              <Button className="bg-[#D4A574] hover:bg-[#C8A882] text-white px-6 py-3 whitespace-nowrap rounded-xl font-medium transition-all duration-200">
                Prihlásiť sa
              </Button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-h3 font-bold">Faborino</span>
            </div>
            <p className="text-white/70 mb-6 max-w-md">
              Podporujeme prirodzený vývoj detí prostredníctvom premysleného Montessori nábytku 
              vyrobeného z kvalitných európskych materiálov.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-h4 font-semibold mb-4">Spoločnosť</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-h4 font-semibold mb-4">Podpora</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-h4 font-semibold mb-4">Kategórie</h4>
            <ul className="space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-white/10 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-primary" />
              <span className="text-white/70">info@faborino.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-primary" />
              <span className="text-white/70">+421 123 456 789</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-white/70">Bratislava, Slovensko</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/70 text-sm">
            © 2024 Faborino. Všetky práva vyhradené.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
            <div className="text-sm">🇪🇺 Made in EU</div>
            <div className="text-sm">✓ FSC Certified</div>
            <div className="text-sm">🛡️ CE Certified</div>
            <div className="text-sm">♻️ Eco-Friendly</div>
            <div className="text-sm">🏆 Premium Quality</div>
          </div>
        </div>
      </div>
    </footer>
  )
}