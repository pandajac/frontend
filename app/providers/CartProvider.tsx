'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Product, CartItem } from '@/app/types'

interface CartContextType {
  cart: CartItem[]
  isOpen: boolean
  totalItems: number
  totalPrice: number
  addToCart: (product: Product) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, change: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        if (existing.quantity < product.stock) {
          return prev.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
        return prev
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    setIsOpen(true) // Auto-abrir carrito al agregar
  }

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const updateQuantity = (id: number, change: number) => {
    setCart(prev => {
      const item = prev.find(i => i.id === id)
      if (!item) return prev
      const newQuantity = item.quantity + change
      if (newQuantity <= 0) {
        return prev.filter(i => i.id !== id)
      }
      if (newQuantity > item.stock) {
        return prev
      }
      return prev.map(i =>
        i.id === id ? { ...i, quantity: newQuantity } : i
      )
    })
  }

  const clearCart = () => {
    setCart([])
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const toggleCart = () => setIsOpen(prev => !prev)
  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)

  return (
    <CartContext.Provider value={{
      cart,
      isOpen,
      totalItems,
      totalPrice,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleCart,
      openCart,
      closeCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}