'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()

  const menu = [
    { name: 'Daftar', path: '/daftar-balita', icon: '📋' },
    { name: 'Tambah', path: '/tambah-balita', icon: '➕' },
  ]

  const handleLogout = async () => {
    const confirm = window.confirm("Yakin mau keluar, Ki?")
    if (confirm) {
      await supabase.auth.signOut()
      router.push('/')
      router.refresh()
    }
  }

  return (
    <>
      {/* 1. Desktop Navbar (Atas - Muncul di Laptop) */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 px-10 py-4 justify-between items-center">
        <h1 className="text-xl font-black text-green-600">POSYANDU <span className="text-gray-800">PARIT</span></h1>
        <div className="flex items-center gap-8">
          {menu.map((item) => (
            <Link key={item.path} href={item.path} 
              className={`text-sm font-bold transition-all ${pathname === item.path ? 'text-green-600' : 'text-gray-400 hover:text-green-500'}`}>
              {item.name}
            </Link>
          ))}
          {/* Tombol Logout Desktop */}
          <button onClick={handleLogout} className="text-sm font-bold text-red-500 hover:text-red-700 transition-all uppercase tracking-widest ml-4">
            Keluar 🚪
          </button>
        </div>
      </nav>

      {/* 2. Mobile Navbar (Bawah - Muncul di HP) */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-gray-900/90 backdrop-blur-lg rounded-3xl z-50 px-6 py-4 shadow-2xl border border-white/10">
        <div className="flex justify-around items-center">
          {menu.map((item) => (
            <Link key={item.path} href={item.path} 
              className={`flex flex-col items-center gap-1 transition-all ${pathname === item.path ? 'text-green-400 scale-110' : 'text-gray-400'}`}>
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">{item.name}</span>
            </Link>
          ))}
          {/* Tombol Logout Mobile */}
          <button onClick={handleLogout} className="flex flex-col items-center gap-1 text-gray-400 active:text-red-400">
            <span className="text-xl">🚪</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Keluar</span>
          </button>
        </div>
      </nav>
    </>
  )
}