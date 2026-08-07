'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/app/lib/supabase/client'
import { Product, ModelFilter } from '@/app/types'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [filter, setFilter] = useState<ModelFilter>('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const supabase = createClient()
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('model', { ascending: true })
          .order('descripcion', { ascending: true })

        if (error) throw error
        setProducts(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar productos')
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    let filtered = products
    
    if (filter !== 'all') {
      filtered = filtered.filter(p => p.model === filter)
    }
    
    if (search.trim() !== '') {
      const query = search.toLowerCase()
      filtered = filtered.filter(p =>
        p.descripcion.toLowerCase().includes(query) ||
        (p.referencia || '').toLowerCase().includes(query)
      )
    }
    
    return filtered
  }, [products, filter, search])

  const resetFilters = () => {
    setFilter('all')
    setSearch('')
  }

  return {
    products: filteredProducts,
    allProducts: products,
    filter,
    search,
    setFilter,
    setSearch,
    resetFilters,
    totalCount: filteredProducts.length,
    loading,
    error,
  }
}