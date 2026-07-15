'use client';

import Link from "next/link";
import { IconBriefcase, IconUsers, IconHammer } from "@tabler/icons-react";

export default function Home() {
  const kpis = [
    { label: "Obras activas", value: 12, color: "#2563eb", trend: "+2 este mes" },
    { label: "Clientes", value: 48, color: "#16a34a", trend: "+5 nuevos" },
    { label: "Trabajadores", value: 23, color: "#d97706", trend: "Activos" },
    { label: "Ingresos", value: "€45,200", color: "#4f46e5", trend: "Este mes" },
  ];

  return (
    <div className="flex-1 flex flex-col" style={{ backgroundColor: 'var(--gray-50)' }}>
      {/* Header */}
      <div className="px-8 py-6 border-b" style={{ borderColor: '#e5e7eb', backgroundColor: 'white' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#0f172a' }}>
              Panel de Control
            </h1>
            <p className="text-sm mt-1" style={{ color: '#64748b' }}>
              Bienvenido a tu gestor de obras, clientes y trabajadores
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {kpis.map((kpi, idx) => (
            <div
              key={idx}
              className="rounded-lg border p-4 overflow-hidden"
              style={{
                backgroundColor: 'white',
                borderColor: '#dfe5ed',
                boxShadow: '0 4px 14px rgba(15,23,42,0.045)',
                borderTop: `3px solid ${kpi.color}`,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748b', letterSpacing: '0.35px' }}>
                  {kpi.label}
                </div>
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: `color-mix(in srgb,${kpi.color} 11%,white)`,
                    color: kpi.color,
                  }}
                >
                  <span style={{ fontSize: '14px' }}>📊</span>
                </div>
              </div>
              <div className="text-2xl font-bold" style={{ color: '#0f172a', marginBottom: '5px' }}>
                {kpi.value}
              </div>
              <div className="text-xs" style={{ color: '#64748b' }}>
                {kpi.trend}
              </div>
            </div>
          ))}
        </div>

        {/* Modules Grid */}
        <div>
          <h2 className="text-lg font-bold mb-4" style={{ color: '#0f172a' }}>
            Módulos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ModuleCard
              href="/modules/obras"
              title="Obras"
              desc="Gestión de proyectos y construcciones"
              count="12 activas"
              color="#2563eb"
              icon={<IconBriefcase size={24} />}
            />
            <ModuleCard
              href="/modules/clientes"
              title="Clientes"
              desc="Base de datos de clientes y contactos"
              count="48 clientes"
              color="#16a34a"
              icon={<IconUsers size={24} />}
            />
            <ModuleCard
              href="/modules/trabajadores"
              title="Trabajadores"
              desc="Gestión del equipo de trabajo"
              count="23 activos"
              color="#d97706"
              icon={<IconHammer size={24} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ModuleCard({
  href,
  title,
  desc,
  count,
  color,
  icon,
}: {
  href: string;
  title: string;
  desc: string;
  count: string;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg border p-6 transition-all duration-200 cursor-pointer group"
      style={{
        backgroundColor: 'white',
        borderColor: '#dfe5ed',
        boxShadow: '0 5px 18px rgba(15,23,42,0.055)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(79,70,229,0.12)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 5px 18px rgba(15,23,42,0.055)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: `color-mix(in srgb,${color} 11%,white)`,
            color: color,
          }}
        >
          {icon}
        </div>
        <div
          className="text-xs font-bold px-2 py-1 rounded-full"
          style={{
            backgroundColor: `color-mix(in srgb,${color} 15%,white)`,
            color: color,
          }}
        >
          {count}
        </div>
      </div>
      <h3 className="text-lg font-bold mb-1" style={{ color: '#0f172a' }}>
        {title}
      </h3>
      <p className="text-sm" style={{ color: '#64748b' }}>
        {desc}
      </p>
    </Link>
  );
}
