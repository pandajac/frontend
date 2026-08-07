import { useState, useMemo } from 'react'
import { products } from '@/app/data/products'
import { ModelFilter } from '@/app/types'

export function useProducts() {
  const [filter, setFilter] = useState<ModelFilter>('all')
  const [search, setSearch] = useState('')

  const filteredProducts = useMemo(() => {
    let filtered = products
    
    if (filter !== 'all') {
      filtered = filtered.filter(p => p.model === filter)
    }
    
    if (search.trim() !== '') {
      const query = search.toLowerCase()
      filtered = filtered.filter(p =>
        p.desc.toLowerCase().includes(query) ||
        p.ref.toLowerCase().includes(query)
      )
    }
    
    return filtered
  }, [filter, search])

  const resetFilters = () => {
    setFilter('all')
    setSearch('')
  }

  return {
    products: filteredProducts,
    filter,
    search,
    setFilter,
    setSearch,
    resetFilters,
    totalCount: filteredProducts.length,
    allProducts: products,
  }
}