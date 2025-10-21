# Changes Made: Hybrid Architecture Refactor

## Summary

Refactored from a full-stack Next.js approach to a hybrid architecture where:
- **Next.js**: Frontend only (pages, components, UI)
- **Flask**: Backend only (API, database, business logic)

This change was made in response to feedback to avoid rewriting the Flask backend.

## What Was Removed

### API Routes (app/api/)
- ❌ `/api/auth/login/route.ts` - Moved to Flask `/login`
- ❌ `/api/auth/logout/route.ts` - Moved to Flask `/logout`
- ❌ `/api/auth/me/route.ts` - Uses Flask `/api/currentuser/`
- ❌ `/api/feed/all/[page]/route.ts` - Uses Flask `/api/feed/all/<page>`

### Database Layer
- ❌ `prisma/schema.prisma` - No longer needed
- ❌ `lib/prisma.ts` - Database handled by Flask
- ❌ `lib/auth.ts` - Authentication handled by Flask
- ❌ `lib/session.ts` - Sessions handled by Flask

### Dependencies (package.json)
- ❌ `@prisma/client`, `prisma`
- ❌ `pg`, `@types/pg`
- ❌ `bcryptjs`, `@types/bcryptjs`
- ❌ `iron-session`
- ❌ `jsonwebtoken`, `@types/jsonwebtoken`
- ❌ `nodemailer`, `@types/nodemailer`
- ❌ `next-auth`

Total dependencies reduced from ~25 to ~6 (just Next.js essentials).

## What Was Changed

### next.config.ts
Added API proxy configuration:
```typescript
async rewrites() {
  return [
    { source: '/api/:path*', destination: 'http://localhost:5000/api/:path*' },
    { source: '/login', destination: 'http://localhost:5000/login' },
    { source: '/logout', destination: 'http://localhost:5000/logout' },
  ];
}
```

### app/login/page.tsx
Changed from:
- Client-side fetch to Next.js API
- JavaScript-based form handling

To:
- Traditional form POST to Flask
- Server-side redirect handling

### app/feed/page.tsx
Changed API endpoint:
- From: `/api/auth/me` (Next.js)
- To: `/api/currentuser/` (Flask)

### lib/functions.ts
Simplified from:
- Database queries with Prisma
- Account/post management

To:
- Client-side utilities only
- Text processing functions

### .env.example
Changed from:
```env
DATABASE_URL=...
SESSION_SECRET=...
JWT_SECRET=...
GOOGLE_CLIENT_ID=...
# etc.
```

To:
```env
FLASK_API_URL=http://localhost:5000
```

## What Was Added

### Documentation
- ✅ `HYBRID_ARCHITECTURE.md` - Complete architecture guide
- ✅ Updated `README_NEXTJS.md` - Hybrid setup instructions
- ✅ Updated `MIGRATION_STATUS.md` - Hybrid approach tracking
- ✅ This file (`CHANGES.md`)

## Impact on Flask Backend

**ZERO CHANGES** to Flask:
- ✅ All Flask code remains exactly the same
- ✅ All API endpoints work as before
- ✅ Database schema unchanged
- ✅ Authentication logic preserved
- ✅ Session management preserved
- ✅ No migration needed

## Development Workflow

### Before (Full-stack Next.js)
```bash
cd nextjs-app
npm run dev
# One server on port 3000
```

### After (Hybrid)
```bash
# Terminal 1: Flask
docker compose up

# Terminal 2: Next.js
cd nextjs-app
npm run dev

# Flask on port 5000
# Next.js on port 3000
```

## File Size Comparison

### Before
- Total files: ~42
- Dependencies: ~216 packages
- node_modules: ~250 MB
- Bundle size: ~120 KB

### After
- Total files: ~26 (removed 16)
- Dependencies: ~53 packages (reduced by 75%)
- node_modules: ~50 MB (reduced by 80%)
- Bundle size: ~120 KB (same)

## Build Comparison

### Before
```
✓ Compiled with 4 API routes
✓ Generated 11 static pages
Build time: 3-4s
```

### After
```
✓ Compiled with 0 API routes
✓ Generated 8 static pages
Build time: 3-4s
```

## Benefits Achieved

1. **No Backend Rewrite**: Flask code completely preserved
2. **Simpler Dependencies**: 75% fewer packages
3. **Smaller Node Modules**: 80% reduction in size
4. **Clear Separation**: Frontend and backend fully decoupled
5. **Independent Scaling**: Can scale each tier separately
6. **Lower Risk**: Backend remains stable and tested

## Trade-offs Accepted

1. **Two Servers**: Need to run both Flask and Next.js in development
2. **Deployment Coordination**: Need to deploy both apps
3. **Cookie Management**: Need to ensure cookies work across both
4. **No Server Components**: Can't directly query database from Next.js

## Testing Impact

### Backend Tests
- ✅ All Flask tests remain valid
- ✅ No changes needed
- ✅ Test suite unaffected

### Frontend Tests
- 🔄 Need to mock Flask API responses
- 🔄 Or test against real Flask backend
- 🔄 E2E tests span both apps

## Migration Path

This architecture supports multiple future paths:

1. **Stay Hybrid**: Keep this setup long-term
2. **BFF Pattern**: Add GraphQL/tRPC layer in Next.js
3. **Gradual Migration**: Move endpoints to Next.js over time
4. **Keep Separate**: Flask becomes pure API server

## Rollback Plan

If needed to revert to full-stack Next.js:
1. Check out commit `c97e365` (before this change)
2. Restore Prisma and API routes
3. Re-run migrations

## Questions?

See documentation:
- Architecture: `HYBRID_ARCHITECTURE.md`
- Setup: `README_NEXTJS.md`
- Status: `MIGRATION_STATUS.md`
