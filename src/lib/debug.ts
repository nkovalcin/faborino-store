// Debug utilities for development
export const DEBUG = process.env.NODE_ENV === 'development'

export function debugLog(message: string, data?: any) {
  if (DEBUG) {
    console.log(`[DEBUG] ${message}`, data)
  }
}

export function debugError(message: string, error?: any) {
  if (DEBUG) {
    console.error(`[DEBUG ERROR] ${message}`, error)
  }
}

export function debugWarn(message: string, data?: any) {
  if (DEBUG) {
    console.warn(`[DEBUG WARN] ${message}`, data)
  }
}

export function debugInfo(message: string, data?: any) {
  if (DEBUG) {
    console.info(`[DEBUG INFO] ${message}`, data)
  }
}

// Performance monitoring
export function debugPerformance(label: string, fn: () => void) {
  if (DEBUG) {
    const start = performance.now()
    fn()
    const end = performance.now()
    console.log(`[PERFORMANCE] ${label}: ${end - start}ms`)
  } else {
    fn()
  }
}

// Component debug wrapper
export function withDebug<T>(Component: T, name: string): T {
  if (DEBUG) {
    console.log(`[COMPONENT] ${name} rendered`)
  }
  return Component
}

// Store debug wrapper
export function debugStore(storeName: string, state: any) {
  if (DEBUG) {
    console.log(`[STORE] ${storeName}:`, state)
  }
}

// API debug wrapper
export function debugAPI(endpoint: string, method: string, data?: any) {
  if (DEBUG) {
    console.log(`[API] ${method} ${endpoint}`, data)
  }
}

// Feature flags for development
export const FEATURE_FLAGS = {
  SHOW_DEBUG_PANEL: DEBUG,
  MOCK_PAYMENTS: DEBUG && process.env.MOCK_PAYMENTS === 'true',
  SKIP_EMAIL_VERIFICATION: DEBUG,
  SHOW_COMPONENT_BOUNDARIES: DEBUG,
  ENABLE_PERFORMANCE_MONITORING: DEBUG,
}

// Development tools
export const DEV_TOOLS = {
  clearAllLocalStorage: () => {
    if (DEBUG) {
      localStorage.clear()
      console.log('[DEV] Local storage cleared')
    }
  },
  
  fillTestData: () => {
    if (DEBUG) {
      // Fill forms with test data
      const emailInputs = document.querySelectorAll('input[type="email"]')
      emailInputs.forEach(input => {
        if (input instanceof HTMLInputElement) {
          input.value = 'test@example.com'
        }
      })
      
      const nameInputs = document.querySelectorAll('input[type="text"]')
      nameInputs.forEach(input => {
        if (input instanceof HTMLInputElement && input.placeholder?.includes('meno')) {
          input.value = 'Test User'
        }
      })
      
      console.log('[DEV] Test data filled')
    }
  },
  
  simulateError: (message: string) => {
    if (DEBUG) {
      throw new Error(`[DEV ERROR] ${message}`)
    }
  },
  
  logCartState: () => {
    if (DEBUG) {
      const cartState = localStorage.getItem('faborino-cart')
      console.log('[DEV] Cart state:', cartState ? JSON.parse(cartState) : 'empty')
    }
  },
  
  resetCart: () => {
    if (DEBUG) {
      localStorage.removeItem('faborino-cart')
      console.log('[DEV] Cart reset')
      window.location.reload()
    }
  }
}

// Make dev tools available globally in development
if (DEBUG && typeof window !== 'undefined') {
  ;(window as any).devTools = DEV_TOOLS
}

// Error boundary helper
export function createErrorBoundary(componentName: string) {
  return (error: Error, errorInfo: any) => {
    if (DEBUG) {
      console.error(`[ERROR BOUNDARY] ${componentName}:`, error, errorInfo)
    }
  }
}

// Network monitoring
export function debugNetwork(url: string, options: any, response?: any) {
  if (DEBUG) {
    console.group(`[NETWORK] ${options.method || 'GET'} ${url}`)
    console.log('Request options:', options)
    if (response) {
      console.log('Response:', response)
    }
    console.groupEnd()
  }
}

// Memory usage monitoring
export function debugMemory() {
  if (DEBUG && 'memory' in performance) {
    const memory = (performance as any).memory
    console.log('[MEMORY]', {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + ' MB',
      total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + ' MB',
      limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + ' MB'
    })
  }
}

// Page load timing
export function debugPageLoad() {
  if (DEBUG && typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      console.log('[PAGE LOAD]', {
        DNS: timing.domainLookupEnd - timing.domainLookupStart,
        TCP: timing.connectEnd - timing.connectStart,
        Request: timing.responseStart - timing.requestStart,
        Response: timing.responseEnd - timing.responseStart,
        DOM: timing.domContentLoadedEventEnd - timing.responseEnd,
        Load: timing.loadEventEnd - timing.loadEventStart,
        Total: timing.loadEventEnd - timing.fetchStart
      })
    })
  }
}

// Initialize debug tools
if (DEBUG) {
  debugPageLoad()
  
  // Log environment info
  console.log('[DEBUG] Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    featureFlags: FEATURE_FLAGS
  })
  
  // Add debug styles
  if (FEATURE_FLAGS.SHOW_COMPONENT_BOUNDARIES) {
    const style = document.createElement('style')
    style.textContent = `
      [data-debug] {
        border: 1px dashed #ff0000 !important;
      }
      [data-debug]:hover {
        background: rgba(255, 0, 0, 0.1) !important;
      }
    `
    document.head.appendChild(style)
  }
}