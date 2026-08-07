export function Header() {
  return (
    <header className="relative overflow-hidden bg-white py-12 md:py-20 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <span className="inline-block py-1 px-3 rounded-full bg-black text-white text-sm font-semibold mb-4 shadow-sm">
          🔥 Últimas unidades disponibles
        </span>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-black">
          Venta de Oportunidad <br /><span className="text-gray-400">Repuestos JAC</span>
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg md:text-xl font-medium">
          Accede a inventario nuevo de paquete a precios de mayorista. Ideal para flotas, talleres y revendedores.
        </p>
      </div>
    </header>
  )
}