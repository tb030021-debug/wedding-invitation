import type { Metadata, Viewport } from "next";
import { Dancing_Script, Gaegu, Gowun_Dodum } from "next/font/google";
import { weddingData } from "@/data/wedding";
import { formatKoreanDate } from "@/utils/date";
import "./globals.css";

const siteUrl = weddingData.siteUrl;
const coupleTitle = `${weddingData.groomName} ♥ ${weddingData.brideName}, 결혼합니다`;
const previewTitle = formatKoreanDate(weddingData.weddingDate);
const coupleDescription = "저희 소중한 날에 초대합니다.";
const shareImageUrl = new URL(weddingData.shareImage, siteUrl).toString();

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

const openingScriptFont = Dancing_Script({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-opening-script",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: coupleTitle,
  description: coupleDescription,
  alternates: {
    canonical: siteUrl
  },
  openGraph: {
    title: previewTitle,
    description: coupleDescription,
    url: siteUrl,
    siteName: `${weddingData.groomName} ♥ ${weddingData.brideName}`,
    locale: "ko_KR",
    images: [
      {
        url: shareImageUrl,
        width: 1600,
        height: 2400,
        alt: `${weddingData.groomName}과 ${weddingData.brideName}의 웨딩 사진`
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: previewTitle,
    description: coupleDescription,
    images: [shareImageUrl]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#fffaf0"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${weddingBodyFont.variable} ${weddingFallbackFont.variable} ${openingScriptFont.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
