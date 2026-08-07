export interface Product {
  id: number
  desc: string
  ref: string
  stock: number
  price: number
  model: string
  cat: string
}

export interface CartItem extends Product {
  quantity: number
}

export type ModelFilter = 'all' | '1061' | '1040' | '1037' | '1083'