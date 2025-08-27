import { redirect } from 'next/navigation'
import { getServerClient } from '../lib/supabaseServer'

export default async function HomePage() {
  const supabase = await getServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Si hay usuario, redirigir al dashboard según su rol
  redirect('/app/ventas')
}
