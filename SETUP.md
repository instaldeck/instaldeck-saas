# Setup Guide: GitHub → Supabase → Netlify

**IMPORTANTE:** Proyectos NUEVOS en cuentas existentes. ERP actual NO se toca.

---

## 1. GitHub — Crear repo nuevo (5 min)

Tu cuenta: https://github.com/YOUR_USERNAME

### Paso a paso:

1. **Ir a crear repo:**
   - Abre https://github.com/new
   - Click en avatar superior derecha → **Your repositories** → green **New**

2. **Llenar formulario:**
   - **Repository name:** `instaldeck-saas`
   - **Description:** `Instaldeck SaaS — Next.js + Supabase`
   - **Public** (no Private, para que puedas revisar código)
   - **Initialize this repository with:**
     - ❌ NO marcar "Add a README file" (ya tenemos)
     - ❌ NO marcar ".gitignore" (ya está)
     - ❌ NO marcar "Choose a license"

3. **Click verde "Create repository"**
   - Espera 2 seg
   - Ves página con "Quick setup — never used git?"

### Conectar código local a GitHub:

En terminal, en carpeta del proyecto:
```bash
cd ~/Desktop/instaldeck-saas

# Reemplaza YOUR_USERNAME con tu usuario GitHub
git remote add origin https://github.com/YOUR_USERNAME/instaldeck-saas.git

# Enviar código a GitHub
git branch -M main
git push -u origin main
```

### Verificar:
- Abre https://github.com/YOUR_USERNAME/instaldeck-saas
- Deberías ver carpetas: `app/`, `lib/`, `public/`, archivos `README.md`, etc.
- ✓ Si ves código → GitHub OK

---

## 2. Supabase — Crear proyecto nuevo (20 min)

Tu cuenta: https://app.supabase.com

**NOTA:** Será OTRO proyecto (distinto del ERP actual).

### Paso a paso:

1. **Abrir dashboard Supabase:**
   - Abre https://app.supabase.com
   - Login con tu email/password
   - Ves lista de proyectos actuales (incluyendo ERP)

2. **Crear proyecto nuevo:**
   - Click botón verde **"+ New project"**
   - O en sidebar izquierdo → **All projects** → **+ New project**

3. **Llenar formulario "Create a new project":**

   | Campo | Valor |
   |-------|-------|
   | **Project name** | `instaldeck-prod` |
   | **Database password** | Genera fuerte (20+ caracteres, mayúsculas, números, símbolos) |
   | **Region** | **Europe (Ireland)** ← importante GDPR |
   | **Pricing plan** | Free (suficiente para desarrollo) |

   - Guarda password en gestor (LastPass, 1Password, etc)

4. **Click "Create new project"**
   - Espera 2-3 minutos (Supabase crea DB)
   - Verás progreso: "Setting up your project..."
   - Cuando termine: ves dashboard con project

5. **Obtener credenciales (PASO CRÍTICO):**

   ### 5a. Project URL y Anon Key:
   - En sidebar izquierdo: **Settings** → **API**
   - Ves 3 cajas:
     - **Project URL** (ej: `https://xyzabc.supabase.co`)
     - **Project API keys**
       - **anon public** (larga, comienza con `eyJ...`)
       - **service_role secret** (larga, comienza con `eyJ...`)

   **Copia estos 3 valores en orden:**
   ```
   NEXT_PUBLIC_SUPABASE_URL = [Project URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY = [anon public]
   SUPABASE_SERVICE_KEY = [service_role secret]
   ```

   ### 5b. JWT Secret:
   - En sidebar: **Settings** → **API**
   - Scroll down → **JWT Secret**
   - Copia el string largo
   ```
   SUPABASE_JWT_SECRET = [JWT Secret]
   ```

6. **Editar `.env.local`:**
   - En VS Code o editor favorito
   - Abre: `~/Desktop/instaldeck-saas/.env.local`
   - Reemplaza vacíos con valores Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xyzabc.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGc...
   SUPABASE_SERVICE_KEY=eyJ0eXAiOiJKV1QiLCJhbGc...
   SUPABASE_JWT_SECRET=super-secret-from-settings...
   ANTHROPIC_API_KEY=
   NODE_ENV=development
   NEXT_PUBLIC_APP_ENV=development
   ```
   - **Guarda archivo** (Ctrl+S o Cmd+S)

### Verificar conexión local:

```bash
cd ~/Desktop/instaldeck-saas

