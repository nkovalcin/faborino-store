'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Shield, 
  Truck, 
  RotateCcw, 
  CheckCircle, 
  Minus, 
  Plus,
  Package,
  Ruler,
  Weight,
  Clock,
  Award,
  Leaf,
  Users,
  Baby
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductsAPI, type ProductWithCategory } from '@/lib/api/products';
import { useCartStore } from '@/stores/cart';
import { getLocalizedProductName, getLocalizedProductDescription, type SupportedLocale } from '@/lib/utils/multilingual';

interface ProductSpec {
  key: string;
  label: string;
  value: string;
  icon?: React.ElementType;
}

export default function ProductPage() {
  const locale = useLocale();
  const params = useParams();
  const router = useRouter();
  const t = useTranslations();
  const productId = params.productId as string;
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<ProductWithCategory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await ProductsAPI.getProduct(productId);
        setProduct(productData.product);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const addItem = useCartStore((state) => state.addItem);
  const toggleCart = useCartStore((state) => state.toggleCart);

  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (product && !isAdding) {
      setIsAdding(true);
      
      // Add item to cart
      addItem(product, quantity);
      
      // Show brief success animation on button
      setTimeout(() => {
        setIsAdding(false);
        toggleCart(); // Open cart sidebar after animation
      }, 400);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Načítava sa produkt...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Produkt sa nenašiel</h1>
          <Button onClick={() => router.push(`/${locale}/kategorie`)} className="bg-amber-600 hover:bg-amber-700">
            Späť na kategórie
          </Button>
        </div>
      </div>
    );
  }

  const breadcrumbs = [
    { label: 'Domov', href: `/${locale}` },
    { label: 'Kategórie', href: `/${locale}/kategorie` },
    { label: getLocalizedProductName(product, locale as SupportedLocale), href: `/${locale}/produkty/${productId}` }
  ];

  // Format product specifications from database data
  const specifications: ProductSpec[] = [
    { key: 'dimensions', label: 'Rozmery', value: `${product.dimensions?.length || 0} × ${product.dimensions?.width || 0} × ${product.dimensions?.height || 0} cm`, icon: Ruler },
    { key: 'weight', label: 'Hmotnosť', value: `${product.weight || 0} kg`, icon: Weight },
    { key: 'age', label: 'Vekové rozpätie', value: `${product.age_min || 0} - ${product.age_max || 0} mesiacov`, icon: Baby },
    { key: 'materials', label: 'Materiály', value: product.materials?.join(', ') || 'Nie je uvedené', icon: Leaf },
    { key: 'assembly', label: 'Montáž', value: product.assembly_required ? 'Vyžaduje sa' : 'Nie je potrebná', icon: Package },
    { key: 'shipping', label: 'Doprava', value: product.shipping_time || '2-4 dni', icon: Truck },
    { key: 'stock', label: 'Skladom', value: product.inventory_quantity > 0 ? 'Skladom' : 'Nedostupné', icon: CheckCircle }
  ];

  const safetyFeatures = [
    { icon: Shield, label: 'Certifikácia CE', description: 'Európska bezpečnostná norma' },
    { icon: Award, label: 'Prírodné materiály', description: 'Bezpečné pre deti' },
    { icon: CheckCircle, label: 'Testované kvalita', description: 'Dôkladne testované' },
    { icon: Leaf, label: 'Ekologické', description: 'Šetrné k životnému prostrediu' }
  ];

  const shippingInfo = [
    { icon: Truck, label: 'Doprava zdarma', description: 'Pri nákupe nad 50€' },
    { icon: Clock, label: 'Rýchle dodanie', description: '2-4 pracovné dni' },
    { icon: RotateCcw, label: 'Vrátenie do 30 dní', description: 'Bez udania dôvodu' },
    { icon: Shield, label: 'Záruka 2 roky', description: 'Na všetky produkty' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <nav className="flex space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center">
                {index > 0 && <span className="text-gray-400 mx-2">/</span>}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-gray-900 font-medium line-clamp-1">{crumb.label}</span>
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

      {/* Product Details */}
      <div className="container-smart py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative">
              <Image
                src={product.images?.[selectedImage] || '/images/placeholder-product.jpg'}
                alt={getLocalizedProductName(product, locale as SupportedLocale)}
                width={800}
                height={800}
                className="w-full aspect-square object-cover rounded-xl shadow-lg"
              />
              <Button
                variant="outline"
                size="sm"
                className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm hover:bg-white shadow-md"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Späť
              </Button>
            </div>
            
            {/* Image thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {product.images?.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative overflow-hidden rounded-lg ${
                    selectedImage === index ? 'ring-2 ring-amber-600' : ''
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${getLocalizedProductName(product, locale as SupportedLocale)} ${index + 1}`}
                    width={120}
                    height={120}
                    className="w-full aspect-square object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{getLocalizedProductName(product, locale as SupportedLocale)}</h1>
              <p className="text-gray-600 mb-4">{getLocalizedProductDescription(product, locale as SupportedLocale)}</p>
              
              {/* Detailed Product Info */}
              <div className="prose prose-sm text-gray-700 mb-6">
                <p>
                  Tento produkt je navrhnutý v súlade s Montessori princípmi, ktoré podporujú prirodzený vývoj vašich detí. 
                  Každý detail bol starostlivo premyslený, aby podporoval samostatnosť, kreativitu a fyzický vývoj.
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>Vyrobené z certifikovaného európskeho dreva najvyššej kvality</li>
                  <li>Bežné laky a farby spĺňajúce prísne európske normy</li>
                  <li>Každý výrobok prechádza manuálnou kontrolou kvality</li>
                  <li>Dizajn podporuje vyvoj jemnej aj hrubej motoriky</li>
                </ul>
              </div>
              
              {/* Rating & Reviews */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <div className="flex text-yellow-400 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < 4 ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">4.8 (127 hodnotení)</span>
                </div>
                <Badge className="bg-amber-100 text-amber-800">
                  {product.age_min}-{product.age_max} mesiacov
                </Badge>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl font-bold text-gray-900">{product.price.toFixed(2)} €</span>
                  {product.compare_price && product.compare_price > product.price && (
                    <span className="text-lg text-gray-500 line-through">{product.compare_price.toFixed(2)} €</span>
                  )}
                </div>
                <p className="text-sm text-gray-600">Cena vrátane DPH • Doprava od 4.99 €</p>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-700 font-medium">Skladom - {product.inventory_quantity > 0 ? `${product.inventory_quantity} ks` : 'Nedostupné'}</span>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">Množstvo:</label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="p-2 hover:bg-gray-100 rounded-l-lg"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="p-2 hover:bg-gray-100 rounded-r-lg"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className={`flex-1 bg-amber-600 hover:bg-amber-700 text-white transition-all duration-300 ${
                      isAdding ? 'scale-105' : ''
                    }`}
                  >
                    {isAdding ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2 animate-bounce" />
                        Pridané!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Pridať do košíka
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-4">
              {safetyFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <feature.icon className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{feature.label}</h4>
                    <p className="text-xs text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12 lg:mt-16">
          <Tabs defaultValue="specs" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="specs">Špecifikácie</TabsTrigger>
              <TabsTrigger value="shipping">Doprava</TabsTrigger>
              <TabsTrigger value="reviews">Hodnotenia</TabsTrigger>
              <TabsTrigger value="care">Starostlivosť</TabsTrigger>
            </TabsList>
            
            <TabsContent value="specs" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Podrobné špecifikácie</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {specifications.map((spec, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        {spec.icon && <spec.icon className="w-5 h-5 text-amber-600" />}
                        <div>
                          <dt className="font-medium text-gray-900 text-sm">{spec.label}</dt>
                          <dd className="text-sm text-gray-600">{spec.value}</dd>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-medium text-gray-900 mb-3">Bezpečnostné certifikácie</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.safety_certifications?.map((cert: string, index: number) => (
                        <Badge key={index} variant="outline" className="border-green-500 text-green-700">
                          {cert}
                        </Badge>
                      )) || (
                        <Badge variant="outline" className="border-green-500 text-green-700">
                          CE certifikácia
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Doprava a dodanie</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {shippingInfo.map((info, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <info.icon className="w-5 h-5 text-amber-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">{info.label}</h4>
                          <p className="text-sm text-gray-600">{info.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Dodacia doba</h4>
                    <p className="text-sm text-blue-800">
                      Štandardná doprava: {product.shipping_time || '2-4 dni'} • Expresná doprava: 1-2 pracovné dni
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hodnotenia zákazníkov</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Overall Rating */}
                    <div className="flex items-center justify-between border-b pb-6">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-4xl font-bold text-gray-900">4.8</span>
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-5 h-5 ${i < 4 ? 'fill-current' : ''}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Na základe 127 hodnoteniam</p>
                      </div>
                      <Button variant="outline">Napísať hodnotenie</Button>
                    </div>
                    
                    {/* Sample Reviews */}
                    <div className="space-y-4">
                      <div className="border-b pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Mária K.</span>
                            <span className="text-sm text-gray-500">Overený nákup</span>
                          </div>
                          <span className="text-sm text-gray-500">pred 2 týždňami</span>
                        </div>
                        <div className="flex text-yellow-400 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <p className="text-gray-700">
                          Skvelá kvalita spracovania! Naša 2-ročná dcéra tento trojuholník miluje. Už po pár dňoch 
                          som videla výrazné zlepšenie jej koordinácie a sebavedomia pri lezení. Drevo je nádherne 
                          hladké, bez akýchkoľvek ostrých hrán. Určite odporúčam!
                        </p>
                      </div>
                      
                      <div className="border-b pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Peter S.</span>
                            <span className="text-sm text-gray-500">Overený nákup</span>
                          </div>
                          <span className="text-sm text-gray-500">pred mesiacom</span>
                        </div>
                        <div className="flex text-yellow-400 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < 4 ? 'fill-current' : ''}`} />
                          ))}
                        </div>
                        <p className="text-gray-700">
                          Výborná investícia do vývoja našich dvojičiat. Používajú ho denn-denne už 3 mesiace 
                          a stále ich to baví. Montáž bola jednoduchá, všetko perfektne sedelo. Jediné mínus - 
                          mohla by byť o trochu nižšia cena, ale kvalita to určite vyvažuje.
                        </p>
                      </div>
                      
                      <div className="pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Jana D.</span>
                            <span className="text-sm text-gray-500">Overený nákup</span>
                          </div>
                          <span className="text-sm text-gray-500">pred 2 mesiacmi</span>
                        </div>
                        <div className="flex text-yellow-400 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <p className="text-gray-700">
                          Fantázia! Nielenže podporuje fyzický vývoj našich detí, ale tiež krásne vyzerá v detѩskej 
                          izbe. Návštevy sa vždy pýtajú, kde sme ho kúpili. Aě prek prekvaapá stálosť - drží aj 
                          váhu dospelého (testovali sme 😉). Dôležité je dodržiavať vekové odporúčania.
                        </p>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      Zobraziť všetky hodnotenia
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="care" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Starostlivosť a údržba</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <p className="mb-4">{product.care_instructions || 'Utrite vlhkou handričkou, vyhnite sa agresívnym čistiacim prostriedkom.'}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">Čistenie</h4>
                        <p className="text-sm text-green-800">Utrite vlhkou handričkou, vyhnite sa agresívnym čistiacim prostriedkom</p>
                      </div>
                      <div className="p-4 bg-yellow-50 rounded-lg">
                        <h4 className="font-medium text-yellow-900 mb-2">Skladovanie</h4>
                        <p className="text-sm text-yellow-800">Uchovávajte na suchom mieste, chráňte pred priamym slnkom</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}