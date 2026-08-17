# ZERO Control Room setup

The `/zero-control` route is intentionally not linked from the public portfolio and is marked `noindex`, but security does not rely on the URL being secret.

Access requires:

1. a valid Supabase Auth email/password account
2. `app_metadata.role = "zero_admin"`
3. the existing RLS policies from the ZERO telemetry migration

## Portfolio environment variables

Add these to the portfolio deployment, not the Python backend:

```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
ZERO_BACKEND_API_URL=https://YOUR_ZERO_BACKEND.example.com
ZERO_BACKEND_ADMIN_KEY=generate-a-separate-long-random-secret
```

The publishable key is safe for application use. The privileged `sb_secret_...` / service-role key must NOT be added to the portfolio deployment.
`ZERO_BACKEND_ADMIN_KEY` is server-only and must match `ZERO_ADMIN_API_KEY` on the Python backend. Never prefix it with `NEXT_PUBLIC_`.

## Create the admin user

In Supabase Dashboard:

- Authentication → Users → Add user
- create your email/password account

Then run this once in SQL Editor, replacing the email:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
  || '{"role":"zero_admin"}'::jsonb
where email = 'YOUR_ADMIN_EMAIL';
```

Verify it with:

```sql
select email, raw_app_meta_data
from auth.users
where email = 'YOUR_ADMIN_EMAIL';
```

You should see `"role": "zero_admin"`.

## Security model

- credentials are sent only to the portfolio's server-side route handler
- access and refresh tokens are stored in HttpOnly, Secure (production), SameSite=Strict cookies scoped to `/zero-control`
- every data request verifies the Supabase user and checks `app_metadata.role`
- database reads use the authenticated user's token, so the existing Supabase RLS policies remain the final authorization boundary
- destructive chat deletion is proxied to the Python backend only after the Control Room session is verified
- unauthenticated or non-admin accounts cannot read telemetry
- the route is marked `noindex`, but obscurity is not treated as authorization

## Dashboard data

The initial dashboard shows:

- session count and active sessions
- messages today
- average response latency
- provider usage
- provider failures / stream interruptions
- recent sessions
- conversation transcripts
- event stream
- captured leads

## Session refresh

The dashboard keeps the access token in an HttpOnly cookie and automatically refreshes it using the refresh token when needed.
