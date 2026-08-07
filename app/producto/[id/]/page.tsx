import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductById } from '@/app/lib/data'
import { ProductDetailClient } from './ProductDetailClient'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = await getProductById(parseInt(id))
  
  if (!product) {
    return { title: 'Producto no encontrado' }
  }
  
  return {
    title: `${product.descripcion} | PandaJac`,
    description: `${product.descripcion} - Ref: ${product.referencia || 'N/A'} - Modelo: JAC ${product.model} - $${product.costo_unidad.toLocaleString('es-AR')}`,
    openGraph: {
      title: product.descripcion,
      description: `Repuesto JAC para modelo ${product.model}`,
      type: 'website',
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const product = await getProductById(parseInt(id))

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}