-- CreateTable
CREATE TABLE "GuestPhoto" (
    "id" TEXT NOT NULL,
    "weddingId" TEXT NOT NULL,
    "uploaderName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "imageData" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuestPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GuestPhoto_weddingId_createdAt_idx" ON "GuestPhoto"("weddingId", "createdAt");

-- AddForeignKey
ALTER TABLE "GuestPhoto" ADD CONSTRAINT "GuestPhoto_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;
