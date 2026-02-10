'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'

export default function DetailTimbangBalita() {
  const { id } = useParams()
  const router = useRouter()
  
  const [balita, setBalita] = useState<any>(null)
  const [berat, setBerat] = useState('')
  const [tinggi, setTinggi] = useState('')
  const [lingkar, setLingkar] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [riwayat, setRiwayat] = useState<any[]>([])

  useEffect(() => {
    async function getDetail() {
      // Ambil data profil balita berdasarkan ID dari URL
      const { data, error } = await supabase
        .from('balitas')
        .select('*')
        .eq('id', id)
        .single()
      
      if (data) {
        setBalita(data)
      } else {
        console.error(error)
      }
      setFetching(false)
    }
    getDetail()
  }, [id])

  useEffect(() => {
    async function getRiwayat() {
        const { data } = await supabase
            .from('pengukurans')
            .select('*')
            .eq('id_balita', id)
            .order('tgl_timbang', { ascending: false }) // Yang terbaru di atas
        
        if (data) setRiwayat(data)
    }
    getRiwayat()
}, [id, loading])

  const handleSimpan = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Kita kirim data sesuai nama kolom di tabel 'pengukurans' kamu
    const { error } = await supabase.from('pengukurans').insert([
      {
        id_balita: id,
        berat_badan: parseFloat(berat),
        tinggi_badan: parseFloat(tinggi),
        lingkar_kepala: parseFloat(lingkar) || 0,
        tgl_timbang: new Date().toISOString().split('T')[0] // Isi otomatis tanggal hari ini (YYYY-MM-DD)
      }
    ])

    if (error) {
      alert("Gagal simpan: " + error.message)
    } else {
      alert('Berhasil! Data timbangan ' + balita.nama_anak + ' sudah dicatat.')
      setBerat('')
      setTinggi('')
      setLingkar('')
      router.push('/daftar-balita') // Balik ke daftar setelah simpan
    }
    setLoading(false)
  }

  if (fetching) return <div className="min-h-screen flex items-center justify-center font-bold text-green-600 italic">Memuat Data Balita...</div>
  if (!balita) return <div className="p-10 text-center">Data balita tidak ditemukan.</div>

  return (
    <main className="min-h-screen bg-gray-50 pt-32 p-6 pb-32">
      <div className="max-w-md mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Header Identitas */}
        <div className="bg-green-600 p-6 text-white text-center">
          <h1 className="text-2xl font-black uppercase tracking-tight">{balita.nama_anak}</h1>
          <p className="text-green-100 text-sm mt-1 font-mono">NIK: {balita.nik}</p>
        </div>

        {/* Form Input Pengukuran */}
        <form onSubmit={handleSimpan} className="p-8 space-y-5">
          
          {/* Berat Badan */}
          <div className="space-y-1">
            <label className="text-xs font-black text-gray-400 uppercase ml-2 tracking-widest">Berat Badan (kg)</label>
            <div className="bg-gray-50 p-4 rounded-2xl flex items-center border border-gray-100 focus-within:ring-2 focus-within:ring-green-500 transition-all">
              <span className="text-2xl mr-3">⚖️</span>
              <input 
                type="number" step="0.01" placeholder="0.0" 
                className="bg-transparent text-xl font-bold w-full outline-none text-gray-700"
                value={berat} onChange={(e) => setBerat(e.target.value)} required 
              />
            </div>
          </div>

          {/* Tinggi Badan */}
          <div className="space-y-1">
            <label className="text-xs font-black text-gray-400 uppercase ml-2 tracking-widest">Tinggi Badan (cm)</label>
            <div className="bg-gray-50 p-4 rounded-2xl flex items-center border border-gray-100 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <span className="text-2xl mr-3">📏</span>
              <input 
                type="number" step="0.1" placeholder="0.0" 
                className="bg-transparent text-xl font-bold w-full outline-none text-gray-700"
                value={tinggi} onChange={(e) => setTinggi(e.target.value)} required 
              />
            </div>
          </div>

          {/* Lingkar Kepala */}
          <div className="space-y-1">
            <label className="text-xs font-black text-gray-400 uppercase ml-2 tracking-widest">Lingkar Kepala (cm)</label>
            <div className="bg-gray-50 p-4 rounded-2xl flex items-center border border-gray-100 focus-within:ring-2 focus-within:ring-orange-500 transition-all">
              <span className="text-2xl mr-3">🧠</span>
              <input 
                type="number" step="0.1" placeholder="0.0" 
                className="bg-transparent text-xl font-bold w-full outline-none text-gray-700"
                value={lingkar} onChange={(e) => setLingkar(e.target.value)} required 
              />
            </div>
          </div>

          {/* Tombol Simpan */}
          <button 
            disabled={loading}
            className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black shadow-xl hover:bg-black active:scale-95 transition-all mt-4 uppercase tracking-widest"
          >
            {loading ? 'Sedang Menyimpan...' : 'Simpan Pengukuran'}
          </button>
        </form>
      </div>

      <button 
        onClick={() => router.back()}
        className="block mx-auto mt-6 text-gray-400 font-bold text-sm hover:text-gray-600"
      >
        ← Kembali ke Daftar
      </button>
        <div className="max-w-md mx-auto mt-10 space-y-4">
        <h2 className="text-lg font-black text-gray-800 ml-2">Riwayat Pertumbuhan</h2>
        {riwayat.length === 0 ? (
            <p className="text-center text-gray-400 py-10 bg-white rounded-3xl border-2 border-dashed border-gray-100">Belum ada catatan timbangan.</p>
        ) : (
            riwayat.map((item, index) => (
                <div key={index} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{new Date(item.tgl_timbang).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>
                        <div className="flex gap-4 mt-1">
                            <span className="text-sm font-black text-green-600">⚖️ {item.berat_badan}kg</span>
                            <span className="text-sm font-black text-blue-600">📏 {item.tinggi_badan}cm</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-300 uppercase">Lingkar</p>
                        <p className="font-bold text-gray-600">{item.lingkar_kepala}cm</p>
                    </div>
                </div>
            ))
        )}
    </div>
    </main>
  )
}