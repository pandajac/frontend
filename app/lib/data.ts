import { createClient } from '@/app/lib/supabase/server'
import { Product, CarouselSlide } from '@/app/types'

export interface PaginatedProducts {
  products: Product[]
  totalCount: number
  totalPages: number
  currentPage: number
}

export async function getProducts({
  model,
  search,
  cat,
  page = 1,
  pageSize = 24,
}: {
  model?: string
  search?: string
  cat?: string
  page?: number
  pageSize?: number
} = {}): Promise<PaginatedProducts> {
  const supabase = await createClient()
  
  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .order('model', { ascending: true })
    .order('descripcion', { ascending: true })
    .range((page - 1) * pageSize, page * pageSize - 1)

  if (model) {
    query = query.eq('model', model)
  }

  if (cat) {
    query = query.eq('cat', cat)
  }

  if (search) {
    query = query.or(`descripcion.ilike.%${search}%,referencia.ilike.%${search}%`)
  }

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return { products: [], totalCount: 0, totalPages: 0, currentPage: page }
  }

  const totalCount = count || 0
  const totalPages = Math.ceil(totalCount / pageSize)

  return { products: data || [], totalCount, totalPages, currentPage: page }
}

export async function getProductsByModel(model: string): Promise<Product[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('model', model)
    .order('descripcion', { ascending: true })

  if (error) {
    console.error('Error fetching products by model:', error)
    return []
  }

  return data || []
}

export async function searchProducts(query: string): Promise<Product[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`descripcion.ilike.%${query}%,referencia.ilike.%${query}%`)
    .order('model', { ascending: true })

  if (error) {
    console.error('Error searching products:', error)
    return []
  }

  return data || []
}

export async function getCarouselSlides(): Promise<CarouselSlide[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('carousel_slides')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Error fetching carousel slides:', error)
    return []
  }

  return data || []
}

export async function getCategoryCounts(): Promise<Record<string, number>> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('cat')

  if (error) {
    console.error('Error fetching category counts:', error)
    return {}
  }

  const counts: Record<string, number> = {}
  data?.forEach((item) => {
    if (item.cat) {
      counts[item.cat.toLowerCase()] = (counts[item.cat.toLowerCase()] || 0) + 1
    }
  })

  return counts
}

export async function getProductById(id: number): Promise<Product | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product by id:', error)
    return null
  }

  return data
}

export async function getFeaturedProducts(): Promise<{
  bestSellers: Product[]
  onSale: Product[]
  newArrivals: Product[]
}> {
  const supabase = await createClient()
  
  // Fetch best sellers (top products by existencia or random)
  const { data: bestSellers } = await supabase
    .from('products')
    .select('*')
    .gt('existencia', 0)
    .order('existencia', { ascending: false })
    .limit(6)

  // Fetch on sale (products with discount - we'll simulate with random for now)
  const { data: allProducts } = await supabase
    .from('products')
    .select('*')
    .gt('existencia', 0)
    .limit(50)

  // Simulate on sale - pick random products and add oldPrice
  const onSale = (allProducts || [])
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .map(p => ({ ...p, oldPrice: Math.round(p.costo_unidad * 1.3) }))

  // New arrivals - most recently added
  const { data: newArrivals } = await supabase
    .from('products')
    .select('*')
    .gt('existencia', 0)
    .order('created_at', { ascending: false })
    .limit(6)

  return {
    bestSellers: bestSellers || [],
    onSale,
    newArrivals: newArrivals || [],
  }
}