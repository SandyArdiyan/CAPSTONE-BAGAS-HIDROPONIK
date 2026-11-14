import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const DEVICE_ID = "ESP32-BAGAS-01";

// [GET] Mengambil konfigurasi batas TDS dari database
export async function GET(request) {
  try {
    let config = await prisma.deviceConfig.findUnique({
      where: { deviceId: DEVICE_ID }
    });

    // Jika belum ada data, buatkan data default
    if (!config) {
      config = await prisma.deviceConfig.create({
        data: {
          deviceId: DEVICE_ID,
          batas_bawah_tds: 950,
          batas_atas_tds: 1050,
        }
      });
    }

    return NextResponse.json({ success: true, data: config });
  } catch (error) {
    console.error("Error GET Config:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// [POST] Menyimpan / memperbarui konfigurasi batas TDS dari website
export async function POST(request) {
  try {
    const body = await request.json();
    const { batas_bawah_tds, batas_atas_tds } = body;

    if (batas_bawah_tds === undefined || batas_atas_tds === undefined) {
      return NextResponse.json({ success: false, error: "Batas bawah dan atas wajib diisi!" }, { status: 400 });
    }

    const updatedConfig = await prisma.deviceConfig.upsert({
      where: { deviceId: DEVICE_ID },
      update: {
        batas_bawah_tds: Number(batas_bawah_tds),
        batas_atas_tds: Number(batas_atas_tds),
      },
      create: {
        deviceId: DEVICE_ID,
        batas_bawah_tds: Number(batas_bawah_tds),
        batas_atas_tds: Number(batas_atas_tds),
      }
    });

    return NextResponse.json({ success: true, data: updatedConfig });
  } catch (error) {
    console.error("Error Detail POST Config:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}