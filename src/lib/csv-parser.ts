import { Product } from './types'

export function parseCSVToProducts(csvData: string): Product[] {
  const lines = csvData.trim().split('\n')
  const headers = lines[0].split(',')
  const products: Product[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    if (values.length === headers.length) {
      const product = createProductFromCSV(headers, values)
      if (product) {
        products.push(product)
      }
    }
  }

  return products
}

function parseCSVLine(line: string): string[] {
  const values: string[] = []
  let currentValue = ''
  let inQuotes = false
  let i = 0

  while (i < line.length) {
    const char = line[i]
    
    if (char === '"' && !inQuotes) {
      inQuotes = true
    } else if (char === '"' && inQuotes) {
      if (i + 1 < line.length && line[i + 1] === '"') {
        // Escaped quote
        currentValue += '"'
        i++ // Skip next quote
      } else {
        inQuotes = false
      }
    } else if (char === ',' && !inQuotes) {
      values.push(currentValue.trim())
      currentValue = ''
    } else {
      currentValue += char
    }
    i++
  }
  
  values.push(currentValue.trim())
  return values
}

function createProductFromCSV(headers: string[], values: string[]): Product | null {
  try {
    const data: Record<string, string> = {}
    headers.forEach((header, index) => {
      data[header] = values[index] || ''
    })

    // Parse specifications JSON
    let specifications = {}
    if (data.specifications_json) {
      try {
        specifications = JSON.parse(data.specifications_json)
      } catch (e) {
        console.warn('Failed to parse specifications JSON:', e)
      }
    }

    // Parse images array
    const images = [
      data.image_1,
      data.image_2,
      data.image_3,
      data.image_4,
      data.image_5,
    ].filter(Boolean)

    // Parse materials
    const materials = data.materials
      ? data.materials.split(' ').filter(Boolean)
      : []

    // Parse safety certifications
    const safetyCertifications = data.safety_certifications
      ? data.safety_certifications.split(' ').filter(Boolean)
      : []

    // Create product object
    const product: Product = {
      id: data.product_id || '',
      name: data.name || '',
      description: data.description || '',
      category: data.category || '',
      subcategory: data.subcategory || '',
      price: parseFloat(data.price) || 0,
      originalPrice: data.original_price ? parseFloat(data.original_price) : undefined,
      currency: data.currency || 'EUR',
      sku: data.sku || '',
      ageMin: parseInt(data.age_min) || 0,
      ageMax: parseInt(data.age_max) || 0,
      materials,
      dimensions: {
        length: parseFloat(data.dimensions_length) || 0,
        width: parseFloat(data.dimensions_width) || 0,
        height: parseFloat(data.dimensions_height) || 0,
      },
      weight: parseFloat(data.weight) || 0,
      safetyCertifications,
      assemblyRequired: data.assembly_required === 'Yes',
      careInstructions: data.care_instructions || '',
      images,
      stockStatus: (data.stock_status as 'In Stock' | 'Out of Stock' | 'Pre-order') || 'In Stock',
      shippingCost: parseFloat(data.shipping_cost_eu) || 0,
      shippingTime: data.shipping_time || '',
      productUrl: data.product_url || '',
      specifications,
    }

    return product
  } catch (error) {
    console.error('Error parsing CSV row:', error)
    return null
  }
}

