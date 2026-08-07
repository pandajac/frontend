import { getFeaturedProducts } from '@/app/lib/data'
import { Product } from '@/app/types'
import { HomeContent } from './HomeContent'
import { CartProvider } from './providers/CartProvider'
import { ToastProvider } from './providers/ToastProvider'

export default async function Home() {
  const { bestSellers, onSale, newArrivals } = await getFeaturedProducts()

  return (
    <CartProvider>
      <ToastProvider>
        <HomeContent
          bestSellers={bestSellers}
          onSale={onSale}
          newArrivals={newArrivals}
        />
      </ToastProvider>
    </CartProvider>
  )
}