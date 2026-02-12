'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert("Email atau Password salah")
    else router.push('/daftar-balita')
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 border border-white">
        <div className="text-center mb-10">
          <span className="text-5xl">🔐</span>
          <h1 className="text-3xl font-black text-gray-900 mt-4 tracking-tighter">MASUK KADER</h1>
          <p className="text-gray-400 text-sm font-medium mt-2 uppercase tracking-[0.2em]">Posyandu Desa Parit</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Alamat Email</label>
            <input 
              type="email" placeholder="email@kader.com"
              className="w-full p-4 bg-white text-gray-900 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium"
              value={email} onChange={(e) => setEmail(e.target.value)} required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Kata Sandi</label>
            <input 
              type="password" placeholder="Password"
              className="w-full p-4 bg-white text-gray-900 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 border border-gray-100 transition-all font-medium"
              value={password} onChange={(e) => setPassword(e.target.value)} required 
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black shadow-xl hover:bg-green-600 active:scale-95 transition-all uppercase tracking-widest text-xs"
          >
            {loading ? 'Mengecek Data...' : 'Masuk Sekarang'}
          </button>
        </form>
      </div>
    </main>
  )
}