import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// [GET] Mengambil log riwayat pompa untuk Dashboard
export async function GET(request) {
  try {
    const logs = await prisma.pumpLog.findMany({
      orderBy: { timestamp_event: 'desc' },
      take: 1, // Ambil 1 status paling terakhir saja untuk indikator utama
    });
    return NextResponse.json({ success: true, data: logs });
  } catch (error) {
    console.error("Error GET Pump:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

// [POST] Menerima trigger status dari ESP32 saat pompa menyala/mati
export async function POST(request) {
  try {
    const body = await request.json();
    const { deviceId, status_pompa } = body;

    if (!deviceId || !status_pompa) {
      return NextResponse.json({ error: "Data deviceId dan status_pompa wajib ada!" }, { status: 400 });
    }

    // Simpan status pompa (ON/OFF) ke database
    const newLog = await prisma.pumpLog.create({
      data: {
        deviceId: String(deviceId),
        status_pompa: String(status_pompa).toUpperCase(), // Pastikan formatnya selalu huruf besar
      }
    });

    return NextResponse.json({ success: true, data: newLog }, { status: 201 });
  } catch (error) {
    console.error("Error POST Pump:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}