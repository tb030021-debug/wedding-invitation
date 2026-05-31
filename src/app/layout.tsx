import type { Metadata, Viewport } from "next";
import { Gaegu, Gowun_Dodum } from "next/font/google";
import { weddingData } from "@/data/wedding";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const coupleTitle = `${weddingData.groomName} & ${weddingData.brideName} 모바일 청첩장`;

const weddingBodyFont = Gaegu({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-wedding-body",
  display: "swap"
});

const weddingFallbackFont = Gowun_Dodum({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-wedding-fallback",
  display: "swap"
});

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
      <body className={`${weddingBodyFont.variable} ${weddingFallbackFont.variable}`}>
        {children}
      </body>
    </html>
  );
}
