import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  const { id } = await context.params;
  const photo = await prisma.guestPhoto.findUnique({
    where: { id },
    select: {
      imageData: true,
      mimeType: true,
      originalName: true
    }
  });

  if (!photo) {
    return NextResponse.json({ message: "사진을 찾지 못했습니다." }, { status: 404 });
  }

  const isDownload = request.nextUrl.searchParams.get("download") === "1";
  const encodedName = encodeURIComponent(photo.originalName);

  return new NextResponse(photo.imageData, {
    headers: {
      "Content-Type": photo.mimeType,
      "Content-Length": String(photo.imageData.byteLength),
      "Content-Disposition": `${isDownload ? "attachment" : "inline"}; filename="guest-photo"; filename*=UTF-8''${encodedName}`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff"
    }
  });
}
