'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'

export default function PeriksaIbuHamil() {
  const { id } = useParams()
  const router = useRouter()
  const [ibu, setIbu] = useState<any>(null)
  
  // State Form sesuai request kamu
  const [bb, setBb] = useState('')
  const [lPerut, setLPerut] = useState('')
  const [lLengan, setLLengan] = useState('')
  const [jantung, setJantung] = useState('')
  const [loading, setLoading] = useState(false)

  // Ambil data profil ibu
  useEffect(() => {
    async function getProfil() {
      const { data } = await supabase.from('ibu_hamil').select('*').eq('id', id).single()
      if (data) setIbu(data)
    }
    getProfil()
  }, [id])

  const handleSimpan = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('pemeriksaan_ibu').insert([
      {
        id_ibu: id,
        berat_badan: parseFloat(bb),
        lingkar_perut: parseFloat(lPerut),
        lingkar_lengan: parseFloat(lLengan),
        detak_jantung: parseInt(jantung),
        tgl_periksa: new Date().toISOString().split('T')[0]
      }
    ])

    if (error) alert(error.message)
    else {
      alert('Data pemeriksaan ' + ibu.nama_ibu + ' berhasil disimpan!')
      router.back()
    }
    setLoading(false)
  }

  if (!ibu) return <p className="pt-32 text-center font-black text-pink-500 italic">Memuat Data Ibu...</p>

  return (
    <main className="min-h-screen bg-gray-50 pt-32 p-6 pb-32">
      <div className="max-w-md mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-rose-100">
        
        <div className="bg-gradient-to-r from-pink-500 to-rose-400 p-8 text-white text-center">
          <span className="text-4xl mb-2 block">🤰</span>
          <h1 className="text-2xl font-black uppercase tracking-tight">{ibu.nama_ibu}</h1>
          <p className="text-pink-100 text-[10px] font-bold uppercase tracking-widest mt-1">Pemeriksaan Rutin Ibu Hamil</p>
        </div>

        <form onSubmit={handleSimpan} className="p-8 space-y-5">
          {/* Berat Badan */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Berat Badan (kg)</label>
            <input type="number" step="0.1" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 font-bold border border-gray-100" value={bb} onChange={(e) => setBb(e.target.value)} required />
          </div>

          {/* Lingkar Perut */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Lingkar Perut (cm)</label>
            <input type="number" step="0.1" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 font-bold border border-gray-100" value={lPerut} onChange={(e) => setLPerut(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Lingkar Lengan */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">LiLA (cm)</label>
              <input type="number" step="0.1" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 font-bold border border-gray-100" value={lLengan} onChange={(e) => setLLengan(e.target.value)} required />
            </div>
            {/* Detak Jantung */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">DJJ (bpm)</label>
              <input type="number" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 font-bold border border-gray-100" value={jantung} onChange={(e) => setJantung(e.target.value)} required />
            </div>
          </div>

          <button disabled={loading} className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black shadow-xl hover:bg-rose-600 active:scale-95 transition-all mt-4 uppercase tracking-widest text-xs">
            {loading ? 'Menyimpan...' : 'Simpan Data Ibu'}
          </button>
        </form>
      </div>
    </main>
  )
}