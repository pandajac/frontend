import Image from 'next/image'

export function Header() {
  return (
    <header className="relative overflow-hidden bg-white py-8 md:py-12 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <Image
          src="/assets/img/logo/logo_name.png"
          alt="PandaJAC"
          width={280}
          height={80}
          className="mx-auto mb-6"
        />
        <span className="inline-block py-1 px-3 rounded-full bg-black text-white text-sm font-semibold mb-4 shadow-sm">
          🔥 Últimas unidades disponibles
        </span>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg md:text-xl font-medium">
          Accede a inventario nuevo de paquete a precios de mayorista. Ideal para flotas, talleres y revendedores.
        </p>
      </div>
    </header>
  )
}