# Instaldeck SaaS

Control completo empresa: organización, finanzas, RRHH, automatizaciones. Holded-style SaaS construido en Next.js + Supabase.

## Fase 0: Estructura base ✓

- Next.js 16+ (TypeScript + Tailwind CSS)
- Supabase (Postgres, Auth, Storage) — *proyecto nuevo, independiente del ERP actual*
- Netlify deploy
- RLS (Row Level Security) desde primera tabla
- Variables de entorno: secrets en servidor, `NEXT_PUBLIC_*` en cliente solo

## Estructura módulos

```
app/modules/
  ├── obras/           # Proyectos/obras
  ├── clientes/        # Base de clientes
  ├── trabajadores/    # Plantilla + PRL
  ├── flota/          # Vehículos
  ├── herramientas/   # Inventario herramientas
  ├── nominas/        # Nóminas + finiquitos
  ├── facturas/       # Facturación compra/venta
  └── presupuestos/   # Presupuestos
```

## Setup local

```bash
npm install
cp .env.example .env.local
# Edita .env.local con credenciales Supabase cuando estén listas
npm run dev
```

Servidor en http://localhost:3000

## Seguridad (no negociable)

✓ Ningún secret en código  
✓ `.env.local` git-ignored  
✓ Endpoint `.env.example` template  
✓ API keys en servidor (Next.js `/api` routes)  
✓ Estructura RLS-ready en Supabase  

## Próximos pasos

1. Crear proyecto Supabase (nueva DB, independiente)
2. Crear site Netlify (nuevo, URL propia)
3. Conectar env vars en .env.local
4. Fase 1: Núcleo operativo (obras, clientes, trabajadores)
