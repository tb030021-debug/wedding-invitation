import { weddingData } from "@/data/wedding";
import { prisma } from "./prisma";

export const DEFAULT_WEDDING_ID = "default-wedding";

export async function getOrCreateWedding() {
  return prisma.wedding.upsert({
    where: { id: DEFAULT_WEDDING_ID },
    update: {},
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
}
