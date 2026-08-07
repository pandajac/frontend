'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, AlertCircle, Info } from 'lucide-react'

interface ToastProps {
  message: string
  isVisible: boolean
  onHide: () => void
  duration?: number
  type?: 'success' | 'error' | 'info'
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

const colors = {
  success: 'bg-black border-gray-800',
  error: 'bg-red-600 border-red-700',
  info: 'bg-blue-600 border-blue-700',
}

export function Toast({ message, isVisible, onHide, duration = 2500, type = 'success' }: ToastProps) {
  const [show, setShow] = useState(false)
  const Icon = icons[type]

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
      className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 ${colors[type]} text-white px-6 py-3 rounded-xl shadow-2xl transition-all duration-300 z-50 flex items-center gap-3 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <Icon className="w-5 h-5 text-white" />
      <span className="font-medium">{message}</span>
    </div>
  )
}