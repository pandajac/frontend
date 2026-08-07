'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Truck, Shield, RotateCcw, CheckCircle, ShoppingBag, Plus, Minus, Heart } from 'lucide-react'
import { Product } from '@/app/types'
import { useCart } from '@/app/providers/CartProvider'
import { useToast } from '@/app/providers/ToastProvider'

interface ProductDetailClientProps {
  product: Product
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addToCart } = useCart()
  const { showToast } = useToast()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isInWishlist, setIsInWishlist] = useState(false)

  const imageUrl = `https://picsum.photos/seed/${product.id}/800/600`
  const discount = product.oldPrice ? Math.round((1 - product.costo_unidad / product.oldPrice) * 100) : 0

  const handleAddToCart = () => {
    const productWithQty = { ...product, quantity }
    addToCart(productWithQty)
    showToast(`${product.descripcion} añadido al carrito (${quantity} und.)`, 'success')
  }

  const incrementQty = () => {
    if (quantity < product.existencia) {
      setQuantity(q => q + 1)
    }
  }

  const decrementQty = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-100 py-4" aria-label="Breadcrumb">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-black transition-colors">Inicio</Link></li>
            <li><ChevronRight className="w-4 h-4" /></li>
            <li><Link href="/catalogo" className="hover:text-black transition-colors">Catálogo</Link></li>
            <li><ChevronRight className="w-4 h-4" /></li>
            <li><Link href={`/catalogo?cat=${product.cat}`} className="hover:text-black transition-colors capitalize">{product.cat}</Link></li>
            <li><ChevronRight className="w-4 h-4" /></li>
            <li className="text-black truncate max-w-xs" aria-current="page">{product.descripcion}</li>
          </ol>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden">
              <Image
                src={imageUrl}
                alt={product.descripcion}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized
              />
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  -{discount}%
                </span>
              )}
              <button
                onClick={() => setIsInWishlist(!isInWishlist)}
                className={`absolute top-4 right-4 p-2 rounded-full shadow-lg transition-all ${
                  isInWishlist ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500'
                }`}
                aria-label={isInWishlist ? 'Quitar de favoritos' : 'Añadir a favoritos'}
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[1, 2, 3, 4].map((i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i - 1)}
                  className={`flex-shrink-0 w-20 h-20 bg-gray-100 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === i - 1 ? 'border-black' : 'border-transparent hover:border-gray-300'
                  }`}
                  aria-label={`Ver imagen ${i}`}
                  aria-current={selectedImage === i - 1 ? 'true' : 'false'}
                >
                  <Image
                    src={`https://picsum.photos/seed/${product.id}${i}/200/150`}
                    alt={`${product.descripcion} - Vista ${i}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:sticky lg:top-24 space-y-6">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-2">
                {product.cat || 'Repuesto JAC'} · Modelo JAC {product.model}
              </p>
              <h1 className="text-3xl md:text-4xl font-black text-black leading-tight mb-4">
                {product.descripcion}
              </h1>
              {product.referencia && (
                <p className="text-gray-500 mb-4">Referencia: <span className="font-medium text-gray-700">{product.referencia}</span></p>
              )}
            </div>

            {/* Price */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div>
                <span className="text-3xl md:text-4xl font-black text-black">
                  ${product.costo_unidad.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </span>
                {product.oldPrice && (
                  <span className="ml-3 text-xl text-gray-400 line-through">
                    ${product.oldPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </span>
                )}
              </div>
              {product.oldPrice && (
                <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  Ahorra ${(product.oldPrice - product.costo_unidad).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className={`flex items-center gap-3 p-4 rounded-xl border ${product.existencia > 10 ? 'bg-green-50 border-green-200 text-green-800' : product.existencia > 0 ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">
                {product.existencia > 10 
                  ? `En stock (${product.existencia} unidades disponibles)`
                  : product.existencia > 0 
                    ? `Pocas unidades (${product.existencia} restantes)`
                    : 'Sin stock - Consultar disponibilidad'}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Cantidad</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                  <button
                    onClick={decrementQty}
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
                      setQuantity(Math.min(Math.max(val, 1), product.existencia))
                    }}
                    min={1}
                    max={product.existencia}
                    className="w-16 text-center text-lg font-semibold border-x border-gray-300 bg-white focus:outline-none"
                    aria-label="Cantidad"
                  />
                  <button
                    onClick={incrementQty}
                    disabled={quantity >= product.existencia}
                    className="px-4 py-3 text-gray-500 hover:text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">Máx: {product.existencia}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.existencia <= 0}
                className="flex-1 flex items-center justify-center gap-3 bg-black text-white font-semibold py-4 px-6 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <ShoppingBag className="w-5 h-5" />
                Añadir al carrito
              </button>
              <button
                onClick={() => setIsInWishlist(!isInWishlist)}
                className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                {isInWishlist ? 'En favoritos' : 'Guardar'}
              </button>
            </div>

            {/* Benefits */}
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

            {/* Specs */}
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
          </div>
        </div>

        {/* Description Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-black text-black mb-6">Descripción del producto</h2>
          <div className="prose prose-gray max-w-none bg-white p-8 rounded-2xl border border-gray-100">
            <p className="text-gray-700 leading-relaxed">
              {product.descripcion} es un repuesto original para vehículos JAC modelo {product.model}. 
              Diseñado para cumplir con las especificaciones técnicas del fabricante, garantiza un ajuste perfecto 
              y un rendimiento óptimo. Este componente pertenece a la categoría de {product.cat.toLowerCase()} 
              y tiene referencia {product.referencia || 'propia del fabricante'}.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Todos nuestros repuestos provienen de liquidaciones directas de inventario, lo que nos permite 
              ofrecer precios de mayorista sin intermediarios. Cada pieza es inspeccionada antes del envío 
              para asegurar su calidad y funcionalidad.
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

        {/* Related Products Placeholder */}
        <section className="mt-16">
          <h2 className="text-2xl font-black text-black mb-6">Productos relacionados</h2>
          <p className="text-center text-gray-500 py-12 bg-white rounded-2xl border border-gray-100">
            Próximamente: productos de la misma categoría o modelo
          </p>
        </section>
      </main>
    </div>
  )
}