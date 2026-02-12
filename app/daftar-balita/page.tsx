'use client'
import { useEffect, useState, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import * as XLSX from 'xlsx'

function DaftarContent() {
  const searchParams = useSearchParams()
  const tabAwal = searchParams.get('tab') === 'ibu' ? 'ibu_hamil' : 'balita'
  
  const [balitas, setBalitas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [kategori, setKategori] = useState(tabAwal)
  const [search, setSearch] = useState('')
  // State untuk angka-angka di atas
  const [stats, setStats] = useState({ balita: 0, ibu: 0, periksa: 0 })

  const exportLaporan = async () => {
  const bulanIni = new Date().toISOString().slice(0, 7)

  const { data: laporan } = await supabase
    .from('pemeriksaan_ibu')
    .select(`
      tgl_periksa, 
      berat_badan, 
      lingkar_perut, 
      lingkar_lengan, 
      detak_jantung,
      ibu_hamil (nama_ibu, nik)
    `)
    .gte('tgl_periksa', `${bulanIni}-01`)

  if (!laporan || laporan.length === 0) {
    alert("Belum ada data pemeriksaan bulan ini!")
    return
  }

  const dataExcel = laporan.map((row: any) => ({
    'Tanggal': row.tgl_periksa,
    'Nama Ibu': row.ibu_hamil?.nama_ibu,
    'NIK': row.ibu_hamil?.nik,
    'BB (kg)': row.berat_badan,
    'L.Perut (cm)': row.lingkar_perut,
    'LiLA (cm)': row.lingkar_lengan,
    'DJJ (bpm)': row.detak_jantung,
  }))

  const worksheet = XLSX.utils.json_to_sheet(dataExcel)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan")
  XLSX.writeFile(workbook, `Laporan_Posyandu_${bulanIni}.xlsx`)
}

  // 1. EFFECT UNTUK AMBIL LIST NAMA (Jalan tiap ganti tab)
  useEffect(() => {
    async function ambilData() {
      setLoading(true)
      const tabel = kategori === 'balita' ? 'balitas' : 'ibu_hamil'
      const { data } = await supabase.from(tabel).select('*')
      if (data) setBalitas(data)
      setLoading(false)
    }
    ambilData()
  }, [kategori])

  // 2. EFFECT UNTUK AMBIL ANGKA STATISTIK (Jalan sekali pas buka web)
  useEffect(() => {
    async function ambilStats() {
      const { count: cBalita } = await supabase.from('balitas').select('*', { count: 'exact', head: true })
      const { count: cIbu } = await supabase.from('ibu_hamil').select('*', { count: 'exact', head: true })
      const { count: cPeriksa } = await supabase.from('pemeriksaan_ibu').select('*', { count: 'exact', head: true })

      setStats({ 
        balita: cBalita || 0, 
        ibu: cIbu || 0, 
        periksa: cPeriksa || 0 
      })
    }
    ambilStats()
  }, [])

  const filteredData = balitas.filter((item) => {
    const namaField = kategori === 'balita' ? item.nama_anak : item.nama_ibu
    return namaField?.toLowerCase().includes(search.toLowerCase())
  })

  if (loading) return <p className="pt-32 text-center font-bold text-gray-400 uppercase tracking-widest italic animate-pulse">Memuat Data Desa Parit...</p>

  return (
    <main className="min-h-screen bg-gray-50 pt-28 p-6 pb-32">
      <div className="max-w-2xl mx-auto">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-black text-gray-800 uppercase italic tracking-tighter">
            Daftar {kategori === 'balita' ? 'Balita' : 'Ibu Hamil'}
          </h1>
          <Link 
            href={kategori === 'balita' ? "/tambah-balita" : "/tambah-ibu?tab=ibu"} 
            className={`${kategori === 'balita' ? 'bg-green-600 shadow-green-100' : 'bg-pink-600 shadow-pink-100'} text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95`}
          >
            + Tambah
          </Link>
        </div>

        {/* --- DASHBOARD REKAP (ANGKA STATISTIK) --- */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-green-500 p-4 rounded-[2rem] text-white shadow-lg shadow-green-100 relative overflow-hidden">
            <span className="absolute -right-2 -bottom-2 text-4xl opacity-20">👶</span>
            <p className="text-[8px] font-black uppercase tracking-widest opacity-80">Balita</p>
            <h2 className="text-2xl font-black">{stats.balita}</h2>
          </div>

          <div className="bg-pink-500 p-4 rounded-[2rem] text-white shadow-lg shadow-pink-100 relative overflow-hidden">
            <span className="absolute -right-2 -bottom-2 text-4xl opacity-20">🤰</span>
            <p className="text-[8px] font-black uppercase tracking-widest opacity-80">Ibu Hamil</p>
            <h2 className="text-2xl font-black">{stats.ibu}</h2>
          </div>

          <div className="bg-blue-500 p-4 rounded-[2rem] text-white shadow-lg shadow-blue-100 relative overflow-hidden">
            <span className="absolute -right-2 -bottom-2 text-4xl opacity-20">📋</span>
            <p className="text-[8px] font-black uppercase tracking-widest opacity-80">Periksa</p>
            <h2 className="text-2xl font-black">{stats.periksa}</h2>
          </div>
        </div>
          <button 
            onClick={exportLaporan}
            className="w-full mb-8 bg-blue-50 text-blue-600 py-4 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] border-2 border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
          >
            📊 Download Rekap Excel Bulan Ini
          </button>

        {/* TOGGLE TAB */}
        <div className="flex bg-gray-200 p-1.5 rounded-3xl mb-8 shadow-inner border border-gray-300">
          <button onClick={() => setKategori('balita')} className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${kategori === 'balita' ? 'bg-white text-green-600 shadow-md' : 'text-gray-400'}`}>👶 Balita</button>
          <button onClick={() => setKategori('ibu_hamil')} className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${kategori === 'ibu_hamil' ? 'bg-white text-pink-600 shadow-md' : 'text-gray-400'}`}>🤰 Ibu Hamil</button>
        </div>

        {/* SEARCH */}
        <div className="mb-8 relative group">
          <span className="absolute left-5 top-5 text-gray-400 group-focus-within:text-green-500 transition-colors">🔍</span>
          <input 
            type="text" 
            placeholder={`Cari nama ${kategori === 'balita' ? 'balita' : 'ibu hamil'}...`} 
            className="w-full p-5 pl-14 bg-white border-2 border-gray-100 rounded-[2rem] outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-bold shadow-sm transition-all text-gray-700"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* LIST DATA */}
        <div className="space-y-5">
          {filteredData.map((item) => {
            const namaTampil = kategori === 'balita' ? item.nama_anak : item.nama_ibu
            const colorTheme = kategori === 'balita' ? 'green' : 'pink'
            const linkAksi = kategori === 'balita' ? `/daftar-balita/${item.id}` : `/tambah-pemeriksaan-ibu/${item.id}`

            return (
              <div key={item.id} className="bg-white p-1 rounded-[1rem] flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-xl transition-all hover:scale-[1.01]">
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 bg-${colorTheme === 'green' ? 'green' : 'pink'}-50 rounded-[1.5rem] flex items-center justify-center text-2xl shadow-inner`}>
                    {kategori === 'balita' ? '👶' : '🤰'}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-800 text-lg uppercase tracking-tight leading-none mb-1">{namaTampil}</h3>
                    <div className="flex gap-2 items-center">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">NIK: {item.nik}</p>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className={`text-[8px] font-black uppercase text-${colorTheme === 'green' ? 'green' : 'pink'}-500 italic`}>Desa Parit</span>
                    </div>
                  </div>
                </div>  
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Link href={`/edit-balita/${item.id}?type=${kategori === 'balita' ? 'balita' : 'ibu'}&tab=${kategori === 'balita' ? 'balita' : 'ibu'}`} className="flex-1 md:flex-none text-center bg-gray-50 text-gray-400 hover:text-gray-600 px-5 py-3 rounded-2xl font-black text-[10px] uppercase border border-gray-100 tracking-widest transition-all">Edit ✏️</Link>
                    <Link href={linkAksi} className={`flex-1 md:flex-none text-center ${kategori === 'balita' ? 'bg-green-600 shadow-green-100' : 'bg-pink-600 shadow-pink-100'} text-white px-7 py-3 rounded-2xl font-black text-[10px] uppercase shadow-lg tracking-widest hover:brightness-110 active:scale-95 transition-all`}>
                      {kategori === 'balita' ? 'Timbang ⚖️' : 'Periksa 🩺'}
                    </Link>
                </div>
              </div>
            )
          })}
          {filteredData.length === 0 && (
            <div className="bg-white p-20 rounded-[3rem] border-4 border-dashed border-gray-100 text-center">
               <p className="text-gray-300 font-black text-sm uppercase tracking-[0.3em] italic">Data Kosong.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default function DaftarBalita() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400 font-black uppercase tracking-widest italic animate-pulse">Inisialisasi Sistem...</div>}>
      <DaftarContent />
    </Suspense>
  )
}