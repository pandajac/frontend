'use client'

import { useEffect, useState } from 'react'
import { CheckCircle } from 'lucide-react'

interface ToastProps {
  message: string
  isVisible: boolean
  onHide: () => void
  duration?: number
}

export function Toast({ message, isVisible, onHide, duration = 2500 }: ToastProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShow(true)
      const timer = setTimeout(() => {
        setShow(false)
        setTimeout(onHide, 300)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onHide])

  return (
    <div 
      className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black border border-gray-800 text-white px-6 py-3 rounded-xl shadow-2xl transition-all duration-300 z-50 flex items-center gap-3 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <CheckCircle className="w-5 h-5 text-white" />
      <span className="font-medium">{message}</span>
    </div>
  )
}