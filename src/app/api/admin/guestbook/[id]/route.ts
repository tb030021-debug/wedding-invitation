import { GuestbookSide } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { adminGuestbookUpdateSchema } from "@/lib/validation";

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

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = adminGuestbookUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || "수정할 값을 확인해 주세요." },
        { status: 400 }
      );
    }

    const message = await prisma.guestbookMessage.update({
      where: { id },
      data: {
        ...(parsed.data.isHidden !== undefined ? { isHidden: parsed.data.isHidden } : {}),
        ...(parsed.data.name ? { name: parsed.data.name } : {}),
        ...(parsed.data.message ? { message: parsed.data.message } : {}),
        ...(parsed.data.side ? { side: parsed.data.side as GuestbookSide } : {})
      },
      select: adminGuestbookSelect
    });

    return NextResponse.json({ message });
  } catch {
    return NextResponse.json(
      { message: "메시지를 수정하지 못했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    await prisma.guestbookMessage.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: "메시지를 삭제하지 못했습니다." },
      { status: 500 }
    );
  }
}