# Inicia dev server
npm run dev

# En navegador: http://localhost:3000/api/health
# Deberías ver:
# { "status": "ok", "timestamp": "2026-07-14T...", "environment": "development" }
```

Si ves `ok` → Supabase conectado ✓

Si error `Cannot find module` → `npm install` primero

---

## 3. Netlify — Crear site nuevo (15 min)

Tu cuenta: https://app.netlify.com

**NOTA:** Será OTRO sitio (distinto del ERP actual).

### Paso a paso:

1. **Abrir Netlify:**
   - Abre https://app.netlify.com
   - Login con tu email/GitHub
   - Ves lista de sites (incluyendo ERP en Netlify)

2. **Crear sitio nuevo:**
   - Click botón **"Add new site"**
   - O en sidebar → **Sites** → botón arriba derecha

3. **Conectar GitHub:**
   - Ves 3 opciones: **Import an existing project**, **Connect a personal Git repository**, **Deploy manually**
   - Click **Import an existing project**
   - Click **GitHub**
   - Autoriza Netlify (si es primera vez)
   - Selecciona tu cuenta

4. **Seleccionar repo:**
   - Ves lista de repos
   - Busca / click en **instaldeck-saas** (el que acabas de pushear)

5. **Configurar build:**
   - Netlify auto-detecta Next.js
   - **Branch to deploy:** `main` (por defecto)
   - **Build command:** `npm run build` (ya correcto)
   - **Publish directory:** `.next` (ya correcto)
   - Scroll down → Click **Deploy site**

   Espera 3-5 minutos (Netlify hace build y deploy)

   Verás progreso:
   ```
   • Building...
   • Build complete
   • Deployed!
   ```

6. **URL auto-generada:**
   - Netlify asigna URL: `https://[random-name].netlify.app`
   - Ej: `https://happy-tree-abc123.netlify.app`
   - Guarda esta URL, la necesitas para CORS en Supabase

### Agregar variables de entorno:

En dashboard Netlify (sitio `instaldeck-saas`):

1. **Sidebar → Site settings**
2. **Build & deploy → Environment**
3. **Add environment variables**
   
   Agrega estas variables (una por una):

   | Variable | Valor | Dónde obtener |
   |----------|-------|---------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://xyzabc.supabase.co` | Supabase Settings → API |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ0eXAiOiJKV1QiLCJhbGc...` | Supabase Settings → API |
   | `SUPABASE_SERVICE_KEY` | `eyJ0eXAiOiJKV1QiLCJhbGc...` | Supabase Settings → API |
   | `SUPABASE_JWT_SECRET` | `super-secret...` | Supabase Settings → API |
   | `NEXT_PUBLIC_APP_ENV` | `production` | Fijo |
   | `ANTHROPIC_API_KEY` | `sk-ant-...` | Dejar vacío por ahora |

   Cada variable:
   - Click **New variable**
   - Poner nombre y valor
   - Click **Save**

4. **Click "Redeploy site"** (para aplicar env vars)
   - Netlify hace nuevo build con las variables
   - Espera deploy termine

### Auto-deploy configurado:

Ahora cada push a `main` en GitHub → Netlify auto-deploya.

**En rama `dev` o PRs:** Netlify genera preview URLs (test antes de merge a `main`).

### Verificar sitio:

- Abre URL generada: `https://[random-name].netlify.app`
- Verás página Next.js default
- Abre `/api/health`: `https://[random-name].netlify.app/api/health`
- Deberías ver: `{ "status": "ok", "timestamp": "...", "environment": "production" }`
- ✓ Si funciona → Netlify + Supabase conectados

### Configurar CORS en Supabase (importante):

Supabase debe permitir requests desde Netlify.

