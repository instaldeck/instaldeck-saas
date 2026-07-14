# Development Guide

## Local Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` with:
- `NEXT_PUBLIC_SUPABASE_URL` — tu Supabase project URL (comienza con https://)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon key de Supabase
- `SUPABASE_SERVICE_KEY` — service key (solo para rutas API)
- `ANTHROPIC_API_KEY` — si usas Claude API

**Never commit .env.local — es git-ignored por seguridad.**

### 3. Start dev server
```bash
npm run dev
```

App en http://localhost:3000  
API en http://localhost:3000/api/

### 4. Type check
```bash
npx tsc --noEmit
```

## File Structure

```
├── app/
│   ├── modules/           # Módulos por funcionalidad
│   │   ├── obras/
│   │   ├── clientes/
│   │   ├── trabajadores/
│   │   └── ...
│   ├── api/               # Server routes (Next.js)
│   ├── components/        # UI components (reutilizables)
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home
│   ├── middleware.ts      # Auth middleware
│   └── globals.css        # Tailwind
├── lib/
│   ├── supabase/          # Supabase client + types
│   └── utils/             # Helper functions
├── public/                # Static files
├── .env.example           # Template (commiteado)
├── .env.local             # Secrets (git-ignored)
├── netlify.toml           # Deploy config
└── next.config.ts         # Next.js config
```

## Branching Strategy

- `main` — stable, production-ready
- `dev` — active development (crear features aquí)

Crear feature:
```bash
git checkout -b feature/module-name
```

Cuando esté listo: PR a `dev` → merge → test en dev → PR a `main`

## Testing

Unit tests + E2E tests TBD (cuando haya lógica).

## Security Checklist

Before committing:
- ✓ No `.env.local` ni `.env.*` (solo `.env.example`)
- ✓ No API keys ni secrets en código
- ✓ TypeScript tipos OK (`npm run build`)
- ✓ No console.log de datos sensibles

## Build & Deploy

### Local build
```bash
npm run build
npm run start
```

### Netlify deploy
Branch `main` → auto-deploys a Netlify (cuando esté conectado).

Deploy preview: cada PR genera preview URL.

## Common Tasks

### Add new module
1. Create `app/modules/module-name/`
2. Add types en `lib/supabase/types.ts`
3. Create API routes: `app/api/module-name/...`
4. Create components: `app/modules/module-name/components/`

### Add Supabase table
1. Create migration (cuando haya setup Supabase)
2. Add types en `lib/supabase/types.ts`
3. Enable RLS en tabla
4. Create API endpoint para read/write

### Debug
```bash
# Check env vars
echo $NEXT_PUBLIC_SUPABASE_URL

# Browser console en http://localhost:3000
# Network tab para ver requests

# Server logs en terminal donde corre `npm run dev`
```

## Troubleshooting

**"Cannot find module '@supabase/ssr'"**
→ `npm install`

**"NEXT_PUBLIC_SUPABASE_URL is undefined"**
→ Check `.env.local` existe y tiene valores (no estar vacía)

**Type errors en TypeScript**
→ `npm run build` muestra errores completos

**Port 3000 en uso**
→ `npm run dev -- -p 3001`
