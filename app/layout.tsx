import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import {
  IconLayoutDashboard,
  IconBriefcase,
  IconUsers,
  IconHammer
} from "@tabler/icons-react";
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
      <body className="min-h-full flex" style={{ backgroundColor: 'var(--gray-50)', fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        {/* Sidebar */}
        <aside
          className="w-60 flex-shrink-0 border-r flex flex-col overflow-y-auto"
          style={{
            backgroundColor: '#172033',
            borderColor: 'rgba(148,163,184,0.12)',
            boxShadow: '8px 0 28px rgba(15,23,42,0.08)'
          }}
        >
          {/* Logo */}
          <div
            className="px-4 py-5 border-b flex items-center gap-3"
            style={{ borderColor: 'rgba(148,163,184,0.14)', backgroundColor: '#1b263b' }}
          >
            <div
              className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'var(--royal-blue)' }}
            >
              <span className="text-white font-bold text-sm">ID</span>
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-white truncate">Instaldeck</div>
              <div className="text-xs text-gray-400">Gestión empresarial</div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            <NavItem
              href="/"
              icon={<IconLayoutDashboard size={20} />}
              label="Panel control"
              isActive={false}
            />
            <NavItem
              href="/modules/obras"
              icon={<IconBriefcase size={20} />}
              label="Obras"
              isActive={false}
            />
            <NavItem
              href="/modules/clientes"
              icon={<IconUsers size={20} />}
              label="Clientes"
              isActive={false}
            />
            <NavItem
              href="/modules/trabajadores"
              icon={<IconHammer size={20} />}
              label="Trabajadores"
              isActive={false}
            />
          </nav>

          {/* User Section */}
          <div
            className="px-3 py-4 border-t"
            style={{ borderColor: 'rgba(148,163,184,0.14)', backgroundColor: '#141c2d' }}
          >
            <div className="flex items-center gap-3 p-2 rounded-lg" style={{ backgroundColor: 'rgba(148,163,184,0.08)' }}>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: '#3348a6', color: 'white' }}
              >
                JG
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-white truncate">Julio G.</div>
                <div className="text-xs text-gray-400 truncate">Admin</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}

function NavItem({
  href,
  icon,
  label,
  isActive = false
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}) {
  return (
    <Link
      href={href}
      className="nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-sm font-medium"
      style={{
        color: isActive ? 'white' : '#c4cddd',
        backgroundColor: isActive ? '#27344c' : 'transparent',
        boxShadow: isActive ? 'inset 3px 0 0 #60a5fa' : 'none',
      }}
    >
      <span style={{
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '6px',
        backgroundColor: isActive ? 'rgba(96,165,250,0.16)' : 'rgba(148,163,184,0.08)',
        color: isActive ? '#7db5ff' : '#9eacc0'
      }}>
        {icon}
      </span>
      <span className="flex-1 truncate">{label}</span>
    </Link>
  );
}
