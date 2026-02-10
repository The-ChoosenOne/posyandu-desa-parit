'use client'
import "./globals.css";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Kondisi: Navbar Kader (yang di bawah) HANYA muncul di halaman selain Home & Login
  const showKaderNavbar = pathname !== "/" && pathname !== "/login";

  return (
    <html lang="en">
      <body className="antialiased bg-white text-gray-900">
        {children}
        
        {/* Navbar Kader hanya muncul jika bukan di landing page / login */}
        {showKaderNavbar && <Navbar />}
      </body>
    </html>
  );
}