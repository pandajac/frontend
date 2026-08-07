'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Product, ModelFilter } from '@/app/types'

export function useCatalog(initialProducts: Product[], initialTotalCount: number, initialTotalPages: number, initialPage: number) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [totalCount, setTotalCount] = useState(initialTotalCount)
  const [totalPages, setTotalPages] = useState(initialTotalPages)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [loading, setLoading] = useState(false)

  const [filter, setFilter] = useState<ModelFilter>(
    (searchParams.get('model') as ModelFilter) || 'all'
  )
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [cat, setCat] = useState(searchParams.get('cat') || '')

  // Sync URL with state
  const updateURL = useCallback((params: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams.toString())
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value)
      } else {
        newParams.delete(key)
      }
    })

    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false })
  }, [router, pathname, searchParams])

  // Handle filter changes
  const handleFilterChange = useCallback((newFilter: ModelFilter) => {
    setFilter(newFilter)
    setCurrentPage(1)
    updateURL({ model: newFilter !== 'all' ? newFilter : null, page: '1' })
  }, [updateURL])

  const handleSearchChange = useCallback((newSearch: string) => {
    setSearch(newSearch)
    setCurrentPage(1)
    updateURL({ q: newSearch || null, page: '1' })
  }, [updateURL])

  const handleCatChange = useCallback((newCat: string) => {
    setCat(newCat)
    setCurrentPage(1)
    updateURL({ cat: newCat || null, page: '1' })
  }, [updateURL])

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    setCurrentPage(newPage)
    updateURL({ page: newPage.toString() })
  }, [totalPages, updateURL])

  const resetFilters = useCallback(() => {
    setFilter('all')
    setSearch('')
    setCat('')
    setCurrentPage(1)
    updateURL({ model: null, q: null, cat: null, page: '1' })
  }, [updateURL])

  // Fetch products when URL params change (for SSR hydration + page changes)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        params.set('page', currentPage.toString())
        if (filter !== 'all') params.set('model', filter)
        if (search) params.set('q', search)
        if (cat) params.set('cat', cat)

        const res = await fetch(`/api/products?${params.toString()}`)
        const data = await res.json()
        
        setProducts(data.products)
        setTotalCount(data.totalCount)
        setTotalPages(data.totalPages)
      } catch (err) {
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [currentPage, filter, search, cat])

  return {
    products,
    totalCount,
    totalPages,
    currentPage,
    loading,
    filter,
    search,
    cat,
    setFilter: handleFilterChange,
    setSearch: handleSearchChange,
    setCat: handleCatChange,
    setPage: handlePageChange,
    resetFilters,
  }
}