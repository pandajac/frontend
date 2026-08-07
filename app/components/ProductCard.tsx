'use client'

import { Product } from '@/app/types'
import { useCart } from '@/app/providers/CartProvider'
import { Package, Cpu, Car, Settings, Filter as FilterIcon, Plus } from 'lucide-react'

interface ProductCardProps {
  product: Product
  onAddToCart?: (productId: number) => void
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Filtros': FilterIcon,
  'Motor': Cpu,
  'Eléctrico': Cpu,
  'Carrocería': Car,
  'Transmisión': Settings,
  'Suspensión': Settings,
  'Frenos': Settings,
  'Dirección': Settings,
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { addToCart } = useCart()
  const Icon = categoryIcons[product.cat] || Settings

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product.id)
    } else {
      addToCart(product)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-black transition-all duration-300 flex flex-col fade-in group shadow-sm hover:shadow-md">
      <div className="h-32 bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden border-b border-gray-100">
        <Icon className="w-12 h-12 text-gray-300 group-hover:text-black transition-colors duration-300 relative z-10" />
        <span className="absolute top-3 right-3 bg-white text-black text-[10px] tracking-wider uppercase font-bold px-2 py-1 rounded border border-gray-200 shadow-sm">
          Ref: {product.referencia || 'N/A'}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-sm font-bold text-black leading-snug uppercase mb-3 line-clamp-2" title={product.descripcion}>
          {product.descripcion}
        </h3>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200 font-medium">
            JAC {product.model}
          </span>
          <span className={`text-xs ${product.existencia > 5 ? 'text-black bg-gray-100 border-gray-200' : 'text-gray-500 bg-gray-50 border-gray-100'} px-2 py-1 rounded border flex items-center gap-1 font-medium`}>
            <Package className="w-3.5 h-3.5" /> {product.existencia} ud.
          </span>
        </div>
        
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Precio Oferta</span>
            <span className="text-xl font-black text-black">{formatMoney(product.costo_unidad)}</span>
          </div>
          <button 
            onClick={handleAddToCart}
            className="bg-black hover:bg-gray-800 text-white w-10 h-10 rounded-xl transition-all duration-200 flex items-center justify-center group/btn shadow-sm border border-transparent"
            title="Agregar a cotización"
          >
            <Plus className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  )
}