'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/app/providers/CartProvider'
import { SearchBar } from './SearchBar'
import { ShoppingBag, Menu, X, Phone, Truck, Tag, Globe, ChevronDown, LogIn, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const navLinks = [
  { id: 'catalogo', href: '/catalogo', label: 'Catálogo', icon: Tag },
  { id: 'marcas', href: '/catalogo', label: 'Marcas', icon: Truck },
  { id: 'ofertas', href: '/catalogo', label: 'Ofertas', icon: Tag },
  { id: 'contacto', href: '#contacto', label: 'Contacto', icon: Phone },
]

export function Navbar() {
  const router = useRouter()
  const { totalItems, toggleCart } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      router.push(`/catalogo?q=${encodeURIComponent(searchValue.trim())}`)
    }
  }

  return (
    <nav className="bg-white text-black sticky top-0 z-40 border-b border-gray-200 backdrop-blur-md bg-opacity-95 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar - Contact info & user actions */}
        <div className="hidden lg:flex items-center justify-between h-10 px-2 text-xs text-gray-500 border-b border-gray-100">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 hover:text-gray-700 transition-colors cursor-default">
              <Phone className="w-3.5 h-3.5" />
              +54 11 4444-5555
            </span>
            <span className="flex items-center gap-1 hover:text-gray-700 transition-colors cursor-default">
              <Truck className="w-3.5 h-3.5" />
              Envío a todo el país
            </span>
            <span className="flex items-center gap-1 hover:text-gray-700 transition-colors cursor-default">
              <Tag className="w-3.5 h-3.5" />
              Precios mayoristas
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors">
              <Globe className="w-3.5 h-3.5" />
              <span>ES</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <Link href="/login" className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors font-medium text-sm">
              <LogIn className="w-3.5 h-3.5" />
              Ingresar
            </Link>
            <Link href="/registro" className="px-3 py-1.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
              Registrarse
            </Link>
          </div>
        </div>

        {/* Main navbar */}
        <div className="flex justify-between items-center h-16 lg:h-18">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer">
            <Image
              src="/assets/img/logo/logo_name.png"
              alt="PandaJAC"
              width={160}
              height={45}
              className="h-11 w-auto lg:h-12"
            />
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-1 flex-1 max-w-3xl mx-8 justify-center">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-xl transition-all duration-200 group"
                >
                  <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="hidden lg:block flex-1 max-w-lg">
              <SearchBar
                value={searchValue}
                onChange={setSearchValue}
                placeholder="Buscar por repuesto o referencia..."
              />
            </form>

            {/* Quote CTA */}
            <Link
              href="/cotizacion"
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-sm"
            >
              <Tag className="w-4 h-4" />
              Solicitar cotización
            </Link>

            {/* Cart Button */}
            <button 
              onClick={toggleCart}
              className="relative p-2.5 lg:p-3 bg-white hover:bg-gray-50 rounded-xl transition-all duration-300 border border-gray-200 shadow-sm group"
            >
              <ShoppingBag className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700 group-hover:text-black transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white transform bg-black rounded-full border-2 border-white shadow-sm scale-125">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4 pt-2 border-t border-gray-100">
          <form onSubmit={handleSearchSubmit} className="w-full">
            <SearchBar
              value={searchValue}
              onChange={setSearchValue}
              placeholder="Buscar repuesto..."
            />
          </form>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-slide-down">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 text-gray-600 hover:text-black hover:bg-gray-50 rounded-xl transition-colors font-medium"
                  >
                    <Icon className="w-5 h-5 text-gray-400" />
                    {link.label}
                  </Link>
                )
              })}
              <hr className="my-2 border-gray-100" />
              <Link
                href="/cotizacion"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
              >
                <Tag className="w-5 h-5" />
                Solicitar cotización
              </Link>
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors font-medium"
                >
                  <LogIn className="w-5 h-5" />
                  Ingresar
                </Link>
                <Link
                  href="/registro"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
                >
                  <User className="w-5 h-5" />
                  Registrarse
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}