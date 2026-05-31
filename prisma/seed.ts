import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { weddingData } from "../src/data/wedding";

const prisma = new PrismaClient();
const DEFAULT_WEDDING_ID = "default-wedding";

async function main() {
  // Production deployments must override these with strong credentials in .env.
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin1234";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.wedding.upsert({
    where: { id: DEFAULT_WEDDING_ID },
    update: {
      groomName: weddingData.groomName,
      brideName: weddingData.brideName,
      weddingDate: new Date(`${weddingData.weddingDate}T00:00:00.000Z`),
      weddingTime: weddingData.weddingTime,
      venueName: weddingData.venueName,
      venueAddress: weddingData.venueAddress
    },
    create: {
      id: DEFAULT_WEDDING_ID,
      groomName: weddingData.groomName,
      brideName: weddingData.brideName,
      weddingDate: new Date(`${weddingData.weddingDate}T00:00:00.000Z`),
      weddingTime: weddingData.weddingTime,
      venueName: weddingData.venueName,
      venueAddress: weddingData.venueAddress
    }
  });

  await prisma.admin.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash }
  });

  console.log(`Seeded wedding ${DEFAULT_WEDDING_ID} and admin "${username}".`);
}

main()
  .catch((error) => {
    console.error("Seed failed.", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
