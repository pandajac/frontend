import { Metadata } from 'next'
import { getProducts, getCategoryCounts } from '@/app/lib/data'
import { CatalogContent } from './CatalogContent'

interface SearchParams {
  q?: string
  model?: string
  cat?: string
  page?: string
}

export const metadata: Metadata = {
  title: 'Catálogo de Repuestos JAC | PandaJac',
  description: 'Explora nuestro catálogo completo de repuestos JAC en liquidación. Filtra por modelo, categoría o busca por referencia.',
}

export default async function CatalogPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const page = parseInt(params.page || '1', 10)
  const model = params.model
  const search = params.q
  const cat = params.cat

  const [productsData, categoryCounts] = await Promise.all([
    getProducts({ model, search, cat, page }),
    getCategoryCounts(),
  ])

  return (
    <CatalogContent
      initialProducts={productsData.products}
      initialTotalCount={productsData.totalCount}
      initialTotalPages={productsData.totalPages}
      initialPage={productsData.currentPage}
      initialSearch={search || ''}
      initialFilter={model || 'all'}
      initialCat={cat || ''}
    />
  )
}