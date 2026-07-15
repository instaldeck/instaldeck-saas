import Link from "next/link";

export default function Home() {
  const modules = [
    {
      href: "/modules/obras",
      title: "Obras",
      desc: "Proyectos de construcción",
      icon: "🏗️",
    },
    {
      href: "/modules/clientes",
      title: "Clientes",
      desc: "Gestión de clientes",
      icon: "👥",
    },
    {
      href: "/modules/trabajadores",
      title: "Trabajadores",
      desc: "Equipo de trabajo",
      icon: "👷",
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--gray-50)' }}>
      <div className="max-w-6xl mx-auto py-20 px-6 sm:px-8">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold mb-4" style={{ color: 'var(--navy)' }}>
            Panel de Control
          </h1>
          <p className="text-xl" style={{ color: 'var(--gray-600)' }}>
            Gestiona obras, clientes y trabajadores en un solo lugar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Link
              key={module.href}
              href={module.href}
              className="card p-8 hover:shadow-lg cursor-pointer group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                {module.icon}
              </div>
              <h2
                className="text-2xl font-bold mb-2"
                style={{ color: 'var(--navy)' }}
              >
                {module.title}
              </h2>
              <p style={{ color: 'var(--gray-600)' }}>
                {module.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
