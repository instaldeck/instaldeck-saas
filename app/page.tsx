import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Panel de Control
          </h1>
          <p className="text-xl text-gray-600">
            Gestiona tus obras, clientes y trabajadores en un solo lugar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link
            href="/modules/obras"
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-8"
          >
            <div className="text-4xl mb-4">🏗️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Obras</h2>
            <p className="text-gray-600">
              Crea y gestiona tus proyectos de construcción
            </p>
          </Link>

          <Link
            href="/modules/clientes"
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-8"
          >
            <div className="text-4xl mb-4">👥</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Clientes</h2>
            <p className="text-gray-600">
              Administra la información de tus clientes
            </p>
          </Link>

          <Link
            href="/modules/trabajadores"
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-8"
          >
            <div className="text-4xl mb-4">👷</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Trabajadores</h2>
            <p className="text-gray-600">
              Gestiona tu equipo de trabajo
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
