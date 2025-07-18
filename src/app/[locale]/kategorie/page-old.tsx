'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, Baby, User, Users, Target, Award, Heart, ChevronRight, ArrowRight, Clock, Shield, Leaf, ChevronLeft } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function CategoriesPage() {
  const locale = useLocale();
  const t = useTranslations();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Age-based developmental categories following Montessori principles
  const mainCategories = [
    {
      id: 'first-steps',
      name: 'Prvé Kroky',
      ageRange: '0-1.5 roka',
      ageMonths: '0-18 mesiacov',
      description: 'Podporujeme senzorický rozvoj a základné motorické zručnosti najmenších',
      icon: Baby,
      color: 'bg-gradient-to-br from-pink-50 to-pink-100',
      textColor: 'text-pink-700',
      borderColor: 'border-pink-200',
      subcategories: [
        { id: 'baby-swings', name: 'Detské Hojdačky', count: 8, description: 'Jemné hojdanie pre upokojenie' },
        { id: 'baby-hammocks', name: 'Detské Hojdacie Postieľky', count: 3, description: 'Bezpečné hniezdo pre odpočinok' },
        { id: 'baby-gym-mats', name: 'Gymnastické Podložky', count: 3, description: 'Prvé pohyby na mäkkej podložke' },
        { id: 'door-bouncers', name: 'Dverové Hojdačky', count: 4, description: 'Posilňovanie nôžok' },
        { id: 'sensory-swings', name: 'Senzorické Hojdačky', count: 6, description: 'Stimulácia zmyslov' },
        { id: 'climbing-blocks', name: 'Mäkké Bloky', count: 3, description: 'Bezpečné prvé lezenie' }
      ]
    },
    {
      id: 'brave-explorers',
      name: 'Odvážni Objavitelia',
      ageRange: '1.5-3 roky',
      ageMonths: '18-36 mesiacov',
      description: 'Rozvíjame koordináciu, rovnováhu a sebavedomie v pohybe',
      icon: User,
      color: 'bg-gradient-to-br from-blue-50 to-blue-100',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      subcategories: [
        { id: 'balance-boards', name: 'Balanćné Dosky', count: 7, description: 'Tréning rovnováhy' },
        { id: 'climbing-triangles', name: 'Pikler Trojuholníky', count: 8, description: 'Klasické lezenie' },
        { id: 'balance-beams', name: 'Balanćné Kladiny', count: 5, description: 'Precízna chôdza' },
        { id: 'learning-towers', name: 'Učiace Veže', count: 3, description: 'Nezávislosť v kuchyni' },
        { id: 'small-climbing-frames', name: 'Malé Preliezky', count: 6, description: 'Komplexné lezenie' },
        { id: 'toddler-slides', name: 'Detské Šmýkačky', count: 4, description: 'Radosť zo šmýkania' }
      ]
    },
    {
      id: 'confident-climbers',
      name: 'Sebavedomí Lezci',
      ageRange: '3-6 rokov',
      ageMonths: '36+ mesiacov',
      description: 'Budujeme silu, koordináciu a sebadôveru prostredníctvom náročnejších aktivít',
      icon: Users,
      color: 'bg-gradient-to-br from-green-50 to-green-100',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      subcategories: [
        { id: 'climbing-walls', name: 'Lezecké Steny', count: 4, description: 'Výzvy pre pokročilých' },
        { id: 'swedish-ladders', name: 'Švédske Rebríky', count: 4, description: 'Klasické gymnastické cvičenie' },
        { id: 'complete-climbing-sets', name: 'Kompletné Lezecké Sety', count: 8, description: 'Celé ihrisko doma' },
        { id: 'climbing-accessories', name: 'Lezecké Príslušenstvo', count: 10, description: 'Rozšírenia a doplnky' },
        { id: 'garden-swings', name: 'Záhradné Hojdačky', count: 3, description: 'Vonkajšie aktivity' },
        { id: 'gymnastics-equipment', name: 'Gymnastické Náčinie', count: 2, description: 'Profesionálne cvičenie' }
      ]
    },
    {
      id: 'creative-spaces',
      name: 'Kreatívne Priestory',
      ageRange: '1-10 rokov',
      ageMonths: '12-120 mesiacov',
      description: 'Vytvárame priestor pre predstavivosť a praktické životné zručnosti',
      icon: Target,
      color: 'bg-gradient-to-br from-purple-50 to-purple-100',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
      subcategories: [
        { id: 'childrens-furniture', name: 'Detský Nábytok', count: 3, description: 'Nábytok prispôsobený deťom' },
        { id: 'bookshelves', name: 'Knižnice', count: 1, description: 'Láska ku knihám' },
        { id: 'clothes-rails', name: 'Vešiaky na Oblečenie', count: 1, description: 'Samostatnosť v obliekaní' },
        { id: 'sandboxes', name: 'Pieskoviská', count: 1, description: 'Kreativita s pieskom' },
        { id: 'tents', name: 'Detské Stany', count: 1, description: 'Vlastný priestor na hranie' }
      ]
    },
    {
      id: 'growing-together',
      name: 'Rastieme Spolu',
      ageRange: 'Rozšíriteľné sety',
      ageMonths: 'Prispôsobivé',
      description: 'Modulárne riešenia, ktoré rastú s vaším dieťaťom',
      icon: Award,
      color: 'bg-gradient-to-br from-amber-50 to-amber-100',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-200',
      subcategories: [
        { id: 'modular-climbing-sets', name: 'Modulárne Lezecké Sety', count: 1, description: 'Expandovateľné systémy' },
        { id: 'expandable-blocks', name: 'Rozšíriteľné Bloky', count: 1, description: 'Nekonečné možnosti' },
        { id: 'progressive-balance-sets', name: 'Progresívne Balanćné Sety', count: 1, description: 'Postupné zvyšovanie náročnosti' },
        { id: 'combination-frames', name: 'Kombinované Rámy', count: 1, description: 'Multifunkčné riešenia' }
      ]
    }
  ];


  const breadcrumbs = [
    { label: 'Domov', href: `/${locale}` },
    { label: 'Kategórie', href: `/${locale}/kategorie` }
  ];

  // SEO and structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Montessori Kategórie - Faborino",
    "description": "Objavte naše Montessori kategórie rozdelené podľa veku dieťaťa. Kvalitné drevené hračky a nábytok pre prirodzený vývoj.",
    "url": `https://faborino.sk/${locale}/kategorie`,
    "mainEntity": {
      "@type": "ItemList",
      "name": "Montessori Kategórie",
      "itemListElement": mainCategories.map((category, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "ProductGroup",
          "name": category.name,
          "description": category.description,
          "category": "Montessori Toys",
          "audience": {
            "@type": "PeopleAudience",
            "suggestedMinAge": category.ageMonths.split('-')[0] + " months",
            "suggestedMaxAge": category.ageMonths.split('-')[1]?.replace('+ mesiacov', '+ months') || "unlimited"
          }
        }
      }))
    },
    "publisher": {
      "@type": "Organization",
      "name": "Faborino",
      "logo": {
        "@type": "ImageObject",
        "url": "https://faborino.sk/logo.png"
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F3]">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
        {/* Hero Section with Breadcrumbs */}
      <div className="relative bg-gradient-to-br from-[#F7F5F3] via-white to-[#F7F5F3] overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,#D4A574_0%,transparent_70%)] opacity-20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,#4A6741_0%,transparent_70%)] opacity-15"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-[#D4A574]/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-[#4A6741]/10 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-[#E17B47]/10 rounded-full blur-xl animate-float" style={{animationDelay: '4s'}}></div>
        
        <div className="container-smart relative z-10">
          {/* Breadcrumbs */}
          <div className="pt-6 pb-4">
            <nav className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.href} className="flex items-center">
                  {index > 0 && (
                    <ChevronRight className="w-4 h-4 text-[#6B7280] mx-2" />
                  )}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-[#3A3A3A] font-semibold bg-[#D4A574]/10 px-3 py-1 rounded-full">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link 
                      href={crumb.href} 
                      className="text-[#6B7280] hover:text-[#D4A574] transition-colors duration-200 hover:bg-[#D4A574]/5 px-3 py-1 rounded-full"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
          
          {/* Hero Content */}
          <div className="text-center py-16 md:py-24">
            <div className="max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-[#D4A574]/20 mb-6">
                <Target className="w-4 h-4 text-[#D4A574]" />
                <span className="text-sm font-medium text-[#3A3A3A]">Inteligentné rozdelenie podľa veku</span>
              </div>
              
              {/* Main Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#3A3A3A] mb-6 leading-tight">
                Nájdite správne 
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-[#D4A574] to-[#E17B47] bg-clip-text text-transparent">
                    produkty
                  </span>
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#D4A574] to-[#E17B47] rounded-full opacity-30"></div>
                </span>
                <br className="hidden md:block" />
                pre váš poklad
              </h1>
              
              {/* Subtitle */}
              <p className="text-lg md:text-xl text-[#6B7280] max-w-2xl mx-auto mb-8 leading-relaxed">
                Naše kategórie sú navrhnuté podľa Montessori princípov a vývojových fáz detí. 
                Každý produkt podporuje prirodzený rozvoj vášho dieťaťa.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto mb-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#D4A574] mb-2">6</div>
                  <div className="text-sm text-[#6B7280]">Hlavných kategórií</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#D4A574] mb-2">25+</div>
                  <div className="text-sm text-[#6B7280]">Podkategórií</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#D4A574] mb-2">100+</div>
                  <div className="text-sm text-[#6B7280]">Produktov</div>
                </div>
              </div>
              
              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-[#D4A574] hover:bg-[#C8A882] text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                  onClick={() => {
                    document.getElementById('categories-grid')?.scrollIntoView({ 
                      behavior: 'smooth' 
                    });
                  }}
                >
                  Preskúmať kategórie
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  className="border-[#D4A574] text-[#D4A574] hover:bg-[#D4A574] hover:text-white px-8 py-3 rounded-full transition-all duration-200"
                  asChild
                >
                  <Link href={`/${locale}/poradca`}>
                    Potrebujem poradenstvo
                    <Users className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-smart py-6">
        {/* Age-Based Categories Slider Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#3A3A3A] mb-4">
              Nájdite produkty podľa veku vášho dieťaťa
            </h2>
            <p className="text-lg text-[#6B7280] max-w-3xl mx-auto leading-relaxed">
              Každá veková kategória je navrhnutá podľa Montessori princípov a podporuje 
              prirodzený vývoj vášho dieťaťa v každom štádiu.
            </p>
          </div>
          
          {/* Slider Container */}
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg border-2 border-[#E5E7EB] flex items-center justify-center transition-all duration-200 ${
                currentSlide === 0 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-[#D4A574] hover:text-white hover:border-[#D4A574] hover:shadow-xl'
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={() => setCurrentSlide(Math.min(mainCategories.length - 3, currentSlide + 1))}
              disabled={currentSlide >= mainCategories.length - 3}
              className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg border-2 border-[#E5E7EB] flex items-center justify-center transition-all duration-200 ${
                currentSlide >= mainCategories.length - 3 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-[#D4A574] hover:text-white hover:border-[#D4A574] hover:shadow-xl'
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            
            {/* Slider Content */}
            <div className="overflow-hidden mx-16">
              <div 
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * (100 / 3)}%)` }}
              >
                {mainCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <div key={category.id} className="w-1/3 flex-shrink-0 px-4">
                      <Card className={`group hover:shadow-xl transition-all duration-300 border-2 ${category.borderColor} overflow-hidden h-full`}>
                        <CardContent className="p-0 h-full flex flex-col">
                          <div className={`${category.color} p-8 text-center relative overflow-hidden`}>
                            {/* Background decoration */}
                            <div className="absolute inset-0 opacity-20">
                              <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full opacity-30 transform rotate-45"></div>
                              <div className="absolute bottom-4 left-4 w-24 h-24 bg-white rounded-full opacity-20"></div>
                            </div>
                            
                            <div className="relative z-10">
                              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4 group-hover:scale-110 transition-transform">
                                <Icon className={`w-10 h-10 ${category.textColor}`} />
                              </div>
                              
                              {/* Age Range - Prominently displayed */}
                              <div className="mb-4">
                                <div className={`inline-flex items-center px-6 py-3 rounded-full bg-white/90 backdrop-blur-sm shadow-md border-2 ${category.borderColor}`}>
                                  <Clock className={`w-5 h-5 ${category.textColor} mr-2`} />
                                  <span className={`text-lg font-bold ${category.textColor}`}>
                                    {category.ageRange}
                                  </span>
                                </div>
                              </div>
                              
                              <h3 className={`text-2xl font-bold ${category.textColor} mb-2`}>
                                {category.name}
                              </h3>
                            </div>
                          </div>
                          
                          <div className="p-6 flex-grow flex flex-col">
                            <p className="text-[#6B7280] mb-6 leading-relaxed">
                              {category.description}
                            </p>
                            
                            {/* Subcategories Preview */}
                            <div className="mb-6 flex-grow">
                              <h4 className="text-sm font-semibold text-[#3A3A3A] mb-3 uppercase tracking-wide">
                                Čo nájdete:
                              </h4>
                              <div className="grid grid-cols-1 gap-2">
                                {category.subcategories.slice(0, 3).map((sub) => (
                                  <div key={sub.id} className="flex items-center justify-between p-2 bg-[#F7F5F3] rounded-lg">
                                    <span className="text-sm text-[#3A3A3A] font-medium">{sub.name}</span>
                                    <span className="text-xs text-[#6B7280] bg-white px-2 py-1 rounded-full">
                                      {sub.count}
                                    </span>
                                  </div>
                                ))}
                                {category.subcategories.length > 3 && (
                                  <div className="text-center pt-2">
                                    <span className="text-xs text-[#6B7280]">
                                      +{category.subcategories.length - 3} ďalších kategórií
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* CTA Button */}
                            <Button 
                              className={`w-full bg-gradient-to-r from-[#D4A574] to-[#E17B47] hover:from-[#C8A882] hover:to-[#D4A574] text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1`}
                              onClick={() => setSelectedCategory(category.id)}
                            >
                              Preskúmať {category.name}
                              <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Slide Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: mainCategories.length - 2 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    i === currentSlide
                      ? 'bg-[#D4A574] scale-125'
                      : 'bg-[#E5E7EB] hover:bg-[#D4A574]/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* All Subcategories Section - Visual Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#3A3A3A] mb-4">
              Preskúmajte naše kategórie
            </h2>
            <p className="text-lg text-[#6B7280] max-w-3xl mx-auto leading-relaxed">
              Každá kategória je starostlivo navrhnutá pre konkrétne potreby vášho dieťaťa
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mainCategories.flatMap((category) => 
              category.subcategories.slice(0, 8).map((subcategory) => (
                <Card key={`${category.id}-${subcategory.id}`} className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-[#E5E7EB] overflow-hidden">
                  <CardContent className="p-0">
                    {/* Image placeholder with category color */}
                    <div className={`${category.color} h-48 relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      <div className="absolute top-4 right-4 z-10">
                        <span className="text-xs bg-white/90 backdrop-blur-sm text-[#3A3A3A] px-2 py-1 rounded-full font-medium">
                          {subcategory.count} produktov
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 z-10">
                        <span className={`text-xs bg-white/90 backdrop-blur-sm ${category.textColor} px-2 py-1 rounded-full font-medium`}>
                          {category.ageRange}
                        </span>
                      </div>
                      
                      {/* Category icon as a large centered element */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <category.icon className={`w-10 h-10 ${category.textColor}`} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="mb-3">
                        <h3 className="font-bold text-[#3A3A3A] mb-1 group-hover:text-[#D4A574] transition-colors">
                          {subcategory.name}
                        </h3>
                        <p className="text-xs text-[#6B7280] uppercase tracking-wide">
                          {category.name}
                        </p>
                      </div>
                      
                      {subcategory.description && (
                        <p className="text-sm text-[#6B7280] mb-4 leading-relaxed">
                          {subcategory.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${category.color.replace('bg-gradient-to-br', 'bg-gradient-to-r')}`}></div>
                          <span className="text-xs text-[#6B7280]">
                            {category.name}
                          </span>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-[#D4A574] hover:bg-[#C8A882] text-white text-xs px-4 py-2 rounded-full"
                        >
                          Zobraziť
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          
          {/* Show more button */}
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              className="border-[#D4A574] text-[#D4A574] hover:bg-[#D4A574] hover:text-white px-8 py-3 rounded-full font-semibold"
            >
              Zobraziť všetky kategórie
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Customer Reviews and Social Proof Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#3A3A3A] mb-4">
              Čo hovoria naši zákazníci
            </h2>
            <p className="text-lg text-[#6B7280] max-w-3xl mx-auto leading-relaxed">
              Spoľahnite sa na skúsenosti tisícok spokojných rodičov, ktorí vybrali Faborino
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Review 1 */}
            <Card className="bg-white border-2 border-[#E5E7EB] hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 mr-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-[#6B7280]">5.0</span>
                </div>
                <blockquote className="text-[#3A3A3A] mb-4 italic">
                  "Pikler trojuholník od Faborino zmenil náš domáci život. Naša 2-ročná dcéra ho používa každý deň a vidno, ako sa jej zvyšuje sebavedomie pri pohybe."
                </blockquote>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#D4A574] rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold text-sm">MK</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#3A3A3A] text-sm">Mária Kováčová</p>
                    <p className="text-xs text-[#6B7280]">Bratislava</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Review 2 */}
            <Card className="bg-white border-2 border-[#E5E7EB] hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 mr-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-[#6B7280]">5.0</span>
                </div>
                <blockquote className="text-[#3A3A3A] mb-4 italic">
                  "Kvalita spracovania je vynikajúca. Drevo je hladké, bez ostrých hrán. Vnútri som si istý, že je to bezpečné pre moje deti. Už rok a stále vyzerá ako nový!"
                </blockquote>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#4A6741] rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold text-sm">PS</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#3A3A3A] text-sm">Peter Slabý</p>
                    <p className="text-xs text-[#6B7280]">Košice</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Review 3 */}
            <Card className="bg-white border-2 border-[#E5E7EB] hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 mr-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-[#6B7280]">5.0</span>
                </div>
                <blockquote className="text-[#3A3A3A] mb-4 italic">
                  "Ako Montessori učiteľka môžem povedať, že Faborino produkty spĺňajú všetky princípy. Deti sa učia prirodzene a bezpečne."
                </blockquote>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#E17B47] rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold text-sm">JN</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#3A3A3A] text-sm">Jana Nováková</p>
                    <p className="text-xs text-[#6B7280]">Trnava</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Social Proof Stats */}
          <div className="mt-12 bg-gradient-to-r from-[#F7F5F3] to-white rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-[#D4A574] mb-2">5000+</div>
                <div className="text-[#6B7280]">Spokojných rodičov</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#D4A574] mb-2">4.9</div>
                <div className="text-[#6B7280]">Priemerné hodnotenie</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#D4A574] mb-2">98%</div>
                <div className="text-[#6B7280]">Odporúča nás</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#D4A574] mb-2">15+</div>
                <div className="text-[#6B7280]">Rokov skúsenosti</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Montessori Education Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-[#4A6741] to-[#A8B5A0] rounded-2xl p-8 md:p-12 text-white">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-8">
                <Award className="w-6 h-6" />
                <span className="font-semibold">Montessori princípy</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Prečo si vybrať Montessori prístup?
              </h2>
              
              <p className="text-lg md:text-xl mb-8 leading-relaxed opacity-90">
                Montessori metóda je vedecky podložený prístup, ktorý podporuje prirodzený vývoj dieťaťa. 
                Naše produkty sú navrhnuté tak, aby reszpektovali tempo a individuálne potreby každého dieťaťa.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Baby className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Prirodzený vývoj</h3>
                  <p className="text-sm opacity-80">Produkty prispôsobené vývojovým štádiám dieťaťa</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Bezpečnosť</h3>
                  <p className="text-sm opacity-80">Certifikované materiály a dôsledná kontrola kvality</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Leaf className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Trvácivosť</h3>
                  <p className="text-sm opacity-80">Prírodné materiály a ekologická výroba</p>
                </div>
              </div>
              
              <Button 
                className="bg-white text-[#4A6741] hover:bg-[#F7F5F3] font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                asChild
              >
                <Link href={`/${locale}/o-nas`}>
                  Zistite viac o našej filozofii
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}