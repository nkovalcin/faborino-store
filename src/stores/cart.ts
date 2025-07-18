import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product, CartItem } from '@/lib/types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  
  // Actions
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  setCartOpen: (isOpen: boolean) => void
  getItem: (productId: string) => CartItem | undefined
  
  // Computed
  getItemCount: () => number
  getTotalAmount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(item => item.product.id === product.id)
          
          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity, total: (item.quantity + quantity) * item.price }
                  : item
              )
            }
          }
          
          const newItem: CartItem = {
            id: `cart-${product.id}-${Date.now()}`,
            product,
            quantity,
            price: product.price,
            total: product.price * quantity
          }
          
          return { items: [...state.items, newItem] }
        })
      },
      
      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter(item => item.product.id !== productId)
        }))
      },
      
      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        
        set((state) => ({
          items: state.items.map(item =>
            item.product.id === productId
              ? { ...item, quantity, total: quantity * item.price }
              : item
          )
        }))
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }))
      },
      
      setCartOpen: (isOpen: boolean) => {
        set({ isOpen })
      },
      
      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      
      getTotalAmount: () => {
        return get().items.reduce((total, item) => total + item.total, 0)
      },
      
      getItem: (productId: string) => {
        return get().items.find(item => item.product.id === productId)
      }
    }),
    {
      name: 'faborino-cart',
      version: 1,
    }
  )
)