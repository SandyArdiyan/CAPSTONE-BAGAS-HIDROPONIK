const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Hapus data lama agar tidak duplikat
  await prisma.sensorLog.deleteMany({});
  await prisma.pumpLog.deleteMany({});

  // Input Data Dummy Sensor
  await prisma.sensorLog.create({
    data: {
      deviceId: "ESP32-BAGAS-01",
      nilai_tds: 980,
    },
  });

  // Input Data Dummy Pompa
  await prisma.pumpLog.create({
    data: {
      deviceId: "ESP32-BAGAS-01",
      status_pompa: "OFF",
    },
  });

  console.log("Data dummy berhasil ditambahkan!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });