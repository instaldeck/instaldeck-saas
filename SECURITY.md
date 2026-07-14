# Security Policy

## Core Principles

1. **No secrets in code** — all env vars, API keys, credentials in `.env.local` (git-ignored)
2. **Server-side secrets only** — `NEXT_PUBLIC_*` safe in browser, everything else server-only
3. **RLS (Row Level Security) enabled** — on all Supabase tables from day 1
4. **Role-based access control** — users see only their data
5. **HTTPS always** — Netlify enforces HTTPS, no HTTP fallback

## Environment Variables

### Public (safe in browser)
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anonymous key (limited permissions)
- `NEXT_PUBLIC_APP_ENV` — environment name (dev/staging/prod)

### Private (server-only, never browser)
- `SUPABASE_SERVICE_KEY` — admin key (for API routes only)
- `SUPABASE_JWT_SECRET` — JWT secret (Supabase dashboard)
- `ANTHROPIC_API_KEY` — Claude API key (routes/anthropic-proxy)

**Never use private env vars in client components.**

## Supabase RLS

Every table must have RLS enabled:

```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- Example: users see only their own data
CREATE POLICY "users_view_own"
  ON table_name
  FOR SELECT
  USING (auth.uid() = user_id);

-- Example: only admin can update
CREATE POLICY "admin_update"
  ON table_name
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );
```

## API Security

### Authentication
- Supabase Auth for user login (session tokens)
- Middleware validates JWT before accessing protected routes

### Rate Limiting
- TBD: Implement on Netlify

### CORS
- Supabase handles CORS by origin
- Configure allowed origins in Supabase dashboard

### Headers
- `X-Content-Type-Options: nosniff` — prevent MIME sniffing
- `X-Frame-Options: DENY` — prevent clickjacking
- `X-XSS-Protection: 1; mode=block` — XSS protection

## Database Security

### Connection
- Supabase uses encrypted connections (SSL/TLS)
- Use service key (`SUPABASE_SERVICE_KEY`) in API routes, not anon key

### Backups
- Supabase auto-backups (check dashboard)
- Never store backups unencrypted locally

### Sensitive Data
- PII (names, emails) encrypted at rest
- Financial data (salaries) role-restricted (HR only)
- No plaintext passwords anywhere

## Git Security

### Committed (safe)
- `.env.example` — template only
- `.gitignore` — rules to block secrets
- Source code (no API keys)

### Git-ignored (NEVER commit)
- `.env.local` — actual secrets
- `.env.production.local`
- Any file matching `*.key`, `*.pem`, `credentials.json`

Check before pushing:
```bash
git diff --cached | grep -E 'SUPABASE_|ANTHROPIC_|sk-'
```

## Deployment Security

### Netlify
- Secrets in Netlify dashboard (not in code)
- Branch deployments for preview URLs
- Automatic HTTPS, no custom domains without verification

### Supabase
- Row Level Security verified before merging
- Service key rotated annually
- Monitor activity log for suspicious queries

## Incident Response

1. **Suspected leaked secret?**
   - Rotate key in Supabase dashboard immediately
   - Update Netlify env vars
   - Redeploy site
   - Check git history: `git log -p --all | grep -i 'api_key'`

2. **Unauthorized data access?**
   - Check Supabase logs
   - Verify RLS policies
   - Audit user roles and permissions

3. **Database compromised?**
   - Restore from backup (Supabase provides)
   - Rotate all credentials
   - Notify users if PII affected

## Regular Audits

- Weekly: Review npm vulnerabilities (`npm audit`)
- Monthly: Audit Supabase logs for unusual queries
- Quarterly: Penetration test (security specialist)
- Annually: Rotate service keys and secrets

## Dependencies

Keep dependencies updated:
```bash
npm outdated
npm update
npm audit fix
```

Remove unused packages regularly to reduce attack surface.

## Compliance

- GDPR: Users can request/delete their data (Supabase supports)
- Spain DPA: Data stored in Supabase EU region
- PRL (Worker safety): Data encrypted at rest
