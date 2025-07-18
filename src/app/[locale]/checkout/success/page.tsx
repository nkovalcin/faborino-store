import React from 'react'
import Link from 'next/link'
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-responsive py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-h1 font-bold text-charcoal mb-4">
            Objednávka bola úspešne odoslaná!
          </h1>
          
          <p className="text-muted text-lg mb-8">
            Ďakujeme za váš nákup. Potvrdenie objednávky sme odoslali na váš email.
          </p>

          {/* Order Details */}
          <Card className="text-left mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Čo sa deje ďalej?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-charcoal mb-1">
                    Spracovanie objednávky
                  </h4>
                  <p className="text-sm text-muted">
                    Vaša objednávka sa spracováva a pripravuje na odoslanie. Zvyčajne to trvá 1-2 pracovné dni.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-charcoal mb-1">
                    Odoslanie
                  </h4>
                  <p className="text-sm text-muted">
                    Pošleme vám email s tracking číslom, aby ste mohli sledovať svoju zásielku.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-charcoal mb-1">
                    Doručenie
                  </h4>
                  <p className="text-sm text-muted">
                    Kurér vám doručí balík priamo domov alebo na vami zvolenú adresu.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="text-left mb-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-charcoal mb-1">
                    Potrebujete pomoc?
                  </h4>
                  <p className="text-sm text-muted mb-2">
                    Ak máte akékoľvek otázky ohľadom vašej objednávky, kontaktujte nás.
                  </p>
                  <div className="space-y-1 text-sm">
                    <p>📧 info@faborino.com</p>
                    <p>📞 +421 123 456 789</p>
                    <p>⏰ Pondelok - Piatok: 9:00 - 17:00</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/produkty">
              <Button size="lg">
                Pokračovať v nákupe
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            <Link href="/kontakt">
              <Button variant="outline" size="lg">
                Kontaktovať podporu
              </Button>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-12 p-6 bg-cream-white/50 rounded-card">
            <h3 className="font-semibold text-charcoal mb-3">
              Pozrite si aj naše ďalšie služby
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-charcoal mb-1">
                  Montážny servis
                </h4>
                <p className="text-muted">
                  Ponúkame profesionálnu montáž vašich produktov
                </p>
              </div>
              <div>
                <h4 className="font-medium text-charcoal mb-1">
                  Montessori poradňa
                </h4>
                <p className="text-muted">
                  Bezplatné konzultácie o výbere vhodných produktov
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}