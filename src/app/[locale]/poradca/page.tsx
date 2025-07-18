'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Baby, 
  User, 
  Users, 
  Heart, 
  Star, 
  ArrowRight, 
  CheckCircle, 
  Gift,
  Target,
  Lightbulb,
  Award
} from 'lucide-react';

export default function AdvisorPage() {
  const locale = useLocale();
  const t = useTranslations();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const steps = [
    {
      id: 'age',
      title: 'Koľko má vaše dieťa rokov?',
      type: 'age',
      options: [
        { value: '0-6m', label: '0-6 mesiacov', icon: Baby },
        { value: '6-12m', label: '6-12 mesiacov', icon: Baby },
        { value: '1-2y', label: '1-2 roky', icon: User },
        { value: '2-4y', label: '2-4 roky', icon: User },
        { value: '4-6y', label: '4-6 rokov', icon: Users },
        { value: '6y+', label: '6+ rokov', icon: Users }
      ]
    },
    {
      id: 'interests',
      title: 'Čo vaše dieťa najviac zaujíma?',
      type: 'multiple',
      options: [
        { value: 'climbing', label: 'Lezenie a pohyb', icon: Target },
        { value: 'building', label: 'Stavanie a konštrukcia', icon: Award },
        { value: 'cooking', label: 'Pomoc v kuchyni', icon: Heart },
        { value: 'creativity', label: 'Kreativita a umenie', icon: Lightbulb },
        { value: 'reading', label: 'Čítanie a učenie', icon: Star },
        { value: 'independence', label: 'Nezávislé aktivity', icon: CheckCircle }
      ]
    },
    {
      id: 'space',
      title: 'Koľko miesta máte k dispozícii?',
      type: 'single',
      options: [
        { value: 'small', label: 'Malý priestor (do 10m²)', icon: Target },
        { value: 'medium', label: 'Stredný priestor (10-20m²)', icon: Target },
        { value: 'large', label: 'Veľký priestor (nad 20m²)', icon: Target }
      ]
    },
    {
      id: 'budget',
      title: 'Aký je váš rozpočet?',
      type: 'single',
      options: [
        { value: 'low', label: 'Do 100€', icon: Gift },
        { value: 'medium', label: '100-300€', icon: Gift },
        { value: 'high', label: '300-500€', icon: Gift },
        { value: 'premium', label: 'Nad 500€', icon: Gift }
      ]
    }
  ];

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getRecommendations = () => {
    const recommendations = [];
    
    // Basic recommendations based on age
    if (answers.age === '0-6m' || answers.age === '6-12m') {
      recommendations.push({
        name: 'Montessori Mobiles',
        reason: 'Ideálne pre zmyslový rozvoj najmenších',
        price: '45€',
        image: '/images/products/mobile.jpg'
      });
    }
    
    if (answers.age === '1-2y' || answers.age === '2-4y') {
      recommendations.push({
        name: 'Learning Tower',
        reason: 'Podpora nezávislosti v kuchyni',
        price: '189€',
        image: '/images/products/learning-tower.jpg'
      });
    }
    
    if (answers.interests?.includes('climbing')) {
      recommendations.push({
        name: 'Pikler Trojuholník',
        reason: 'Rozvoj hrubej motoriky',
        price: '159€',
        image: '/images/products/climbing-triangle.jpg'
      });
    }
    
    if (answers.interests?.includes('building')) {
      recommendations.push({
        name: 'Drevené Stavebné Kocky',
        reason: 'Kreativita a priestorová predstavivosť',
        price: '79€',
        image: '/images/products/wooden-blocks.jpg'
      });
    }
    
    return recommendations;
  };

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const canProceed = answers[currentStepData.id];

  const breadcrumbs = [
    { label: 'Domov', href: `/${locale}` },
    { label: 'Poradca', href: `/${locale}/poradca` }
  ];

  const benefits = [
    {
      icon: Target,
      title: 'Personalizované odporúčania',
      description: 'Produkty vybrané presne pre vek a záujmy vašeho dieťaťa'
    },
    {
      icon: Award,
      title: 'Odborné poradenstvo',
      description: 'Rady od certifikovaných Montessori špecializtov'
    },
    {
      icon: Heart,
      title: 'Overené produkty',
      description: 'Všetky produkty sú testované a schválené rodičmi'
    },
    {
      icon: Star,
      title: 'Výhodné ceny',
      description: 'Exkluzívne zľavy pre návštevníkov poradcu'
    }
  ];

  const testimonials = [
    {
      name: 'Mária K.',
      text: 'Poradca mi pomohol vybrať perfektné produkty pre môjho 2-ročného syna. Odporúčania boli presne to, čo sme potrebovali!',
      rating: 5
    },
    {
      name: 'Peter S.',
      text: 'Fantastický nástroj! Ušetril mi hodiny hľadania a dostal som presne to, čo potrebujem.',
      rating: 5
    },
    {
      name: 'Jana M.',
      text: 'Veľmi užitočné, najmä pre začiatočníkov v Montessori metóde. Odporúčam!',
      rating: 5
    }
  ];

  if (isLastStep && canProceed) {
    const recommendations = getRecommendations();
    
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumbs */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex space-x-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.href} className="flex items-center">
                  {index > 0 && <span className="text-gray-400 mx-2">/</span>}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-gray-900 font-medium">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="text-gray-600 hover:text-amber-600">
                      {crumb.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Vaše personalizované odporúčania
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Na základe vašich odpovedí sme vybrali najvhodnejšie produkty pre vaše dieťa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {recommendations.map((product, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-gray-500">Obrázok produktu</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.reason}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-amber-600">{product.price}</span>
                    <Button className="bg-amber-600 hover:bg-amber-700">
                      Pridať do košíka
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button 
              onClick={() => {
                setCurrentStep(0);
                setAnswers({});
              }}
              variant="outline"
              className="mr-4"
            >
              Spustiť znovu
            </Button>
            <Button className="bg-amber-600 hover:bg-amber-700">
              Prezrieť všetky produkty
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center">
                {index > 0 && <span className="text-gray-400 mx-2">/</span>}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-gray-900 font-medium">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="text-gray-600 hover:text-amber-600">
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Montessori Poradca
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Nájdite ideálne produkty pre vaše dieťa s naším inteligentným poradcom
            </p>
            
            {/* Progress Bar */}
            <div className="max-w-md mx-auto mb-8">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Krok {currentStep + 1} z {steps.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {currentStepData.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {currentStepData.options.map((option, index) => {
              const Icon = option.icon;
              const isSelected = currentStepData.type === 'multiple' 
                ? answers[currentStepData.id]?.includes(option.value)
                : answers[currentStepData.id] === option.value;

              return (
                <button
                  key={index}
                  onClick={() => {
                    if (currentStepData.type === 'multiple') {
                      const current = answers[currentStepData.id] || [];
                      const updated = current.includes(option.value)
                        ? current.filter((v: string) => v !== option.value)
                        : [...current, option.value];
                      handleAnswer(currentStepData.id, updated);
                    } else {
                      handleAnswer(currentStepData.id, option.value);
                    }
                  }}
                  className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
                    isSelected 
                      ? 'border-amber-600 bg-amber-50' 
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-amber-600' : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${isSelected ? 'text-amber-600' : 'text-gray-900'}`}>
                        {option.label}
                      </h3>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between">
            <Button 
              onClick={prevStep}
              disabled={currentStep === 0}
              variant="outline"
            >
              Späť
            </Button>
            <Button 
              onClick={nextStep}
              disabled={!canProceed}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {isLastStep ? 'Zobraziť odporúčania' : 'Pokračovať'}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Benefits Section */}
      {currentStep === 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Prečo použiť našich poradcu?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Testimonials */}
      {currentStep === 0 && (
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Čo hovoria naši zákazníci
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}