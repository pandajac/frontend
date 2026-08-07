import { NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@/app/lib/data'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  
  const page = parseInt(searchParams.get('page') || '1', 10)
  const pageSize = 24
  const model = searchParams.get('model') || undefined
  const search = searchParams.get('q') || undefined
  const cat = searchParams.get('cat') || undefined

  const result = await getProducts({ model, search, cat, page, pageSize })

  return NextResponse.json(result)
}