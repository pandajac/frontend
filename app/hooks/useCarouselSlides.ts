'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/lib/supabase/client'
import { CarouselSlide } from '@/app/types'

export function useCarouselSlides() {
  const [slides, setSlides] = useState<CarouselSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true)
        const supabase = createClient()
        const { data, error } = await supabase
          .from('carousel_slides')
          .select('*')
          .eq('is_active', true)
          .order('order_index', { ascending: true })

        if (error) throw error
        setSlides(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar slides')
        console.error('Error fetching carousel slides:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSlides()
  }, [])

  return { slides, loading, error }
}