En **Supabase dashboard → Settings → API → CORS Allowed Origins:**
- Agrega: `https://[random-name].netlify.app`
- Click **Save**

Ejemplo:
```
https://happy-tree-abc123.netlify.app
```

### Domain personalizado (opcional):

Si quieres `instaldeck.app` en lugar de `.netlify.app`:
1. Compra dominio (ej: Namecheap, Google Domains)
2. En Netlify → **Site settings → Domain management**
3. Click **Add custom domain**
4. Sigue pasos (apunta nameservers a Netlify)
5. Espera ~24h para propagación DNS

---

## 4. Verificar todo funciona

### Test 1: Local (dev)
```bash
cd ~/Desktop/instaldeck-saas
npm run dev
```
- Abre http://localhost:3000
- Verás página Next.js default
- Abre http://localhost:3000/api/health
- Deberías ver: `{ "status": "ok", ... }`

### Test 2: Netlify (production)
- Abre tu URL: `https://[random-name].netlify.app`
- Verás página Next.js
- Abre `/api/health`: `https://[random-name].netlify.app/api/health`
- Deberías ver mismo JSON

### Test 3: GitHub Actions (opcional más adelante)
Cuando quieras CI/CD automático:
- Crea `.github/workflows/test.yml`
- Hace lint + build en cada push
- TBD por ahora

---

## 5. Checklist Final

Antes de empezar Fase 1, verifica:

- ✓ GitHub repo creado y código pusheado
- ✓ Supabase proyecto creado (Europe region)
- ✓ `.env.local` con 4 credenciales Supabase
- ✓ `npm run dev` funciona local → `/api/health` OK
- ✓ Netlify sitio creado y env vars agregadas
- ✓ `https://[netlify-url]` carga sin errores
- ✓ `/api/health` en Netlify retorna OK
- ✓ CORS en Supabase permite URL Netlify

Si todo ✓ → listo para Fase 1

---

## 6. Problemas comunes

### "Cannot find module" al hacer `npm run dev`
```bash
npm install
npm run dev
```

### `.env.local` vacío / valores incorrectos
- Verifica en Supabase dashboard: **Settings → API**
- Copia exacto (sin espacios antes/después)
- `NEXT_PUBLIC_SUPABASE_URL` debe empezar con `https://`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` debe empezar con `eyJ`

### Netlify deploy falla
- Abre Netlify dashboard → sitio → **Deploys**
- Click en deploy rojo → **Deploy log**
- Busca error (usualmente falta env var)
- Solución: agrega variable en Netlify dashboard, haz redeploy

### CORS error en browser console
```
Cross-Origin Request Blocked...
```
- Abre Supabase dashboard → **Settings → API → CORS Allowed Origins**
- Agrega tu URL Netlify: `https://[random-name].netlify.app`
- Click **Save**
- Recarga página navegador

### "API key is invalid"
- Verifica credenciales en `.env.local` / Netlify dashboard
- Si sospechas leak: rota keys en Supabase (**Settings → API → Regenerate**)

### Secreto leaked en GitHub accidentalmente
**ACCIÓN INMEDIATA:**
1. Rota en Supabase: **Settings → API → Regenerate** (crea claves nuevas)
2. Actualiza `.env.local` y Netlify dashboard con claves nuevas
3. En GitHub, borra commit histórico:
   ```bash
   git log --all --full-history -- ".env.local"  # Ver dónde está
   git filter-branch --tree-filter 'rm -f .env.local' -- --all
   git push --force-with-lease origin main
   ```
   (O contacta support GitHub si es crítico)

---

## Resumen cronológico

| Paso | Tiempo | Qué |
|------|--------|-----|
| 1. GitHub repo | 5 min | Crear repo, push código |
| 2. Supabase proyecto | 20 min | Crear, obtener credenciales |
| 3. Netlify sitio | 15 min | Conectar GitHub, agregar env vars |
| 4. Test local | 5 min | Verificar `/api/health` |
| 5. Test production | 5 min | Verificar en Netlify |
| **Total** | **~50 min** | **3 servicios conectados** |

Después: **Fase 1 — Núcleo operativo** (obras, clientes, trabajadores)
