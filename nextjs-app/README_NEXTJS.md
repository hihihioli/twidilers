# Twidilers - Next.js Refactor

This is a Next.js refactor of the original Flask-based Twidilers application, maintaining all existing features and design while modernizing the tech stack.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Iron Session
- **Styling**: Original CSS from Flask app

## Getting Started

### Prerequisites

- Node.js 20.x or later
- PostgreSQL database (can use the same database as the Flask app)
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

Edit `.env` with your database credentials and secrets.

3. Generate Prisma client:
```bash
npx prisma generate
```

4. If starting fresh, run migrations:
```bash
npx prisma db push
```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Production Build

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
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # API endpoints
│   │   ├── auth/         # Authentication routes
│   │   └── feed/         # Feed API routes
│   ├── about/            # About page
│   ├── feed/             # Feed page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   └── Navbar.tsx        # Main navigation
├── lib/                   # Utility libraries
│   ├── auth.ts           # Authentication utilities
│   ├── functions.ts      # Business logic
│   ├── prisma.ts         # Database client
│   └── session.ts        # Session configuration
├── prisma/
│   └── schema.prisma     # Database schema
└── public/               # Static assets
    └── styles/           # CSS files from Flask app
```

## Features Implemented

- ✅ Home page with navigation
- ✅ About page
- ✅ User authentication (login/logout)
- ✅ Session management
- ✅ Feed page with post display
- ✅ Database models (Account, Post)
- ✅ API routes for authentication and feed
- ✅ Original styling maintained

## Features In Progress

- ⏳ Post creation
- ⏳ Like/unlike functionality
- ⏳ Profile pages
- ⏳ Settings pages
- ⏳ OAuth2 authentication (Google, GitHub)
- ⏳ Email functionality
- ⏳ Sign-up flow
- ⏳ Following/followers
- ⏳ Notifications
- ⏳ Profile pictures

## Migration Notes

### Database

The Prisma schema is designed to be compatible with the existing Flask SQLAlchemy models. If you're migrating from the Flask app:

1. The same PostgreSQL database can be used
2. Table names and column names match the Flask models
3. No data migration is required

### API Compatibility

The Next.js API routes mimic the Flask API endpoints where possible:
- `/api/auth/login` - Login endpoint
- `/api/auth/logout` - Logout endpoint
- `/api/auth/me` - Get current user
- `/api/feed/all/[page]` - Get all posts (paginated)

## Development Tips

- Use `npm run dev` with hot reloading for rapid development
- API routes are in `app/api/`
- Components are in `components/`
- Utility functions are in `lib/`
- Prisma queries are type-safe and auto-completed

## Troubleshooting

### Database Connection Issues

Ensure your `DATABASE_URL` in `.env` is correct:
```
DATABASE_URL="postgresql://user:password@localhost:5432/twidilers"
```

### Prisma Client Not Found

Regenerate the Prisma client:
```bash
npx prisma generate
```

### Build Errors

Clear the Next.js cache:
```bash
rm -rf .next
npm run build
```

## Contributing

This is a refactor in progress. Key areas that need work:
1. Complete post creation and interaction features
2. Implement remaining pages (profile, settings, sign-up)
3. Add OAuth2 authentication
4. Implement email functionality
5. Add comprehensive tests

## License

MIT License - Same as the original Twidilers project
