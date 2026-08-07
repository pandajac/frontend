'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCarouselSlides } from '@/app/hooks/useCarouselSlides'

interface Slide {
  src: string
  alt: string
  title?: string
  subtitle?: string
}

// Fallback slides in case DB is empty or error
const fallbackSlides: Slide[] = [
  { src: '/assets/img/carousel/1.webp', alt: 'Repuestos JAC Serie 1061', title: 'Serie 1061', subtitle: 'Motor y componentes principales' },
  { src: '/assets/img/carousel/2.webp', alt: 'Repuestos JAC Serie 1040', title: 'Serie 1040', subtitle: 'Transmisión y filtros' },
  { src: '/assets/img/carousel/3.webp', alt: 'Repuestos JAC Serie 1037', title: 'Serie 1037', subtitle: 'Embrague y suspensión' },
  { src: '/assets/img/carousel/4.webp', alt: 'Repuestos JAC Serie 1083', title: 'Serie 1083', subtitle: 'Componentes de transmisión' },
  { src: '/assets/img/carousel/5.webp', alt: 'Inventario JAC 4250', title: 'Serie 4250', subtitle: 'Carrocería y tanque combustible' },
  { src: '/assets/img/carousel/6.webp', alt: 'Liquidación repuestos JAC', title: 'Liquidación Directa', subtitle: 'Precios de mayorista' },
  { src: '/assets/img/carousel/7.webp', alt: 'PandaJac Repuestos', title: 'PANDAJAC', subtitle: 'Plataforma privada de inventarios' },
]

export function HeroCarousel() {
  const { slides: dbSlides, loading, error } = useCarouselSlides()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')

  // Use DB slides if available, otherwise fallback
  const slides = dbSlides.length > 0 
    ? dbSlides.map(s => ({ src: s.src, alt: s.alt, title: s.title, subtitle: s.subtitle }))
    : fallbackSlides

  const goToSlide = useCallback((index: number) => {
    if (isAnimating || index === currentIndex) return
    setDirection(index > currentIndex ? 'next' : 'prev')
    setIsAnimating(true)
    setCurrentIndex(index)
    setTimeout(() => setIsAnimating(false), 500)
  }, [currentIndex, isAnimating])

  const nextSlide = useCallback(() => {
    goToSlide((currentIndex + 1) % slides.length)
  }, [currentIndex, goToSlide])

  const prevSlide = useCallback(() => {
    goToSlide((currentIndex - 1 + slides.length) % slides.length)
  }, [currentIndex, goToSlide])

  // Auto-play
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [nextSlide])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide()
      if (e.key === 'ArrowRight') nextSlide()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, prevSlide])

  // Reset index when slides change
  useEffect(() => {
    setCurrentIndex(0)
  }, [slides.length])

  if (loading && dbSlides.length === 0) {
    return (
      <header className="relative overflow-hidden bg-white py-12 md:py-20 border-b border-gray-200">
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4 animate-pulse" />
          <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto mb-4 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto animate-pulse" />
        </div>
      </header>
    )
  }

  return (
    <header className="relative overflow-hidden bg-white py-12 md:py-20 border-b border-gray-200">
      {/* Slides Container */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-out ${
              index === currentIndex
                ? 'opacity-100 scale-100 z-10'
                : 'opacity-0 scale-105 z-0'
            }`}
            style={{
              backgroundImage: `url(${slide.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
            role="img"
            aria-label={slide.alt}
          >
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20" />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        disabled={isAnimating}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-3 md:p-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      <button
        onClick={nextSlide}
        disabled={isAnimating}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-3 md:p-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
        aria-label="Slide siguiente"
      >
        <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      {/* Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none">
        <div className="text-center md:text-left max-w-3xl pointer-events-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-semibold mb-4 shadow-sm border border-white/20">
            🔥 Últimas unidades disponibles
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4 text-white leading-tight">
            Venta de Oportunidad <br /><span className="text-white/80">Repuestos JAC</span>
          </h1>
          <p className="text-white/90 max-w-2xl text-lg md:text-xl font-medium mb-8">
            Accede a inventario nuevo de paquete a precios de mayorista. Ideal para flotas, talleres y revendedores.
          </p>
          
          {/* Slide Indicators */}
          <div className="flex justify-center md:justify-start gap-2 mt-8 relative z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-white w-8'
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Ir a slide ${index + 1}`}
                aria-current={index === currentIndex ? 'true' : 'false'}
              />
            ))}
          </div>

          {/* Current slide info */}
          <div className="mt-6 flex items-center gap-4 text-white/70 text-sm font-medium">
            <span className="flex items-center gap-1">
              {slides[currentIndex].title && (
                <>
                  <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                    {slides[currentIndex].title}
                  </span>
                  {slides[currentIndex].subtitle && (
                    <span className="hidden sm:inline">·</span>
                  )}
                </>
              )}
            </span>
            {slides[currentIndex].subtitle && (
              <span className="hidden sm:inline">{slides[currentIndex].subtitle}</span>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}