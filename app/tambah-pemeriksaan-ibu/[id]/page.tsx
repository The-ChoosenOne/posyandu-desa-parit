'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'

export default function PeriksaIbuHamil() {
  const { id } = useParams()
  const router = useRouter()
  const [ibu, setIbu] = useState<any>(null)
  const [riwayat, setRiwayat] = useState<any[]>([]) // State untuk simpan list riwayat
  
  const [bb, setBb] = useState('')
  const [lPerut, setLPerut] = useState('')
  const [lLengan, setLLengan] = useState('')
  const [jantung, setJantung] = useState('')
  const [loading, setLoading] = useState(false)

  // 1. Ambil data profil & riwayat pemeriksaan
  useEffect(() => {
    async function getData() {
      // Ambil profil ibu
      const { data: dataIbu } = await supabase.from('ibu_hamil').select('*').eq('id', id).single()
      if (dataIbu) setIbu(dataIbu)

      // Ambil riwayat pemeriksaan (urutkan dari yang terbaru)
      const { data: dataRiwayat } = await supabase
        .from('pemeriksaan_ibu')
        .select('*')
        .eq('id_ibu', id)
        .order('tgl_periksa', { ascending: false })
      
      if (dataRiwayat) setRiwayat(dataRiwayat)
    }
    getData()
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

    if (error) {
      alert("Error: " + error.message)
    } else {
      alert('Data pemeriksaan berhasil disimpan!')
      window.location.reload() // Refresh halaman biar riwayatnya langsung muncul di bawah
    }
    setLoading(false)
  }

  if (!ibu) return <p className="pt-32 text-center font-black text-pink-500 italic text-sm tracking-widest uppercase">Memuat Data Ibu...</p>

  return (
    <main className="min-h-screen bg-gray-50 pt-32 p-6 pb-32">
      <div className="max-w-md mx-auto space-y-8">
        
        {/* CARD FORM INPUT */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-rose-100">
          <div className="bg-gradient-to-r from-pink-500 to-rose-400 p-8 text-white text-center">
            <span className="text-4xl mb-2 block">🤰</span>
            <h1 className="text-2xl font-black uppercase tracking-tight">{ibu.nama_ibu}</h1>
            <p className="text-pink-100 text-[10px] font-bold uppercase tracking-widest mt-1 italic font-mono">Input Pemeriksaan Baru</p>
          </div>

          <form onSubmit={handleSimpan} className="p-8 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest text-pink-500">BB (kg)</label>
                <input type="number" step="0.1" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 font-bold border border-gray-100" value={bb} onChange={(e) => setBb(e.target.value)} placeholder="0.0" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest text-pink-500">L. Perut (cm)</label>
                <input type="number" step="0.1" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 font-bold border border-gray-100" value={lPerut} onChange={(e) => setLPerut(e.target.value)} placeholder="0.0" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest text-pink-500">LiLA (cm)</label>
                <input type="number" step="0.1" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 font-bold border border-gray-100" value={lLengan} onChange={(e) => setLLengan(e.target.value)} placeholder="0.0" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest text-pink-500">DJJ (bpm)</label>
                <input type="number" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 font-bold border border-gray-100" value={jantung} onChange={(e) => setJantung(e.target.value)} placeholder="0" required />
              </div>
            </div>

            <button disabled={loading} className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black shadow-xl hover:bg-rose-600 active:scale-95 transition-all mt-4 uppercase tracking-widest text-xs">
              {loading ? 'Menyimpan...' : 'Simpan Pemeriksaan'}
            </button>
          </form>
        </div>

        {/* SECTION RIWAYAT (HISTORY) */}
        <div className="space-y-4">
          <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] ml-4 italic">Riwayat Pemeriksaan</h2>
          
          {riwayat.length === 0 ? (
            <div className="bg-white p-10 rounded-[2.5rem] border-2 border-dashed border-gray-100 text-center">
              <p className="text-gray-300 font-bold text-xs uppercase italic tracking-widest">Belum ada data history, Ki.</p>
            </div>
          ) : (
            riwayat.map((item, index) => (
              <div key={item.id || index} className="bg-white p-6 rounded-[2rem] shadow-md border border-gray-100 flex justify-between items-center relative overflow-hidden">
                {/* Aksen nomor urut kecil di pojok */}
                <span className="absolute -left-2 -top-2 text-4xl font-black text-pink-50 opacity-50 italic">#{riwayat.length - index}</span>
                
                <div className="z-10">
                  <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest mb-1">{item.tgl_periksa}</p>
                  <div className="flex gap-4">
                    <div>
                      <span className="block text-[8px] font-bold text-gray-400 uppercase">BB</span>
                      <span className="font-black text-gray-700">{item.berat_badan}kg</span>
                    </div>
                    <div>
                      <span className="block text-[8px] font-bold text-gray-400 uppercase">Perut</span>
                      <span className="font-black text-gray-700">{item.lingkar_perut}cm</span>
                    </div>
                    <div>
                        <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-tighter">DJJ (bpm)</span>
                        <span className={`font-black ${item.detak_jantung < 120 || item.detak_jantung > 160 ? 'text-red-600 animate-pulse' : 'text-gray-700'}`}>
                            {item.detak_jantung} {item.detak_jantung < 120 || item.detak_jantung > 160 ? '⚠️' : ''}
                        </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="bg-rose-50 px-3 py-1 rounded-full">
                    <span className="text-[10px] font-black text-rose-500 italic uppercase">LiLA: {item.lingkar_lengan}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <button 
          type="button" 
          onClick={() => router.push('/daftar-balita?tab=ibu')} 
          className="w-full py-4 bg-white border-2 border-pink-100 text-pink-500 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:bg-pink-50 mt-10"
        >
          ← Kembali ke Daftar
        </button>
      </div>
    </main>
  )
}