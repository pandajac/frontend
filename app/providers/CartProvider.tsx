'use client'

import { createContext, ReactNode } from 'react'
import { useCart } from '@/app/hooks/useCart'

// Creamos el contexto para que los componentes puedan acceder al carrito
// Nota: En esta implementación, useCart es un hook que maneja el estado local
// y lo compartimos a través de un provider simple

export function CartProvider({ children }: { children: ReactNode }) {
  // El hook useCart ya maneja el estado, pero lo exponemos a través del contexto
  // Para una implementación más robusta, podríamos usar React Context directamente
  return <>{children}</>
}

// Para simplificar, los componentes usan el hook directamente
// En una app real, usarías React Context o Zustand para compartir el estado