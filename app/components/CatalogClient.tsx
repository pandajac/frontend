'use client'

import { useState } from 'react'
import { useCatalog } from '@/app/hooks/useCatalog'
import { useCart } from '@/app/providers/CartProvider'
import { FilterSidebar } from './FilterSidebar'
import { ProductGrid } from './ProductGrid'
import { Toast } from './Toast'
import { Product } from '@/app/types'

interface CatalogClientProps {
  initialProducts: Product[]
  initialTotalCount: number
  initialTotalPages: number
  initialPage: number
  initialSearch: string
  initialFilter: string
  initialCat: string
}

export function CatalogClient({
  initialProducts,
  initialTotalCount,
  initialTotalPages,
  initialPage,
  initialSearch,
  initialFilter,
  initialCat,
}: CatalogClientProps) {
  const {
    products,
    totalCount,
    totalPages,
    currentPage,
    loading,
    filter,
    search,
    cat,
    setFilter,
    setSearch,
    setCat,
    setPage,
    resetFilters,
  } = useCatalog(initialProducts, initialTotalCount, initialTotalPages, initialPage)

  const { addToCart } = useCart()
  const [toastMessage, setToastMessage] = useState('')
  const [toastVisible, setToastVisible] = useState(false)

  const showToast = (message: string) => {
    setToastMessage(message)
    setToastVisible(true)
  }

  const handleAddToCart = (productId: number) => {
    const product = products.find(p => p.id === productId)
    if (product) {
      addToCart(product)
      showToast(`Agregado a cotización: ${product.descripcion}`)
    }
  }

  return (
    <>
      <div className="flex flex-col md:flex-row gap-8">
        <FilterSidebar 
          currentFilter={filter} 
          onFilterChange={setFilter} 
        />
        
        <div className="flex-1 min-w-0">
          {/* Search + Results header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-black">Catálogo de Repuestos</h2>
              {(search || filter !== 'all' || cat) && (
                <p className="text-sm text-gray-500 mt-1">
                  {totalCount} resultado{totalCount !== 1 ? 's' : ''} 
                  {search && <span> para "<span className="font-medium">{search}</span>"</span>}
                  {filter !== 'all' && <span> en modelo <span className="font-medium">JAC {filter}</span></span>}
                  {cat && <span> en <span className="font-medium capitalize">{cat}</span></span>}
                </p>
              )}
            </div>
            
            {(search || filter !== 'all' || cat) && (
              <button 
                onClick={resetFilters}
                className="text-sm text-black hover:text-gray-700 font-medium flex items-center gap-1 transition-colors border-b border-transparent hover:border-current"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {/* Product Grid */}
          <ProductGrid 
            products={products} 
            totalCount={totalCount} 
            onReset={resetFilters}
            loading={loading}
            onAddToCart={handleAddToCart}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Paginación">
              <button
                onClick={() => setPage(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Página anterior"
              >
                Anterior
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        pageNum === currentPage
                          ? 'bg-black text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      aria-label={`Página ${pageNum}`}
                      aria-current={pageNum === currentPage ? 'page' : undefined}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>
              
              <button
                onClick={() => setPage(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Página siguiente"
              >
                Siguiente
              </button>
            </nav>
          )}
        </div>
      </div>
      <Toast 
        message={toastMessage} 
        isVisible={toastVisible} 
        onHide={() => setToastVisible(false)} 
      />
    </>
  )
}