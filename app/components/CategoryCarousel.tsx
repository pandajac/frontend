'use client'

import Link from 'next/link'
import { Package, Cpu, Zap, Car, Settings, Truck, CircleDot, Navigation } from 'lucide-react'

interface Category {
  slug: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  count?: number
}

const categories: Category[] = [
  { slug: 'filtros', label: 'Filtros', icon: Package },
  { slug: 'motor', label: 'Motor', icon: Cpu },
  { slug: 'electrico', label: 'Eléctrico', icon: Zap },
  { slug: 'carroceria', label: 'Carrocería', icon: Car },
  { slug: 'transmision', label: 'Transmisión', icon: Settings },
  { slug: 'suspension', label: 'Suspensión', icon: Truck },
  { slug: 'frenos', label: 'Frenos', icon: CircleDot },
  { slug: 'direccion', label: 'Dirección', icon: Navigation },
]

const catToModel: Record<string, string[]> = {
  filtros: ['1061', '1040', '1037', '1083', '1027', '4250', '4251', '1131', '3130'],
  motor: ['1061', '1040', '1037', '1083', '1027', '4250', '4251', '1131', '3130'],
  electrico: ['1061', '1040', '1037', '1083', '1027', '4250', '4251', '1131', '3130'],
  carroceria: ['1061', '1040', '1037', '1083', '1027', '4250', '4251', '1131', '3130'],
  transmision: ['1061', '1040', '1037', '1083', '1027', '4250', '4251', '1131', '3130'],
  suspension: ['1061', '1040', '1037', '1083', '1027', '4250', '4251', '1131', '3130'],
  frenos: ['1061', '1040', '1037', '1083', '1027', '4250', '4251', '1131', '3130'],
  direccion: ['1061', '1040', '1037', '1083', '1027', '4250', '4251', '1131', '3130'],
}

export function CategoryCarousel({ counts }: { counts?: Record<string, number> }) {
  return (
    <section className="py-10 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-black text-black mb-6">Categorías</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/catalogo?cat=${cat.slug}`}
              className="flex-shrink-0 snap-start w-48 md:w-56 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:border-black hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group"
            >
              <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-black group-hover:text-white transition-colors">
                <cat.icon className="w-7 h-7 text-gray-600 group-hover:text-white transition-colors" />
              </div>
              <span className="font-bold text-black text-sm leading-tight">{cat.label}</span>
              {counts && counts[cat.slug] !== undefined && (
                <span className="text-xs text-gray-500 mt-1 font-medium">{counts[cat.slug]} productos</span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}