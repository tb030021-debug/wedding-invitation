import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOrCreateWedding } from "@/lib/wedding";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    const wedding = await getOrCreateWedding();
    const photos = await prisma.guestPhoto.findMany({
      where: { weddingId: wedding.id },
      orderBy: { createdAt: "desc" },
      take: 500,
      select: {
        id: true,
        uploaderName: true,
        originalName: true,
        mimeType: true,
        size: true,
        createdAt: true
      }
    });

    return NextResponse.json(
      {
        photos: photos.map((photo) => ({
          ...photo,
          imageUrl: `/api/admin/photos/${photo.id}/image`
        }))
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { message: "하객 사진을 불러오지 못했습니다." },
      { status: 500 }
    );
  }
}
