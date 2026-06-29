"use client";

/* eslint-disable @next/next/no-img-element */

import { ImagePlus, Send, X } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import {
  MAX_GUEST_PHOTO_BYTES,
  MAX_GUEST_PHOTOS_PER_SELECTION
} from "@/lib/photo";
import SectionShell from "./SectionShell";

type PendingPhoto = {
  id: string;
  file: File;
  previewUrl: string;
};

const MAX_SOURCE_PHOTO_BYTES = 25 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1600;

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    const sourceUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(sourceUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(sourceUrl);
      reject(new Error("사진을 읽지 못했습니다."));
    };
    image.src = sourceUrl;
  });
}

function canvasToJpeg(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("사진을 변환하지 못했습니다."));
        }
      },
      "image/jpeg",
      quality
    );
  });
}

async function compressPhoto(file: File) {
  if (file.size > MAX_SOURCE_PHOTO_BYTES) {
    throw new Error(`${file.name}: 원본 사진은 25MB 이하만 선택할 수 있습니다.`);
  }

  const image = await loadImage(file);
  const scale = Math.min(
    1,
    MAX_IMAGE_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight)
  );
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("사진을 변환하지 못했습니다.");
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  let blob = await canvasToJpeg(canvas, 0.82);

  if (blob.size > MAX_GUEST_PHOTO_BYTES) {
    blob = await canvasToJpeg(canvas, 0.68);
  }

  if (blob.size > MAX_GUEST_PHOTO_BYTES) {
    throw new Error(`${file.name}: 압축 후에도 3MB를 초과합니다.`);
  }

  const baseName = file.name.replace(/\.[^.]+$/, "") || "guest-photo";
  return new File([blob], `${baseName}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now()
  });
}

export default function GuestPhotoSection() {
  const [uploaderName, setUploaderName] = useState("");
  const [pendingPhotos, setPendingPhotos] = useState<PendingPhoto[]>([]);
  const [status, setStatus] = useState("");
  const [isPreparing, setIsPreparing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const pendingPhotosRef = useRef<PendingPhoto[]>([]);

  useEffect(() => {
    pendingPhotosRef.current = pendingPhotos;
  }, [pendingPhotos]);

  useEffect(
    () => () => {
      pendingPhotosRef.current.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
    },
    []
  );

  const handlePhotoSelection = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    event.target.value = "";
    setStatus("");

    const remainingCount = MAX_GUEST_PHOTOS_PER_SELECTION - pendingPhotos.length;
    if (remainingCount <= 0) {
      setStatus(`사진은 한 번에 최대 ${MAX_GUEST_PHOTOS_PER_SELECTION}장까지 선택할 수 있습니다.`);
      return;
    }

    const filesToPrepare = selectedFiles.slice(0, remainingCount);
    if (selectedFiles.length > remainingCount) {
      setStatus(`한 번에 최대 ${MAX_GUEST_PHOTOS_PER_SELECTION}장까지만 선택됩니다.`);
    }

    setIsPreparing(true);
    const prepared: PendingPhoto[] = [];
    const errors: string[] = [];

    for (const file of filesToPrepare) {
      try {
        const compressed = await compressPhoto(file);
        prepared.push({
          id: `${Date.now()}-${crypto.randomUUID()}`,
          file: compressed,
          previewUrl: URL.createObjectURL(compressed)
        });
      } catch (error) {
        errors.push(error instanceof Error ? error.message : `${file.name}: 사진 변환에 실패했습니다.`);
      }
    }

    setPendingPhotos((current) => [...current, ...prepared]);
    if (errors.length > 0) {
      setStatus(errors[0]);
    }
    setIsPreparing(false);
  };

  const removePhoto = (id: string) => {
    setPendingPhotos((current) => {
      const target = current.find((photo) => photo.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return current.filter((photo) => photo.id !== id);
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");

    const trimmedName = uploaderName.trim();
    if (!trimmedName) {
      setStatus("사진을 보내는 분의 이름을 입력해 주세요.");
      return;
    }

    if (pendingPhotos.length === 0) {
      setStatus("전송할 사진을 선택해 주세요.");
      return;
    }

    setIsUploading(true);
    const uploadedIds = new Set<string>();
    let uploadError = "";

    for (let index = 0; index < pendingPhotos.length; index += 1) {
      const pendingPhoto = pendingPhotos[index];
      setStatus(`${pendingPhotos.length}장 중 ${index + 1}장을 보내는 중입니다.`);

      try {
        const formData = new FormData();
        formData.append("uploaderName", trimmedName);
        formData.append("photo", pendingPhoto.file);
        const response = await fetch("/api/photos", {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" }
        });
        const data = (await response.json().catch(() => ({}))) as { message?: string };

        if (!response.ok) {
          throw new Error(data.message || "사진을 전송하지 못했습니다.");
        }

        uploadedIds.add(pendingPhoto.id);
        URL.revokeObjectURL(pendingPhoto.previewUrl);
      } catch (error) {
        uploadError = error instanceof Error ? error.message : "사진을 전송하지 못했습니다.";
        break;
      }
    }

    setPendingPhotos((current) =>
      current.filter((photo) => !uploadedIds.has(photo.id))
    );
    setStatus(
      uploadError
        ? `${uploadedIds.size}장은 전송되었습니다. ${uploadError}`
        : `${uploadedIds.size}장의 사진을 신랑·신부에게 전송했습니다. 감사합니다!`
    );
    setIsUploading(false);
  };

  return (
    <SectionShell kicker="Guest Photos" title="하객 사진 보내기">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="rounded-lg bg-ivory/70 px-4 py-3 text-center text-sm leading-6 text-ink/65">
          함께 찍은 소중한 사진을 보내주세요.
          <br />
          전송된 사진은 신랑·신부 관리자만 확인할 수 있어요.
        </div>

        <label className="block">
          <span className="sr-only">사진을 보내는 분의 이름</span>
          <input
            className="muted-input"
            value={uploaderName}
            onChange={(event) => setUploaderName(event.target.value)}
            placeholder="사진을 보내는 분의 이름"
            maxLength={20}
            autoComplete="name"
            required
          />
        </label>

        <label className="icon-button w-full cursor-pointer">
          <ImagePlus aria-hidden size={18} />
          {isPreparing ? "사진을 준비하는 중" : "사진 선택하기"}
          <input
            className="sr-only"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            multiple
            onChange={handlePhotoSelection}
            disabled={isPreparing || isUploading}
          />
        </label>

        {pendingPhotos.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {pendingPhotos.map((photo) => (
              <div
                key={photo.id}
                className="relative aspect-square overflow-hidden rounded-lg border border-champagne bg-ivory"
              >
                <img
                  className="h-full w-full object-cover"
                  src={photo.previewUrl}
                  alt="전송할 사진 미리보기"
                />
                <button
                  type="button"
                  className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-ink/70 text-white backdrop-blur"
                  onClick={() => removePhoto(photo.id)}
                  disabled={isUploading}
                  aria-label="선택한 사진 제외"
                >
                  <X aria-hidden size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : null}

        <button
          type="submit"
          className="primary-button w-full disabled:opacity-60"
          disabled={isPreparing || isUploading || pendingPhotos.length === 0}
        >
          <Send aria-hidden size={17} />
          {isUploading ? "사진 보내는 중" : `사진 ${pendingPhotos.length || ""}장 보내기`}
        </button>

        {status ? (
          <p className="text-center text-sm leading-6 text-ink/65" role="status" aria-live="polite">
            {status}
          </p>
        ) : null}
      </form>
    </SectionShell>
  );
}
