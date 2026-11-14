import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// [GET] Mengambil riwayat sensor log
export async function GET(request) {
  try {
    const logs = await prisma.sensorLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 50
    });
    return NextResponse.json({ success: true, data: logs });
  } catch (error) {
    console.error("Error GET SensorLog:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// [POST] Menerima data kiriman dari ESP32
export async function POST(request) {
  try {
    const body = await request.json();
    const { deviceId = "ESP32-BAGAS-01", nilai_tds } = body;

    if (nilai_tds === undefined) {
      return NextResponse.json({ success: false, error: "Nilai TDS wajib diisi!" }, { status: 400 });
    }

    const newLog = await prisma.sensorLog.create({
      data: {
        deviceId: deviceId,
        nilai_tds: Number(nilai_tds),
      }
    });

    return NextResponse.json({ success: true, data: newLog });
  } catch (error) {
    console.error("Error POST SensorLog:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}