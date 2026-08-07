'use client'

import { useState, useEffect } from 'react'
import { CartProvider, useCart } from './providers/CartProvider'
import { useProducts } from './hooks/useProducts'
import { Navbar } from './components/Navbar'
import { HeroCarousel } from './components/HeroCarousel'
import { Footer } from './components/Footer'
import { FilterSidebar } from './components/FilterSidebar'
import { ProductGrid } from './components/ProductGrid'
import { CartDrawer } from './components/CartDrawer'
import { Toast } from './components/Toast'

function HomeContent() {
  const { products, filter, search, setFilter, setSearch, resetFilters, totalCount } = useProducts()
  const { addToCart } = useCart()
  const [toastMessage, setToastMessage] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const [mobileSearch, setMobileSearch] = useState('')

  // Sincronizar búsqueda desktop -> móvil
  useEffect(() => {
    setMobileSearch(search)
  }, [search])

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

  const handleMobileSearchChange = (value: string) => {
    setMobileSearch(value)
    setSearch(value)
  }

  return (
    <>
      <Navbar 
        search={search} 
        onSearchChange={setSearch}
        mobileSearch={mobileSearch}
        onMobileSearchChange={handleMobileSearchChange}
      />
      <HeroCarousel />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex flex-col md:flex-row gap-8">
        <FilterSidebar currentFilter={filter} onFilterChange={setFilter} />
        <ProductGrid 
          products={products} 
          totalCount={totalCount} 
          onReset={resetFilters}
        />
      </main>
      
      <Footer />
      <CartDrawer />
      <Toast 
        message={toastMessage} 
        isVisible={toastVisible} 
        onHide={() => setToastVisible(false)} 
      />
    </>
  )
}

export default function Home() {
  return (
    <CartProvider>
      <HomeContent />
    </CartProvider>
  )
}