'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Shield, Truck, Award, Sparkles, Leaf, Users, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AboutUsPage() {
  const locale = useLocale();
  const t = useTranslations();

  const breadcrumbs = [
    { label: 'Domov', href: `/${locale}` },
    { label: 'O nás', href: `/${locale}/o-nas` }
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F3]">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="container-smart py-2">
          <nav className="flex space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center">
                {index > 0 && <span className="text-[#6B7280] mx-2">/</span>}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-[#3A3A3A] font-medium">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="text-[#6B7280] hover:text-[#D4A574] transition-colors">
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Hero Section with Pattern */}
      <div className="bg-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-hero opacity-20"></div>
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'url(/images/pattern-faborino-1.png)',
            backgroundSize: '150px 150px',
            backgroundRepeat: 'repeat'
          }}
        ></div>
        
        <div className="container-smart py-16 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-soft mb-6">
              <Heart className="w-5 h-5 text-[#D4A574]" />
              <span className="text-sm font-medium text-[#3A3A3A]">Rodinná tradícia</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-[#3A3A3A] mb-6">
              O <span className="text-gradient">nás</span>
            </h1>
            <p className="text-xl text-[#6B7280] leading-relaxed">
              Naša misia je podporovať prirodzený rozvoj detí prostredníctvom kvalitného Montessori nábytku
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-smart py-16">
        {/* Story Section */}
        <div className="mb-16">
          <Card className="card-3d">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-[#3A3A3A] mb-6">Náš príbeh</h2>
                  <p className="text-lg text-[#6B7280] leading-relaxed mb-6">
                    FABORINO vzniklo z lásky k deťom a presvedčenia, že kvalitný nábytok môže významne ovplyvniť ich rozvoj. Sme rodinna firma, ktorá sa špecializuje na dovoz a predaj certifikovaného Montessori nábytku pre slovenský a český trh.
                  </p>
                  <p className="text-lg text-[#6B7280] leading-relaxed">
                    Veríme, že každé dieťa si zaslúži kvalitné, bezpečné a funkčné prostredie, ktoré podporuje jeho nezávislosť a prirodzený rozvoj. Naše produkty sú vyberané s dôrazom na kvalitu, bezpečnosť a súlad s Montessori princípmi.
                  </p>
                </div>
                <div className="relative">
                  <Image 
                    src="/images/hero/hero-montessori-room.jpg" 
                    alt="Montessori Room" 
                    width={600}
                    height={400}
                    className="w-full h-96 object-cover image-hero"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#3A3A3A] text-center mb-12">Naše <span className="text-gradient">hodnoty</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="card-3d text-center hover-lift">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#D4A574] to-[#C8A882] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#3A3A3A] mb-3">Kvalita</h3>
                <p className="text-[#6B7280]">Všetky naše produkty sú vyrobené z prémiových materiálov a spĺňajú najvyššie európske štandardy bezpečnosti.</p>
              </CardContent>
            </Card>
            
            <Card className="card-3d text-center hover-lift">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#4A6741] to-[#A8B5A0] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#3A3A3A] mb-3">Bezpečnosť</h3>
                <p className="text-[#6B7280]">Každý produkt má potrebné certifikácie CE, EN71 a je dôkladne testovaný pre bezpečnosť detí.</p>
              </CardContent>
            </Card>
            
            <Card className="card-3d text-center hover-lift">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#7BA8C4] to-[#E17B47] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#3A3A3A] mb-3">Rýchla doprava</h3>
                <p className="text-[#6B7280]">Zabezpečujeme rýchlu a bezpečnú dopravu po celom Slovensku a Česku s možnosťou sledovania zásielky.</p>
              </CardContent>
            </Card>
            
            <Card className="card-3d text-center hover-lift">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#E17B47] to-[#D4A574] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#3A3A3A] mb-3">Podpora</h3>
                <p className="text-[#6B7280]">Poskytujeme kompletnú podporu pri výbere produktov a pomáhame s montážou a údržbou.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <Card className="card-3d">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="relative order-2 lg:order-1">
                  <Image 
                    src="/images/hero/hero-child-independence.jpg" 
                    alt="Child Independence" 
                    width={600}
                    height={400}
                    className="w-full h-96 object-cover image-hero"
                  />
                </div>
                <div className="order-1 lg:order-2">
                  <h2 className="text-3xl font-bold text-[#3A3A3A] mb-6">Náš <span className="text-gradient">tím</span></h2>
                  <p className="text-lg text-[#6B7280] leading-relaxed">
                    Sme tím nadšencov Montessori metódy s dlhoročnými skúsenosťami v oblasti detského nábytku a vzdelávania. Naša expertíza nám umožňuje vyberať len tie najlepšie produkty pre vaše deti.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Certificates Section */}
        <div className="mb-16">
          <Card className="card-3d">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-[#3A3A3A] text-center mb-6">Certifikácie a <span className="text-gradient">štandardy</span></h2>
              <p className="text-lg text-[#6B7280] leading-relaxed text-center max-w-4xl mx-auto mb-8">
                Všetky naše produkty spĺňajú prísne európske normy a sú certifikované pre bezpečnosť detí. Spolupracujeme len s overenými dodávateľmi, ktorí zdieľajú naše hodnoty kvality a bezpečnosti.
              </p>
              
              <div className="flex justify-center space-x-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-soft">
                    <span className="text-white font-bold text-lg">CE</span>
                  </div>
                  <p className="text-sm text-[#6B7280]">Európska zhoda</p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-soft">
                    <span className="text-white font-bold text-lg">EN71</span>
                  </div>
                  <p className="text-sm text-[#6B7280]">Bezpečnosť hračiek</p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#D4A574] to-[#C8A882] rounded-full flex items-center justify-center mx-auto mb-3 shadow-soft">
                    <span className="text-white font-bold text-lg">FSC</span>
                  </div>
                  <p className="text-sm text-[#6B7280]">Udržateľné drevo</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact CTA */}
        <div className="text-center">
          <Card className="card-3d bg-gradient-to-r from-[#D4A574] to-[#4A6741] text-white relative overflow-hidden">
            <div className="absolute inset-0 pattern-hero opacity-20"></div>
            <CardContent className="p-8 relative">
              <h2 className="text-3xl font-bold mb-4">Spojte sa s nami</h2>
              <p className="text-xl mb-6 opacity-90">
                Máte otázky o našich produktoch alebo potrebujete poradiť s výberom? Náš tím je tu pre vás.
              </p>
              <Link href={`/${locale}/kontakt`}>
                <Button className="bg-white text-[#3A3A3A] hover:bg-[#F7F5F3] px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                  Kontaktujte nás
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}