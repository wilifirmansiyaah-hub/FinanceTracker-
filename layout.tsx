import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SANN404 Finance",
  description: "Minimalist Fintech",
  manifest: "/manifest.json",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
  themeColor: "#09090B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className={`${inter.className} bg-black min-h-screen flex justify-center items-center overflow-hidden`}>
        {/* Frame Desktop/Mobile */}
        <div className="w-full sm:max-w-[420px] bg-background h-[100dvh] sm:h-[95vh] sm:rounded-[32px] shadow-2xl relative flex flex-col border border-border overflow-hidden ring-1 ring-white/10">
          {children}
        </div>
      </body>
    </html>
  );
}
