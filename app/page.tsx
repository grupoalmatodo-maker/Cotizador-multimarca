import { redirect } from 'next/navigation'
import { getServerClient } from '../lib/supabaseServer'

export default async function HomePage() {
  const supabase = await getServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold">Bienvenido a CotizAI</h1>
      <p>Has iniciado sesión correctamente.</p>
    </div>
  )
}
