# Twidilers - Next.js Frontend

This is a Next.js frontend for the Twidilers application, which uses Flask for the backend API.

## Architecture

This is a **hybrid architecture**:
- **Frontend**: Next.js with React and TypeScript (this directory)
- **Backend**: Flask with SQLAlchemy (../twidilers/)

The Next.js app handles:
- Page rendering
- Client-side routing
- UI components
- Static assets

The Flask backend handles:
- All API endpoints
- Authentication and sessions
- Database operations
- Business logic

## Getting Started

### Prerequisites

- Node.js 20.x or later
- A running Flask backend (see main project README)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` to point to your Flask backend:
```
FLASK_API_URL=http://localhost:5000
```

3. Start the Flask backend first (in another terminal):
```bash
cd ../
docker compose up
# OR
python -m flask --app 'twidilers:create_app()' run
```

4. Start the Next.js development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## How It Works

### API Proxy

All API requests from Next.js pages are proxied to the Flask backend:

```
Next.js Request                Flask Backend
/api/feed/all/1        →      http://localhost:5000/api/feed/all/1
/login (POST)          →      http://localhost:5000/login
/logout                →      http://localhost:5000/logout
```

This is configured in `next.config.ts` using Next.js rewrites.

### Session Management

Sessions are managed by Flask on the backend. The Next.js frontend simply passes cookies through to Flask for authentication.

### Pages

Next.js serves the following pages:
- `/` - Home page
- `/about` - About page
- `/login` - Login form (submits to Flask)
- `/feed` - Feed display (fetches from Flask API)

## Development

Run the development server:
```bash
npm run dev
```

The app will be available at http://localhost:3000 with hot reload.

### Adding New Pages

1. Create a new directory in `app/`
2. Add a `page.tsx` file
3. Export a default React component

Example:
```tsx
// app/new-page/page.tsx
export default function NewPage() {
  return <div>New Page</div>;
}
```

### Fetching Data from Flask

Use standard fetch with relative URLs:

```tsx
const response = await fetch('/api/endpoint');
const data = await response.json();
```

Next.js will proxy these to Flask automatically.

## Production Build

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Project Structure

```
nextjs-app/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── feed/              # Feed page
│   ├── login/             # Login page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   └── Navbar.tsx        # Main navigation
├── lib/                   # Utility functions
│   └── functions.ts      # Client-side helpers
├── public/               # Static assets
│   └── styles/           # CSS files
├── next.config.ts        # Next.js configuration (API proxy)
└── package.json          # Dependencies
```

## Deployment

### Option 1: Separate Deployments

Deploy Flask and Next.js separately:
- Flask: Traditional Python hosting (e.g., Docker, Railway, Fly.io)
- Next.js: Vercel, Netlify, or any Node.js host

Set `FLASK_API_URL` in Next.js environment to your Flask deployment URL.

### Option 2: Same Server

Use a reverse proxy (nginx, Caddy) to route:
- `/api/*` → Flask backend
- `/*` → Next.js frontend

## Troubleshooting

### API requests fail with CORS errors

Make sure Flask has CORS enabled for the Next.js origin. The proxy should handle most CORS issues, but if deploying separately, you may need flask-cors.

### Session/login not working

Ensure cookies are being passed through. The Flask backend must accept cookies from the Next.js domain. In production, both should be on the same domain or use proper CORS configuration.

### Build errors

Clear the Next.js cache:
```bash
rm -rf .next
npm run build
```

## Contributing

This is a hybrid frontend for the Twidilers Flask application. When adding features:
1. Add pages/components in Next.js (this directory)
2. Add API endpoints in Flask (../twidilers/)
3. Connect them using fetch calls

## License

MIT License - Same as the main Twidilers project
