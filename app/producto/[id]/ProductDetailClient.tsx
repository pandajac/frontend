'use client'

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ChevronLeft,
  ChevronRight,
  Truck,
  Shield,
  RotateCcw,
  CheckCircle,
  ShoppingBag,
  Plus,
  Minus,
  Heart,
  Share2,
  ZoomIn,
  X,
} from 'lucide-react'
import { Product } from '@/app/types'
import { useCart } from '@/app/providers/CartProvider'
import { useToast } from '@/app/providers/ToastProvider'
import { motion, AnimatePresence } from 'framer-motion'

// ----- Subcomponente: Galería con miniaturas y zoom -----
interface ImageGalleryProps {
  productId: number
  productName: string
  discount: number
  onWishlistToggle: () => void
  isInWishlist: boolean
}

const ImageGallery = ({
  productId,
  productName,
  discount,
  onWishlistToggle,
  isInWishlist,
}: ImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLDivElement>(null)

  const mainImageUrl = `https://picsum.photos/seed/${productId}/800/600`
  const thumbUrls = useMemo(
    () =>
      [1, 2, 3, 4].map(
        (i) => `https://picsum.photos/seed/${productId}${i}/200/150`
      ),
    [productId]
  )

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return
    const rect = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePosition({ x, y })
  }

  return (
    <div className="space-y-4">
      {/* Main Image with zoom */}
      <div
        ref={imageRef}
        className="relative aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden cursor-zoom-in group"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setIsZoomed(!isZoomed)}
      >
        <Image
          src={mainImageUrl}
          alt={productName}
          fill
          className={`object-cover transition-transform duration-300 ${
            isZoomed ? 'scale-150' : ''
          }`}
          style={
            isZoomed
              ? {
                  transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                }
              : undefined
          }
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          unoptimized
        />
        {discount > 0 && (
          <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full z-10">
            -{discount}%
          </span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onWishlistToggle()
          }}
          className={`absolute top-4 right-4 p-2 rounded-full shadow-lg transition-all z-10 ${
            isInWishlist
              ? 'bg-red-500 text-white'
              : 'bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500'
          }`}
          aria-label={isInWishlist ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
        </button>
        <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
          <ZoomIn className="w-4 h-4" />
          {isZoomed ? 'Alejar' : 'Acercar'}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {thumbUrls.map((url, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className={`flex-shrink-0 w-20 h-20 bg-gray-100 rounded-xl overflow-hidden border-2 transition-all ${
              selectedIndex === idx ? 'border-black' : 'border-transparent hover:border-gray-300'
            }`}
            aria-label={`Ver imagen ${idx + 1}`}
            aria-current={selectedIndex === idx ? 'true' : 'false'}
          >
            <Image
              src={url}
              alt={`${productName} - Vista ${idx + 1}`}
              width={80}
              height={80}
              className="object-cover w-full h-full"
              unoptimized
            />
          </button>
        ))}
      </div>

      {/* Zoom modal (opcional, al hacer clic) */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
          >
            <button
              className="absolute top-4 right-4 text-white p-2"
              onClick={() => setIsZoomed(false)}
              aria-label="Cerrar zoom"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="relative w-full max-w-4xl aspect-[4/3]">
              <Image
                src={mainImageUrl}
                alt={productName}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ----- Subcomponente: Selector de cantidad -----
interface QuantitySelectorProps {
  quantity: number
  stock: number
  onIncrement: () => void
  onDecrement: () => void
  onChange: (val: number) => void
}

const QuantitySelector = ({
  quantity,
  stock,
  onIncrement,
  onDecrement,
  onChange,
}: QuantitySelectorProps) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Cantidad</label>
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
          <button
            onClick={onDecrement}
            disabled={quantity <= 1}
            className="px-4 py-3 text-gray-500 hover:text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Disminuir cantidad"
          >
            <Minus className="w-5 h-5" />
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 1
              onChange(Math.min(Math.max(val, 1), stock))
            }}
            min={1}
            max={stock}
            className="w-16 text-center text-lg font-semibold border-x border-gray-300 bg-white focus:outline-none"
            aria-label="Cantidad"
          />
          <button
            onClick={onIncrement}
            disabled={quantity >= stock}
            className="px-4 py-3 text-gray-500 hover:text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Aumentar cantidad"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <span className="text-sm text-gray-500">Máx: {stock}</span>
      </div>
    </div>
  )
}

