import { createClient } from '@/app/lib/supabase/server'
import { Product, CarouselSlide } from '@/app/types'

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('model', { ascending: true })
    .order('desc', { ascending: true })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data || []
}

export async function getProductsByModel(model: string): Promise<Product[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('model', model)
    .order('desc', { ascending: true })

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
    .or(`desc.ilike.%${query}%,ref.ilike.%${query}%`)
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