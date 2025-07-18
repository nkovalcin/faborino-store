import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(
  price: number,
  currency: string = 'EUR',
  locale: string = 'sk-SK'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(price)
}

export function formatDate(
  date: Date,
  locale: string = 'sk-SK',
  options: Intl.DateTimeFormatOptions = {}
): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(date)
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export function generateSKU(name: string, category: string): string {
  const namePrefix = name.substring(0, 3).toUpperCase()
  const categoryPrefix = category.substring(0, 3).toUpperCase()
  const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `${namePrefix}${categoryPrefix}${randomSuffix}`
}

export function calculateDiscountPercentage(
  originalPrice: number,
  salePrice: number
): number {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[+]?[(]?[\d\s\-\(\)]{10,}$/
  return phoneRegex.test(phone)
}

export function extractImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.width, height: img.height })
    img.onerror = reject
    img.src = url
  })
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `FB-${timestamp}-${random}`.toUpperCase()
}

export function getAgeRangeLabel(ageMin: number, ageMax: number, locale: string = 'sk'): string {
  const labels: Record<string, { months: string; years: string; plus: string }> = {
    sk: { months: 'mesiacov', years: 'rokov', plus: '+' },
    en: { months: 'months', years: 'years', plus: '+' },
    de: { months: 'Monate', years: 'Jahre', plus: '+' },
    fr: { months: 'mois', years: 'ans', plus: '+' },
  }

  const label = labels[locale] || labels.sk

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

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastFunc: NodeJS.Timeout
  let lastRan: number
  return (...args: Parameters<T>) => {
    if (!lastRan) {
      func(...args)
      lastRan = Date.now()
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func(...args)
          lastRan = Date.now()
        }
      }, limit - (Date.now() - lastRan))
    }
  }
}

export function getImageUrl(imagePath: string, width?: number, height?: number): string {
  // Handle Mamoi image URLs
  if (imagePath.includes('mamoi.me')) {
    return imagePath
  }

  // Handle local images
  if (imagePath.startsWith('/')) {
    return imagePath
  }

  // Handle absolute URLs
  if (imagePath.startsWith('http')) {
    return imagePath
  }

  // Default to public directory
  return `/images/${imagePath}`
}

export function parseCSVProduct(csvRow: any): any {
  return {
    id: csvRow.product_id,
    name: csvRow.name,
    description: csvRow.description,
    category: csvRow.category,
    subcategory: csvRow.subcategory,
    price: parseFloat(csvRow.price),
    originalPrice: csvRow.original_price ? parseFloat(csvRow.original_price) : undefined,
    currency: csvRow.currency,
    sku: csvRow.sku,
    ageMin: parseInt(csvRow.age_min),
    ageMax: parseInt(csvRow.age_max),
    materials: csvRow.materials.split(' '),
    dimensions: {
      length: parseFloat(csvRow.dimensions_length) || 0,
      width: parseFloat(csvRow.dimensions_width) || 0,
      height: parseFloat(csvRow.dimensions_height) || 0,
    },
    weight: parseFloat(csvRow.weight) || 0,
    safetyCertifications: csvRow.safety_certifications.split(' '),
    assemblyRequired: csvRow.assembly_required === 'Yes',
    careInstructions: csvRow.care_instructions,
    images: [
      csvRow.image_1,
      csvRow.image_2,
      csvRow.image_3,
      csvRow.image_4,
      csvRow.image_5,
    ].filter(Boolean),
    stockStatus: csvRow.stock_status,
    shippingCost: parseFloat(csvRow.shipping_cost_eu) || 0,
    shippingTime: csvRow.shipping_time,
    productUrl: csvRow.product_url,
    specifications: csvRow.specifications_json
      ? JSON.parse(csvRow.specifications_json)
      : {},
  }
}

export function generateBreadcrumbs(
  pathname: string,
  locale: string = 'sk'
): Array<{ label: string; href: string }> {
  const pathSegments = pathname.split('/').filter(Boolean)
  const breadcrumbs = [{ label: 'Domov', href: '/' }]

  let currentPath = ''
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    
    const labels: Record<string, Record<string, string>> = {
      sk: {
        kategorie: 'Kategórie',
        produkty: 'Produkty',
        kosik: 'Košík',
        ucet: 'Účet',
        kontakt: 'Kontakt',
        'o-nas': 'O nás',
        poradca: 'Poradca',
      },
      en: {
        kategorie: 'Categories',
        produkty: 'Products',
        kosik: 'Cart',
        ucet: 'Account',
        kontakt: 'Contact',
        'o-nas': 'About',
        poradca: 'Advisor',
      },
    }

    const label = labels[locale]?.[segment] || segment
    breadcrumbs.push({
      label: label.charAt(0).toUpperCase() + label.slice(1),
      href: currentPath,
    })
  })

  return breadcrumbs
}

export function calculateShipping(
  items: any[],
  country: string = 'SK'
): { cost: number; estimatedDays: number } {
  const totalWeight = items.reduce((sum, item) => sum + (item.weight * item.quantity), 0)
  const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  // Free shipping over 100 EUR
  if (totalValue >= 100) {
    return { cost: 0, estimatedDays: 3 }
  }

  // Base shipping rates
  const shippingRates: Record<string, { cost: number; days: number }> = {
    SK: { cost: 4.99, days: 2 },
    CZ: { cost: 6.99, days: 3 },
    DE: { cost: 8.99, days: 4 },
    AT: { cost: 8.99, days: 4 },
    FR: { cost: 12.99, days: 5 },
    IT: { cost: 12.99, days: 5 },
    ES: { cost: 15.99, days: 6 },
    NL: { cost: 10.99, days: 4 },
    BE: { cost: 10.99, days: 4 },
    PL: { cost: 9.99, days: 4 },
  }

  const rate = shippingRates[country] || shippingRates.SK
  
  // Add weight surcharge for heavy items
  const weightSurcharge = totalWeight > 10 ? Math.ceil((totalWeight - 10) / 5) * 2.99 : 0
  
  return {
    cost: rate.cost + weightSurcharge,
    estimatedDays: rate.days,
  }
}

export function isValidAge(age: number, ageMin: number, ageMax: number): boolean {
  return age >= ageMin && age <= ageMax
}

export function getRecommendedProducts(
  currentProduct: any,
  allProducts: any[],
  limit: number = 4
): any[] {
  return allProducts
    .filter(p => p.id !== currentProduct.id)
    .filter(p => 
      p.category === currentProduct.category ||
      Math.abs(p.ageMin - currentProduct.ageMin) <= 12
    )
    .slice(0, limit)
}

export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '')
}

export function generateMetaTags(
  title: string,
  description: string,
  image?: string,
  url?: string
): Record<string, string> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://faborino.com'
  
  return {
    title,
    description,
    'og:title': title,
    'og:description': description,
    'og:image': image || `${baseUrl}/images/og-default.jpg`,
    'og:url': url || baseUrl,
    'og:type': 'website',
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': image || `${baseUrl}/images/twitter-default.jpg`,
  }
}