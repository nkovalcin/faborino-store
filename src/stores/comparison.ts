import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/lib/types'

interface ComparisonStore {
  items: Product[]
  maxItems: number
  
  // Actions
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  clearComparison: () => void
  isInComparison: (productId: string) => boolean
  
  // Computed
  getItemCount: () => number
  isFull: () => boolean
  canAdd: () => boolean
}

export const useComparisonStore = create<ComparisonStore>()(
  persist(
    (set, get) => ({
      items: [],
      maxItems: 4,
      
      addItem: (product: Product) => {
        set((state) => {
          const isAlreadyInComparison = state.items.some(item => item.id === product.id)
          
          if (isAlreadyInComparison || state.items.length >= state.maxItems) {
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
      
      clearComparison: () => {
        set({ items: [] })
      },
      
      isInComparison: (productId: string) => {
        return get().items.some(item => item.id === productId)
      },
      
      getItemCount: () => {
        return get().items.length
      },
      
      isFull: () => {
        return get().items.length >= get().maxItems
      },
      
      canAdd: () => {
        return get().items.length < get().maxItems
      }
    }),
    {
      name: 'faborino-comparison',
      version: 1,
    }
  )
)