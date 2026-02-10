'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function TambahBalita() {
    const router = useRouter()
    const [nama, setNama] = useState('')
    const [nik, setNik] = useState('')
    const [loading, setLoading] = useState(false)
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        const cekUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) router.push('/login')
            else setChecking(false)
        }
        cekUser()
    }, [router])

    const handleSimpan = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const { error } = await supabase.from('balitas').insert([{ nama_anak: nama, nik: nik }])
        if (error) alert('Gagal: ' + error.message)
        else {
            alert('Berhasil Daftar!')
            setNama(''); setNik('')
        }
        setLoading(false)
    }

    if (checking) return <div className="min-h-screen flex items-center justify-center font-bold">Mengecek Akses...</div>

    return (
        <main className="min-h-screen bg-gray-50 p-6 pb-24">
            <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-8 mt-10">
                <h1 className="text-2xl font-black text-gray-900 mb-6 text-center">Pendaftaran Balita</h1>
                <form onSubmit={handleSimpan} className="space-y-6">
                    <input type="text" placeholder="Nama Lengkap" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-green-500" value={nama} onChange={(e) => setNama(e.target.value)} required />
                    <input type="number" placeholder="NIK (16 Digit)" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-green-500" value={nik} onChange={(e) => setNik(e.target.value)} required />
                    <button disabled={loading} className="w-full bg-green-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-green-200">
                        {loading ? 'Menyimpan...' : 'Simpan Data'}
                    </button>
                </form>
            </div>
            <div className="max-w-md mx-auto mt-8 px-4">
        <button 
          type="button" 
          onClick={() => router.back()} 
          className="w-full py-4 bg-white border-2 border-green-100 text-green-600 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-sm hover:bg-green-50 transition-all active:scale-95"
        >
          ← Batal & Kembali
        </button>
      </div>
        </main>
    )
}