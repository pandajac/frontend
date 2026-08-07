'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/app/types'

import { CartProvider, useCart } from './providers/CartProvider'
import { Navbar } from './components/Navbar'
import { HeroCarousel } from './components/HeroCarousel'
import { Footer } from './components/Footer'
import { CartDrawer } from './components/CartDrawer'
import { Toast } from './components/Toast'
import { useToast } from './providers/ToastProvider'

interface HomeContentProps {
  bestSellers: Product[]
  onSale: Product[]
  newArrivals: Product[]
}

export function HomeContent({ bestSellers, onSale, newArrivals }: HomeContentProps) {
  const { addToCart } = useCart()
  const { showToast } = useToast()

  const handleAddToCart = useCallback(
    (product: Product) => {
      addToCart(product)
      showToast('Producto añadido al carrito', 'success')
    },
    [addToCart, showToast]
  )

  return (
    <>
      <Head>
        <title>PandaJac - Liquidación de Repuestos JAC</title>
        <meta name="description" content="Plataforma privada de liquidación de inventarios JAC. Precios mayoristas, envío nacional." />
        <meta property="og:title" content="PandaJac - Liquidación de Repuestos JAC" />
        <meta property="og:description" content="Accede a inventario nuevo de paquete a precios de mayorista." />
        <link rel="canonical" href="https://pandajac.com" />
      </Head>

      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />

        <HeroCarousel />

        {/* Carruseles por categoría con productos reales */}
        <ProductCarousel title="⭐ Más Vendidos" products={bestSellers} onAdd={handleAddToCart} />
        <ProductCarousel title="🔥 Ofertas Especiales" products={onSale} onAdd={handleAddToCart} />
        <ProductCarousel title="🆕 Novedades" products={newArrivals} onAdd={handleAddToCart} />

        {/* Banner promocional */}
        <PromoBanner />

        {/* Marcas */}
        <BrandsGrid />

        {/* Testimonios */}
        <Testimonials />

        {/* Inspiración */}
        <InspirationSection />

        {/* Newsletter */}
        <Newsletter />

        <Footer />

        <CartDrawer />

<ScrollToTopButton />
        </div>
      </>
  )
}

// ============================================================
// COMPONENTES INTERNOS
// ============================================================