export async function loadProductsFromCSV(csvUrl: string): Promise<Product[]> {
  try {
    const response = await fetch(csvUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`)
    }
    
    const csvData = await response.text()
    return parseCSVToProducts(csvData)
  } catch (error) {
    console.error('Error loading products from CSV:', error)
    return []
  }
}

// Category mapping from CSV to our category structure
export const categoryMapping: Record<string, string> = {
  'First Steps': 'first-steps',
  'Brave Explorers': 'brave-explorers',
  'Confident Climbers': 'confident-climbers',
  'Creative Spaces': 'creative-spaces',
  'Growing Together': 'growing-together',
  'Essential Accessories': 'accessories',
}

// Subcategory mapping
export const subcategoryMapping: Record<string, string> = {
  'Baby Swings': 'baby-swings',
  'Baby Hammock Cradles': 'baby-hammocks',
  'Baby Gymnastics Mats': 'play-mats',
  'Door Bouncers': 'door-bouncers',
  'Hanging Sensory Swings': 'sensory-swings',
  'Climbing Blocks': 'climbing-blocks',
  'Balance Boards': 'balance-boards',
  'Climbing Triangles': 'climbing-triangles',
  'Balance Beams': 'balance-beams',
  'Learning Towers': 'learning-towers',
  'Small Climbing Frames': 'small-climbing-frames',
  'Toddler Slides': 'toddler-slides',
  'Play Mats': 'play-mats',
  'Climbing Walls': 'climbing-walls',
  'Swedish Ladders': 'swedish-ladders',
  'Complete Climbing Sets': 'complete-sets',
  'Climbing Accessories': 'climbing-accessories',
  'Garden Swings': 'garden-swings',
  'Gymnastics Equipment': 'gymnastics-equipment',
  'Climbing Holds': 'climbing-holds',
  "Children's Furniture": 'furniture',
  'Bookshelves': 'bookshelves',
  'Clothes Rails': 'clothes-rails',
  'Sandboxes': 'sandboxes',
  'Tents': 'tents',
  'Climbing Triangle Sets': 'climbing-triangle-sets',
  'Modular Climbing Blocks': 'modular-climbing-blocks',
  'Balance Board Sets': 'balance-board-sets',
  'Climbing Frame Combinations': 'climbing-frame-combinations',
  'Safety Equipment': 'safety-equipment',
  'Replacement Parts': 'replacement-parts',
  'Wall Decorations': 'wall-decorations',
  'Maintenance Items': 'maintenance-items',
}

export function mapProductCategory(product: Product): Product {
  return {
    ...product,
    category: categoryMapping[product.category] || product.category.toLowerCase().replace(/\s+/g, '-'),
    subcategory: subcategoryMapping[product.subcategory] || product.subcategory.toLowerCase().replace(/\s+/g, '-'),
  }
}

export function validateProduct(product: Product): boolean {
  return !!(
    product.id &&
    product.name &&
    product.price > 0 &&
    product.category &&
    product.images.length > 0
  )
}

export function filterProducts(products: Product[], filters: any): Product[] {
  return products.filter(product => {
    // Category filter
    if (filters.categories.length > 0) {
      if (!filters.categories.includes(product.category)) {
        return false
      }
    }

    // Age filter
    if (filters.ageGroups.length > 0) {
      const productAgeRange = { min: product.ageMin, max: product.ageMax }
      const matchesAge = filters.ageGroups.some((ageGroup: any) => {
        return productAgeRange.min <= ageGroup.max && productAgeRange.max >= ageGroup.min
      })
      if (!matchesAge) return false
    }

    // Price filter
    if (filters.priceRange) {
      if (product.price < filters.priceRange.min || product.price > filters.priceRange.max) {
        return false
      }
    }

    // Material filter
    if (filters.materials.length > 0) {
      const hasMatchingMaterial = filters.materials.some((material: string) =>
        product.materials.some(productMaterial => 
          productMaterial.toLowerCase().includes(material.toLowerCase())
        )
      )
      if (!hasMatchingMaterial) return false
    }

    // Stock filter
    if (filters.inStock === true) {
      if (product.stockStatus !== 'In Stock') {
        return false
      }
    }

    return true
  })
}

export function sortProducts(products: Product[], sortBy: string, sortOrder: 'asc' | 'desc'): Product[] {
  return [...products].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'price':
        comparison = a.price - b.price
        break
      case 'age':
        comparison = a.ageMin - b.ageMin
        break
      case 'newest':
        // For now, we'll sort by ID as a proxy for newest
        comparison = a.id.localeCompare(b.id)
        break
      case 'popularity':
        // For now, we'll sort by price as a proxy for popularity
        comparison = b.price - a.price
        break
      default:
        comparison = 0
    }

    return sortOrder === 'desc' ? -comparison : comparison
  })
}