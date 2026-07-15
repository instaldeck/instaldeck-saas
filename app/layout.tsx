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
  title: "Instaldeck",
  description: "Gestión de obras, clientes y trabajadores",
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
      <body className="min-h-full flex flex-col" style={{ backgroundColor: 'var(--gray-50)' }}>
        <nav className="border-b" style={{ backgroundColor: 'var(--navy-dark)', borderColor: 'var(--navy)' }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link href="/" className="font-bold text-2xl" style={{ color: 'var(--royal-blue-light)' }}>
                Instaldeck
              </Link>
              <div className="flex items-center gap-8">
                <Link
                  href="/modules/obras"
                  className="font-medium transition-colors hover:text-royal-blue-light"
                  style={{ color: 'var(--gray-200)' }}
                >
                  Obras
                </Link>
                <Link
                  href="/modules/clientes"
                  className="font-medium transition-colors hover:text-royal-blue-light"
                  style={{ color: 'var(--gray-200)' }}
                >
                  Clientes
                </Link>
                <Link
                  href="/modules/trabajadores"
                  className="font-medium transition-colors hover:text-royal-blue-light"
                  style={{ color: 'var(--gray-200)' }}
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
