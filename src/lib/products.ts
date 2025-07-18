import { Product, Category } from './types'
import { parseCSVProduct } from './utils'
import { allProducts } from './products-complete'

// Use real products from CSV data
const products: Product[] = allProducts

export const categories: Category[] = [
  {
    id: 'first-steps',
    name: 'Prvé kroky',
    slug: 'first-steps',
    description: 'Ideálne pre bábätká a batoliata, ktoré robia prvé kroky do sveta objavovania. Jemné a bezpečné produkty pre najmenších.',
    image: '/images/categories/first-steps.jpg',
    productCount: products.filter(p => p.category === 'first-steps').length,
    children: [
      {
        id: 'baby-swings',
        name: 'Detské hojdačky',
        slug: 'baby-swings',
        description: 'Bezpečné a pohodlné hojdačky pre bábätká',
        productCount: products.filter(p => p.subcategory === 'baby-swings').length,
        parentId: 'first-steps',
      },
      {
        id: 'baby-hammocks',
        name: 'Detské kolísky',
        slug: 'baby-hammocks',
        description: 'Jemné hojdacie kolísky pre novorodencov',
        productCount: products.filter(p => p.subcategory === 'baby-hammocks').length,
        parentId: 'first-steps',
      },
      {
        id: 'baby-mats',
        name: 'Hranie podložky',
        slug: 'baby-mats',
        description: 'Mäkké podložky pre hru na podlahe a bezpečnosť',
        productCount: products.filter(p => p.subcategory === 'baby-mats').length,
        parentId: 'first-steps',
      },
    ],
  },
  {
    id: 'brave-explorers',
    name: 'Odvážni prieskumníci',
    slug: 'brave-explorers',
    description: 'Pre batoliata pripravené liezť, udržiavať rovnováhu a objavovať. Rozvojové produkty pre aktívnych malých dobrodruhov.',
    image: '/images/categories/brave-explorers.jpg',
    productCount: products.filter(p => p.category === 'brave-explorers').length,
    children: [
      {
        id: 'balance-boards',
        name: 'Balančné dosky',
        slug: 'balance-boards',
        description: 'Rozvoj rovnováhy a koordinácie',
        productCount: products.filter(p => p.subcategory === 'balance-boards').length,
        parentId: 'brave-explorers',
      },
      {
        id: 'climbing-triangles',
        name: 'Lezecké trojuholníky',
        slug: 'climbing-triangles',
        description: 'Klasické Pikler trojuholníky na lezenie',
        productCount: products.filter(p => p.subcategory === 'climbing-triangles').length,
        parentId: 'brave-explorers',
      },
      {
        id: 'learning-towers',
        name: 'Vzdelávacie veže',
        slug: 'learning-towers',
        description: 'Kuchynskí pomocníci pre nezávislosť',
        productCount: products.filter(p => p.subcategory === 'learning-towers').length,
        parentId: 'brave-explorers',
      },
    ],
  },
  {
    id: 'confident-climbers',
    name: 'Sebavedomí lezci',
    slug: 'confident-climbers',
    description: 'Pokročilé lezecké vybavenie pre skúsených malých lezcov. Výzvy pre deti, ktoré už ovládajú základné lezecké pohyby.',
    image: '/images/categories/confident-climbers.jpg',
    productCount: products.filter(p => p.category === 'confident-climbers').length,
    children: [
      {
        id: 'climbing-walls',
        name: 'Lezecké steny',
        slug: 'climbing-walls',
        description: 'Nástenné lezecké systémy',
        productCount: products.filter(p => p.subcategory === 'climbing-walls').length,
        parentId: 'confident-climbers',
      },
      {
        id: 'swedish-ladders',
        name: 'Švédske rebriny',
        slug: 'swedish-ladders',
        description: 'Tradičné nástenné rebriny pre gymnastiku',
        productCount: products.filter(p => p.subcategory === 'swedish-ladders').length,
        parentId: 'confident-climbers',
      },
      {
        id: 'complete-sets',
        name: 'Kompletné súpravy',
        slug: 'complete-sets',
        description: 'Viacprávkové lezecké systémy',
        productCount: products.filter(p => p.subcategory === 'complete-sets').length,
        parentId: 'confident-climbers',
      },
    ],
  },
]

export async function getAllProducts(): Promise<Product[]> {
  // TODO: Replace with real API call to Supabase
  return products
}

export async function getProductById(id: string): Promise<Product | null> {
  // TODO: Replace with real API call to Supabase
  return products.find(p => p.id === id) || null
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  // TODO: Replace with real API call to Supabase
  return products.filter(p => p.category === categorySlug)
}

