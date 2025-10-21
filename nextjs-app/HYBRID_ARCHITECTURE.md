# Twidilers Hybrid Architecture

## Overview

This project uses a **hybrid architecture** where:
- **Next.js** handles the frontend (UI rendering, routing, components)
- **Flask** handles the backend (API, authentication, database, business logic)

This approach allows us to modernize the user interface without rewriting the entire backend.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Next.js Frontend (Port 3000)               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Pages (React Components)                            │   │
│  │  - Home, About, Login, Feed, Profile, Settings      │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  API Proxy (next.config.ts)                          │   │
│  │  /api/* → http://localhost:5000/api/*               │   │
│  │  /login → http://localhost:5000/login               │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Flask Backend (Port 5000)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  API Routes                                           │   │
│  │  - /api/feed/*, /api/user/*, /api/post/*           │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Authentication                                       │   │
│  │  - /login, /logout, /signup                         │   │
│  │  - Session management (Flask sessions)               │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Database (PostgreSQL via SQLAlchemy)                │   │
│  │  - Accounts, Posts, Likes, Follows                   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Responsibilities

### Next.js (Frontend)

**Handles**:
- Page rendering and routing
- UI components (Navbar, Cards, Forms)
- Client-side state management
- Static assets (CSS, images)
- Client-side validation

**Does NOT handle**:
- Database queries
- Authentication logic
- Session storage
- Business logic
- Email sending

### Flask (Backend)

**Handles**:
- All API endpoints
- Authentication and authorization
- Session management
- Database operations (CRUD)
- Business logic
- Email functionality
- OAuth2 integration
- File uploads

**Does NOT handle**:
- Page rendering (that's Next.js)
- UI components
- Client-side routing

## Request Flow Examples

### Example 1: Viewing the Feed

1. User navigates to `http://localhost:3000/feed`
2. Next.js serves the Feed page (React component)
3. Feed component runs: `fetch('/api/feed/all/1')`
4. Next.js proxy redirects to: `http://localhost:5000/api/feed/all/1`
5. Flask API processes request:
   - Checks session for authentication
   - Queries database for posts
   - Returns JSON response
6. Next.js receives JSON
7. React component renders posts

### Example 2: Logging In

1. User visits `http://localhost:3000/login`
2. Next.js serves Login page (React form)
3. User submits form to `/login` (POST)
4. Next.js proxy redirects to: `http://localhost:5000/login`
5. Flask processes login:
   - Validates credentials
   - Sets session cookie
   - Redirects to `/feed`
6. Browser follows redirect to Next.js `/feed`
7. Feed page loads (now authenticated)

### Example 3: Creating a Post

1. User on feed page clicks "Create Post"
2. Next.js navigates to `/post`
3. User fills form and submits
4. Form POSTs to `/api/post`
5. Next.js proxy → Flask `/api/post`
6. Flask:
   - Validates session
   - Validates post content
   - Saves to database
   - Returns success JSON
7. Next.js redirects to feed
8. Feed fetches updated posts from Flask

## API Proxy Configuration

In `next.config.ts`:

```typescript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: process.env.FLASK_API_URL + '/api/:path*',
    },
    {
      source: '/login',
      destination: process.env.FLASK_API_URL + '/login',
    },
    // ... more routes
  ];
}
```

This makes Flask API calls seamless from Next.js.

## Session Handling

### How It Works

1. User logs in via Flask
2. Flask sets session cookie in response
3. Browser stores cookie
4. All subsequent requests include cookie
5. Next.js passes cookie through to Flask
6. Flask validates session from cookie

### Important Notes

- Sessions are stored by Flask (not Next.js)
- Next.js is stateless - just passes cookies
- Cookie must be accessible to both servers (same domain or CORS)

## Development Setup

### Terminal 1: Start Flask

```bash
cd /home/runner/work/twidilers/twidilers
docker compose up
# OR
python -m flask --app 'twidilers:create_app()' run
```

Flask runs on: http://localhost:5000

### Terminal 2: Start Next.js

```bash
cd nextjs-app
npm install
npm run dev
```

Next.js runs on: http://localhost:3000

### Access the App

Visit: http://localhost:3000

All pages served by Next.js, all API calls go to Flask.

## Production Deployment

### Option 1: Same Domain with Reverse Proxy

Use nginx or Caddy:

```nginx
server {
    listen 80;
    server_name twidilers.com;

    # Next.js frontend
    location / {
        proxy_pass http://localhost:3000;
    }

    # Flask backend
    location /api {
        proxy_pass http://localhost:5000;
    }

    location /login {
        proxy_pass http://localhost:5000;
    }

    location /logout {
        proxy_pass http://localhost:5000;
    }
}
```

### Option 2: Separate Domains

- Flask: `api.twidilers.com`
- Next.js: `twidilers.com`

Set environment variable:
```
FLASK_API_URL=https://api.twidilers.com
```

Configure CORS on Flask to allow Next.js domain.

## Benefits of This Approach

### ✅ Advantages

1. **No Backend Rewrite**: Flask code stays exactly as-is
2. **Modern UI**: React components, TypeScript, better DX
3. **Independent Scaling**: Can scale frontend and backend separately
4. **Gradual Migration**: Can move pages one at a time
5. **Lower Risk**: Backend remains stable and tested
6. **Faster Development**: Only need to create UI components

### ⚠️ Trade-offs

1. **Two Servers**: More complex development setup
2. **Deployment Coordination**: Need to deploy both apps
3. **Session Management**: Need careful cookie handling
4. **Network Overhead**: Extra hop for API calls (minimal)

## When to Use This Architecture

### ✅ Good Fit

- Want modern frontend without backend rewrite
- Backend is stable and well-tested
- Team has separate frontend/backend developers
- Need to modernize UI quickly

### ❌ Not a Good Fit

- Want full-stack framework benefits (like server components)
- Backend needs major refactoring anyway
- Deployment infrastructure can't handle two apps
- Team prefers monolithic architecture

## Comparison with Full Next.js Rewrite

| Aspect | Hybrid (Current) | Full Next.js |
|--------|------------------|--------------|
| Backend | Flask (unchanged) | Next.js API routes |
| Database | SQLAlchemy | Prisma/SQLAlchemy |
| Sessions | Flask sessions | NextAuth/iron-session |
| Development | 2 servers | 1 server |
| Deployment | 2 apps | 1 app |
| Development Time | Faster (UI only) | Slower (rewrite all) |
| Risk | Lower (backend stable) | Higher (full rewrite) |
| Type Safety | Frontend only | Full-stack |

## Future Considerations

### Potential Evolution

1. **Stay Hybrid**: Keep this architecture long-term
2. **Gradual Migration**: Move API routes to Next.js over time
3. **BFF Pattern**: Next.js acts as Backend-for-Frontend
4. **Full Migration**: Eventually move everything to Next.js

The current architecture supports all these paths.

## Testing Strategy

### Frontend Tests
- Component tests (React Testing Library)
- E2E tests (Playwright)
- Test against mock API or real Flask backend

### Integration Tests
- Test Next.js ↔ Flask communication
- Test session handling
- Test form submissions

### Backend Tests
- Flask tests remain unchanged
- Test API endpoints independently
- Existing test suite still valid

## FAQ

**Q: Why not use Next.js API routes?**  
A: To avoid rewriting all backend logic. Flask backend is stable and tested.

**Q: Can I use server components?**  
A: Yes, but they can't directly query the database. They must fetch from Flask API.

**Q: How do I add a new page?**  
A: Create a new directory in `app/` with a `page.tsx`. Fetch data from Flask API as needed.

**Q: How do I add a new API endpoint?**  
A: Add it to Flask (not Next.js). Next.js proxy will automatically route to it.

**Q: What about WebSockets/real-time features?**  
A: Implement in Flask (e.g., Socket.IO). Next.js can connect as a client.

**Q: Can both apps share the same database?**  
A: Yes, Flask already manages the database. Next.js doesn't touch it.

## Conclusion

This hybrid architecture provides a pragmatic path to modernizing Twidilers' frontend while preserving the stable Flask backend. It balances developer experience, deployment complexity, and development speed.
