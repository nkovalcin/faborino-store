'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, Baby, User, Users, Target, Award, Heart, ChevronRight, ArrowRight, Clock, Shield, Leaf, ChevronLeft } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CategoriesAPI, type CategoryWithProductCount } from '@/lib/api/categories';

export default function CategoriesPage() {
  const locale = useLocale();
  const t = useTranslations();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categories, setCategories] = useState<CategoryWithProductCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await CategoriesAPI.getCategories(true);
        setCategories(response.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Nepodarilo sa načítať kategórie.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Icon mapping for categories
  const iconMap: { [key: string]: any } = {
    'first-steps': Baby,
    'brave-explorers': User,
    'confident-climbers': Users,
    'creative-spaces': Target,
    'growing-together': Award
  };

  // Color mapping for categories
  const colorMap: { [key: string]: any } = {
    'first-steps': {
      color: 'bg-gradient-to-br from-pink-50 to-pink-100',
      textColor: 'text-pink-700',
      borderColor: 'border-pink-200'
    },
    'brave-explorers': {
      color: 'bg-gradient-to-br from-blue-50 to-blue-100',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200'
    },
    'confident-climbers': {
      color: 'bg-gradient-to-br from-green-50 to-green-100',
      textColor: 'text-green-700',
      borderColor: 'border-green-200'
    },
    'creative-spaces': {
      color: 'bg-gradient-to-br from-purple-50 to-purple-100',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200'
    },
    'growing-together': {
      color: 'bg-gradient-to-br from-amber-50 to-amber-100',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-200'
    }
  };

  // Transform database categories to match UI format
  const mainCategories = categories.map(cat => ({
    id: cat.slug,
    name: typeof cat.name === 'string' ? cat.name : cat.name[locale as keyof typeof cat.name] || cat.name.sk,
    ageRange: cat.slug === 'first-steps' ? '0-1.5 roka' : cat.slug === 'brave-explorers' ? '1.5-3 roky' : cat.slug === 'confident-climbers' ? '3-6 rokov' : cat.slug === 'creative-spaces' ? '1-10 rokov' : 'Rozšíriteľné',
    ageMonths: cat.slug === 'first-steps' ? '0-18 mesiacov' : cat.slug === 'brave-explorers' ? '18-36 mesiacov' : cat.slug === 'confident-climbers' ? '36+ mesiacov' : cat.slug === 'creative-spaces' ? '12-120 mesiacov' : 'Prispôsobivé',
    description: typeof cat.description === 'string' ? cat.description : cat.description?.[locale as keyof typeof cat.description] || cat.description?.sk || '',
    icon: iconMap[cat.slug] || Target,
    ...colorMap[cat.slug] || colorMap['creative-spaces'],
    subcategories: [],
    productCount: cat.productCount || 0
  })).slice(0, 5); // Limit to 5 for slider

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5F3] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A574] mx-auto mb-4"></div>
          <p className="text-[#6B7280]">Načítajú sa kategórie...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F7F5F3] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="btn-primary">
            Skúsiť znova
          </Button>
        </div>
      </div>
    );
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, mainCategories.length - 2));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.max(1, mainCategories.length - 2)) % Math.max(1, mainCategories.length - 2));
  };

  const breadcrumbs = [
    { label: 'Domov', href: `/${locale}` },
    { label: 'Kategórie', href: `/${locale}/kategorie` }
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

      {/* Hero Section */}
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
        
        <div className="container-smart py-12 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-[#3A3A3A] mb-6">
              Montessori <span className="text-gradient">Kategórie</span>
            </h1>
            <p className="text-xl text-[#6B7280] mb-8 leading-relaxed">
              Objavte našu starostlivo kurátorovanú kolekciu Montessori nábytku a hračiek, 
              rozdelených podľa vekových kategórií a vývojových potrieb vášho dieťaťa
            </p>
          </div>
        </div>
      </div>

      {/* Categories Slider */}
      <div className="container-smart py-12">
        <div className="relative">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#3A3A3A]">
              Vekové kategórie
            </h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevSlide}
                disabled={mainCategories.length <= 3}
                className="w-10 h-10 rounded-full p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextSlide}
                disabled={mainCategories.length <= 3}
                className="w-10 h-10 rounded-full p-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="overflow-hidden mx-16">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * (100 / 3)}%)` }}
            >
              {mainCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <div
                    key={category.id}
                    className="w-1/3 flex-shrink-0 px-3"
                  >
                    <Link href={`/${locale}/kategorie/${category.id}`}>
                      <Card className={`${category.color} ${category.borderColor} border-2 h-full card-3d group cursor-pointer`}>
                        <CardContent className="p-8 text-center h-full flex flex-col justify-between">
                          <div>
                            <div className="relative mb-6">
                              <div className="w-20 h-20 bg-white/80 rounded-full flex items-center justify-center mx-auto mb-4">
                                <IconComponent className={`w-10 h-10 ${category.textColor}`} />
                              </div>
                              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-[#D4A574] to-[#F4E4C1] rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-white">{category.productCount}</span>
                              </div>
                            </div>
                            
                            <h3 className={`text-xl font-bold ${category.textColor} mb-2 group-hover:scale-105 transition-transform`}>
                              {category.name}
                            </h3>
                            
                            <div className="bg-white/60 rounded-full px-4 py-2 mb-4">
                              <span className={`text-sm font-semibold ${category.textColor}`}>
                                {category.ageRange}
                              </span>
                            </div>
                            
                            <p className={`text-sm ${category.textColor} mb-6 line-clamp-3`}>
                              {category.description}
                            </p>
                          </div>
                          
                          <Button className="btn-primary group-hover:scale-105 transition-transform">
                            Preskúmať
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* All Products Link */}
      <div className="container-smart pb-12">
        <div className="text-center">
          <Link href={`/${locale}/produkty`}>
            <Button className="btn-primary btn-lg">
              Zobraziť všetky produkty
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}