export async function searchProducts(query: string): Promise<Product[]> {
  // TODO: Replace with real API call to Supabase with full-text search
  const lowercaseQuery = query.toLowerCase()
  return products.filter(p => 
    p.name.toLowerCase().includes(lowercaseQuery) ||
    p.description.toLowerCase().includes(lowercaseQuery) ||
    p.category.toLowerCase().includes(lowercaseQuery) ||
    p.subcategory.toLowerCase().includes(lowercaseQuery)
  )
}

export async function getProductsByAgeRange(ageMin: number, ageMax: number): Promise<Product[]> {
  // TODO: Replace with real API call to Supabase
  return products.filter(p => 
    p.ageMin <= ageMax && p.ageMax >= ageMin
  )
}

export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
  // TODO: Replace with real API call to Supabase
  return products.slice(0, limit)
}

export async function getRelatedProducts(productId: string, limit: number = 4): Promise<Product[]> {
  const product = await getProductById(productId)
  if (!product) return []
  
  return products
    .filter(p => p.id !== productId)
    .filter(p => p.category === product.category || Math.abs(p.ageMin - product.ageMin) <= 12)
    .slice(0, limit)
}

export async function getProductsByPriceRange(min: number, max: number): Promise<Product[]> {
  // TODO: Replace with real API call to Supabase
  return products.filter(p => p.price >= min && p.price <= max)
}

export function getCategoryBySlug(slug: string): Category | null {
  function findCategory(cats: Category[]): Category | null {
    for (const cat of cats) {
      if (cat.slug === slug) return cat
      if (cat.children) {
        const found = findCategory(cat.children)
        if (found) return found
      }
    }
    return null
  }
  
  return findCategory(categories)
}

export function getAllCategories(): Category[] {
  return categories
}

export function getTopLevelCategories(): Category[] {
  return categories.filter(c => !c.parentId)
}

export function getCategoryChildren(categoryId: string): Category[] {
  const category = categories.find(c => c.id === categoryId)
  return category?.children || []
}

// Helper function to convert CSV data to Product objects
export function parseCSVToProducts(csvData: any[]): Product[] {
  return csvData.map(parseCSVProduct)
}

export function getProductPrice(product: Product): { price: number; originalPrice?: number; hasDiscount: boolean } {
  return {
    price: product.price,
    originalPrice: product.originalPrice,
    hasDiscount: product.originalPrice ? product.originalPrice > product.price : false,
  }
}

export function getProductAgeLabel(product: Product, locale: string = 'sk'): string {
  const labels: Record<string, { months: string; years: string; plus: string }> = {
    sk: { months: 'mesiacov', years: 'rokov', plus: '+' },
    en: { months: 'months', years: 'years', plus: '+' },
    de: { months: 'Monate', years: 'Jahre', plus: '+' },
    fr: { months: 'mois', years: 'ans', plus: '+' },
  }

  const label = labels[locale] || labels.sk
  const ageMin = product.ageMin
  const ageMax = product.ageMax

  if (ageMin < 12 && ageMax < 12) {
    return `${ageMin}-${ageMax} ${label.months}`
  } else if (ageMin < 12) {
    return `${ageMin} ${label.months} - ${Math.floor(ageMax / 12)} ${label.years}`
  } else if (ageMax >= 150) {
    return `${Math.floor(ageMin / 12)} ${label.years}${label.plus}`
  } else {
    return `${Math.floor(ageMin / 12)}-${Math.floor(ageMax / 12)} ${label.years}`
  }
}

export function isProductInStock(product: Product): boolean {
  return product.stockStatus === 'In Stock'
}

export function canProductBeShipped(product: Product, country: string = 'SK'): boolean {
  // Add shipping logic here
  return true
}

export function getProductImageUrl(product: Product, index: number = 0): string {
  if (product.images && product.images[index]) {
    return product.images[index]
  }
  return '/images/products/placeholder.jpg'
}

export function getProductCategory(product: Product): Category | null {
  return categories.find(c => c.name === product.category) || null
}

export function formatProductMaterials(materials: string[], locale: string = 'sk'): string {
  return materials.join(', ')
}

export function getProductSafetyCertifications(product: Product): string[] {
  return product.safetyCertifications || []
}

export function calculateProductShipping(product: Product, quantity: number = 1): number {
  // Basic shipping calculation
  const weight = product.weight * quantity
  const baseShipping = product.shippingCost
  
  // Add weight surcharge for heavy items
  const weightSurcharge = weight > 10 ? Math.ceil((weight - 10) / 5) * 2.99 : 0
  
  return baseShipping + weightSurcharge
}