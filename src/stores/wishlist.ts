import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/lib/types'

interface WishlistStore {
  items: Product[]
  
  // Actions
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  clearWishlist: () => void
  isInWishlist: (productId: string) => boolean
  
  // Computed
  getItemCount: () => number
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product: Product) => {
        set((state) => {
          const isAlreadyInWishlist = state.items.some(item => item.id === product.id)
          
          if (isAlreadyInWishlist) {
            return state
          }
          
          return { items: [...state.items, product] }
        })
      },
      
      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== productId)
        }))
      },
      
      clearWishlist: () => {
        set({ items: [] })
      },
      
      isInWishlist: (productId: string) => {
        return get().items.some(item => item.id === productId)
      },
      
      getItemCount: () => {
        return get().items.length
      }
    }),
    {
      name: 'faborino-wishlist',
      version: 1,
    }
  )
)