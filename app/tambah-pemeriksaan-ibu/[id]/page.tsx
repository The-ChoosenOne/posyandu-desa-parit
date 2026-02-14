'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'

export default function PeriksaIbuHamil() {
  const { id } = useParams()
  const router = useRouter()
  
  // States Data Utama
  const [ibu, setIbu] = useState<any>(null)
  const [riwayat, setRiwayat] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  // --- 10 STATE UNTUK BIDAN ---
  const [bb, setBb] = useState('')
  const [tb, setTb] = useState('')
  const [tensi, setTensi] = useState('')
  const [lila, setLila] = useState('')
  const [tfu, setTfu] = useState('')
  const [palpasi, setPalpasi] = useState('')
  const [djj, setDjj] = useState('')
  const [fe, setFe] = useState('')
  const [tt, setTt] = useState('')
  const [skrining, setSkrining] = useState('')

  const getData = async () => {
    setFetching(true)
    const { data: dataIbu } = await supabase.from('ibu_hamil').select('*').eq('id', id).single()
    if (dataIbu) setIbu(dataIbu)

    const { data: dataRiwayat } = await supabase
      .from('pemeriksaan_ibu')
      .select('*')
      .eq('id_ibu', id)
      .order('tgl_periksa', { ascending: false })
    
    if (dataRiwayat) setRiwayat(dataRiwayat)
    setFetching(false)
  }

  useEffect(() => { getData() }, [id])

  const handleSimpan = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('pemeriksaan_ibu').insert([
      {
        id_ibu: id,
        tgl_periksa: new Date().toISOString().split('T')[0],
        berat_badan: parseFloat(bb),
        tinggi_badan: parseFloat(tb),
        tensi_darah: tensi,
        lila: parseFloat(lila),
        tinggi_fundus: parseFloat(tfu),
        letak_janin: palpasi,
        djj: parseInt(djj),
        tablet_fe: fe,
        imunisasi_tt: tt,
        skrining: skrining
      }
    ])

    if (error) {
      alert("Gagal simpan: " + error.message)
    } else {
      alert('Data Pemeriksaan Berhasil Dicatat!')
      // Reset Form
      setBb(''); setTb(''); setTensi(''); setLila(''); setTfu('');
      setPalpasi(''); setDjj(''); setFe(''); setTt(''); setSkrining('');
      getData()
    }
    setLoading(false)
  }

  if (fetching) return <p className="pt-32 text-center font-black text-pink-500 animate-pulse">MEMUAT DATA...</p>

  return (
    <main className="min-h-screen bg-gray-50 pt-24 p-6 pb-32">
      <div className="max-w-md mx-auto space-y-8">
        
        {/* HEADER PROFIL */}
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-pink-100">
          <div className="bg-pink-600 p-8 text-white text-center">
            <h1 className="text-2xl font-black uppercase">{ibu?.nama_ibu}</h1>
            <p className="text-pink-100 text-[10px] font-bold uppercase tracking-widest mt-1">Input 10 Data Pemeriksaan KIA</p>
          </div>

          <form onSubmit={handleSimpan} className="p-8 space-y-8">
            
            {/* SEKSI 1: FISIK IBU */}
            <div className="space-y-4">
              <h2 className="text-[10px] font-black text-pink-500 bg-pink-50 p-2 px-3 rounded-full inline-block uppercase tracking-widest">1. Fisik Ibu</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase ml-2">BB (kg)</label>
                  <input type="number" step="0.1" className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold" value={bb} onChange={(e) => setBb(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase ml-2">TB (cm)</label>
                  <input type="number" step="0.1" className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold" value={tb} onChange={(e) => setTb(e.target.value)} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Tensi (mmHg)</label>
                  <input type="text" placeholder="120/80" className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold" value={tensi} onChange={(e) => setTensi(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase ml-2">LiLA (cm)</label>
                  <input type="number" step="0.1" className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold" value={lila} onChange={(e) => setLila(e.target.value)} required />
                </div>
              </div>
            </div>

            {/* SEKSI 2: KONDISI JANIN */}
            <div className="space-y-4 pt-4 border-t border-dashed">
              <h2 className="text-[10px] font-black text-pink-500 bg-pink-50 p-2 px-3 rounded-full inline-block uppercase tracking-widest">2. Kondisi Janin</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase ml-2">T. Fundus (cm)</label>
                  <input type="number" step="0.1" className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold" value={tfu} onChange={(e) => setTfu(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase ml-2">DJJ (bpm)</label>
                  <input type="number" className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold" value={djj} onChange={(e) => setDjj(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Palpasi / Letak Janin</label>
                <input type="text" placeholder="Kepala / Sungsang" className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold" value={palpasi} onChange={(e) => setPalpasi(e.target.value)} required />
              </div>
            </div>

            {/* SEKSI 3: TINDAKAN */}
            <div className="space-y-4 pt-4 border-t border-dashed">
              <h2 className="text-[10px] font-black text-pink-500 bg-pink-50 p-2 px-3 rounded-full inline-block uppercase tracking-widest">3. Tindakan & Skrining</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Tablet Fe</label>
                  <input type="text" placeholder="Ya / Tidak" className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold" value={fe} onChange={(e) => setFe(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Imunisasi TT</label>
                  <input type="text" placeholder="TT1 / TT2" className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold" value={tt} onChange={(e) => setTt(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Hasil Skrining / Keterangan</label>
                <textarea rows={2} className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold" value={skrining} onChange={(e) => setSkrining(e.target.value)} />
              </div>
            </div>

            <button disabled={loading} className="w-full bg-gray-900 text-white py-5 rounded-3xl font-black uppercase text-xs shadow-xl active:scale-95 transition-all">
              {loading ? 'Menyimpan...' : 'Simpan Pemeriksaan'}
            </button>
          </form>
        </div>

        {/* SEKSI RIWAYAT PEMERIKSAAN */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-tighter">Riwayat Pemeriksaan</h3>
            <span className="bg-pink-100 text-pink-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
              {riwayat.length} Total
            </span>
          </div>

          {riwayat.length === 0 ? (
            <div className="bg-white p-8 rounded-[2rem] text-center border-2 border-dashed border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Belum ada data pemeriksaan</p>
            </div>
          ) : (
            <div className="space-y-4">
              {riwayat.map((item, index) => (
                <div key={index} className="bg-white rounded-[2rem] shadow-md border border-gray-100 overflow-hidden">
                  {/* Header Riwayat (Tanggal & Kunjungan ke-X) */}
                  <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex justify-between items-center">
                    <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">
                      📅 {new Date(item.tgl_periksa).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <span className="text-[9px] font-bold text-gray-400 uppercase">Kunjungan #{riwayat.length - index}</span>
                  </div>

                  {/* Body Riwayat (10 Data) */}
                  <div className="p-6 grid grid-cols-2 gap-y-4 gap-x-6">
                    {/* Fisik Ibu */}
                    <div className="col-span-2 flex items-center gap-2 mb-[-8px]">
                      <div className="h-[2px] w-4 bg-pink-500 rounded-full"></div>
                      <p className="text-[9px] font-black text-pink-500 uppercase tracking-tighter">Status Ibu</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-bold text-gray-400 uppercase">BB / TB</p>
                      <p className="text-xs font-black text-gray-800">{item.berat_badan}kg / {item.tinggi_badan}cm</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-bold text-gray-400 uppercase">Tensi / LiLA</p>
                      <p className="text-xs font-black text-gray-800">{item.tensi_darah} / {item.lila}cm</p>
                    </div>

                    {/* Janin */}
                    <div className="col-span-2 flex items-center gap-2 mb-[-8px] mt-2">
                      <div className="h-[2px] w-4 bg-blue-500 rounded-full"></div>
                      <p className="text-[9px] font-black text-blue-500 uppercase tracking-tighter">Status Janin</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-bold text-gray-400 uppercase">T. Fundus / DJJ</p>
                      <p className="text-xs font-black text-gray-800">{item.tinggi_fundus}cm / {item.djj}bpm</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-bold text-gray-400 uppercase">Letak Janin</p>
                      <p className="text-xs font-black text-gray-800 uppercase">{item.letak_janin}</p>
                    </div>

                    {/* Tindakan */}
                    <div className="col-span-2 flex items-center gap-2 mb-[-8px] mt-2">
                      <div className="h-[2px] w-4 bg-green-500 rounded-full"></div>
                      <p className="text-[9px] font-black text-green-500 uppercase tracking-tighter">Tindakan & Skrining</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-bold text-gray-400 uppercase">Tablet Fe / TT</p>
                      <p className="text-xs font-black text-gray-800 uppercase">{item.tablet_fe} / {item.imunisasi_tt}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[8px] font-bold text-gray-400 uppercase">Hasil Skrining</p>
                      <p className="text-[10px] font-bold text-gray-600 italic bg-gray-50 p-2 rounded-xl mt-1 border border-gray-100">
                        "{item.skrining || 'Tidak ada keterangan'}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


        <button onClick={() => router.back()} className="w-full py-4 bg-white border-2 border-pink-100 text-pink-500 rounded-2xl font-black text-[10px] uppercase tracking-widest">← Kembali</button>
      </div>
    </main>
  )
}