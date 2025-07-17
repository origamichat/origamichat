# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Root Commands
- `bun install --workspaces` - Install all dependencies across the monorepo
- `bun dev` - Start development servers for all apps
- `bun build` - Build all packages and apps
- `bun lint` - Run linting across all packages
- `bun format` - Format code using Prettier
- `bun check-types` - Type check all packages

### API (apps/api)
- `cd apps/api && bun dev` - Start API server with hot reload
- `cd apps/api && bun test` - Run tests
- `cd apps/api && bun test --watch` - Run tests in watch mode
- `cd apps/api && bun db:migrate` - Run database migrations
- `cd apps/api && bun db:seed` - Seed database with sample data
- `cd apps/api && bun db:studio` - Open Drizzle Studio
- `cd apps/api && bun generate` - Generate new database migration

### Web App (apps/web)
- `cd apps/web && bun dev` - Start Next.js dev server with Turbopack
- `cd apps/web && bun build` - Build Next.js app
- `cd apps/web && bun lint` - Run Biome linting
- `cd apps/web && bun format` - Format code with Biome
- `cd apps/web && bun test` - Run tests

## Architecture Overview

### Project Purpose
Cossistant is a developer-first AI/human support framework that provides:
- A ready-to-use `<Support />` component - the key product element that is a fully working support widget
- Suite of primitive components for building custom support experiences
- Support for React, Next.js, and Remix applications

Customers have two main options:
1. **Use the `<Support />` component directly** - A complete, fully-functional support widget
2. **Use primitive components** - Build custom support experiences using headless components

### Monorepo Structure
This is a Turbo monorepo with Bun as the package manager:
- **apps/api** - Hono-based API server with tRPC, WebSockets, Drizzle ORM, and OpenAPI endpoints
- **apps/web** - Next.js frontend with React 19, Tailwind CSS, and tRPC client
- **packages/react** - Headless React components library with `<Support />` component (published package)
- **packages/core** - Core API client and utilities
- **packages/types** - Shared TypeScript types AND Zod schemas used across API and libraries
- **packages/transactional** - Email templates with React Email

### Documentation
- **Location**: `apps/web/src/app/(lander-docs)/docs` (routes)
- **Content**: `apps/web/content/` (MDX files)
- **Framework**: Fumadocs with MDX for documentation generation
- **Structure**: MDX files in `apps/web/content/docs/` with meta.json for navigation

### Key Technologies
- **Runtime**: Bun for package management and execution
- **Framework**: Next.js (frontend), Hono (API)
- **Database**: PostgreSQL with Drizzle ORM
- **API**: tRPC for type-safe client-server communication + OpenAPI endpoints
- **Auth**: Better Auth for authentication
- **Styling**: Tailwind CSS with headless UI components
- **Real-time**: WebSockets for live chat functionality

### Schema & Types Architecture
- **@cossistant/types**: Central package containing both TypeScript types and Zod schemas
- Schemas are shared between API and client libraries (react/core)
- Ensures type safety across the entire application stack
- API validation and client-side validation use the same schema definitions

### Database Management
- Production: PlanetScale Postgres
- Local: DBgin recommended for development
- Migrations: Use `bun db:generate` to create, `bun db:migrate` to apply
- Schema files located in `apps/api/src/db/schema/`

### Package Architecture
- **@cossistant/react**: Headless React components including main `<Support />` component and primitives
- **@cossistant/core**: Core API client and data fetching utilities
- **@cossistant/types**: Shared TypeScript definitions and Zod schemas
- **@cossistant/api**: Internal API package with database queries and client

### API Architecture
- **tRPC**: Type-safe client-server communication
- **OpenAPI**: REST API endpoints exposed for external integrations
- **WebSocket**: Real-time communication for live chat

### Authentication Flow
Uses Better Auth with Google and GitHub OAuth providers. Auth configuration in `apps/api/src/lib/auth.tsx` and client-side utilities in `apps/web/src/lib/auth/`.

### Real-time Features
WebSocket implementation for live chat, conversation management, and presence indicators. WebSocket server integrated with Hono API.

## Development Workflow

### Making Schema Changes
1. Update schema files in `apps/api/src/db/schema/`
2. Update corresponding Zod schemas in `packages/types/src/`
3. Run `cd apps/api && bun generate` to create migration
4. Run `cd apps/api && bun db:migrate` to apply changes

### Documentation Updates
- Edit MDX files in `apps/web/content/docs/`
- Update navigation in `apps/web/content/docs/meta.json`
- Documentation is built with Fumadocs and served from `apps/web/src/app/(lander-docs)/docs`

### Package Development
- React components in `packages/react/src/`
- Build packages with `bun build` from root
- Test React components: `cd packages/react && bun test`

### Environment Setup
- Copy environment files and configure database connection
- Set up OAuth providers (Google, GitHub)
- Configure Resend for transactional emails
- Set up Upstash Redis for rate limiting