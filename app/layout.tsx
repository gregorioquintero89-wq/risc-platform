import type { Metadata } from "next";
import { Manrope, Public_Sans } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const publicSans = Public_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "RISC — Red Inmobiliaria Solidaria Colombia",
  description:
    "Plataforma de coordinación de emergencia humanitaria y habitacional para el sector inmobiliario colombiano.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${manrope.variable} ${publicSans.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
