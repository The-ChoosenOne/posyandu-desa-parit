'use client'
import { useEffect, useState, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

function EditContent() {
  const { id } = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isIbu = searchParams.get('type') === 'ibu'
  
  const [nama, setNama] = useState('')
  const [nik, setNik] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  const colorTheme = isIbu ? 'pink' : 'green'
  const tabelName = isIbu ? 'ibu_hamil' : 'balitas'

  useEffect(() => {
    async function getDetail() {
      const { data } = await supabase.from(tabelName).select('*').eq('id', id).single()
      if (data) {
        setNama(isIbu ? data.nama_ibu : data.nama_anak)
        setNik(data.nik)
      }
      setFetching(false)
    }
    getDetail()
  }, [id, isIbu])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const updateData = isIbu ? { nama_ibu: nama, nik: nik } : { nama_anak: nama, nik: nik }
    const { error } = await supabase.from(tabelName).update(updateData).eq('id', id)
    
    if (error) {
    alert(error.message)
  } else {
    alert('Berhasil diperbarui!')
    // Balik sesuai jenis data yang tadi diedit
    router.push(`/daftar-balita?tab=${isIbu ? 'ibu' : 'balita'}`)
  }
}

const handleHapusProfil = async () => {
  const jenis = isIbu ? 'Ibu Hamil' : 'Balita'
  const yakin = confirm(`Yakin mau hapus data ${jenis} ini? Semua riwayat periksanya juga bakal ikut terhapus.`)
  
  if (yakin) {
    setLoading(true)
    const { error } = await supabase
      .from(tabelName) // tabelName otomatis 'balitas' atau 'ibu_hamil'
      .delete()
      .eq('id', id)

    if (error) {
      alert("Gagal hapus: " + error.message)
    } else {
      alert(`Data ${jenis} berhasil dihapus!`)
      // Balik ke daftar sesuai tab terakhir
      router.push(`/daftar-balita?tab=${isIbu ? 'ibu' : 'balita'}`)
    }
    setLoading(false)
  }
}

  if (fetching) return <p className="pt-32 text-center italic">Memuat...</p>

  return (
    <main className="min-h-screen bg-gray-50 pt-32 p-6 pb-32">
      <div className={`max-w-md mx-auto bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-${colorTheme}-100`}>
        <div className={`bg-${colorTheme === 'pink' ? 'pink-600' : 'green-600'} p-8 text-white text-center`}>
          <h1 className="text-xl font-black uppercase tracking-widest">Edit Profil {isIbu ? 'Ibu' : 'Balita'}</h1>
        </div>
        <form onSubmit={handleUpdate} className="p-8 space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Nama Lengkap</label>
            <input type="text" className={`w-full p-4 bg-white text-gray-900 rounded-2xl outline-none focus:ring-2 focus:ring-${colorTheme}-500 font-bold border border-gray-100 uppercase`} value={nama} onChange={(e) => setNama(e.target.value)} required />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">NIK</label>
            <input type="number" className={`w-full p-4 bg-white text-gray-900 rounded-2xl outline-none focus:ring-2 focus:ring-${colorTheme}-500 font-bold border border-gray-100`} value={nik} onChange={(e) => setNik(e.target.value)} required />
          </div>
          <button disabled={loading} className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase text-xs shadow-xl active:scale-95 transition-all">
            {loading ? 'Menyimpan...' : 'Update Profil'}
          </button>
          <button 
  type="button"
  onClick={handleHapusProfil}
  className="w-full mt-4 bg-red-50 text-red-500 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-red-100 hover:bg-red-500 hover:text-white transition-all active:scale-95"
>
  🗑️ Hapus Permanen Data {isIbu ? 'Ibu' : 'Balita'}
</button>
        </form>
      </div>
      <div className="max-w-md mx-auto mt-6">
        <button 
    type="button" 
    // Logika Pintar: Kalau isIbu true, lari ke tab ibu. Kalau false, lari ke tab balita.
    onClick={() => router.push(`/daftar-balita?tab=${isIbu ? 'ibu' : 'balita'}`)} 
    className={`w-full py-4 bg-white text-gray-900 border-2 border-${isIbu ? 'pink' : 'green'}-100 text-${isIbu ? 'pink' : 'green'}-500 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm`}
  >
    ← Kembali ke Daftar {isIbu ? 'Ibu' : 'Balita'}
  </button>
      </div>
    </main>
  )
}

export default function EditData() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <EditContent />
    </Suspense>
  )
}