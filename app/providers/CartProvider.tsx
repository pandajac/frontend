'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Product, CartItem } from '@/app/types'

interface AddToCartProduct {
  id: number
  descripcion?: string
  referencia?: string | null
  existencia?: number
  costo_unidad?: number
  model?: string
  cat?: string
  name?: string
  price?: number
  image?: string
  category?: string
  oldPrice?: number
}

interface CartContextType {
  cart: CartItem[]
  isOpen: boolean
  totalItems: number
  totalPrice: number
  addToCart: (product: AddToCartProduct) => void
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

  const addToCart = (product: AddToCartProduct) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      const descripcion = product.descripcion || product.name || 'Producto'
      const costo_unidad = product.costo_unidad || product.price || 0
      const existencia = product.existencia || 999
      
      if (existing) {
        if (existing.quantity < existencia) {
          return prev.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
        return prev
      }
      return [...prev, { 
        ...product, 
        descripcion, 
        costo_unidad, 
        existencia,
        referencia: product.referencia || null,
        model: product.model || '',
        cat: product.cat || '',
        quantity: 1 
      } as CartItem]
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
      if (newQuantity > item.existencia) {
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
  const totalPrice = cart.reduce((sum, item) => sum + (item.costo_unidad * item.quantity), 0)

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