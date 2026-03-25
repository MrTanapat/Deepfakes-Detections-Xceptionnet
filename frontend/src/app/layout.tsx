import type { Metadata } from "next";
import { Syne, DM_Sans, Noto_Sans_Thai } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { LanguageProvider, type Locale } from "@/app/providers/language-provider";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500"],
});

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  variable: "--font-thai",
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Veridex — Deepfake Detection",
  description: "Advanced deepfake detection powered by XceptionNet and Context Expansion",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get("lang")?.value;

  const initialLang: Locale = cookieLang === "en" ? "en" : "th";

  return (
    <html
      lang={initialLang}
      className={`${syne.variable} ${dmSans.variable} ${notoSansThai.variable}`}
    >
      <body>
        <LanguageProvider initialLang={initialLang}>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}