'use client'

import { useCart } from '@/app/hooks/useCart'
import { SearchBar } from './SearchBar'
import { Square, ShoppingBag } from 'lucide-react'

interface NavbarProps {
  search: string
  onSearchChange: (value: string) => void
  mobileSearch: string
  onMobileSearchChange: (value: string) => void
}

export function Navbar({ search, onSearchChange, mobileSearch, onMobileSearchChange }: NavbarProps) {
  const { totalItems, toggleCart } = useCart()

  return (
    <nav className="bg-white text-black sticky top-0 z-40 border-b border-gray-200 backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="bg-black text-white p-2 rounded-lg shadow-sm">
              <Square className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-2xl tracking-tighter uppercase leading-none">
                PANDA<span className="text-gray-400">JAC</span>
              </span>
              <span className="text-[10px] text-gray-500 tracking-widest uppercase font-semibold">
                Liquidación Directa
              </span>
            </div>
          </div>
          
          {/* Desktop Search */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <SearchBar 
              value={search}
              onChange={onSearchChange}
              placeholder="Buscar por repuesto o referencia..."
            />
          </div>

          {/* Cart Button */}
          <div className="flex items-center">
            <button 
              onClick={toggleCart}
              className="relative p-3 bg-white hover:bg-gray-50 rounded-xl transition-all duration-300 border border-gray-200 shadow-sm group"
            >
              <ShoppingBag className="w-6 h-6 text-gray-700 group-hover:text-black transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform bg-black rounded-full border-2 border-white shadow-sm scale-125">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <SearchBar 
            value={mobileSearch}
            onChange={onMobileSearchChange}
            placeholder="Buscar repuesto..."
          />
        </div>
      </div>
    </nav>
  )
}