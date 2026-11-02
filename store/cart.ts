import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  variantId?: string
  name: string
  variantName?: string
  slug: string
  price: number
  quantity: number
  image: string
  sku?: string
  maxStock: number
}

export interface AppliedCoupon {
  code: string
  discountType: 'PERCENTAGE' | 'FIXED'
  discountValue: number
  description?: string
}

interface CartState {
  items: CartItem[]
  appliedCoupon: AppliedCoupon | null
  isOpen: boolean

  // Actions
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  applyCoupon: (coupon: AppliedCoupon) => void
  removeCoupon: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void

  // Computed
  getItemCount: () => number
  getSubtotal: () => number
  getDiscount: () => number
  getTotal: (shippingCost?: number) => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,
      isOpen: false,

      addItem: (newItem) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.productId === newItem.productId &&
              item.variantId === newItem.variantId
          )

          if (existingIndex >= 0) {
            const items = [...state.items]
            const existing = items[existingIndex]
            const newQty = Math.min(
              existing.quantity + (newItem.quantity ?? 1),
              existing.maxStock
            )
            items[existingIndex] = { ...existing, quantity: newQty }
            return { items }
          }

          return {
            items: [
              ...state.items,
              { ...newItem, quantity: newItem.quantity ?? 1 },
            ],
          }
        })
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.min(quantity, item.maxStock) }
              : item
          ),
        }))
      },

      clearCart: () => set({ items: [], appliedCoupon: null }),

      applyCoupon: (coupon) => set({ appliedCoupon: coupon }),

      removeCoupon: () => set({ appliedCoupon: null }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        )
      },

      getDiscount: () => {
        const { appliedCoupon, getSubtotal } = get()
        if (!appliedCoupon) return 0
        const subtotal = getSubtotal()
        if (appliedCoupon.discountType === 'PERCENTAGE') {
          return (subtotal * appliedCoupon.discountValue) / 100
        }
        return Math.min(appliedCoupon.discountValue, subtotal)
      },

      getTotal: (shippingCost = 0) => {
        const { getSubtotal, getDiscount } = get()
        return Math.max(0, getSubtotal() - getDiscount() + shippingCost)
      },
    }),
    {
      name: 'elara-cart',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      })),
    }
  )
)
