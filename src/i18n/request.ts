import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

// Can be imported from a shared config
const locales = ['sk', 'en', 'de', 'fr']

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    console.error('Invalid locale:', locale)
    // Use default locale instead of notFound
    locale = 'sk'
  }

  try {
    // Try to load messages from JSON files
    const messages = (await import(`../../messages/${locale}.json`)).default
    return {
      locale,
      messages
    }
  } catch (error) {
    console.error('Error loading messages:', error)
    // Fallback to basic messages
    return {
      locale,
      messages: {
        navigation: {
          home: "Domov",
          products: "Produkty",
          categories: "Kategórie",
          about: "O nás",
          contact: "Kontakt"
        }
      }
    }
  }
})