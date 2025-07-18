'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  Star, 
  Play, 
  Award, 
  Shield, 
  Leaf, 
  Users, 
  Heart,
  BookOpen,
  Sparkles,
  Zap,
  TrendingUp,
  Baby,
  User,
  Users2,
  Target,
  Gift,
  CheckCircle
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getMockProducts, Product } from '@/lib/mock-products';

export default function HomePage() {
  const locale = useLocale();
  const t = useTranslations();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getMockProducts();
        setFeaturedProducts(products.slice(0, 6));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const developmentalCategories = [
    {
      id: 'first-steps',
      title: 'Prvé Kroky',
      description: 'Pre najmenších objaviteľov',
      ageRange: '0-18 mesiacov',
      icon: Baby,
      gradient: 'from-pink-400 to-rose-500',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
      features: ['Senzorický rozvoj', 'Bezpečnosť', 'Jemná motorika']
    },
    {
      id: 'brave-explorers',
      title: 'Odvážni Objavitelia',
      description: 'Pre aktívnych batoliat',
      ageRange: '18m - 3 roky',
      icon: User,
      gradient: 'from-blue-400 to-indigo-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      features: ['Rovnováha', 'Koordinácia', 'Nezávislosť']
    },
    {
      id: 'confident-climbers',
      title: 'Sebavedomí Lezci',
      description: 'Pre pokročilých malých športovcov',
      ageRange: '3-6 rokov',
      icon: Users2,
      gradient: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      features: ['Sila', 'Odvaha', 'Vytrvalosť']
    },
    {
      id: 'creative-spaces',
      title: 'Kreatívne Priestory',
      description: 'Pre predstavivosť a učenie',
      ageRange: 'Všetky vekové kategórie',
      icon: Target,
      gradient: 'from-purple-400 to-violet-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      features: ['Kreativita', 'Organizácia', 'Praktický život']
    }
  ];

  const trustSignals = [
    {
      icon: Shield,
      title: 'Európska Bezpečnosť',
      description: 'CE certifikácie a prísne bezpečnostné štandardy'
    },
    {
      icon: Leaf,
      title: 'Prírodné Materiály',
      description: 'Udržateľné drevo z európskych lesov'
    },
    {
      icon: Award,
      title: 'Montessori Princípy',
      description: 'Overené pedagogické metódy pre rozvoj dieťaťa'
    },
    {
      icon: Heart,
      title: 'Rodinná Tradícia',
      description: 'Produkty vytvorené s láskou pre vaše deti'
    }
  ];

  const testimonials = [
    {
      name: 'Anna Novákova',
      role: 'Mama dvojčiat (3 a 5 rokov)',
      content: 'Keď som prvýkrát objavila Faborino, bola som skeptická - ďalší predražený detský nábytok. Ale po 8 mesiacoch používania môžem povedať, že to bola najlepšia investícia pre našu rodinu. Pikler trojuholník sa stal srdcom nášho domova. Deti si na ňom stavajú domčeky, cvičia, čítají knižky... Vidím, ako im to buduje sebadôveru a nezávislosť. Kvalita je skutočne prémiová - žiadne štiepky, pevné spojenia, krásne drevo. Aj po intenzívnom používaní vyzerá ako nové. Susedia sa stále pýtajú, kde sme to kúpili.',
      rating: 5,
      location: 'Bratislava, SK'
    },
    {
      name: 'Petra Svobodova',
      role: 'Montessori učiteľka s 15-ročnou praxou',
      content: 'Vo svojej kariére som videla stovky detských nábytkov, ale Faborino má niečo výnimočné. Nie je to len o dizajne - je to o pochopení detskej psychológie a vývoja. Každý produkt je navrhnutý tak, aby podporoval prirodzené učenie. V našej triede máme už 3 roky ich učiacu vežu a balanční disk. Deti ich používajú prirodzene, bez donucovania. Rodičia sa ma stále pýtajú, kde sme to kúpili, lebo vidia, ako im to pomáha doma. Konečne niekto, kto rozumie Montessori princípom a nebojí sa ich implementovať do moderného dizajnu.',
      rating: 5,
      location: 'Praha, CZ'
    },
    {
      name: 'Zuzana Kováčová',
      role: 'Architektka interiérov',
      content: 'Ako architektka som veľmi kritická na detský nábytok - väčšina je buď príliš detinská, alebo nefunkčná. Faborino je výnimka. Keď som navrhovala izbu pre svojho 4-ročného syna, chcela som niečo, co bude krásne, funkčné a vydrží roky. Ich nábytok krásne zapadá do moderného interiéru, ale zároveň je skutočne praktický. Syn má teraz svoj vlastný priestor, kde sa cíti nezávisle. Drevo je nádherné, spracovanie bezchybné. Už som ich produkty odporučila 5 klientom a všetci sú nadšení. Konečne detský nábytok, ktorý nevyzerá ako lacná hračka.',
      rating: 5,
      location: 'Košice, SK'
    },
    {
      name: 'Marek Horváth',
      role: 'Otec a IT špecialista',
      content: 'Ako technik som zvyknutý na kvalitné veci, ktoré fungujú. Faborino je presne to - žiadne kompromisy, žiadne lacné riešenia. Kúpili sme lezeckú stenu pre našu 6-ročnú dcéru a je to investícia na roky. Bezpečnosť na prvom mieste, ale zároveň výzva pre dieťa. Dcéra si na nej vytvorila svoj vlastný "tréningový program". Vidím, ako jej to buduje nielen fyzickú silu, ale aj sebadôveru. Montáž bola jednoduchá, návod jasný. Po roku vyzerá stále ako nová. Odporúčam všetkým otcom, ktorí chcú pre svoje deti to najlepšie.',
      rating: 5,
      location: 'Žilina, SK'
    },
    {
      name: 'Lucia Miklošová',
      role: 'Mama samoživiteľka',
      content: 'Dlho som váhala s kúpou, lebo cena nie je najnižšia. Ale teraz viem, že to bola správna voľba. Balančný disk a malý stôl s stoličkou úplne zmenili náš byt. Môj 2-ročný syn si konečne dokáže sám obliecť topánky (vďaka učiacej veži), hrá sa samostatne a ja mám chvíľu pre seba. Najdôležitejšie je, že vidím, ako je hrdý na svoje úspechy. Kúpila som jeden produkt, ale v podstate som kúpila pokoj a radosť pre celú rodinu. Určite budem kupovať aj ďalšie produkty, keď syn porastie.',
      rating: 5,
      location: 'Trnava, SK'
    }
  ];

  const HeroSection = () => (
    <section className="relative overflow-hidden">
      {/* Pattern Background */}
      <div className="absolute inset-0 pattern-hero opacity-30"></div>
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'url(/images/pattern-faborino-1.png)',
          backgroundSize: '200px 200px',
          backgroundRepeat: 'repeat'
        }}
      ></div>
      
      <div className="relative container-smart py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-soft">
                <Sparkles className="w-5 h-5 text-[#D4A574]" />
                <span className="text-sm font-medium text-[#3A3A3A]">Montessori pre moderné domovy</span>
              </div>
              
              <h1 className="text-hero text-balance">
                Kde sa <span className="text-gradient">učenie</span> stretáva s <span className="text-gradient">hrou</span>
              </h1>
              
              <p className="text-xl text-[#6B7280] leading-relaxed max-w-2xl">
                Prémiové drevené Montessori nábytky a hračky, ktoré podporujú prirodzený rozvoj vašich detí. 
                Európska kvalita, moderný dizajn, rodinná tradícia.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={`/${locale}/kategorie`}>
                <Button className="btn-primary group">
                  Objaviť produkty
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              
              <Button className="btn-outline group">
                <Play className="mr-2 h-5 w-5" />
                Príbeh značky
              </Button>
            </div>

            <div className="flex items-center space-x-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#3A3A3A]">5000+</div>
                <div className="text-sm text-[#6B7280]">Spokojných rodín</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#3A3A3A]">4.9</div>
                <div className="text-sm text-[#6B7280]">Hodnotenie</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#3A3A3A]">100+</div>
                <div className="text-sm text-[#6B7280]">Produktov</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-large">
              <Image
                src="/images/hero/hero-montessori-room.jpg"
                alt="Krásna detská izba s Montessori nábytkom"
                width={600}
                height={400}
                className="w-full h-[500px] object-cover image-hero"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              
              {/* Floating Elements */}
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-soft">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-[#3A3A3A]">Certified Safe</span>
                </div>
              </div>
              
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-soft">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-[#D4A574]" />
                  <span className="text-sm font-medium text-[#3A3A3A]">Montessori Approved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const CategoriesSection = () => (
    <section className="py-16 bg-white">
      <div className="container-smart">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#3A3A3A] mb-4">
            Produkty podľa <span className="text-gradient">vývoja dieťaťa</span>
          </h2>
          <p className="text-xl text-[#6B7280] max-w-3xl mx-auto">
            Naše inteligentné kategórie rešpektujú prirodzené fázy vývoja a pomáhajú vybrať správne produkty pre váš poklad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {developmentalCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.id} href={`/${locale}/kategorie/${category.id}`}>
                <Card className="card-3d hover-lift group cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 ${category.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-8 h-8 ${category.textColor}`} />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-[#3A3A3A] mb-2">
                      {category.title}
                    </h3>
                    
                    <p className="text-[#6B7280] mb-3">
                      {category.description}
                    </p>
                    
                    <div className="badge-age mb-4">
                      {category.ageRange}
                    </div>
                    
                    <div className="space-y-2">
                      {category.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-[#6B7280]">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );

  const FeaturedProductsSection = () => (
    <section className="py-16 bg-[#F7F5F3]">
      <div className="container-smart">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#3A3A3A] mb-4">
            Obľúbené <span className="text-gradient">produkty</span>
          </h2>
          <p className="text-xl text-[#6B7280] max-w-3xl mx-auto">
            Najlepšie hodnotené produkty od spokojných rodín po celej Európe
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="card-product">
                <CardContent className="p-0">
                  <div className="loading-shimmer h-64 rounded-t-2xl"></div>
                  <div className="p-6 space-y-3">
                    <div className="loading-shimmer h-4 rounded"></div>
                    <div className="loading-shimmer h-3 rounded w-3/4"></div>
                    <div className="loading-shimmer h-8 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/${locale}/produkty/${product.id}`}>
                <Card className="card-product group cursor-pointer h-full">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-2xl">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={400}
                        height={300}
                        className="w-full h-64 object-cover image-product"
                      />
                      
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <div className="badge-age">
                          {product.ageMin}-{product.ageMax}m
                        </div>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="badge-sale">
                            ZĽAVA
                          </div>
                        )}
                      </div>
                      
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button className="btn-primary">
                          <ArrowRight className="w-4 h-4 mr-2" />
                          Zobraziť detail
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-[#3A3A3A] mb-2 group-hover:text-[#D4A574] transition-colors">
                        {product.name}
                      </h3>
                      
                      <p className="text-[#6B7280] mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center mb-4">
                        <div className="flex text-yellow-400 mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < 4 ? 'fill-current' : ''}`} />
                          ))}
                        </div>
                        <span className="text-sm text-[#6B7280]">4.8 (127)</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-[#3A3A3A]">
                            {product.price.toFixed(2)} €
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-lg text-[#6B7280] line-through">
                              {product.originalPrice.toFixed(2)} €
                            </span>
                          )}
                        </div>
                        
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Skladom
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href={`/${locale}/produkty`}>
            <Button className="btn-primary">
              Zobraziť všetky produkty
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );

  const TrustSection = () => (
    <section className="py-16 bg-white">
      <div className="container-smart">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#3A3A3A] mb-4">
            Prečo si vybrať <span className="text-gradient">Faborino</span>?
          </h2>
          <p className="text-xl text-[#6B7280] max-w-3xl mx-auto">
            Viac ako 5000 spokojných rodín po celej Európe dôveruje našej kvalite a bezpečnosti
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustSignals.map((signal, index) => {
            const Icon = signal.icon;
            return (
              <Card key={index} className="card-3d text-center hover-lift">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#D4A574] to-[#C8A882] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-[#3A3A3A] mb-3">
                    {signal.title}
                  </h3>
                  
                  <p className="text-[#6B7280]">
                    {signal.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );

  const TestimonialsSection = () => (
    <section className="py-16 bg-[#F7F5F3]">
      <div className="container-smart">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#3A3A3A] mb-4">
            Čo hovoria <span className="text-gradient">spokojné mamy</span>
          </h2>
          <p className="text-xl text-[#6B7280] max-w-3xl mx-auto">
            Skutočné príbehy od rodín, ktoré si vybrali kvalitu a bezpečnosť pre svoje deti
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <Card key={index} className="card-3d hover-lift">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 mr-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-[#6B7280]">{testimonial.location}</span>
                </div>
                
                <p className="text-[#3A3A3A] mb-6 italic leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4A574] to-[#C8A882] rounded-full flex items-center justify-center mr-4">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#3A3A3A]">{testimonial.name}</h4>
                    <p className="text-sm text-[#6B7280]">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Show more testimonials button */}
        <div className="text-center mt-8">
          <p className="text-[#6B7280] mb-4">A ďalšie stovky spokojných rodín po celej Európe...</p>
          <Button className="btn-outline">
            Prečítajte si viac recenzií
          </Button>
        </div>
      </div>
    </section>
  );

  const CTASection = () => (
    <section className="py-16 bg-gradient-to-r from-[#D4A574] to-[#4A6741] relative overflow-hidden">
      <div className="absolute inset-0 pattern-hero opacity-20"></div>
      
      <div className="container-smart relative">
        <div className="text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Pripravení začať cestu <span className="text-[#F7F5F3]">Montessori</span>?
          </h2>
          <p className="text-xl text-[#F7F5F3] max-w-3xl mx-auto mb-8">
            Objavte produkty, ktoré podporia prirodzený rozvoj vášho dieťaťa a prinesú radosť do vašej domácnosti
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/kategorie`}>
              <Button className="bg-white text-[#3A3A3A] hover:bg-[#F7F5F3] px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105">
                Začať nakupovanie
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Link href={`/${locale}/poradca`}>
              <Button className="border-2 border-white text-white hover:bg-white hover:text-[#3A3A3A] px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105">
                Potrebujem poradenstvo
                <Users className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <TrustSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}