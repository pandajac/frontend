export interface Product {
  id: number
  descripcion: string
  referencia: string | null
  existencia: number
  costo_unidad: number
  model: string
  cat: string
  created_at?: string
  updated_at?: string
}

export interface CartItem extends Product {
  quantity: number
}

export interface CarouselSlide {
  id: number
  src: string
  alt: string
  title?: string
  subtitle?: string
  order_index: number
  is_active: boolean
  created_at?: string
}

export type ModelFilter = 'all' | '1061' | '1040' | '1037' | '1083' | '4250' | '1027' | '4251' | '1131' | '3130'