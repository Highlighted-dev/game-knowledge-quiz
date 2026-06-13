import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import LanguageSync from "@/components/LanguageSync";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Great Game Knowledge Tournament",
  description: "Great Game Knowledge Tournament",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageSync />
        {children}
      </body>
    </html>
  );
}
