'use client'

import { Product } from '@/app/types'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: Product[]
  totalCount: number
  onReset: () => void
}

export function ProductGrid({ products, totalCount, onReset }: ProductGridProps) {
  const showNoResults = products.length === 0

  return (
    <section className="flex-grow">
      <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-black">Catálogo Disponible</h2>
        <span className="text-sm font-bold bg-gray-100 px-3 py-1 rounded-full text-black border border-gray-200">
          {totalCount} Pieza{totalCount !== 1 ? 's' : ''}
        </span>
      </div>
      
      {showNoResults ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <i className="ph ph-magnifying-glass-minus text-6xl text-gray-300 mb-4 block"></i>
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
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}