// ----- Subcomponente: Beneficios -----
const Benefits = () => (
  <div className="border-t border-gray-100 pt-6 space-y-3">
    <h3 className="text-sm font-semibold text-gray-700">Beneficios incluidos</h3>
    <div className="grid grid-cols-2 gap-3">
      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
        <Truck className="w-5 h-5 text-black" />
        <span className="text-sm text-gray-700">Envío nacional</span>
      </div>
      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
        <Shield className="w-5 h-5 text-black" />
        <span className="text-sm text-gray-700">Garantía 12 meses</span>
      </div>
      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
        <RotateCcw className="w-5 h-5 text-black" />
        <span className="text-sm text-gray-700">Devolución 30 días</span>
      </div>
      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
        <CheckCircle className="w-5 h-5 text-black" />
        <span className="text-sm text-gray-700">Precios mayoristas</span>
      </div>
    </div>
  </div>
)

// ----- Subcomponente: Especificaciones -----
const Specifications = ({ product }: { product: Product }) => (
  <details className="group border border-gray-200 rounded-xl overflow-hidden">
    <summary className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer list-none">
      <span className="font-medium text-gray-700">Especificaciones técnicas</span>
      <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform" />
    </summary>
    <div className="p-4 space-y-3 text-sm text-gray-600">
      <div className="grid grid-cols-2 gap-2">
        <span className="text-gray-400">Modelo compatible</span>
        <span className="font-medium">JAC {product.model}</span>
        <span className="text-gray-400">Categoría</span>
        <span className="font-medium capitalize">{product.cat}</span>
        <span className="text-gray-400">Referencia</span>
        <span className="font-medium">{product.referencia || 'N/A'}</span>
        <span className="text-gray-400">Stock actual</span>
        <span className="font-medium">{product.existencia} unidades</span>
      </div>
    </div>
  </details>
)