// ----- Product Card con efectos -----
const ProductCard = ({ product, onAdd }: { product: Product; onAdd: (product: Product) => void }) => {
  const [isHovered, setIsHovered] = useState(false)

  // Usar imagen placeholder con seed basado en ID
  const imageUrl = `https://picsum.photos/seed/${product.id}/300/300`

  const discount = product.oldPrice ? Math.round((1 - product.costo_unidad / product.oldPrice) * 100) : 0

  return (
    <Link href={`/producto/${product.id}`} className="block">
      <motion.div
        whileHover={{ y: -8 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group relative bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-2xl"
      >
        <div className="relative h-48 bg-gray-100">
          <Image
            src={imageUrl}
            alt={product.descripcion}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
            unoptimized
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              -{discount}%
            </span>
          )}
          <motion.button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onAdd(product)
            }}
            whileTap={{ scale: 0.9 }}
            className="absolute bottom-3 right-3 bg-black text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Añadir al carrito"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </motion.button>
        </div>

        <div className="p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
            {product.cat || 'Repuesto JAC'}
          </p>
          <h3 className="font-bold text-black text-sm leading-tight mb-2 line-clamp-2">
            {product.descripcion}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-black">
              ${product.costo_unidad.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </span>
            {product.oldPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${product.oldPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>
          {product.referencia && (
            <p className="text-xs text-gray-500 mt-1">Ref: {product.referencia}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">Modelo: JAC {product.model}</p>
          <p className="text-xs mt-1">
            <span className={product.existencia > 10 ? 'text-green-600' : product.existencia > 0 ? 'text-yellow-600' : 'text-red-600'}>
              {product.existencia > 0 ? `${product.existencia} unidades disponibles` : 'Sin stock'}
            </span>
          </p>
        </div>
      </motion.div>
    </Link>
  )
}

// ----- ProductCarousel -----
interface ProductCarouselProps {
  title: string
  products: Product[]
  onAdd: (product: Product) => void
}

const ProductCarousel = ({ title, products, onAdd }: ProductCarouselProps) => {
  const [ref, inView] = useInView({ triggerOnce: true, rootMargin: '100px' })

  if (products.length === 0) return null

  return (
    <motion.section ref={ref} className="py-16 bg-white" initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-black text-black mb-8">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={onAdd} />
          ))}
        </div>
        {products.length < 4 && (
          <p className="text-center text-gray-500 mt-4 text-sm">
            Mostrando {products.length} producto{products.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </motion.section>
  )
}

// ----- PromoBanner -----
const PromoBanner = () => {
  const targetDate = useMemo(() => new Date().getTime() + 7 * 24 * 60 * 60 * 1000, [])
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const diff = targetDate - now
      if (diff <= 0) {
        clearInterval(interval)
        return
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  return (
    <section className="relative bg-gradient-to-r from-indigo-900 to-purple-800 text-white py-16 overflow-hidden">
      <div className="absolute inset-0 opacity-10" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-semibold mb-4">
            🔥 Oferta Especial
          </span>
          <h2 className="text-3xl md:text-5xl font-black mb-2">¡No te lo pierdas!</h2>
          <p className="text-lg md:text-xl text-white/80 mb-8">Hasta 30% de descuento en repuestos seleccionados</p>
          <div className="flex justify-center gap-4 flex-wrap">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 min-w-[70px]">
                <div className="text-2xl md:text-4xl font-mono font-bold">{String(value).padStart(2, '0')}</div>
                <div className="text-xs uppercase tracking-wider text-white/70">{unit}</div>
              </div>
            ))}
          </div>
          <motion.div whileHover={{ scale: 1.05 }} className="mt-8">
            <Link href="/catalogo" className="inline-block bg-white text-black px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition">
              Ver ofertas
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ----- BrandsGrid -----
const BrandsGrid = () => {
  const [ref, inView] = useInView({ triggerOnce: true, rootMargin: '100px' })
  const brands = [
    { name: 'Bosch', color: '#FF0000' },
    { name: 'Mann-Filter', color: '#0066CC' },
    { name: 'NGK', color: '#FF6600' },
    { name: 'Castrol', color: '#009933' },
    { name: 'Gates', color: '#000000' },
    { name: 'Monroe', color: '#CC0000' },
    { name: 'TRW', color: '#003399' },
    { name: 'Febi', color: '#006600' },
  ]

  return (
    <motion.section ref={ref} className="py-16 bg-white" initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-black text-black mb-8 text-center">Marcas Premium</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-8 items-center">
          {brands.map((brand) => (
            <motion.div
              key={brand.name}
              whileHover={{ scale: 1.1 }}
              className="flex justify-center items-center min-h-[80px] px-4"
            >
              <span className="font-black text-2xl md:text-3xl tracking-tight" style={{ color: brand.color }}>
                {brand.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

// ----- Testimonials -----
const Testimonials = () => {
  const [ref, inView] = useInView({ triggerOnce: true, rootMargin: '100px' })
  const testimonials = [
    { id: 1, name: 'Carlos M.', text: 'Excelente calidad y envío rápido. Mi taller funciona mejor con sus repuestos.', role: 'Dueño Taller Mecánico' },
    { id: 2, name: 'Laura G.', text: 'Encontré el repuesto que nadie tenía en stock. Muy satisfecha con la atención.', role: 'Gerente Flota Transporte' },
    { id: 3, name: 'Javier R.', text: 'Precios reales de mayorista. Ahorro 30% vs distribuidores tradicionales.', role: 'Distribuidor Repuestos' },
  ]

  return (
    <motion.section ref={ref} className="py-16 bg-gray-50" initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-black text-black mb-8 text-center">Lo que dicen nuestros clientes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <motion.div
              key={t.id}
              whileHover={{ y: -4 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="font-bold text-gray-600">{t.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-semibold text-black">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

// ----- InspirationSection -----
const InspirationSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, rootMargin: '100px' })
  const images = [
    { src: 'taller', label: 'Equipa tu Taller' },
    { src: 'flota', label: 'Mantenimiento Flotas' },
    { src: 'reventa', label: 'Revendedores' },
    { src: 'motor', label: 'Repuestos Motor' },
  ]

  return (
    <motion.section ref={ref} className="py-16 bg-white" initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-black text-black mb-8 text-center">Inspiración para tu Negocio</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <motion.div
              key={img.src}
              whileHover={{ scale: 1.02 }}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100"
            >
              <Image
                src={`https://picsum.photos/seed/insp${img.src}/600/450`}
                alt={img.label}
                fill
                className="object-cover group-hover:scale-105 transition duration-500"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition" />
              <div className="absolute bottom-4 left-4 text-white font-semibold text-lg drop-shadow">
                {img.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

// ----- Newsletter -----
const Newsletter = () => {
  const [ref, inView] = useInView({ triggerOnce: true, rootMargin: '100px' })
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      alert(`¡Gracias! Te has suscrito con: ${email}`)
      setEmail('')
    }
  }

  return (
    <motion.section ref={ref} className="py-16 bg-gray-900" initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-black text-white mb-4">
            Recibe Ofertas Exclusivas
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Suscríbete y entérate primero de liquidaciones especiales y nuevos ingresos de stock.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="flex-1 px-6 py-4 rounded-xl bg-gray-800 border border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none text-white placeholder-gray-500"
              required
            />
            <button
              type="submit"
              className="bg-yellow-400 text-black font-bold px-8 py-4 rounded-xl hover:bg-yellow-300 transition-all duration-300 whitespace-nowrap"
            >
              Suscribirse
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-4">No spam. Solo ofertas reales. Cancela cuando quieras.</p>
        </div>
      </div>
    </motion.section>
  )
}

// ============================================================
// SCROLL TO TOP BUTTON
// ============================================================
const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false)
  const { scrollY } = useScroll()

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => setVisible(latest > 500))
    return () => unsubscribe()
  }, [scrollY])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 bg-black text-white p-3 rounded-full shadow-xl hover:bg-gray-800 transition"
          aria-label="Volver arriba"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}