'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function TambahIbuHamil() {
  const [nama, setNama] = useState('')
  const [nik, setNik] = useState('')
  const [namaSuami, setNamaSuami] = useState('')
  const [tglLahir, setTglLahir] = useState('')
  const [hpht, setHpht] = useState('')
  
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSimpan = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Pastikan nama kolom di database sesuai (nama_suami, tgl_lahir, hpht)
    const { error } = await supabase.from('ibu_hamil').insert([{ 
      nama_ibu: nama, 
      nik: nik, 
      nama_suami: namaSuami,
      tgl_lahir: tglLahir,
      hpht: hpht,
      tgl_daftar: new Date().toISOString() 
    }])

    if (error) alert("Gagal simpan: " + error.message)
    else {
      alert('Berhasil! Data Ibu ' + nama + ' sudah terdaftar.')
      router.push('/daftar-balita?tab=ibu')
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-32 p-6 pb-32">
      <div className="max-w-md mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-pink-100">
        <div className="bg-gradient-to-r from-pink-500 to-rose-400 p-8 text-white text-center">
          <span className="text-4xl mb-2 block">🤰</span>
          <h1 className="text-2xl font-black uppercase">Tambah Ibu Hamil</h1>
        </div>
        <form onSubmit={handleSimpan} className="p-8 space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Nama Lengkap Ibu</label>
            <input type="text" placeholder="Nama Lengkap" className="w-full p-4 bg-white text-gray-900 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 font-bold border border-gray-100 uppercase" value={nama} onChange={(e) => setNama(e.target.value)} required />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">NIK</label>
            <input type="number" placeholder="NIK (16 digit)" className="w-full p-4 bg-white text-gray-900 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 font-bold border border-gray-100" value={nik} onChange={(e) => setNik(e.target.value)} required />
          </div>

          {/* INPUT TAMBAHAN REKUES BIDAN */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-pink-500 uppercase tracking-widest ml-2">Nama Suami</label>
            <input type="text" placeholder="Nama Suami" className="w-full p-4 bg-white text-gray-900 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 font-bold border border-gray-100 uppercase" value={namaSuami} onChange={(e) => setNamaSuami(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-pink-500 uppercase tracking-widest ml-2">Tgl Lahir Ibu</label>
              <input type="date" className="w-full p-4 bg-white text-gray-900 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 font-bold border border-gray-100" value={tglLahir} onChange={(e) => setTglLahir(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-pink-500 uppercase tracking-widest ml-2">HPHT (Mens Terakhir)</label>
              <input type="date" className="w-full p-4 bg-white text-gray-900 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 font-bold border border-gray-100" value={hpht} onChange={(e) => setHpht(e.target.value)} required />
            </div>
          </div>

          <button disabled={loading} className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
            {loading ? 'Mendaftarkan...' : 'Daftarkan Ibu Hamil'}
          </button>
        </form>
      </div>
      <div className="max-w-md mx-auto mt-6">
        <button 
          type="button" 
          onClick={() => router.push('/daftar-balita?tab=ibu')} 
          className="w-full py-4 bg-white border-2 border-pink-100 text-pink-500 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:bg-pink-50"
        >
          ← Kembali ke Daftar Ibu
        </button>
      </div>
    </main>
  )
}