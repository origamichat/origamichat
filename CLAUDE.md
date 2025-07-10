# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cossistant is an open-source chat support widget focused on the React ecosystem. It's built as a Turborepo monorepo using TypeScript throughout.

**Tech Stack:**

- Frontend: Next.js 15 (App Router), React 19, Tailwind CSS v4, Radix UI
- Backend: Hono API server with tRPC for type-safe APIs
- Database: PostgreSQL (Neon.tech) with Drizzle ORM
- Auth: Better Auth with multiple providers (Google, GitHub, email/password)
- Real-time: WebSocket support for chat functionality
- Package Manager: Bun v1.2.13

## Monorepo Structure

```
apps/
├── api/          # Hono backend server
│   ├── src/
│   │   ├── client/     # API client exports
│   │   ├── db/         # Database queries
│   │   ├── rest/       # REST endpoints
│   │   ├── trpc/       # tRPC routers
│   │   ├── ws/         # WebSocket handling
│   │   └── schemas/    # Zod schemas
│   └── server          # Compiled binary
│
└── web/          # Next.js frontend
    ├── content/        # MDX documentation
    └── src/
        ├── app/        # App Router pages
        ├── components/ # React components
        ├── hooks/      # Custom hooks
        └── lib/        # Utilities

packages/
├── core/              # Shared constants
├── database/          # Database schema & migrations
├── location/          # Geo utilities
├── react/             # React SDK for chat widget
└── typescript-config/ # Shared TS configs
```

## Essential Commands

### Development

```bash
# Start all services (run from root)
bun dev

# Start individual apps
cd apps/web && bun dev    # Frontend on localhost:3000
cd apps/api && bun dev    # API on localhost:8000

# Database setup
cd packages/database
bun db:migrate            # Run migrations
bun db:seed              # Seed initial data
bun db:studio            # Open Drizzle Studio
bun generate             # Generate migration from schema changes
```

### Build & Deploy

```bash
# Build everything
bun build

# Build API to standalone binary
cd apps/api && bun build  # Creates ./server executable

# Build frontend
cd apps/web && bun build
```

### Code Quality

```bash
# Run from root for all packages
bun lint          # Lint with Biome
bun format        # Format code
bun check-types   # TypeScript type checking

# Run tests
bun test          # Run all tests
bun test:watch    # Watch mode
bun test:coverage # With coverage (API only)
```

### Release Management

```bash
bun changeset         # Create changeset
bun version-packages  # Update versions
bun release          # Publish to npm
```

## Architecture Patterns

### API Structure

- **REST endpoints**: `apps/api/src/rest/` - Standard REST APIs
- **tRPC routers**: `apps/api/src/trpc/` - Type-safe RPC endpoints
- **WebSocket**: `apps/api/src/ws/` - Real-time chat handling
- **Database queries**: `apps/api/src/db/` - Data access layer
- **Schemas**: Zod schemas in `apps/api/src/schemas/` for validation

### Frontend Patterns

- **App Router**: All pages in `apps/web/src/app/`
- **Components**: Organized in `apps/web/src/components/`
  - UI components use Radix UI primitives
  - Styled with Tailwind CSS v4
- **Data fetching**: tRPC client with React Query
- **State management**: Zustand for client state
- **Forms**: React Hook Form with Zod validation

### Database Schema

Located in `packages/database/src/schema/`:

- `auth.ts` - Better Auth tables (users, sessions, accounts)
- `api-keys.ts` - API key management
- `chat.ts` - Conversations and messages
- `waiting-list.ts` - Waiting list with referral codes

### Authentication Flow

- Better Auth handles user authentication
- Multi-provider support (Google, GitHub, email/password)
- Organization/tenant support built-in
- Session management with secure cookies

## Environment Variables

### Database Package (.env)

```
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

```

### API Package (.env)

Includes all database variables plus:

```
API_KEY_SECRET=
RESEND_API_KEY=
RESEND_AUDIENCE_ID=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

## Testing Strategy

- Unit tests use Bun's native test runner
- Test files located alongside source files (`.test.ts`)
- Run specific test: `bun test path/to/file.test.ts`
- Database tests require test database setup

## Type Safety

- End-to-end type safety with tRPC
- Shared types via workspace packages
- Zod schemas for runtime validation
- TypeScript strict mode enabled

## Deployment

- API compiles to standalone binary via Bun
- Docker support for API (Dockerfile.api)
- Frontend deployable to Vercel/Netlify
- Database hosted on Neon.tech

## Common Tasks

### Adding a new API endpoint

1. Create router in `apps/api/src/trpc/routers/`
2. Add to main router in `apps/api/src/trpc/index.ts`
3. Schema validation in `apps/api/src/schemas/`
4. Database queries in `apps/api/src/db/`

### Creating a new page

1. Add route in `apps/web/src/app/`
2. Create components in `apps/web/src/components/`
3. Use tRPC hooks for data fetching
4. Follow existing component patterns

### Database migrations

1. Modify schema in `packages/database/src/schema/`
2. Run `bun generate` to create migration
3. Review generated SQL in `packages/database/migrations/`
4. Run `bun db:migrate` to apply

## Code Style

- Biome for linting and formatting
- Tab indentation
- Double quotes for strings
- Conventional commits enforced
- No console.log in production code
