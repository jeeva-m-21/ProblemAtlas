# Dependencies
<!-- last-updated: 2026-07-11 -->
<!-- fingerprint: sha256:initial -->

## Core Dependencies

### Framework
| Package | Version | Purpose |
|---|---|---|
| next | 16.2.6 | React framework |
| react | 19.2.4 | UI library |
| react-dom | 19.2.4 | React DOM renderer |
| typescript | ^5 | Type safety |

### UI & Styling
| Package | Version | Purpose |
|---|---|---|
| tailwindcss | ^4 | Utility-first CSS |
| @tailwindcss/postcss | ^4 | Tailwind PostCSS integration |
| framer-motion | ^12.38 | Animations |
| lucide-react | ^1.14 | Icon library |
| tailwind-merge | latest | Class merging utility |
| radix-ui (various) | latest | Accessible UI primitives (via shadcn) |

### Auth
| Package | Version | Purpose |
|---|---|---|
| @clerk/nextjs | ^7.3.3 | Authentication (Clerk v5) |

### Database
| Package | Version | Purpose |
|---|---|---|
| drizzle-orm | ^0.45.2 | TypeScript ORM |
| drizzle-kit | ^0.31.10 | Schema management CLI |
| postgres | ^3.4.9 | PostgreSQL client (serverless pooling) |

### Validation
| Package | Version | Purpose |
|---|---|---|
| zod | ^4.4.3 | Schema validation |

### Dev Dependencies
| Package | Version | Purpose |
|---|---|---|
| eslint | ^9 | Linting |
| @eslint/eslintrc | latest | ESLint config |
| tsx | latest | TypeScript runner (for seed scripts) |

## Dependency Notes
- Clerk v5 uses `@clerk/nextjs` v7 — verify breaking changes from v6
- Drizzle ORM v0.45 — significant API changes from v0.43; use official docs
- Zod v4 — `z.object()` API unchanged but verify migration from v3
- Tailwind CSS v4 — breaking changes from v3; use `@tailwindcss/postcss` plugin
- Next.js 16 — breaking changes from 15; read `node_modules/next/dist/docs/`
