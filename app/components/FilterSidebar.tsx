'use client'

import { ModelFilter } from '@/app/types'
import { Filter, Check } from 'lucide-react'

interface FilterSidebarProps {
  currentFilter: ModelFilter
  onFilterChange: (filter: ModelFilter) => void
}

const filters: { value: ModelFilter; label: string }[] = [
  { value: 'all', label: 'Todo el inventario' },
  { value: '1061', label: 'Serie 1061' },
  { value: '1040', label: 'Serie 1040' },
  { value: '1037', label: 'Serie 1037' },
  { value: '1083', label: 'Serie 1083' },
]

export function FilterSidebar({ currentFilter, onFilterChange }: FilterSidebarProps) {
  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-28 shadow-sm">
        <h2 className="text-lg font-bold text-black mb-6 flex items-center gap-2 uppercase tracking-wider text-sm">
          <Filter className="w-5 h-5 text-black" /> Filtrar Modelos
        </h2>
        <div className="space-y-3">
          {filters.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="model"
                  value={value}
                  checked={currentFilter === value}
                  onChange={() => onFilterChange(value)}
                  className="peer sr-only"
                />
                <div className="w-5 h-5 rounded border border-gray-300 peer-checked:bg-black peer-checked:border-black transition-colors"></div>
                <Check className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100" />
              </div>
              <span className="text-gray-600 font-medium group-hover:text-black transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  )
}