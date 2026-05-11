import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import FallingPetals from "@/components/FallingPetals";
import DecorativeFlowers from "@/components/DecorativeFlowers";
import FirebaseProvider from "@/components/FirebaseProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Tiệm Hoa Phúc Linh | Blooms to Brighten Your Day",
  description: "Bó hoa tươi nghệ thuật và quà tặng hoa sang trọng tại Tiệm Hoa Phúc Linh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${cormorant.variable} antialiased font-sans bg-[#FBF9F6] text-[#2D2926] relative`}
      >
        <div className="fixed inset-0 floral-pattern pointer-events-none z-0" />
        <FallingPetals />
        <DecorativeFlowers />
        <FirebaseProvider>
          <div className="relative z-10">
            {children}
          </div>
        </FirebaseProvider>
      </body>
    </html>
  );
}
