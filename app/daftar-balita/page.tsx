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
  const [stats, setStats] = useState({ balita: 0, ibu: 0, periksa: 0 })

  // --- FUNGSI EXCEL UPDATE (2 SHEET + 10 DATA) ---
  const exportLaporan = async () => {
    const bulanIni = new Date().toISOString().slice(0, 7)
    
    // 1. Ambil Data Ibu (10 Field Lengkap)
    const { data: dataIbu } = await supabase
      .from('pemeriksaan_ibu')
      .select(`*, ibu_hamil(nama_ibu, nik)`)
      .gte('tgl_periksa', `${bulanIni}-01`)

    // 2. Ambil Data Balita
    const { data: dataBalita } = await supabase
      .from('timbangans')
      .select(`*, balitas(nama_anak, nik)`)
      .gte('tgl_timbang', `${bulanIni}-01`)

    if ((!dataIbu || dataIbu.length === 0) && (!dataBalita || dataBalita.length === 0)) {
      alert("Belum ada data pemeriksaan/timbangan bulan ini!");
      return
    }

    // Format Data Sheet Ibu
    const sheetIbu = dataIbu?.map((row: any) => ({
      'Tanggal': row.tgl_periksa,
      'Nama Ibu': row.ibu_hamil?.nama_ibu,
      'NIK': row.ibu_hamil?.nik,
      'BB (kg)': row.berat_badan,
      'TB (cm)': row.tinggi_badan,
      'Tensi': row.tensi_darah,
      'LiLA (cm)': row.lila,
      'T.Fundus (cm)': row.tinggi_fundus,
      'Letak Janin': row.letak_janin,
      'DJJ (bpm)': row.djj,
      'Tab FE': row.tablet_fe,
      'Imunisasi TT': row.imunisasi_tt,
      'Skrining': row.skrining
    })) || []

    // Format Data Sheet Balita
    const sheetBalita = dataBalita?.map((row: any) => ({
      'Tanggal': row.tgl_timbang,
      'Nama Anak': row.balitas?.nama_anak,
      'NIK': row.balitas?.nik,
      'BB (kg)': row.berat_badan,
      'TB (cm)': row.tinggi_badan,
      'LK (cm)': row.lingkar_kepala
    })) || []

    const workbook = XLSX.utils.book_new()
    
    // Tambah Sheet Ibu
    const wsIbu = XLSX.utils.json_to_sheet(sheetIbu)
    XLSX.utils.book_append_sheet(workbook, wsIbu, "Laporan Ibu Hamil")
    
    // Tambah Sheet Balita
    const wsBalita = XLSX.utils.json_to_sheet(sheetBalita)
    XLSX.utils.book_append_sheet(workbook, wsBalita, "Laporan Balita")

    XLSX.writeFile(workbook, `REKAP_POSYANDU_PARIT_${bulanIni}.xlsx`)
  }

  // 1. EFFECT LIST NAMA
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

  // 2. EFFECT STATISTIK GABUNGAN
  useEffect(() => {
    async function ambilStats() {
      const { count: cBalita } = await supabase.from('balitas').select('*', { count: 'exact', head: true })
      const { count: cIbu } = await supabase.from('ibu_hamil').select('*', { count: 'exact', head: true })
      
      // Ambil total pelayanan (Pemeriksaan Ibu + Timbangan Balita)
      const { count: rIbu } = await supabase.from('pemeriksaan_ibu').select('*', { count: 'exact', head: true })
      const { count: rBalita } = await supabase.from('timbangans').select('*', { count: 'exact', head: true })

      setStats({ 
        balita: cBalita || 0, 
        ibu: cIbu || 0, 
        periksa: (rIbu || 0) + (rBalita || 0) 
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

        {/* --- DASHBOARD REKAP --- */}
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
            <p className="text-[8px] font-black uppercase tracking-widest opacity-80">Pelayanan</p>
            <h2 className="text-2xl font-black">{stats.periksa}</h2>
          </div>
        </div>

        <button 
          onClick={exportLaporan}
          className="w-full mb-8 bg-blue-50 text-blue-600 py-4 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] border-2 border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
        >
          📊 Download Rekap Excel (2 Sheet)
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

        {/* LIST DATA TERUPDATE */}
<div className="space-y-5">
  {filteredData.map((item) => {
    const namaTampil = kategori === 'balita' ? item.nama_anak : item.nama_ibu
    const colorTheme = kategori === 'balita' ? 'green' : 'pink'
    const linkAksi = kategori === 'balita' ? `/daftar-balita/${item.id}` : `/tambah-pemeriksaan-ibu/${item.id}`

    return (
      <div key={item.id} className="bg-white p-3 rounded-[1rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:scale-[1.01] group">
        {/* bg-white p-1 rounded-[1rem] flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-xl transition-all hover:scale-[1.01] */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          
          {/* SISI KIRI: PROFIL */}
          <div className="flex items-center gap-5 w-full">
            <div className={`w-16 h-16 shrink-0 bg-${colorTheme}-50 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-inner group-hover:rotate-6 transition-transform`}>
              {kategori === 'balita' ? '👶' : '🤰'}
            </div>
            <div className="overflow-hidden">
              <h3 className="font-black text-gray-800 text-lg uppercase leading-tight truncate mb-1">
                {namaTampil}
              </h3>
              <div className="flex flex-col gap-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  NIK: {item.nik}
                </p>
                {/* Info Tambahan Bidan */}
                <p className="text-[9px] font-black text-blue-500 uppercase italic bg-blue-50 px-2 py-0.5 rounded-lg inline-block w-fit">
                   {kategori === 'balita' ? `Ortu: ${item.nama_ortu || '-'}` : `Suami: ${item.nama_suami || '-'}`}
                </p>
              </div>
            </div>
          </div>  
          
          {/* SISI KANAN: AKSI */}
          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
            <Link 
              href={`/edit-balita/${item.id}?type=${kategori === 'balita' ? 'balita' : 'ibu'}`} 
              className="flex-1 sm:flex-none text-center bg-gray-50 text-gray-400 hover:bg-gray-200 px-5 py-4 rounded-2xl font-black text-[10px] uppercase border border-gray-100 tracking-widest transition-all"
            >
              Edit ✏️
            </Link>
            <Link 
              href={linkAksi} 
              className={`flex-1 sm:flex-none text-center ${kategori === 'balita' ? 'bg-green-600 shadow-green-100' : 'bg-pink-600 shadow-pink-100'} text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase shadow-lg tracking-widest hover:brightness-110 active:scale-95 transition-all`}
            >
              {kategori === 'balita' ? 'Timbang ⚖️' : 'Periksa 🩺'}
            </Link>
          </div>

        </div>
      </div>
    )
  })}
</div>
      </div>
    </main>
  )
}

export default function DaftarBalita() {
  return (
    <Suspense fallback={<div className="pt-32 text-center font-black">MEMUAT...</div>}>
      <DaftarContent />
    </Suspense>
  )
}