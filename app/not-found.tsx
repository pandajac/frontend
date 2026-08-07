import { AlertCircle, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <AlertCircle className="w-20 h-20 text-gray-300 mb-4 mx-auto" />
        <h1 className="text-4xl font-black text-black mb-2">404</h1>
        <p className="text-gray-500 mb-6 text-lg">Página no encontrada</p>
        <a 
          href="/" 
          className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Volver al inicio
        </a>
      </div>
    </div>
  )
}