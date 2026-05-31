import { GuestbookSide, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { adminGuestbookQuerySchema } from "@/lib/validation";
import { getOrCreateWedding } from "@/lib/wedding";

export const runtime = "nodejs";

const adminGuestbookSelect = {
  id: true,
  weddingId: true,
  name: true,
  side: true,
  message: true,
  isHidden: true,
  createdAt: true,
  updatedAt: true
};

function createWhere(
  weddingId: string,
  query: {
    side: "ALL" | "GROOM_SIDE" | "BRIDE_SIDE";
    keyword: string;
    hidden: "ALL" | "VISIBLE" | "HIDDEN";
  }
) {
  const where: Prisma.GuestbookMessageWhereInput = { weddingId };

  if (query.side !== "ALL") {
    where.side = query.side as GuestbookSide;
  }

  if (query.hidden !== "ALL") {
    where.isHidden = query.hidden === "HIDDEN";
  }

  if (query.keyword) {
    where.OR = [
      { name: { contains: query.keyword, mode: "insensitive" } },
      { message: { contains: query.keyword, mode: "insensitive" } }
    ];
  }

  return where;
}

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    const parsed = adminGuestbookQuerySchema.parse({
      side: request.nextUrl.searchParams.get("side") || "ALL",
      keyword: request.nextUrl.searchParams.get("keyword") || "",
      hidden: request.nextUrl.searchParams.get("hidden") || "ALL",
      order: request.nextUrl.searchParams.get("order") || "desc"
    });
    const wedding = await getOrCreateWedding();
    const where = createWhere(wedding.id, parsed);

    const [messages, totalCount, groomCount, brideCount, hiddenCount] = await Promise.all([
      prisma.guestbookMessage.findMany({
        where,
        orderBy: { createdAt: parsed.order },
        take: 300,
        select: adminGuestbookSelect
      }),
      prisma.guestbookMessage.count({ where: { weddingId: wedding.id } }),
      prisma.guestbookMessage.count({
        where: { weddingId: wedding.id, side: "GROOM_SIDE" }
      }),
      prisma.guestbookMessage.count({
        where: { weddingId: wedding.id, side: "BRIDE_SIDE" }
      }),
      prisma.guestbookMessage.count({
        where: { weddingId: wedding.id, isHidden: true }
      })
    ]);

    return NextResponse.json({
      messages,
      stats: {
        totalCount,
        groomCount,
        brideCount,
        hiddenCount
      }
    });
  } catch {
    return NextResponse.json(
      { message: "방명록 목록을 불러오지 못했습니다." },
      { status: 500 }
    );
  }
}
