import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// [GET] Mengambil riwayat log pompa secara rapi (diurutkan dari yang terbaru)
export async function GET(request) {
  try {
    const logs = await prisma.pumpLog.findMany({
      orderBy: { timestamp_event: 'desc' },
      take: 20 // Batasi 20 data terakhir agar ringan dan rapi
    });

    return NextResponse.json({ success: true, data: logs });
  } catch (error) {
    console.error("Error GET PumpLog:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// [POST] Mencatat event pompa menyala/mati (dari ESP32 atau Web)
export async function POST(request) {
  try {
    const body = await request.json();
    const { deviceId = "ESP32-BAGAS-01", status_pompa } = body;

    if (!status_pompa) {
      return NextResponse.json({ success: false, error: "Status pompa wajib diisi!" }, { status: 400 });
    }

    const newLog = await prisma.pumpLog.create({
      data: {
        deviceId: deviceId,
        status_pompa: status_pompa, // "ON" atau "OFF"
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: `Log pompa ${status_pompa} berhasil dicatat`,
      data: newLog 
    });
  } catch (error) {
    console.error("Error POST PumpLog:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}