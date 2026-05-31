import { GuestbookSide, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { createGuestbookCsv, createGuestbookCsvFilename } from "@/lib/export";
import { prisma } from "@/lib/prisma";
import { exportQuerySchema } from "@/lib/validation";
import { getOrCreateWedding } from "@/lib/wedding";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    const parsed = exportQuerySchema.parse({
      side: request.nextUrl.searchParams.get("side") || "ALL",
      includeHidden: request.nextUrl.searchParams.get("includeHidden") || "true"
    });
    const wedding = await getOrCreateWedding();
    const where: Prisma.GuestbookMessageWhereInput = { weddingId: wedding.id };

    if (parsed.side !== "ALL") {
      where.side = parsed.side as GuestbookSide;
    }

    if (parsed.includeHidden === "false") {
      where.isHidden = false;
    }

    const messages = await prisma.guestbookMessage.findMany({
      where,
      orderBy: { createdAt: "desc" }
    });
    const csv = createGuestbookCsv(messages);

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${createGuestbookCsvFilename()}"`
      }
    });
  } catch {
    return NextResponse.json(
      { message: "방명록 데이터를 다운로드하지 못했습니다." },
      { status: 500 }
    );
  }
}
