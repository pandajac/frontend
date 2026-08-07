import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'PandaJac - Liquidación de Repuestos',
  description: 'Plataforma privada de liquidación de inventarios JAC',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-gray-50 text-gray-900 min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  )
}