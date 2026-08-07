import { createClient } from '@/app/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/catalogo'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      redirect(next)
    }
  }

  // Error - redirect to login with error
  redirect('/login?error=No se pudo confirmar la cuenta')
}