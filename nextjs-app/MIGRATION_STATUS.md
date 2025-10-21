# Twidilers Next.js Frontend - Status

## Overview

This document tracks the progress of creating a Next.js frontend for Twidilers while keeping the Flask backend for all API logic.

## Architecture

**Hybrid Approach**:
- **Frontend**: Next.js (React + TypeScript) - Handles UI rendering
- **Backend**: Flask (Python) - Handles all API, auth, database logic

This approach allows us to modernize the frontend without rewriting the backend.

## Completed ✅

### Infrastructure
- ✅ Next.js 15 project with TypeScript
- ✅ API proxy configuration to Flask backend
- ✅ Layout with CSS integration
- ✅ Component structure

### Pages
- ✅ Home page (`/`)
- ✅ About page (`/about`)
- ✅ Login page (`/login`) - Form submits to Flask
- ✅ Feed page (`/feed`) - Fetches from Flask API

### Components
- ✅ Navbar with notifications and user menu
- ✅ Root layout with original styling

### Assets
- ✅ All CSS files migrated
- ✅ All images migrated

## Flask Backend (Unchanged)

The Flask backend remains responsible for:
- ✅ All API endpoints (`/api/*`)
- ✅ Authentication (`/login`, `/logout`)
- ✅ Session management
- ✅ Database operations
- ✅ Business logic
- ✅ OAuth2 providers
- ✅ Email functionality

## What Remains 🚧

### Pages to Create
- 🚧 Sign-up page (`/sign-up`)
- 🚧 Post creation page (`/post`)
- 🚧 Profile page (`/profile/[username]`)
- 🚧 Settings page (`/settings`)
- 🚧 Password reset pages

### Components to Create
- 🚧 Post creation form
- 🚧 Profile edit form
- 🚧 Settings forms
- 🚧 Notification panel

### Integration Work
- 🚧 Connect all pages to Flask API endpoints
- 🚧 Handle Flask flash messages in Next.js
- 🚧 Session state management on frontend

## Benefits of Hybrid Approach

### Advantages
✅ **No backend rewrite needed** - All Flask logic stays intact  
✅ **Faster development** - Only create UI components  
✅ **Lower risk** - Backend remains stable and tested  
✅ **Gradual migration** - Can move features one at a time  
✅ **Use existing API** - Flask endpoints already work  

### Trade-offs
⚠️ **Two servers in development** - Flask + Next.js  
⚠️ **Deployment complexity** - Need to coordinate deployments  
⚠️ **Session handling** - Need to proxy cookies correctly  

## How Pages Connect to Backend

### Example: Login Flow

1. User visits `/login` (Next.js page)
2. User submits form
3. Form POSTs to `/login` (proxied to Flask)
4. Flask handles authentication and sets session cookie
5. Flask redirects to `/feed`
6. Next.js serves feed page
7. Feed page fetches from `/api/feed/all/1` (proxied to Flask)
8. Flask returns data using existing logic

### Example: Feed Page

```tsx
// Next.js page fetches from Flask API
const response = await fetch('/api/feed/all/1');
const posts = await response.json();
// Render posts in React
```

Flask endpoint handles the logic:
```python
@app.route('/api/feed/all/<int:page>')
def all_posts(page):
    # Existing Flask logic
    return jsonify(posts)
```

## Development Workflow

1. **Start Flask backend**:
   ```bash
   docker compose up
   ```

2. **Start Next.js frontend**:
   ```bash
   cd nextjs-app
   npm run dev
   ```

3. **Make changes**:
   - UI changes: Edit Next.js components
   - API changes: Edit Flask routes
   - Both stay in sync through API

## Testing Strategy

### Frontend Testing
- [ ] Component tests (React Testing Library)
- [ ] E2E tests (Playwright)
- [ ] Visual regression tests

### Integration Testing
- [ ] Test Next.js → Flask API calls
- [ ] Test session handling
- [ ] Test form submissions

### Backend Testing
- ✅ Flask tests remain unchanged
- ✅ All existing tests still pass

## Deployment Options

### Option 1: Same Server
Use nginx/Caddy to route:
```
/ → Next.js (port 3000)
/api/* → Flask (port 5000)
```

### Option 2: Separate Servers
- Flask: Traditional Python hosting
- Next.js: Vercel/Netlify
- Set `FLASK_API_URL` env var

## Timeline

- ✅ **Phase 1** (Complete): Setup hybrid architecture
- 🚧 **Phase 2** (Current): Create remaining pages
- 🚧 **Phase 3**: Connect all features to Flask API
- 🚧 **Phase 4**: Testing and polish

**Estimated time**: 3-5 days for remaining work

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Rewrites](https://nextjs.org/docs/app/api-reference/next-config-js/rewrites)
- [Flask API Documentation](../twidilers/)
