import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  detectImageMimeType,
  MAX_GUEST_PHOTO_BYTES,
  normalizePhotoFileName
} from "@/lib/photo";
import { guestPhotoUploaderNameSchema } from "@/lib/validation";
import { getOrCreateWedding } from "@/lib/wedding";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const parsedName = guestPhotoUploaderNameSchema.safeParse(
      formData.get("uploaderName")
    );
    const photo = formData.get("photo");

    if (!parsedName.success) {
      return NextResponse.json(
        { message: parsedName.error.issues[0]?.message || "이름을 확인해 주세요." },
        { status: 400 }
      );
    }

    if (!(photo instanceof File) || photo.size === 0) {
      return NextResponse.json(
        { message: "전송할 사진을 선택해 주세요." },
        { status: 400 }
      );
    }

    if (photo.size > MAX_GUEST_PHOTO_BYTES) {
      return NextResponse.json(
        { message: "사진 한 장은 3MB 이하로 전송해 주세요." },
        { status: 413 }
      );
    }

    const imageData = new Uint8Array(await photo.arrayBuffer());
    const mimeType = detectImageMimeType(imageData);

    if (!mimeType) {
      return NextResponse.json(
        { message: "JPG, PNG, WebP 사진만 전송할 수 있습니다." },
        { status: 415 }
      );
    }

    const wedding = await getOrCreateWedding();
    const guestPhoto = await prisma.guestPhoto.create({
      data: {
        weddingId: wedding.id,
        uploaderName: parsedName.data,
        originalName: normalizePhotoFileName(photo.name, mimeType),
        mimeType,
        size: imageData.byteLength,
        imageData
      },
      select: {
        id: true,
        uploaderName: true,
        originalName: true,
        size: true,
        createdAt: true
      }
    });

    return NextResponse.json({ photo: guestPhoto }, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "사진을 전송하지 못했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }
}