// ----- Subcomponente: Producto relacionado (card) -----
const RelatedProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart()
  const { showToast } = useToast()

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition"
    >
      <div className="relative h-40 bg-gray-100">
        <Image
          src={`https://picsum.photos/seed/${product.id}/300/300`}
          alt={product.descripcion}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wider">{product.cat}</p>
        <h4 className="font-semibold text-gray-800 truncate">{product.descripcion}</h4>
        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-bold text-black">
            ${product.costo_unidad.toFixed(2)}
          </span>
          <button
            onClick={() => {
              addToCart({ ...product, quantity: 1 })
              showToast(`${product.descripcion} añadido al carrito`, 'success')
            }}
            className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition"
            aria-label="Añadir al carrito"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addToCart } = useCart()
  const { showToast } = useToast()
  const router = useRouter()

  // Estado local
  const [quantity, setQuantity] = useState(1)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  // Cálculos
  const discount = product.oldPrice
    ? Math.round((1 - product.costo_unidad / product.oldPrice) * 100)
    : 0
  const totalPrice = product.costo_unidad * quantity
  const totalSaved = product.oldPrice
    ? (product.oldPrice - product.costo_unidad) * quantity
    : 0

  // Persistencia de wishlist en localStorage
  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
    setIsInWishlist(savedWishlist.includes(product.id))
  }, [product.id])

  const toggleWishlist = useCallback(() => {
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
    let newWishlist
    if (savedWishlist.includes(product.id)) {
      newWishlist = savedWishlist.filter((id: number) => id !== product.id)
      showToast('Eliminado de favoritos', 'info')
    } else {
      newWishlist = [...savedWishlist, product.id]
      showToast('Añadido a favoritos ❤️', 'success')
    }
    localStorage.setItem('wishlist', JSON.stringify(newWishlist))
    setIsInWishlist(!isInWishlist)
  }, [product.id, showToast, isInWishlist])

  // Manejo de cantidad
  const incrementQty = useCallback(() => {
    if (quantity < product.existencia) {
      setQuantity((q) => q + 1)
    }
  }, [quantity, product.existencia])

  const decrementQty = useCallback(() => {
    if (quantity > 1) {
      setQuantity((q) => q - 1)
    }
  }, [quantity])

  const handleQuantityChange = useCallback(
    (val: number) => {
      setQuantity(Math.min(Math.max(val, 1), product.existencia))
    },
    [product.existencia]
  )

  // Añadir al carrito con animación
  const handleAddToCart = useCallback(() => {
    if (product.existencia <= 0) {
      showToast('Producto sin stock', 'error')
      return
    }
    setIsAddingToCart(true)
    const productWithQty = { ...product, quantity }
    addToCart(productWithQty)
    showToast(
      `${product.descripcion} (${quantity} und.) añadido al carrito`,
      'success'
    )
    // Simulación de feedback visual
    setTimeout(() => setIsAddingToCart(false), 300)
  }, [product, quantity, addToCart, showToast])

  // Compartir producto
  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.descripcion,
          text: `Mira este repuesto para JAC ${product.model}`,
          url: window.location.href,
        })
      } catch (error) {
        // Si el usuario cancela, no hacemos nada
      }
    } else {
      // Fallback: copiar enlace al portapapeles
      await navigator.clipboard.writeText(window.location.href)
      showToast('Enlace copiado al portapapeles', 'info')
    }
  }, [product, showToast])

  // Productos relacionados (simulados con el mismo producto pero podrías pasarlos desde props)
  const relatedProducts = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => ({
        ...product,
        id: product.id + i + 100,
        descripcion: `${product.descripcion} - Relacionado ${i + 1}`,
        costo_unidad: product.costo_unidad * (0.8 + Math.random() * 0.4),
      })),
    [product]
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-100 py-4" aria-label="Breadcrumb">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
            <li>
              <Link href="/" className="hover:text-black transition-colors">
                Inicio
              </Link>
            </li>
            <li>
              <ChevronRight className="w-4 h-4" />
            </li>
            <li>
              <Link href="/catalogo" className="hover:text-black transition-colors">
                Catálogo
              </Link>
            </li>
            <li>
              <ChevronRight className="w-4 h-4" />
            </li>
            <li>
              <Link
                href={`/catalogo?cat=${product.cat}`}
                className="hover:text-black transition-colors capitalize"
              >
                {product.cat}
              </Link>
            </li>
            <li>
              <ChevronRight className="w-4 h-4" />
            </li>
            <li className="text-black truncate max-w-xs" aria-current="page">
              {product.descripcion}
            </li>
          </ol>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Galería */}
          <ImageGallery
            productId={product.id}
            productName={product.descripcion}
            discount={discount}
            onWishlistToggle={toggleWishlist}
            isInWishlist={isInWishlist}
          />

          {/* Información del producto */}
          <div className="lg:sticky lg:top-24 space-y-6">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-2">
                {product.cat || 'Repuesto JAC'} · Modelo JAC {product.model}
              </p>
              <h1 className="text-3xl md:text-4xl font-black text-black leading-tight mb-4">
                {product.descripcion}
              </h1>
              {product.referencia && (
                <p className="text-gray-500 mb-4">
                  Referencia:{' '}
                  <span className="font-medium text-gray-700">
                    {product.referencia}
                  </span>
                </p>
              )}
            </div>

            {/* Precio y ahorro */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div>
                <span className="text-3xl md:text-4xl font-black text-black">
                  ${product.costo_unidad.toLocaleString('es-AR', {
                    minimumFractionDigits: 2,
                  })}
                </span>
                {product.oldPrice && (
                  <span className="ml-3 text-xl text-gray-400 line-through">
                    ${product.oldPrice.toLocaleString('es-AR', {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                )}
              </div>
              {product.oldPrice && (
                <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  Ahorra ${(product.oldPrice - product.costo_unidad).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </span>
              )}
            </div>

            {/* Ahorro total por cantidad */}
            {totalSaved > 0 && quantity > 1 && (
              <div className="text-sm text-green-600 font-medium">
                Ahorro total: ${totalSaved.toFixed(2)} (por {quantity} unidades)
              </div>
            )}

            {/* Stock */}
            <div
              className={`flex items-center gap-3 p-4 rounded-xl border ${
                product.existencia > 10
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : product.existencia > 0
                  ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">
                {product.existencia > 10
                  ? `En stock (${product.existencia} unidades disponibles)`
                  : product.existencia > 0
                  ? `Pocas unidades (${product.existencia} restantes)`
                  : 'Sin stock - Consultar disponibilidad'}
              </span>
            </div>

            {/* Selector de cantidad */}
            <QuantitySelector
              quantity={quantity}
              stock={product.existencia}
              onIncrement={incrementQty}
              onDecrement={decrementQty}
              onChange={handleQuantityChange}
            />

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                disabled={product.existencia <= 0 || isAddingToCart}
                className={`flex-1 flex items-center justify-center gap-3 bg-black text-white font-semibold py-4 px-6 rounded-xl transition-colors shadow-sm ${
                  isAddingToCart
                    ? 'bg-green-600'
                    : 'hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {isAddingToCart ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    ¡Añadido!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    Añadir al carrito
                  </>
                )}
              </motion.button>

              <button
                onClick={toggleWishlist}
                className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isInWishlist ? 'fill-red-500 text-red-500' : ''
                  }`}
                />
                {isInWishlist ? 'En favoritos' : 'Guardar'}
              </button>

              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 border border-gray-200 text-gray-600 px-4 py-4 rounded-xl hover:bg-gray-50 transition-colors"
                aria-label="Compartir producto"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Beneficios */}
            <Benefits />

            {/* Especificaciones */}
            <Specifications product={product} />
          </div>
        </div>

        {/* Descripción */}
        <section className="mt-16">
          <h2 className="text-2xl font-black text-black mb-6">Descripción del producto</h2>
          <div className="prose prose-gray max-w-none bg-white p-8 rounded-2xl border border-gray-100">
            <p className="text-gray-700 leading-relaxed">
              {product.descripcion} es un repuesto original para vehículos JAC modelo{' '}
              {product.model}. Diseñado para cumplir con las especificaciones
              técnicas del fabricante, garantiza un ajuste perfecto y un
              rendimiento óptimo. Este componente pertenece a la categoría de{' '}
              {product.cat.toLowerCase()} y tiene referencia{' '}
              {product.referencia || 'propia del fabricante'}.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Todos nuestros repuestos provienen de liquidaciones directas de
              inventario, lo que nos permite ofrecer precios de mayorista sin
              intermediarios. Cada pieza es inspeccionada antes del envío para
              asegurar su calidad y funcionalidad.
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-4 space-y-2">
              <li>Producto nuevo, en empaque original</li>
              <li>Compatible con JAC {product.model}</li>
              <li>Categoría: {product.cat}</li>
              <li>Garantía de 12 meses por defectos de fabricación</li>
              <li>Envío a todo el país</li>
            </ul>
          </div>
        </section>

        {/* Productos relacionados */}
        <section className="mt-16">
          <h2 className="text-2xl font-black text-black mb-6">
            Productos relacionados
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <RelatedProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}