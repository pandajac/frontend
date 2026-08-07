import { getFeaturedProducts } from '@/app/lib/data'
import { Product } from '@/app/types'
import { HomeContent } from './HomeContent'

export default async function Home() {
  const { bestSellers, onSale, newArrivals } = await getFeaturedProducts()

  return (
    <HomeContent
      bestSellers={bestSellers}
      onSale={onSale}
      newArrivals={newArrivals}
    />
  )
}