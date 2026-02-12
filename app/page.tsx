'use client'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* NAVBAR KHUSUS LANDING PAGE */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <h1 className="text-xl font-black text-green-600 tracking-tighter uppercase">Posyandu Parit</h1>
          </div>
          <Link 
            href="/login" 
            className="bg-green-600 text-white px-6 py-2.5 rounded-2xl font-black text-xs shadow-lg shadow-green-100 hover:scale-105 transition-all uppercase"
          >
            Login Kader
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="py-20 px-6 text-center bg-gradient-to-b from-green-50/50 to-white">
        <div className="inline-block bg-white border border-green-100 text-green-600 px-4 py-1.5 rounded-full text-[10px] font-black mb-6 uppercase tracking-widest shadow-sm">
          📍 Desa Parit, Indralaya Utara
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1]">
          Layanan Digital <br/>
          <span className="text-green-600">Kesehatan Ibu & Anak</span>
        </h1>
        
      </section>

      {/* INFO JADWAL & KEGIATAN */}
      <section className="py-12 px-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-2xl mb-5">📅</div>
          <h3 className="font-black text-gray-800 text-xl mb-3">Jadwal Kegiatan</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Setiap bulan pada tanggal 10 <br/> Pukul 09.00 - 12.00 WIB <br/> di Balai Desa Parit.
          </p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl mb-5">📝</div>
          <h3 className="font-black text-gray-800 text-xl mb-3">Persyaratan</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Wajib membawa **Buku KIA (Buku Pink)** dan Kartu Keluarga untuk pendaftaran.
          </p>
        </div>
      </section>

      <footer className="py-20 text-center">
        <p className="text-gray-300 text-[10px] font-black uppercase tracking-[0.3em]">
          &copy; 2026 KKN UIN Raden Fatah
        </p>
      </footer>
    </main>
  );
}