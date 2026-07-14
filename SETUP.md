# Setup Guide: Connecting GitHub, Supabase, Netlify

Proyecto listo para conectar. Fases:

## 1. GitHub (45 min)

### Create empty repo
- Go to https://github.com/new
- Name: `instaldeck-saas`
- Description: "Instaldeck SaaS — Next.js + Supabase"
- Public (optional, but recommended for security review)
- **Do NOT** initialize with README (we have one)
- Click **Create repository**

### Push local repo
```bash
cd ~/Desktop/instaldeck-saas
git remote add origin https://github.com/YOUR_USERNAME/instaldeck-saas.git
git branch -M main
git push -u origin main
```

Check: https://github.com/YOUR_USERNAME/instaldeck-saas — should see code

---

## 2. Supabase (1 hour)

### Create project
- Go to https://supabase.com
- Click **New Project**
- Name: `instaldeck-prod`
- Database password: Generate strong one, save in password manager
- Region: **Europe (Ireland)** → GDPR compliant
- Click **Create new project**

Wait ~2 min for project to initialize.

### Get credentials
When ready, go to **Settings** → **API**:
- Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL` en `.env.local`
- Copy `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY` en `.env.local`
- Copy `service_role secret` → `SUPABASE_SERVICE_KEY` en `.env.local`
- Go to **Settings** → **Auth** → JWT Secret:
  - Copy value → `SUPABASE_JWT_SECRET` en `.env.local`

### Test connection locally
```bash
# Edit .env.local with actual values
npm run dev

# In browser: http://localhost:3000/api/health
# Should return: { status: 'ok', timestamp: '...', environment: 'development' }
```

If works: commit keys en `.env.local` are correct ✓

---

## 3. Netlify (30 min)

### Create site
- Go to https://app.netlify.com
- Click **Add new site** → **Import an existing project**
- Connect GitHub (authorize if first time)
- Select repository: `instaldeck-saas`
- Build settings:
  - Build command: `npm run build` (already set)
  - Publish directory: `.next`
  - Click **Deploy site**

Wait ~3 min for first deploy. If success → site URL auto-generated (e.g., `happy-tree-abc123.netlify.app`)

### Add environment variables
In Netlify dashboard → **Site settings** → **Build & deploy** → **Environment**:
- Add each variable from `.env.example`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_KEY` (production only)
  - `SUPABASE_JWT_SECRET` (production only)
  - `ANTHROPIC_API_KEY` (when needed)
  - `NEXT_PUBLIC_APP_ENV=production`

**Never put secrets in code. Netlify will use values from dashboard.**

### Domain (optional)
- Netlify gives free `.netlify.app` domain
- To use custom domain (instaldeck.app):
  - Update domain registrar nameservers (Netlify shows how)
  - Or add DNS records manually

### Auto-deploy
- Branch `main` → auto-deploys to production
- Branch `dev` or PRs → preview URLs (test before merge)

---

## 4. Verify Everything

### Local dev
```bash
npm run dev
# Visit http://localhost:3000
# Check API: curl http://localhost:3000/api/health
```

### Netlify production
- Visit deployed URL
- Check API: `curl https://[your-netlify-url]/api/health`
- Both should return health status

### GitHub Actions (optional)
When ready, can add CI/CD:
- `.github/workflows/test.yml` for lint + build on PR
- Will trigger on push to any branch

---

## 5. Next Steps

Once verified:
1. Delete `.env.local` locally (or leave empty as template)
2. Add to CLAUDE.md: current deployed URLs (Supabase, Netlify)
3. Start **Fase 1: Núcleo operativo** (obras, clientes, trabajadores)

## Troubleshooting

**Netlify deploy fails:**
- Check build logs: **Netlify dashboard** → **Deploys** → click failed deploy
- Most common: missing env var. Add to Netlify dashboard, redeploy

**Can't connect to Supabase:**
- Verify `.env.local` has exact values (no extra spaces)
- Check URL includes `https://`
- Check ANON_KEY starts with `eyJ...` (JWT format)

**CORS error in browser:**
- Supabase → **Settings** → **API** → check CORS origins
- Local: allow `http://localhost:3000`
- Production: allow `https://[netlify-url]`

**Got leak of secret in GitHub?**
- Rotate keys immediately in Supabase dashboard
- Force-push to remove from history: `git push --force-with-lease`
- Delete from GitHub: Settings → Code security → remove commit
