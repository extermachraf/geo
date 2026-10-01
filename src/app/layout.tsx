import type { Metadata, Viewport } from "next";
import { Cardo, Montserrat } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";

// Self-hosted at build time by next/font. Montserrat carries structure; Cardo keeps reading passages lighter.
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
const cardo = Cardo({
  subsets: ["latin"],
  variable: "--font-cardo",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Geotehnika — Fondations spéciales, forage et injection au Maroc",
  description:
    "Geotehnika SARL : fondations spéciales, injection, clouage et génie civil. Depuis 1992 à Casablanca, Maroc.",
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${cardo.variable}`}>
      <body className="bg-bg text-grey">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
