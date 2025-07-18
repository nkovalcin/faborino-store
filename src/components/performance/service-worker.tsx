'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope)
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content available, notify user
                  if (confirm('Nový obsah je k dispozícii. Chcete obnoviť stránku?')) {
                    window.location.reload()
                  }
                }
              })
            }
          })
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })
    }
  }, [])

  return null
}

// Hook for background sync
export function useBackgroundSync() {
  const registerBackgroundSync = (tag: string) => {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then((registration) => {
        return registration.sync.register(tag)
      }).catch((error) => {
        console.error('Background sync registration failed:', error)
      })
    }
  }

  return { registerBackgroundSync }
}

// Hook for offline detection
export function useOfflineDetection() {
  const handleOfflineActions = () => {
    // Store actions to be synced when online
    const offlineActions = JSON.parse(localStorage.getItem('offline-actions') || '[]')
    
    return {
      addToOfflineQueue: (action: any) => {
        offlineActions.push(action)
        localStorage.setItem('offline-actions', JSON.stringify(offlineActions))
      },
      
      getOfflineQueue: () => offlineActions,
      
      clearOfflineQueue: () => {
        localStorage.removeItem('offline-actions')
      }
    }
  }

  return { handleOfflineActions }
}