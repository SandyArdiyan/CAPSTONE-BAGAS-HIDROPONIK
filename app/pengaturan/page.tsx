"use client";
import Link from 'next/link';

export default function Pengaturan() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 pb-20 md:pb-0">
      
      {/* HEADER KHUSUS HP DENGAN LOGO BESAR */}
      <div className="md:hidden bg-green-900 text-white p-4 shadow-md sticky top-0 z-20 flex justify-center items-center gap-4">
        <img src="/logo.jpg" alt="Logo Kebun Bagas" className="w-16 h-auto rounded-xl shadow-sm border border-white/30" />
        <h1 className="text-xl font-black tracking-wider uppercase">Kebun Bagas</h1>
      </div>

      {/* SIDEBAR KHUSUS KOMPUTER/LAPTOP DENGAN LOGO BESAR */}
      <aside className="hidden md:block w-72 bg-green-900 text-white p-6 shadow-xl shrink-0">
        <div className="flex flex-col items-center mb-8 text-center mt-2">
          <img src="/logo.jpg" alt="Logo Kebun Bagas" className="w-36 h-auto rounded-2xl shadow-lg border-2 border-white/30 mb-4" />
          <h1 className="text-xl font-black tracking-wider uppercase leading-snug">Kebun Bagas<br/>Hidroponik</h1>
        </div>
        <nav>
          <ul className="space-y-3 font-medium">
            <Link href="/">
              <li className="p-3 hover:bg-green-800 rounded-lg cursor-pointer transition mb-3">
                Dasbor Utama
              </li>
            </Link>
            <Link href="/riwayat">
              <li className="p-3 hover:bg-green-800 rounded-lg cursor-pointer transition mb-3">
                Analisis Grafik
              </li>
            </Link>
            <Link href="/pengaturan">
              <li className="bg-green-700/50 p-3 rounded-lg border border-green-600/50 cursor-pointer">
                Pengaturan Alat
              </li>
            </Link>
          </ul>
        </nav>
      </aside>

      {/* KONTEN UTAMA */}
      <main className="flex-1 p-6 md:p-10">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Pengaturan Kalibrasi & Jadwal</h2>
          <p className="text-gray-500 mt-1">Konfigurasi batas nutrisi, interval 3 harian, dan kontrol manual</p>
        </header>

        {/* Kartu Pengaturan Otomatis */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mb-6">
          <form className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">🎯 Target TDS (Fase Dewasa)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Batas Bawah (Pompa ON)</label>
                  <div className="flex items-center">
                    <input type="number" defaultValue="950" className="flex-1 bg-gray-50 border border-gray-200 rounded-l-lg p-3 outline-none focus:ring-2 focus:ring-green-500 transition" />
                    <span className="bg-gray-100 border-t border-b border-r border-gray-200 px-4 py-3 rounded-r-lg text-gray-500 font-medium">ppm</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Batas Atas (Pompa OFF)</label>
                  <div className="flex items-center">
                    <input type="number" defaultValue="1050" className="flex-1 bg-gray-50 border border-gray-200 rounded-l-lg p-3 outline-none focus:ring-2 focus:ring-green-500 transition" />
                    <span className="bg-gray-100 border-t border-b border-r border-gray-200 px-4 py-3 rounded-r-lg text-gray-500 font-medium">ppm</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">⏱️ Penjadwalan Rutin</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Interval Pemberian Nutrisi</label>
                  <div className="flex items-center">
                    <input type="number" defaultValue="3" className="flex-1 bg-gray-50 border border-gray-200 rounded-l-lg p-3 outline-none focus:ring-2 focus:ring-green-500 transition" />
                    <span className="bg-gray-100 border-t border-b border-r border-gray-200 px-4 py-3 rounded-r-lg text-gray-500 font-medium">Hari</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Jam Eksekusi</label>
                  <input type="time" defaultValue="07:00" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-green-500 transition" />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">Sistem mengecek TDS & menyiram nutrisi tiap 3 hari sekali pada jam di atas.</p>
            </div>

            <button type="button" className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-md">
              Simpan Konfigurasi Jadwal
            </button>
          </form>
        </div>

        {/* Kartu Kontrol Manual */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl border-l-4 border-l-amber-500">
          <h3 className="text-lg font-bold text-gray-800 mb-2">⚡ Kalibrasi Manual (Bebas)</h3>
          <p className="text-sm text-gray-500 mb-6">
            Gunakan fitur ini jika mitra ingin memberikan nutrisi tambahan seketika di luar jadwal.
          </p>
          <button type="button" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-4 rounded-lg transition duration-200 shadow-md flex justify-center items-center gap-2">
            <span className="text-xl">🚀</span> Eksekusi Nutrisi Sekarang
          </button>
        </div>
      </main>

      {/* BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center pt-2 pb-3 px-2 z-30 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
        
        {/* 1. Dasbor (Tidak Aktif) */}
        <Link href="/" className="flex flex-col items-center p-2 text-gray-500 hover:text-teal-700 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
          <span className="text-[10px] font-medium tracking-wide">Dasbor</span>
        </Link>

        {/* 2. Analisis (Tidak Aktif) */}
        <Link href="/riwayat" className="flex flex-col items-center p-2 text-gray-500 hover:text-teal-700 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
          <span className="text-[10px] font-medium tracking-wide">Analisis</span>
        </Link>

        {/* 3. Pengaturan (AKTIF) */}
        <Link href="/pengaturan" className="flex flex-col items-center p-2 text-teal-700 transition">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mb-1">
            <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" />
          </svg>
          <span className="text-[10px] font-bold tracking-wide">Pengaturan</span>
        </Link>
      </nav>

    </div>
  );
}