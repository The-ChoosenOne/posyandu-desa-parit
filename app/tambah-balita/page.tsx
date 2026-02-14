'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function TambahBalita() {
    const router = useRouter()
    const [nama, setNama] = useState('')
    const [nik, setNik] = useState('')
    // --- State Baru Tambahan dari Bidan ---
    const [namaOrtu, setNamaOrtu] = useState('')
    const [tglLahir, setTglLahir] = useState('')
    
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

        // Pastikan kolom nama_ortu dan tgl_lahir sudah ada di tabel 'balitas' Supabase
        const { error } = await supabase.from('balitas').insert([
            { 
                nama_anak: nama, 
                nik: nik,
                nama_ortu: namaOrtu, 
                tgl_lahir: tglLahir 
            }
        ])

        if (error) {
            alert('Gagal: ' + error.message)
        } else {
            alert('Berhasil Daftar Balita!')
            // Reset semua field
            setNama(''); setNik(''); setNamaOrtu(''); setTglLahir('')
            router.push('/daftar-balita?tab=balita')
        }
        setLoading(false)
    }

    if (checking) return <div className="min-h-screen flex items-center justify-center font-bold italic animate-pulse text-green-600">Mengecek Akses...</div>

    return (
        <main className="min-h-screen bg-gray-50 p-6 pb-24">
            <div className="max-w-md mx-auto bg-white rounded-[2.5rem] shadow-2xl p-8 mt-10 border border-green-50">
                <div className="text-center mb-8">
                    <span className="text-4xl">👶</span>
                    <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mt-2">Pendaftaran Balita</h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Data Baru Desa Parit</p>
                </div>

                <form onSubmit={handleSimpan} className="space-y-5">
                    {/* Nama Anak */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-green-600 uppercase ml-2 tracking-widest">Nama Lengkap Anak</label>
                        <input type="text" placeholder="Masukkan nama..." className="w-full p-4 bg-gray-50 text-gray-900 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 border border-gray-100 font-bold" value={nama} onChange={(e) => setNama(e.target.value)} required />
                    </div>

                    {/* NIK */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-green-600 uppercase ml-2 tracking-widest">NIK (16 Digit)</label>
                        <input type="number" placeholder="35xxxxxxxxxxxxxx" className="w-full p-4 bg-gray-50 text-gray-900 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 border border-gray-100 font-bold" value={nik} onChange={(e) => setNik(e.target.value)} required />
                    </div>

                    {/* Nama Ortu (Update Bidan) */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-green-600 uppercase ml-2 tracking-widest">Nama Orang Tua</label>
                        <input type="text" placeholder="Nama Ayah / Ibu" className="w-full p-4 bg-gray-50 text-gray-900 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 border border-gray-100 font-bold" value={namaOrtu} onChange={(e) => setNamaOrtu(e.target.value)} required />
                    </div>

                    {/* Tanggal Lahir (Update Bidan) */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-green-600 uppercase ml-2 tracking-widest">Tanggal Lahir</label>
                        <input type="date" className="w-full p-4 bg-gray-50 text-gray-900 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 border border-gray-100 font-bold" value={tglLahir} onChange={(e) => setTglLahir(e.target.value)} required />
                    </div>

                    <button disabled={loading} className="w-full bg-green-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-green-100 uppercase tracking-widest text-xs transition-all active:scale-95 hover:bg-green-700 mt-4">
                        {loading ? 'Menyimpan...' : 'Simpan Data Balita'}
                    </button>
                </form>
            </div>

            <div className="max-w-md mx-auto mt-8">
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