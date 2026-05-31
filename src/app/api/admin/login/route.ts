import { NextRequest, NextResponse } from "next/server";
import { createAdminToken, setAdminCookie } from "@/lib/auth";
import { comparePassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { adminLoginSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = adminLoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || "로그인 정보를 확인해 주세요." },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.findUnique({
      where: { username: parsed.data.username }
    });

    if (!admin) {
      return NextResponse.json({ message: "아이디 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
    }

    const isValidPassword = await comparePassword(parsed.data.password, admin.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json({ message: "아이디 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
    }

    const response = NextResponse.json({
      admin: {
        id: admin.id,
        username: admin.username
      }
    });
    setAdminCookie(response, createAdminToken(admin));
    return response;
  } catch {
    return NextResponse.json(
      { message: "로그인 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }
}
