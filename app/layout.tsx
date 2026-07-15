import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Instaldeck SaaS",
  description: "Construction project management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50">
        <nav className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="font-bold text-xl text-gray-900">
                  Instaldeck
                </Link>
              </div>
              <div className="flex items-center gap-8">
                <Link
                  href="/modules/obras"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Obras
                </Link>
                <Link
                  href="/modules/clientes"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Clientes
                </Link>
                <Link
                  href="/modules/trabajadores"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Trabajadores
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
