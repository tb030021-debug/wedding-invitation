import type { Metadata, Viewport } from "next";
import { weddingData } from "@/data/wedding";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const coupleTitle = `${weddingData.groomName} & ${weddingData.brideName} 모바일 청첩장`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: coupleTitle,
  description: `${weddingData.groomName}, ${weddingData.brideName}의 결혼식에 초대합니다.`,
  openGraph: {
    title: coupleTitle,
    description: "소중한 날, 함께 축복해 주세요.",
    images: [weddingData.heroImage],
    type: "website"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#fffaf0"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
