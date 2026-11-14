"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Pengaturan() {
  const [batasBawah, setBatasBawah] = useState(950);
  const [batasAtas, setBatasAtas] = useState(1050);
  const [loading, setLoading] = useState(false);
  const [statusPesan, setStatusPesan] = useState("");

  // Ambil data konfigurasi saat halaman pertama kali dibuka
  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch('/api/config');
        const json = await res.json();
        if (json.success && json.data) {
          setBatasBawah(json.data.batas_bawah_tds);
          setBatasAtas(json.data.batas_atas_tds);
        }
      } catch (err) {
        console.error("Gagal memuat konfigurasi:", err);
      }
    }
    fetchConfig();
  }, []);

  // Fungsi untuk menyimpan perubahan ke database Neon
  const handleSimpan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusPesan("");

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batas_bawah_tds: Number(batasBawah),
          batas_atas_tds: Number(batasAtas),
        }),
      });

      const json = await res.json();
      if (json.success) {
        setStatusPesan("✅ Konfigurasi berhasil disimpan ke Database!");
      } else {
        setStatusPesan("❌ Gagal menyimpan konfigurasi.");
      }
    } catch (err) {
      console.error(err);
      setStatusPesan("❌ Terjadi kesalahan pada server.");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk eksekusi pompa manual secara instan
  const handlePompaManual = async () => {
    try {
      const res = await fetch('/api/pump', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: "ESP32-BAGAS-01",
          status_pompa: "ON"
        }),
      });
      const json = await res.json();
      if (json.success) {
        alert("🚀 Perintah manual terkirim: Pompa diaktifkan!");
      } else {
        alert("Gagal mengaktifkan pompa.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 pb-20 md:pb-0">
      
      {/* HEADER KHUSUS HP */}
      <div className="md:hidden bg-green-900 text-white p-4 shadow-md sticky top-0 z-20 flex justify-center items-center gap-4">
        <img src="/logo.jpg" alt="Logo Kebun Bagas" className="w-16 h-auto rounded-xl shadow-sm border border-white/30" />
        <h1 className="text-xl font-black tracking-wider uppercase">Kebun Bagas</h1>
      </div>

      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:block w-72 bg-green-900 text-white p-6 shadow-xl shrink-0">
        <div className="flex flex-col items-center mb-8 text-center mt-2">
          <img src="/logo.jpg" alt="Logo Kebun Bagas" className="w-36 h-auto rounded-2xl shadow-lg border-2 border-white/30 mb-4" />
          <h1 className="text-xl font-black tracking-wider uppercase leading-snug">Kebun Bagas<br/>Hidroponik</h1>
        </div>
        <nav>
          <ul className="space-y-3 font-medium">
            <Link href="/">
              <li className="p-3 hover:bg-green-800 rounded-lg cursor-pointer transition mb-3">Dasbor Utama</li>
            </Link>
            <Link href="/riwayat">
              <li className="p-3 hover:bg-green-800 rounded-lg cursor-pointer transition mb-3">Analisis Grafik</li>
            </Link>
            <Link href="/pengaturan">
              <li className="bg-green-700/50 p-3 rounded-lg border border-green-600/50 cursor-pointer">Pengaturan Alat</li>
            </Link>
          </ul>
        </nav>
      </aside>

      {/* KONTEN UTAMA */}
      <main className="flex-1 p-6 md:p-10">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Pengaturan Kalibrasi & Sistem</h2>
          <p className="text-gray-500 mt-1">Konfigurasi batas nutrisi dan kontrol manual perangkat ESP32</p>
        </header>

        {/* Kartu Pengaturan Batas TDS */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mb-6">
          <form onSubmit={handleSimpan} className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">🎯 Target TDS (Closed-Loop)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Batas Bawah (Pompa ON)</label>
                  <div className="flex items-center">
                    <input 
                      type="number" 
                      value={batasBawah} 
                      onChange={(e) => setBatasBawah(Number(e.target.value))}
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-l-lg p-3 outline-none focus:ring-2 focus:ring-green-500 transition text-black font-semibold" 
                    />
                    <span className="bg-gray-100 border-t border-b border-r border-gray-200 px-4 py-3 rounded-r-lg text-gray-500 font-medium">ppm</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Batas Atas (Pompa OFF)</label>
                  <div className="flex items-center">
                    <input 
                      type="number" 
                      value={batasAtas} 
                      onChange={(e) => setBatasAtas(Number(e.target.value))}
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-l-lg p-3 outline-none focus:ring-2 focus:ring-green-500 transition text-black font-semibold" 
                    />
                    <span className="bg-gray-100 border-t border-b border-r border-gray-200 px-4 py-3 rounded-r-lg text-gray-500 font-medium">ppm</span>
                  </div>
                </div>
              </div>
            </div>

            {statusPesan && (
              <div className="text-sm font-medium text-center p-3 rounded-lg bg-green-50 text-green-700 border border-green-200">
                {statusPesan}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-md disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan Konfigurasi ke Database"}
            </button>
          </form>
        </div>

        {/* Kartu Kontrol Manual */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl border-l-4 border-l-amber-500">
          <h3 className="text-lg font-bold text-gray-800 mb-2">⚡ Kontrol Pompa Manual</h3>
          <p className="text-sm text-gray-500 mb-6">
            Gunakan fitur ini untuk memicu penyiraman nutrisi seketika di luar siklus otomatis.
          </p>
          <button 
            type="button" 
            onClick={handlePompaManual}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-4 rounded-lg transition duration-200 shadow-md flex justify-center items-center gap-2"
          >
            <span className="text-xl">🚀</span> Eksekusi Nutrisi Sekarang
          </button>
        </div>
      </main>

      {/* BOTTOM NAVIGATION BAR MOBILE */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center pt-2 pb-3 px-2 z-30 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
        <Link href="/" className="flex flex-col items-center p-2 text-gray-500 hover:text-teal-700 transition">
          <span className="text-[10px] font-medium">Dasbor</span>
        </Link>
        <Link href="/riwayat" className="flex flex-col items-center p-2 text-gray-500 hover:text-teal-700 transition">
          <span className="text-[10px] font-medium">Analisis</span>
        </Link>
        <Link href="/pengaturan" className="flex flex-col items-center p-2 text-teal-700 transition">
          <span className="text-[10px] font-bold">Pengaturan</span>
        </Link>
      </nav>

    </div>
  );
}