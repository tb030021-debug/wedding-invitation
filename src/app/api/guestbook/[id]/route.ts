import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/password";
import { guestbookDeleteSchema } from "@/lib/validation";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = guestbookDeleteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || "삭제용 비밀번호를 확인해 주세요." },
        { status: 400 }
      );
    }

    const message = await prisma.guestbookMessage.findUnique({
      where: { id },
      select: { id: true, passwordHash: true }
    });

    if (!message) {
      return NextResponse.json({ message: "삭제할 메시지를 찾지 못했습니다." }, { status: 404 });
    }

    const isValidPassword = await comparePassword(parsed.data.password, message.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json({ message: "삭제용 비밀번호가 일치하지 않습니다." }, { status: 403 });
    }

    await prisma.guestbookMessage.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: "메시지를 삭제하지 못했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }
}
