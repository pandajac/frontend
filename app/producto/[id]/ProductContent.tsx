'use client'

import { ProductDetailClient } from './ProductDetailClient'
import { CartProvider } from '@/app/providers/CartProvider'
import { ToastProvider } from '@/app/providers/ToastProvider'
import { Navbar } from '@/app/components/Navbar'
import { Footer } from '@/app/components/Footer'
import { CartDrawer } from '@/app/components/CartDrawer'
import { Product } from '@/app/types'

interface ProductContentProps {
  product: Product
}

export function ProductContent({ product }: ProductContentProps) {
  return (
    <CartProvider>
      <ToastProvider>
        <Navbar />
        <ProductDetailClient product={product} />
        <Footer />
        <CartDrawer />
      </ToastProvider>
    </CartProvider>
  )
}