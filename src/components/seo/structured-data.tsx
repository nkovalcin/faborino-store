import { Product, Review } from '@/lib/types'

interface ProductStructuredDataProps {
  product: Product
  reviews: Review[]
  averageRating: number
  totalReviews: number
}

export function ProductStructuredData({ 
  product, 
  reviews, 
  averageRating, 
  totalReviews 
}: ProductStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.images.map(img => `${process.env.NEXT_PUBLIC_APP_URL}${img}`),
    "brand": {
      "@type": "Brand",
      "name": "Faborino"
    },
    "category": product.category,
    "sku": product.sku,
    "offers": {
      "@type": "Offer",
      "url": `${process.env.NEXT_PUBLIC_APP_URL}/sk/produkty/${product.id}`,
      "priceCurrency": product.currency,
      "price": product.price,
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "availability": product.stockStatus === 'In Stock' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Faborino"
      }
    },
    "aggregateRating": totalReviews > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": averageRating,
      "bestRating": 5,
      "worstRating": 1,
      "ratingCount": totalReviews
    } : undefined,
    "review": reviews.slice(0, 5).map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.customerName
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": 5,
        "worstRating": 1
      },
      "reviewBody": review.comment,
      "datePublished": review.createdAt.toISOString()
    })),
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Vek",
        "value": `${product.ageMin}-${product.ageMax} mesiacov`
      },
      {
        "@type": "PropertyValue",
        "name": "Materiál",
        "value": product.materials.join(', ')
      },
      {
        "@type": "PropertyValue",
        "name": "Rozmery",
        "value": `${product.dimensions.length}×${product.dimensions.width}×${product.dimensions.height} cm`
      },
      {
        "@type": "PropertyValue",
        "name": "Hmotnosť",
        "value": `${product.weight} kg`
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  )
}

interface CategoryStructuredDataProps {
  category: {
    name: string
    description: string
    productCount: number
    url: string
  }
}

export function CategoryStructuredData({ category }: CategoryStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": category.name,
    "description": category.description,
    "url": category.url,
    "mainEntity": {
      "@type": "ItemList",
      "name": category.name,
      "description": category.description,
      "numberOfItems": category.productCount
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Domov",
          "item": `${process.env.NEXT_PUBLIC_APP_URL}/sk`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Kategórie",
          "item": `${process.env.NEXT_PUBLIC_APP_URL}/sk/kategorie`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": category.name,
          "item": category.url
        }
      ]
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  )
}

interface OrganizationStructuredDataProps {
  companyName?: string
  description?: string
  url?: string
  logo?: string
}

export function OrganizationStructuredData({ 
  companyName = "Faborino",
  description = "Prémiový európsky Montessori nábytok a hračky pre podporu prirodzeného vývoja detí",
  url = process.env.NEXT_PUBLIC_APP_URL,
  logo = `${process.env.NEXT_PUBLIC_APP_URL}/images/logo.png`
}: OrganizationStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": companyName,
    "description": description,
    "url": url,
    "logo": logo,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+421-123-456-789",
      "contactType": "Customer Service",
      "availableLanguage": ["Slovak", "Czech", "English"]
    },
    "sameAs": [
      "https://www.facebook.com/faborino",
      "https://www.instagram.com/faborino",
      "https://www.youtube.com/faborino"
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  )
}