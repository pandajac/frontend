'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, Truck, Tag, Shield } from 'lucide-react'
import Image from 'next/image'

export default function RegistroPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    company: '',
    phone: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.email) {
      newErrors.email = 'El email es obligatorio'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres'
    }
    
    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.name = 'El nombre es obligatorio'
      }
      if (!formData.company.trim()) {
        newErrors.company = 'La empresa es obligatoria'
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'El teléfono es obligatorio'
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    
    if (isLogin) {
      router.push('/catalogo')
    } else {
      router.push('/catalogo')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setErrors({})
    setFormData({ email: '', password: '', name: '', confirmPassword: '', company: '', phone: '' })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block mb-8">
            <Image
              src="/assets/img/logo/logo_name.png"
              alt="PandaJAC"
              width={180}
              height={50}
              className="h-12 w-auto mx-auto"
            />
          </Link>
          <h2 className="text-3xl font-black text-black">
            {isLogin ? 'Bienvenido de nuevo' : 'Crear cuenta'}
          </h2>
          <p className="mt-2 text-gray-600">
            {isLogin 
              ? 'Ingresa para acceder a precios mayoristas' 
              : 'Regístrate para cotizar repuestos JAC'
            }
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-sm rounded-2xl border border-gray-100">
          <div className="flex mb-8 border-b border-gray-100">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 text-center font-semibold text-sm transition-colors ${
                isLogin 
                  ? 'text-black border-b-2 border-black -mb-px' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Ingresar
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 text-center font-semibold text-sm transition-colors ${
                !isLogin 
                  ? 'text-black border-b-2 border-black -mb-px' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-colors ${
                        errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-200 focus:border-black focus:ring-black'
                      } focus:ring-2 focus:ring-offset-0 outline-none`}
                      placeholder="Juan Pérez"
                      autoComplete="name"
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Empresa / Taller
                  </label>
                  <div className="relative">
                    <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-colors ${
                        errors.company ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-200 focus:border-black focus:ring-black'
                      } focus:ring-2 focus:ring-offset-0 outline-none`}
                      placeholder="Taller El Motor"
                      autoComplete="organization"
                    />
                  </div>
                  {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company}</p>}
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-colors ${
                    errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-200 focus:border-black focus:ring-black'
                  } focus:ring-2 focus:ring-offset-0 outline-none`}
                  placeholder="correo@empresa.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-colors ${
                      errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-200 focus:border-black focus:ring-black'
                    } focus:ring-2 focus:ring-offset-0 outline-none`}
                    placeholder="+54 11 4444-5555"
                    autoComplete="tel"
                  />
                </div>
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl transition-colors ${
                    errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-200 focus:border-black focus:ring-black'
                  } focus:ring-2 focus:ring-offset-0 outline-none`}
                  placeholder="••••••••"
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-colors ${
                      errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-200 focus:border-black focus:ring-black'
                    } focus:ring-2 focus:ring-offset-0 outline-none`}
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 border-gray-300 rounded text-black focus:ring-black focus:ring-2"
                  />
                  <span className="text-sm text-gray-600">Recordarme</span>
                </label>
                <Link href="/recuperar-password" className="text-sm text-black hover:text-gray-700 font-medium">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {isLogin ? 'Ingresando...' : 'Creando cuenta...'}
                </>
              ) : (
                isLogin ? 'Ingresar' : 'Crear cuenta'
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Beneficios de tu cuenta</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-xl text-center">
                <Tag className="w-6 h-6 text-black mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-700">Precios mayoristas</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl text-center">
                <Shield className="w-6 h-6 text-black mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-700">Cotizaciones guardadas</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl text-center">
                <Truck className="w-6 h-6 text-black mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-700">Envío nacional</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl text-center">
                <User className="w-6 h-6 text-black mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-700">Historial de pedidos</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500">
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'} {' '}
          <button
            onClick={toggleMode}
            className="text-black font-semibold hover:text-gray-700 transition-colors"
          >
            {isLogin ? 'Regístrate' : 'Ingresa'}
          </button>
        </p>
      </div>
    </div>
  )
}