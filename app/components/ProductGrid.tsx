'use client'

import { Product } from '@/app/types'
import { ProductCard } from './ProductCard'
import { Search, Loader2 } from 'lucide-react'

interface ProductGridProps {
  products: Product[]
  totalCount: number
  onReset: () => void
  loading?: boolean
  onAddToCart: (productId: number) => void
}

export function ProductGrid({ products, totalCount, onReset, loading, onAddToCart }: ProductGridProps) {
  const showNoResults = products.length === 0 && !loading

  return (
    <section className="flex-grow">
      <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-black">Catálogo Disponible</h2>
        <span className="text-sm font-bold bg-gray-100 px-3 py-1 rounded-full text-black border border-gray-200">
          {totalCount} Pieza{totalCount !== 1 ? 's' : ''}
        </span>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse">
              <div className="h-32 bg-gray-100 rounded-xl mb-4" />
              <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : showNoResults ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <Search className="w-16 h-16 text-gray-300 mb-4 mx-auto" />
          <h3 className="text-xl font-bold text-black mb-2">No se encontraron piezas</h3>
          <p className="text-gray-500 mb-6 font-medium">Intenta con otra referencia o descripción.</p>
          <button 
            onClick={onReset}
            className="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-6 rounded-lg transition-colors border border-black shadow-sm"
          >
            Ver todo el catálogo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      )}
    </section>
  )
}