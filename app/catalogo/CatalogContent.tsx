'use client'

import { CatalogClient } from '@/app/components/CatalogClient'
import { CartProvider } from '@/app/providers/CartProvider'
import { Navbar } from '@/app/components/Navbar'
import { Footer } from '@/app/components/Footer'
import { CartDrawer } from '@/app/components/CartDrawer'
import { ToastProvider } from '@/app/providers/ToastProvider'

interface CatalogContentProps {
  initialProducts: any[]
  initialTotalCount: number
  initialTotalPages: number
  initialPage: number
  initialSearch: string
  initialFilter: string
  initialCat: string
}

export function CatalogContent({
  initialProducts,
  initialTotalCount,
  initialTotalPages,
  initialPage,
  initialSearch,
  initialFilter,
  initialCat,
}: CatalogContentProps) {
  return (
    <ToastProvider>
      <CartProvider>
        <Navbar />
        <CatalogClient
          initialProducts={initialProducts}
          initialTotalCount={initialTotalCount}
          initialTotalPages={initialTotalPages}
          initialPage={initialPage}
          initialSearch={initialSearch}
          initialFilter={initialFilter}
          initialCat={initialCat}
        />
        <Footer />
        <CartDrawer />
      </CartProvider>
    </ToastProvider>
  )
}