"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface SensorLog {
  idLog: string;
  deviceId: string;
  nilai_tds: number;
  timestamp: string;
}

interface PumpLog {
  idLog: string;
  deviceId: string;
  status_pompa: string;
  timestamp_event: string;
}

export default function Dashboard() {
  const [tdsData, setTdsData] = useState<SensorLog[]>([]);
  const [pumpLogs, setPumpLogs] = useState<PumpLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const resTds = await fetch('/api/sensor');
      const jsonTds = await resTds.json();
      if (jsonTds.success) setTdsData(jsonTds.data);

      const resPump = await fetch('/api/pump');
      const jsonPump = await resPump.json();
      if (jsonPump.success) setPumpLogs(jsonPump.data);
    } catch (error) {
      console.error("Gagal mengambil data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

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
              <li className="bg-green-700/50 p-3 rounded-lg border border-green-600/50 cursor-pointer mb-3">
                Dasbor Utama
              </li>
            </Link>
            <Link href="/riwayat">
              <li className="p-3 hover:bg-green-800 rounded-lg cursor-pointer transition mb-3">
                Analisis Grafik
              </li>
            </Link>
            <Link href="/pengaturan">
              <li className="p-3 hover:bg-green-800 rounded-lg cursor-pointer transition">
                Pengaturan Alat
              </li>
            </Link>
          </ul>
        </nav>
      </aside>

      {/* KONTEN UTAMA */}
      <main className="flex-1 p-6 md:p-10">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Pemantauan Nutrisi</h2>
            <p className="text-gray-500 mt-1">Fase Dewasa (Target: 1000 ppm)</p>
          </div>
        </header>

        {loading ? (
          <div className="text-center py-20 text-gray-500 font-medium animate-pulse">Memuat data dari server...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">💧</div>
              <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">Tingkat TDS Terkini</h3>
              <div className="text-6xl font-black text-gray-800 mb-4">
                {tdsData[0]?.nilai_tds ?? 0} <span className="text-2xl text-gray-400 font-medium ml-2">ppm</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">Status Pompa Nutrisi</h3>
              <div className={`text-5xl font-black mb-4 ${pumpLogs[0]?.status_pompa === 'ON' ? 'text-green-500' : 'text-rose-500'}`}>
                {pumpLogs[0]?.status_pompa ?? "OFF"}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center pt-2 pb-3 px-2 z-30 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
        <Link href="/" className="flex flex-col items-center p-2 text-teal-700 transition">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mb-1">
            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zM12.75 6a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM12.75 15.75a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clipRule="evenodd" />
          </svg>
          <span className="text-[10px] font-bold tracking-wide">Dasbor</span>
        </Link>
        <Link href="/riwayat" className="flex flex-col items-center p-2 text-gray-500 hover:text-teal-700 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
          <span className="text-[10px] font-medium tracking-wide">Analisis</span>
        </Link>
        <Link href="/pengaturan" className="flex flex-col items-center p-2 text-gray-500 hover:text-teal-700 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-[10px] font-medium tracking-wide">Pengaturan</span>
        </Link>
      </nav>
    </div>
  );
}