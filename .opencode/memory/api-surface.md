# API Surface
<!-- last-updated: 2026-07-11 -->
<!-- fingerprint: sha256:initial -->

## Status: NO API ROUTES IMPLEMENTED YET

All data currently comes from mock files in `data/`. The API will be built in Phases 2-3.

## Planned Endpoints

### Problems
| Endpoint | Method | Auth | Status |
|---|---|---|---|
| `/api/problems` | GET | Public | To build (Phase 3) |
| `/api/problems` | POST | Admin | To build (Phase 5) |
| `/api/problems/[id]` | GET | Public | To build (Phase 3) |
| `/api/problems/[id]/comments` | GET | Public | To build (Phase 3) |
| `/api/problems/[id]/comments` | POST | Authenticated | To build (Phase 3) |
| `/api/problems/[id]/interest` | POST | Authenticated | To build (Phase 3) |

### Comments
| Endpoint | Method | Auth | Status |
|---|---|---|---|
| `/api/comments/[id]/flag` | POST | Authenticated | To build (Phase 3) |
| `/api/comments/[id]` | PATCH | Owner | To build |

### Solution Spaces
| Endpoint | Method | Auth | Status |
|---|---|---|---|
| `/api/solution-spaces` | GET | Public | To build (Phase 3) |
| `/api/solution-spaces` | POST | Auth + profile complete | To build (Phase 3) |
| `/api/solution-spaces/[id]` | GET | Public | To build (Phase 3) |
| `/api/solution-spaces/[id]` | PATCH | Owner | To build (Phase 3) |
| `/api/solution-spaces/[id]/artifacts` | POST | Owner | To build (Phase 3) |

### Artifacts
| Endpoint | Method | Auth | Status |
|---|---|---|---|
| `/api/artifacts/[id]` | DELETE | Owner | To build (Phase 3) |

### Users
| Endpoint | Method | Auth | Status |
|---|---|---|---|
| `/api/users/[id]` | GET | Public | To build (Phase 3) |
| `/api/users/me` | PATCH | Authenticated | To build (Phase 2) |

### Admin
| Endpoint | Method | Auth | Status |
|---|---|---|---|
| `/api/admin/problems/[id]` | PATCH | Admin | To build (Phase 5) |
| `/api/admin/comments/[id]` | DELETE | Admin | To build (Phase 5) |

### Search
| Endpoint | Method | Auth | Status |
|---|---|---|---|
| `/api/search` | GET | Public | To build (Phase 4) |

## Response Envelope
```typescript
// Success
{ "data": { ... } }

// Validation error (422)
{ "error": { "code": "VALIDATION_ERROR", "message": "...", "fields": [...] } }

// Auth error (401/403)
{ "error": { "code": "UNAUTHORIZED" | "FORBIDDEN", "message": "..." } }

// Server error (500)
{ "error": { "code": "INTERNAL_ERROR", "message": "..." } }
```
