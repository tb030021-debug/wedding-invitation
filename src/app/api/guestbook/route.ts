import { GuestbookSide } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { guestbookCreateSchema } from "@/lib/validation";
import { getOrCreateWedding } from "@/lib/wedding";

export const runtime = "nodejs";

const publicSelect = {
  id: true,
  name: true,
  side: true,
  message: true,
  createdAt: true
};

export async function GET(request: NextRequest) {
  try {
    const wedding = await getOrCreateWedding();
    const limit = Math.min(
      Math.max(Number(request.nextUrl.searchParams.get("limit") || "20"), 1),
      100
    );
    const messages = await prisma.guestbookMessage.findMany({
      where: {
        weddingId: wedding.id,
        isHidden: false
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: publicSelect
    });

    return NextResponse.json({ messages });
  } catch {
    return NextResponse.json(
      { message: "방명록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = guestbookCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || "입력값을 확인해 주세요." },
        { status: 400 }
      );
    }

    const wedding = await getOrCreateWedding();
    const passwordHash = await hashPassword(parsed.data.password);
    const message = await prisma.guestbookMessage.create({
      data: {
        weddingId: wedding.id,
        name: parsed.data.name,
        side: parsed.data.side as GuestbookSide,
        message: parsed.data.message,
        passwordHash
      },
      select: publicSelect
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "축하 메시지를 등록하지 못했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }
}
