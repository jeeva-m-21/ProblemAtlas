# Environment Variables
<!-- last-updated: 2026-07-11 -->
<!-- fingerprint: sha256:initial -->

## Required Variables

### Database
| Variable | Purpose | Default | Required |
|---|---|---|---|
| DATABASE_URL | PostgreSQL connection string | — | Yes |

### Auth (Clerk)
| Variable | Purpose | Default | Required |
|---|---|---|---|
| NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY | Clerk frontend key | pk_test_xxx | Yes |
| CLERK_SECRET_KEY | Clerk backend secret | sk_test_xxx | Yes |
| ADMIN_CLERK_USER_ID | Single admin user ID | user_xxx | Yes (for admin) |

### Deployment
| Variable | Purpose | Default | Required |
|---|---|---|---|
| NEXT_PUBLIC_APP_URL | Public app URL | http://localhost:3000 | Yes (for callbacks) |

## Variable Usage in Code
- `DATABASE_URL` → `lib/db/index.ts` (PostgreSQL client connection)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` → ClerkProvider (layout.tsx)
- `CLERK_SECRET_KEY` → Clerk server-side (auth(), middleware)
- `ADMIN_CLERK_USER_ID` → `lib/auth/index.ts` (requireAdmin)
- `NEXT_PUBLIC_APP_URL` → Callback URLs, metadata

## Security Notes
- `NEXT_PUBLIC_` prefixed variables ARE exposed to the browser — never put secrets here
- `CLERK_SECRET_KEY` and `DATABASE_URL` must NEVER be prefixed with `NEXT_PUBLIC_`
- All secrets are in `.env.local` (gitignored, never committed)
