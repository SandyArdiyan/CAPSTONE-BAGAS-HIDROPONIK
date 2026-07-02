import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// [GET] Mengambil riwayat TDS untuk ditampilkan di Dashboard
export async function GET(request) {
  try {
    const logs = await prisma.sensorLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 10, // Ambil 10 data terbaru
    });
    return NextResponse.json({ success: true, data: logs });
  } catch (error) {
    console.error("Error GET Sensor:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

// [POST] Menerima data kiriman dari alat ESP32
export async function POST(request) {
  try {
    const body = await request.json();
    const { deviceId, nilai_tds } = body;

    // Validasi apakah ESP32 mengirim data yang lengkap
    if (!deviceId || nilai_tds === undefined) {
      return NextResponse.json({ error: "Data deviceId dan nilai_tds wajib ada!" }, { status: 400 });
    }

    // Simpan data TDS ke database Supabase
    const newLog = await prisma.sensorLog.create({
      data: {
        deviceId: String(deviceId),
        nilai_tds: parseInt(nilai_tds),
      }
    });

    return NextResponse.json({ success: true, data: newLog }, { status: 201 });
  } catch (error) {
    console.error("Error POST Sensor:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}