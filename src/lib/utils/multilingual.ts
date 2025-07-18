/**
 * Utility functions for handling multilingual content
 */

export type SupportedLocale = 'sk' | 'en' | 'de' | 'fr';

export interface MultilingualContent {
  sk: string;
  en: string;
  de: string;
  fr: string;
}

/**
 * Get localized content from multilingual object
 */
export function getLocalizedContent(
  content: string | MultilingualContent | null | undefined,
  locale: SupportedLocale = 'sk'
): string {
  if (!content) return '';
  
  // If it's already a string, return it
  if (typeof content === 'string') {
    return content;
  }
  
  // If it's an object, get the localized version
  if (typeof content === 'object' && content !== null) {
    // Try to get the requested locale
    if (content[locale]) {
      return content[locale];
    }
    
    // Fallback to Slovak if requested locale is not available
    if (content.sk) {
      return content.sk;
    }
    
    // Fallback to English
    if (content.en) {
      return content.en;
    }
    
    // Fallback to any available language
    const availableLanguages = Object.values(content).filter(Boolean);
    if (availableLanguages.length > 0) {
      return availableLanguages[0];
    }
  }
  
  return '';
}

/**
 * Get localized category name
 */
export function getLocalizedCategoryName(
  category: any,
  locale: SupportedLocale = 'sk'
): string {
  return getLocalizedContent(category?.name, locale);
}

/**
 * Get localized product name
 */
export function getLocalizedProductName(
  product: any,
  locale: SupportedLocale = 'sk'
): string {
  return getLocalizedContent(product?.name, locale);
}

/**
 * Get localized product description
 */
export function getLocalizedProductDescription(
  product: any,
  locale: SupportedLocale = 'sk'
): string {
  return getLocalizedContent(product?.description, locale);
}

/**
 * Get localized category description
 */
export function getLocalizedCategoryDescription(
  category: any,
  locale: SupportedLocale = 'sk'
): string {
  return getLocalizedContent(category?.description, locale);
}