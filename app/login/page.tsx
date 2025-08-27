'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/app` }
    })
    if (error) return alert(error.message)
    setSent(true)
  }

  return (
    <main className="grid place-items-center min-h-screen">
      <form onSubmit={onSubmit} className="bg-white p-6 rounded-xl shadow w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">Login CotizAI</h1>
        {sent ? (
          <p>Revisa tu correo para acceder.</p>
        ) : (
          <>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border p-2 rounded" required />
            <button className="w-full bg-black text-white py-2 rounded-xl">Enviar enlace</button>
          </>
        )}
      </form>
    </main>
  )
}
