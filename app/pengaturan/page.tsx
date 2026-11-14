"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface PumpLogItem {
  idLog: string;
  deviceId: string;
  status_pompa: string;
  timestamp_event: string;
}

export default function Pengaturan() {
  const [batasBawah, setBatasBawah] = useState(950);
  const [batasAtas, setBatasAtas] = useState(1050);
  const [loading, setLoading] = useState(false);
  const [loadingPompa, setLoadingPompa] = useState(false);
  const [statusPesan, setStatusPesan] = useState("");
  const [pumpLogs, setPumpLogs] = useState<PumpLogItem[]>([]);

  // Fungsi ambil riwayat log pompa terbaru
  const fetchPumpLogs = async () => {
    try {
      const res = await fetch('/api/pump');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setPumpLogs(json.data);
      }
    } catch (err) {
      console.error("Gagal memuat riwayat pompa:", err);
    }
  };

  // Ambil data konfigurasi & log pompa saat halaman pertama kali dibuka
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
    fetchPumpLogs();
  }, []);

  // Fungsi untuk menyimpan perubahan batas TDS ke database Neon
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
        setStatusPesan(`❌ Gagal: ${json.error || 'Terjadi kesalahan'}`);
      }
    } catch (err) {
      console.error(err);
      setStatusPesan("❌ Terjadi kesalahan pada server.");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk eksekusi pompa manual ("ON" atau "OFF")
  const handlePompaManual = async (status: "ON" | "OFF") => {
    setLoadingPompa(true);
    try {
      const res = await fetch('/api/pump', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: "ESP32-BAGAS-01",
          status_pompa: status
        }),
      });
      const json = await res.json();
      if (json.success) {
        alert(`🚀 Perintah manual terkirim: Pompa ${status}!`);
        fetchPumpLogs(); // Langsung perbarui tabel log di bawah
      } else {
        alert(`Gagal mengubah status pompa ke ${status}.`);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi ke server.");
    } finally {
      setLoadingPompa(false);
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
              <div className={`text-sm font-medium text-center p-3 rounded-lg border ${statusPesan.includes('✅') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
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

        {/* Kartu Kontrol Manual ON & OFF */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl border-l-4 border-l-amber-500 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2">⚡ Kontrol Pompa Manual</h3>
          <p className="text-sm text-gray-500 mb-6">
            Gunakan tombol di bawah untuk menyalakan atau mematikan pompa nutrisi secara manual di luar siklus otomatis.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              type="button" 
              disabled={loadingPompa}
              onClick={() => handlePompaManual("ON")}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-4 rounded-lg transition duration-200 shadow-md flex justify-center items-center gap-2 disabled:opacity-50"
            >
              <span className="text-xl">🟢</span> Nyalakan Pompa (ON)
            </button>

            <button 
              type="button" 
              disabled={loadingPompa}
              onClick={() => handlePompaManual("OFF")}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-4 rounded-lg transition duration-200 shadow-md flex justify-center items-center gap-2 disabled:opacity-50"
            >
              <span className="text-xl">🔴</span> Matikan Pompa (OFF)
            </button>
          </div>
        </div>

        {/* Kartu Tabel Log Aktivitas Pompa */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="text-lg font-bold text-gray-800">📋 Riwayat Aktivitas Pompa</h3>
            <button 
              type="button" 
              onClick={fetchPumpLogs}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-3 py-1.5 rounded-lg transition"
            >
              🔄 Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase text-gray-500 bg-gray-50">
                  <th className="py-3 px-4 rounded-tl-lg">Waktu</th>
                  <th className="py-3 px-4">Perangkat</th>
                  <th className="py-3 px-4 rounded-tr-lg text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {pumpLogs.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-gray-400">
                      Belum ada riwayat aktivitas pompa.
                    </td>
                  </tr>
                ) : (
                  pumpLogs.slice(0, 8).map((log) => (
                    <tr key={log.idLog} className="hover:bg-gray-50 transition">
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(log.timestamp_event).toLocaleString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-700">{log.deviceId}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          log.status_pompa === "ON" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-red-100 text-red-700"
                        }`}>
                          {log.status_pompa}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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