import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-white text-gray-500 py-10 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center sm:text-left flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <Image
            src="/assets/img/logo/logo_name.png"
            alt="PandaJAC"
            width={200}
            height={50}
            className="mx-auto sm:mx-0"
          />
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