import { Square } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-white text-gray-500 py-10 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center sm:text-left flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <span className="text-black font-black tracking-widest text-lg flex items-center gap-1 justify-center sm:justify-start">
            <Square className="w-5 h-5 text-black" /> PANDAJAC
          </span>
          <p className="text-sm mt-2 font-medium">Plataforma privada de liquidación de inventarios.</p>
        </div>
        <div className="text-sm flex gap-4 font-medium">
          <span>&copy; 2026 PandaJac.</span>
          <span className="hidden sm:inline">|</span>
          <span>Desarrollado para uso interno.</span>
        </div>
      </div>
    </footer>
  )
}